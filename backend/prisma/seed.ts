import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log(' Seeding database...');

  try {
    
    console.log('🗑️  Clearing existing data...');
    await prisma.poolMember.deleteMany();
    await prisma.pool.deleteMany();
    await prisma.bankEntry.deleteMany();
    await prisma.shipCompliance.deleteMany();
    await prisma.route.deleteMany();
    console.log('✅ Old data cleared');

    
    console.log('📦 Seeding routes...');
    const routes = await prisma.route.createMany({
      data: [
        {
          routeId: 'R001',
          vesselType: 'Container',
          fuelType: 'HFO',
          year: 2024,
          ghgIntensity: 91.0,
          fuelConsumption: 5000,
          distance: 12000,
          totalEmissions: 4500,
          isBaseline: true
        },
        {
          routeId: 'R002',
          vesselType: 'BulkCarrier',
          fuelType: 'LNG',
          year: 2024,
          ghgIntensity: 88.0,
          fuelConsumption: 4800,
          distance: 11500,
          totalEmissions: 4200,
          isBaseline: false
        },
        {
          routeId: 'R003',
          vesselType: 'Tanker',
          fuelType: 'MGO',
          year: 2024,
          ghgIntensity: 93.5,
          fuelConsumption: 5100,
          distance: 12500,
          totalEmissions: 4700,
          isBaseline: false
        },
        {
          routeId: 'R004',
          vesselType: 'RoRo',
          fuelType: 'HFO',
          year: 2025,
          ghgIntensity: 89.2,
          fuelConsumption: 4900,
          distance: 11800,
          totalEmissions: 4300,
          isBaseline: false
        },
        {
          routeId: 'R005',
          vesselType: 'Container',
          fuelType: 'LNG',
          year: 2025,
          ghgIntensity: 90.5,
          fuelConsumption: 4950,
          distance: 11900,
          totalEmissions: 4400,
          isBaseline: false
        }
      ]
    });
    console.log(` Seeded ${routes.count} routes`);

    
    console.log(' Seeding ship compliance...');
    const compliance = await prisma.shipCompliance.createMany({
      data: [
        { shipId: 'SHIP001', year: 2024, cbGco2eq: 1500.5 },
        { shipId: 'SHIP002', year: 2024, cbGco2eq: -800.3 },
        { shipId: 'SHIP003', year: 2024, cbGco2eq: 2200.0 }
      ]
    });
    console.log(` Seeded ${compliance.count} ship compliance records`);

   
    console.log(' Seeding bank entries...');
    const bankEntries = await prisma.bankEntry.createMany({
      data: [
        {
          shipId: 'SHIP001',
          year: 2024,
          amountGco2eq: 500.0,
          isApplied: false
        },
        {
          shipId: 'SHIP001',
          year: 2024,
          amountGco2eq: 300.0,
          isApplied: false
        },
        {
          shipId: 'SHIP003',
          year: 2024,
          amountGco2eq: 1000.0,
          isApplied: false
        }
      ]
    });
    console.log(` Seeded ${bankEntries.count} bank entries`);

    console.log('Database seeding complete!');
  } catch (error) {
    console.error(' Seeding failed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Fatal error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
