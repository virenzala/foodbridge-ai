import { Controller, Post, Get, Body, Query, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Controller('auth')
export class AuthController {
  constructor(private prisma: PrismaService) {}

  @Post('login')
  async login(@Body() body: { email: string }) {
    if (!body.email) {
      throw new BadRequestException('Email is required');
    }
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
      include: { organization: true },
    });
    if (!user) {
      throw new BadRequestException('User not found. Try donor@foodbridge.com, ngo@foodbridge.com, volunteer@foodbridge.com, or admin@foodbridge.com');
    }
    return {
      token: `fb_jwt_token_${user.id}`,
      user,
    };
  }

  @Post('register')
  async register(@Body() body: { email: string; name: string; role: string; orgName?: string; orgType?: string }) {
    const existing = await this.prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      throw new BadRequestException('Email already registered');
    }

    let organizationId = null;
    if (body.orgName && body.orgType) {
      const org = await this.prisma.organization.create({
        data: {
          name: body.orgName,
          type: body.orgType,
          latitude: 40.7128 + (Math.random() - 0.5) * 0.05,
          longitude: -74.0060 + (Math.random() - 0.5) * 0.05,
          address: 'Simulated Address, NY',
          urgencyLevel: body.orgType === 'NGO' || body.orgType === 'SHELTER' ? 3 : 1,
        },
      });
      organizationId = org.id;
    }

    const user = await this.prisma.user.create({
      data: {
        email: body.email,
        name: body.name,
        role: body.role,
        organizationId,
      },
      include: { organization: true },
    });

    return {
      token: `fb_jwt_token_${user.id}`,
      user,
    };
  }

  @Get('users')
  async getUsers() {
    return this.prisma.user.findMany({
      include: { organization: true },
    });
  }

  @Get('organizations')
  async getOrganizations(@Query('type') type?: string) {
    return this.prisma.organization.findMany({
      where: type ? { type } : {},
    });
  }
}
