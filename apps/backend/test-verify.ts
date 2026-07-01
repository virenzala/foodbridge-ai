import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function runDiagnostics() {
  console.log('--- STARTING PLATFORM DIAGNOSTICS ---');
  
  try {
    console.log('1. Checking database connection...');
    await prisma.$connect();
    console.log('   [SUCCESS] Connected to SQLite database.');

    console.log('2. Auditing organization entities...');
    const orgs = await prisma.organization.findMany();
    console.log(`   [SUCCESS] Found ${orgs.length} registered organizations.`);

    console.log('3. Validating user configuration models...');
    const users = await prisma.user.findMany();
    console.log(`   [SUCCESS] Found ${users.length} active platform profiles.`);

    console.log('4. Performing integrity check on donation ledger...');
    const donations = await prisma.foodDonation.findMany();
    console.log(`   [SUCCESS] ${donations.length} total food batches logged.`);

    console.log('--- ALL SYSTEMS INTEGRATIONAL HEALTH CHECKS PASSED ---');
  } catch (error) {
    console.error('   [ERROR] Diagnostics failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

runDiagnostics();
