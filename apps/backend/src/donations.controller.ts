import { Controller, Post, Get, Patch, Body, Param, Query } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('donations')
export class DonationsController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async createDonation(@Body() body: {
    title: string;
    description?: string;
    foodType: string;
    weightKg: number;
    expirationHours: number;
    imageUrl?: string;
    donorId: string;
  }) {
    // 1. Run simulated Image analysis / Computer vision
    let freshness = 95.0;
    let packaging = 'Sealed';
    let shelfLife = body.expirationHours;
    let spoilage = false;

    if (body.imageUrl) {
      try {
        // Try calling python AI service
        const response = await fetch('http://localhost:8000/api/v1/computer-vision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image_url: body.imageUrl }),
        });
        if (response.ok) {
          const aiResult = await response.json();
          freshness = aiResult.freshness_percentage;
          packaging = aiResult.packaging_safety;
          shelfLife = aiResult.recommended_shelf_life_hours;
          spoilage = aiResult.spoilage_detected;
        }
      } catch (err) {
        console.warn('AI Service unreachable, falling back to local vision simulation.', err.message);
        // Fallback simulation based on food type keywords
        if (body.title.toLowerCase().includes('pastry') || body.title.toLowerCase().includes('bread')) {
          freshness = 90.0;
          packaging = 'Sealed';
        } else if (body.title.toLowerCase().includes('salad') || body.title.toLowerCase().includes('fruit')) {
          freshness = 85.0;
          packaging = 'Exposed';
        }
      }
    }

    const expTime = new Date(Date.now() + shelfLife * 60 * 60 * 1000);

    return this.prisma.foodDonation.create({
      data: {
        title: body.title,
        description: body.description,
        foodType: body.foodType,
        weightKg: body.weightKg,
        status: 'PENDING',
        expirationTime: expTime,
        imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
        freshnessPercent: freshness,
        spoilageDetected: spoilage,
        packagingSafety: packaging,
        donorId: body.donorId,
      },
      include: { donor: true },
    });
  }

  @Get()
  async getDonations(@Query('status') status?: string, @Query('donorId') donorId?: string) {
    const filters: any = {};
    if (status) filters.status = status;
    if (donorId) filters.donorId = donorId;

    return this.prisma.foodDonation.findMany({
      where: filters,
      include: { donor: true, recipient: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  async getDonationById(@Param('id') id: string) {
    return this.prisma.foodDonation.findUnique({
      where: { id },
      include: { donor: true, recipient: true },
    });
  }

  // AI Matching Recommendation trigger
  @Post(':id/match')
  async matchDonation(@Param('id') id: string) {
    const donation = await this.prisma.foodDonation.findUnique({
      where: { id },
      include: { donor: { include: { organization: true } } },
    });

    if (!donation) {
      throw new Error('Donation not found');
    }

    const ngos = await this.prisma.organization.findMany({
      where: { type: { in: ['NGO', 'FOOD_BANK', 'SHELTER'] } },
    });

    // Format list for Python AI Service
    const ngoList = ngos.map(n => ({
      id: n.id,
      name: n.name,
      latitude: n.latitude,
      longitude: n.longitude,
      capacity_kg: n.capacityKg,
      current_occupancy_kg: n.currentKg,
      dietary_preferences: JSON.parse(n.dietaryTags || '[]'),
      urgency_level: n.urgencyLevel,
    }));

    let matches = [];
    const expHours = Math.max(1.0, (donation.expirationTime.getTime() - Date.now()) / (1000 * 60 * 60));

    const requestBody = {
      donor_latitude: donation.donor.organization?.latitude || 40.7128,
      donor_longitude: donation.donor.organization?.longitude || -74.0060,
      food_type: donation.foodType,
      quantity_kg: donation.weightKg,
      dietary_tags: JSON.parse(donation.donor.organization?.dietaryTags || '[]'),
      expiration_hours: expHours,
      ngos: ngoList,
    };

    try {
      // Call external FastAPI server
      const response = await fetch('http://localhost:8000/api/v1/smart-matching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        matches = await response.json();
      } else {
        throw new Error('AI service returned error status');
      }
    } catch (err) {
      console.warn('AI matching failed or unavailable, running offline routing logic:', err.message);
      // Fallback matching algorithm (simple distance-based rating)
      matches = ngos.map(n => {
        const dLat = n.latitude - (donation.donor.organization?.latitude || 40.7128);
        const dLng = n.longitude - (donation.donor.organization?.longitude || -74.0060);
        const dist = Math.sqrt(dLat * dLat + dLng * dLng) * 111; // rough km conversion
        const score = Math.max(0, 100 - dist * 8) + (n.urgencyLevel * 5);
        return {
          ngo_id: n.id,
          ngo_name: n.name,
          score: Math.min(100, Math.round(score * 10) / 10),
          distance_km: Math.round(dist * 100) / 100,
          estimated_travel_time_mins: Math.round(dist * 3) + 5,
          matching_reasons: [
            'Offline calculation model activated.',
            `Located ${dist.toFixed(1)} km away.`,
            `Capacity available: ${(n.capacityKg - n.currentKg).toFixed(1)}kg`,
          ],
        };
      });
      matches.sort((a, b) => b.score - a.score);
    }

    return {
      donationId: id,
      recommendations: matches,
    };
  }

  // Finalize Matching
  @Patch(':id/assign')
  async assignNGO(@Param('id') id: string, @Body() body: { ngoId: string }) {
    return this.prisma.foodDonation.update({
      where: { id },
      data: {
        status: 'MATCHED',
        recipientId: body.ngoId,
      },
      include: { donor: true, recipient: true },
    });
  }
}
