import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { AuthController } from './auth.controller';
import { DonationsController } from './donations.controller';
import { LogisticsController } from './logistics.controller';
import { AnalyticsController } from './analytics.controller';

@Module({
  imports: [],
  controllers: [
    AuthController,
    DonationsController,
    LogisticsController,
    AnalyticsController,
  ],
  providers: [PrismaService],
  exports: [PrismaService],
})
export class AppModule {}
