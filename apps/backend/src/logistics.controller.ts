import { Controller, Post, Get, Patch, Body, Param, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('logistics')
export class LogisticsController {
  constructor(private prisma: PrismaService) {}

  @Post('deliveries')
  async createDelivery(@Body() body: { donationId: string; volunteerId: string }) {
    const donation = await this.prisma.foodDonation.findUnique({
      where: { id: body.donationId },
      include: { donor: { include: { organization: true } }, recipient: true },
    });

    if (!donation) {
      throw new NotFoundException('Donation not found');
    }

    const startLat = donation.donor.organization?.latitude || 40.7128;
    const startLng = donation.donor.organization?.longitude || -74.0060;
    const endLat = donation.recipient?.latitude || 40.7259;
    const endLng = donation.recipient?.longitude || -73.9967;

    // Simulate route coordinates between start and end
    const coords = [
      [startLat, startLng],
      [startLat + (endLat - startLat) * 0.3, startLng + (endLng - startLng) * 0.3],
      [startLat + (endLat - startLat) * 0.6, startLng + (endLng - startLng) * 0.6],
      [endLat, endLng],
    ];

    const delivery = await this.prisma.delivery.create({
      data: {
        donationId: body.donationId,
        volunteerId: body.volunteerId,
        status: 'ASSIGNED',
        qrCode: `QR_${body.donationId.slice(0, 8).toUpperCase()}`,
        estimatedEtaMins: 25,
        currentLat: startLat,
        currentLng: startLng,
        routeCoordinates: JSON.stringify(coords),
      },
    });

    // Update donation status
    await this.prisma.foodDonation.update({
      where: { id: body.donationId },
      data: { status: 'MATCHED' },
    });

    return delivery;
  }

  @Get('deliveries/active')
  async getActiveDeliveries() {
    return this.prisma.delivery.findMany({
      where: { status: { in: ['ASSIGNED', 'EN_ROUTE', 'PICKED_UP'] } },
      include: {
        donation: {
          include: { donor: { include: { organization: true } }, recipient: true },
        },
        volunteer: true,
      },
    });
  }

  @Patch('deliveries/:id/location')
  async updateLocation(@Param('id') id: string, @Body() body: { lat: number; lng: number; eta: number }) {
    return this.prisma.delivery.update({
      where: { id },
      data: {
        currentLat: body.lat,
        currentLng: body.lng,
        estimatedEtaMins: body.eta,
      },
    });
  }

  @Post('deliveries/:id/verify')
  async verifyDelivery(@Param('id') id: string, @Body() body: { qrCode: string }) {
    const delivery = await this.prisma.delivery.findUnique({
      where: { id },
      include: { donation: { include: { donor: { include: { organization: true } }, recipient: true } } },
    });

    if (!delivery) {
      throw new NotFoundException('Delivery task not found');
    }

    if (delivery.qrCode !== body.qrCode) {
      throw new BadRequestException('Invalid QR Verification Code');
    }

    // Complete delivery
    const updated = await this.prisma.delivery.update({
      where: { id },
      data: { status: 'DELIVERED' },
    });

    // Complete donation
    await this.prisma.foodDonation.update({
      where: { id: delivery.donationId },
      data: { status: 'DELIVERED' },
    });

    // Update NGO capacity occupancy
    if (delivery.donation.recipientId) {
      const ngo = await this.prisma.organization.findUnique({ where: { id: delivery.donation.recipientId } });
      if (ngo) {
        await this.prisma.organization.update({
          where: { id: ngo.id },
          data: {
            currentKg: Math.min(ngo.capacityKg, ngo.currentKg + delivery.donation.weightKg),
          },
        });
      }
    }

    // Update CSR carbon metrics for donor
    if (delivery.donation.donor.organizationId) {
      const orgId = delivery.donation.donor.organizationId;
      const meals = Math.round(delivery.donation.weightKg * 2.2); // approx 2.2 meals per kg
      const co2 = Number((delivery.donation.weightKg * 2.5).toFixed(2)); // 2.5 kg CO2 saved per kg food
      const water = Math.round(delivery.donation.weightKg * 350); // 350L water per kg

      const existingReport = await this.prisma.cSRReport.findFirst({
        where: { organizationId: orgId },
      });

      if (existingReport) {
        await this.prisma.cSRReport.update({
          where: { id: existingReport.id },
          data: {
            mealsSaved: existingReport.mealsSaved + meals,
            carbonSavedKg: existingReport.carbonSavedKg + co2,
            waterSavedLitres: existingReport.waterSavedLitres + water,
            landfillReducedKg: existingReport.landfillReducedKg + delivery.donation.weightKg,
          },
        });
      } else {
        await this.prisma.cSRReport.create({
          data: {
            organizationId: orgId,
            mealsSaved: meals,
            carbonSavedKg: co2,
            waterSavedLitres: water,
            landfillReducedKg: delivery.donation.weightKg,
            periodStart: new Date(),
            periodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
      }
    }

    // Allocate Achievement points to Volunteer
    await this.prisma.userAchievement.create({
      data: {
        userId: delivery.volunteerId,
        badgeName: 'Mission Complete',
        badgeIcon: 'Zap',
        pointsEarned: 150,
      },
    });

    return {
      status: 'SUCCESS',
      message: 'Delivery verified successfully. Environmental metrics updated.',
      delivery: updated,
    };
  }
}
