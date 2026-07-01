import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding FoodBridge AI Database...');

  // 1. Create Organizations
  const bistro = await prisma.organization.upsert({
    where: { id: 'org-bistro' },
    update: {},
    create: {
      id: 'org-bistro',
      name: 'Gourmet Bistro & Cafe',
      type: 'RESTAURANT',
      latitude: 40.7128,
      longitude: -74.0060,
      address: '128 Culinary Ave, New York, NY',
      capacityKg: 0.0,
      dietaryTags: JSON.stringify(['Vegetarian', 'Halal']),
      urgencyLevel: 1,
      verified: true,
    },
  });

  const supermarket = await prisma.organization.upsert({
    where: { id: 'org-supermarket' },
    update: {},
    create: {
      id: 'org-supermarket',
      name: 'Metro Mega Supermarket',
      type: 'SUPERMARKET',
      latitude: 40.7306,
      longitude: -73.9352,
      address: '400 Retail Pkwy, Brooklyn, NY',
      capacityKg: 0.0,
      dietaryTags: JSON.stringify(['Gluten-Free', 'Vegan']),
      urgencyLevel: 1,
      verified: true,
    },
  });

  const foodBank = await prisma.organization.upsert({
    where: { id: 'org-foodbank' },
    update: {},
    create: {
      id: 'org-foodbank',
      name: 'Central City Food Bank',
      type: 'FOOD_BANK',
      latitude: 40.7259,
      longitude: -73.9967,
      address: '45 Community Lane, Manhattan, NY',
      capacityKg: 500.0,
      currentKg: 120.0,
      dietaryTags: JSON.stringify(['Vegetarian', 'Halal', 'Vegan', 'Gluten-Free']),
      urgencyLevel: 4,
      verified: true,
    },
  });

  const shelter = await prisma.organization.upsert({
    where: { id: 'org-shelter' },
    update: {},
    create: {
      id: 'org-shelter',
      name: 'Hope Homeless Shelter',
      type: 'SHELTER',
      latitude: 40.7484,
      longitude: -73.9857,
      address: '89 Compassion Way, New York, NY',
      capacityKg: 200.0,
      currentKg: 45.0,
      dietaryTags: JSON.stringify(['Vegetarian']),
      urgencyLevel: 5,
      verified: true,
    },
  });

  console.log('Organizations created.');

  // 2. Create Users
  const donorUser = await prisma.user.upsert({
    where: { email: 'donor@foodbridge.com' },
    update: {},
    create: {
      id: 'user-donor',
      email: 'donor@foodbridge.com',
      name: 'Chef Sarah Jenkins',
      role: 'DONOR',
      organizationId: bistro.id,
    },
  });

  const ngoUser = await prisma.user.upsert({
    where: { email: 'ngo@foodbridge.com' },
    update: {},
    create: {
      id: 'user-ngo',
      email: 'ngo@foodbridge.com',
      name: 'Marcus Vance',
      role: 'NGO',
      organizationId: foodBank.id,
    },
  });

  const volunteerUser = await prisma.user.upsert({
    where: { email: 'volunteer@foodbridge.com' },
    update: {},
    create: {
      id: 'user-volunteer',
      email: 'volunteer@foodbridge.com',
      name: 'Elena Rostova',
      role: 'VOLUNTEER',
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@foodbridge.com' },
    update: {},
    create: {
      id: 'user-admin',
      email: 'admin@foodbridge.com',
      name: 'David Miller',
      role: 'ADMIN',
    },
  });

  console.log('Users created.');

  // 3. Create Sample Donations
  const donation1 = await prisma.foodDonation.upsert({
    where: { id: 'donation-1' },
    update: {},
    create: {
      id: 'donation-1',
      title: 'Assorted Gourmet Pastries & Bagels',
      description: 'Morning bake surplus, perfectly fresh, individually bagged.',
      foodType: 'Bakery',
      weightKg: 12.5,
      status: 'DELIVERED',
      expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
      freshnessPercent: 95.0,
      spoilageDetected: false,
      donorId: donorUser.id,
      recipientId: foodBank.id,
    },
  });

  const donation2 = await prisma.foodDonation.upsert({
    where: { id: 'donation-2' },
    update: {},
    create: {
      id: 'donation-2',
      title: 'Fresh Tomato and Herb Pastas',
      description: 'Prepared lunch trays, sealed and kept in warmers.',
      foodType: 'Cooked Meal',
      weightKg: 35.0,
      status: 'MATCHED',
      expirationTime: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4h
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
      freshnessPercent: 98.0,
      spoilageDetected: false,
      donorId: donorUser.id,
      recipientId: shelter.id,
    },
  });

  const donation3 = await prisma.foodDonation.upsert({
    where: { id: 'donation-3' },
    update: {},
    create: {
      id: 'donation-3',
      title: 'Organic Romaine & Veggie Salad Boxes',
      description: 'Unopened pre-packaged retail salads.',
      foodType: 'Fresh Produce',
      weightKg: 18.0,
      status: 'PENDING',
      expirationTime: new Date(Date.now() + 12 * 60 * 60 * 1000),
      imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999',
      freshnessPercent: 88.0,
      donorId: donorUser.id,
    },
  });

  console.log('Donations created.');

  // 4. Create Delivery Tracker
  const delivery = await prisma.delivery.upsert({
    where: { id: 'delivery-1' },
    update: {},
    create: {
      id: 'delivery-1',
      donationId: donation2.id,
      volunteerId: volunteerUser.id,
      status: 'EN_ROUTE',
      qrCode: 'VERIFY_DONATION_2_QR',
      estimatedEtaMins: 18,
      currentLat: 40.7200,
      currentLng: -74.0000,
      routeCoordinates: JSON.stringify([
        [40.7128, -74.0060],
        [40.7200, -74.0000],
        [40.7484, -73.9857]
      ]),
    },
  });

  console.log('Deliveries created.');

  // 5. Create Achievements / Badges
  await prisma.userAchievement.createMany({
    data: [
      { userId: volunteerUser.id, badgeName: 'First Rescue', badgeIcon: 'ShieldAlert', pointsEarned: 100 },
      { userId: volunteerUser.id, badgeName: 'Zero Waste Warrior', badgeIcon: 'Leaf', pointsEarned: 250 },
      { userId: donorUser.id, badgeName: 'Green Enterprise', badgeIcon: 'Zap', pointsEarned: 500 },
    ],
  });

  // 6. Create CSR Summary
  await prisma.cSRReport.createMany({
    data: [
      {
        organizationId: bistro.id,
        mealsSaved: 140,
        carbonSavedKg: 350.2,
        waterSavedLitres: 4200.0,
        landfillReducedKg: 85.0,
        periodStart: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        periodEnd: new Date(),
      },
    ],
  });

  // 7. Audit Log
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      action: 'SYSTEM_BOOTSTRAP',
      details: 'Initial system seeding completed successfully.',
      ipAddress: '127.0.0.1',
    },
  });

  console.log('Seed database initialized.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
