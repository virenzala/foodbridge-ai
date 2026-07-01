import { Controller, Get, Param, Query } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private prisma: PrismaService) {}

  @Get('global')
  async getGlobalImpact() {
    const donations = await this.prisma.foodDonation.findMany({
      where: { status: 'DELIVERED' },
    });

    const totalWeight = donations.reduce((acc, curr) => acc + curr.weightKg, 0);
    const mealsSaved = Math.round(totalWeight * 2.2);
    const carbonSavedKg = Number((totalWeight * 2.5).toFixed(1));
    const waterSavedLitres = Math.round(totalWeight * 350);
    const landfillReducedKg = totalWeight;

    // Entity Counts
    const donorCount = await this.prisma.user.count({ where: { role: 'DONOR' } });
    const ngoCount = await this.prisma.organization.count({ where: { type: { in: ['NGO', 'FOOD_BANK', 'SHELTER'] } } });
    const volunteerCount = await this.prisma.user.count({ where: { role: 'VOLUNTEER' } });

    // Recent Donations Feed
    const feed = await this.prisma.foodDonation.findMany({
      take: 6,
      orderBy: { updatedAt: 'desc' },
      include: { donor: { include: { organization: true } }, recipient: true },
    });

    return {
      stats: {
        mealsSaved,
        carbonSavedKg,
        waterSavedLitres,
        landfillReducedKg,
        activeDonors: donorCount,
        registeredNGOs: ngoCount,
        volunteersCount: volunteerCount,
      },
      recentActivity: feed.map(item => ({
        id: item.id,
        title: item.title,
        donorName: item.donor.organization?.name || item.donor.name,
        recipientName: item.recipient?.name || 'Pending Matching',
        weight: item.weightKg,
        status: item.status,
        timestamp: item.updatedAt,
      })),
    };
  }

  @Get('csr/:orgId')
  async getCSRAggregates(@Param('orgId') orgId: string) {
    const report = await this.prisma.cSRReport.findFirst({
      where: { organizationId: orgId },
    });

    if (!report) {
      return {
        mealsSaved: 0,
        carbonSavedKg: 0,
        waterSavedLitres: 0,
        landfillReducedKg: 0,
        historicalChart: [],
      };
    }

    // Generate monthly simulated analytics for Recharts
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
    const historicalChart = months.map((m, idx) => {
      const scale = (idx + 1) / months.length;
      return {
        month: m,
        meals: Math.round(report.mealsSaved * scale),
        carbon: Number((report.carbonSavedKg * scale).toFixed(1)),
        water: Math.round(report.waterSavedLitres * scale),
        landfill: Number((report.landfillReducedKg * scale).toFixed(1)),
      };
    });

    return {
      ...report,
      historicalChart,
    };
  }

  @Get('leaderboard')
  async getLeaderboard() {
    const achievements = await this.prisma.userAchievement.findMany({
      include: { user: true },
    });

    // Aggregate points per user
    const pointsMap: { [userId: string]: { name: string; role: string; points: number } } = {};
    
    // Seed default volunteers so leaderboard is never empty
    const users = await this.prisma.user.findMany({ where: { role: 'VOLUNTEER' } });
    for (const u of users) {
      pointsMap[u.id] = { name: u.name, role: u.role, points: 150 };
    }

    for (const a of achievements) {
      if (!pointsMap[a.userId]) {
        pointsMap[a.userId] = {
          name: a.user.name,
          role: a.user.role,
          points: 0,
        };
      }
      pointsMap[a.userId].points += a.pointsEarned;
    }

    return Object.values(pointsMap).sort((a, b) => b.points - a.points);
  }
}
