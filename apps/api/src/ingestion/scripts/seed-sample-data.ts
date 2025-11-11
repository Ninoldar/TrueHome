import { NestFactory } from '@nestjs/core';
import { AppModule } from '../../app.module';
import { IngestionService } from '../ingestion.service';
import { prisma } from '@truehome/db';

/**
 * Seed script to create sample property data for MVP demonstration
 * This creates realistic property history with sales, permits, ownership, and work events
 */
async function seedSampleData() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const ingestionService = app.get(IngestionService);

  console.log('🌱 Starting data seeding...');

  // Sample properties with rich history
  const sampleProperties = [
    {
      property: {
        apn: '123456789',
        address: '1234 Main Street',
        city: 'Plano',
        state: 'TX',
        zipCode: '75023',
        latitude: 33.0198,
        longitude: -96.6989,
        lotSize: 8000,
        livingArea: 2500,
        bedrooms: 4,
        bathrooms: 2.5,
        yearBuilt: 2010,
        propertyType: 'Single Family',
      },
      sales: [
        {
          saleDate: new Date('2023-06-15'),
          salePrice: 485000,
          saleType: "Arm's Length",
          buyerName: 'Sarah Johnson',
          sellerName: 'Michael Chen',
        },
        {
          saleDate: new Date('2018-03-20'),
          salePrice: 375000,
          saleType: "Arm's Length",
          buyerName: 'Michael Chen',
          sellerName: 'Robert Williams',
        },
        {
          saleDate: new Date('2010-05-10'),
          salePrice: 285000,
          saleType: "Arm's Length",
          buyerName: 'Robert Williams',
          sellerName: 'Builder Corp',
        },
      ],
      ownership: [
        {
          ownerName: 'Sarah Johnson',
          ownerType: 'Individual',
          fromDate: new Date('2023-06-15'),
          isCurrent: true,
        },
        {
          ownerName: 'Michael Chen',
          ownerType: 'Individual',
          fromDate: new Date('2018-03-20'),
          toDate: new Date('2023-06-15'),
          isCurrent: false,
        },
        {
          ownerName: 'Robert Williams',
          ownerType: 'Individual',
          fromDate: new Date('2010-05-10'),
          toDate: new Date('2018-03-20'),
          isCurrent: false,
        },
      ],
      permits: [
        {
          permitNumber: 'PER-2023-1245',
          permitType: 'Roofing',
          status: 'Completed',
          issuedDate: new Date('2023-08-01'),
          completedDate: new Date('2023-08-15'),
          description: 'Complete roof replacement with architectural shingles',
          contractorName: 'Plano Roofing Co',
          jurisdiction: 'Plano',
        },
        {
          permitNumber: 'PER-2021-0892',
          permitType: 'Electrical',
          status: 'Completed',
          issuedDate: new Date('2021-04-10'),
          completedDate: new Date('2021-04-25'),
          description: 'Panel upgrade and new circuit installation',
          contractorName: 'Texas Electric Services',
          jurisdiction: 'Plano',
        },
        {
          permitNumber: 'PER-2019-0456',
          permitType: 'Building',
          status: 'Completed',
          issuedDate: new Date('2019-07-15'),
          completedDate: new Date('2019-09-30'),
          description: 'Kitchen renovation and expansion',
          contractorName: 'Home Renovations LLC',
          jurisdiction: 'Plano',
        },
      ],
      workEvents: [
        {
          workType: 'HVAC',
          description: 'Complete HVAC system replacement',
          workDate: new Date('2022-05-20'),
          cost: 8500,
          contractorName: 'Comfort Air Solutions',
          contractorPhone: '(972) 555-0101',
          contractorEmail: 'info@comfortair.com',
          contractorWebsite: 'https://comfortair.com',
          warrantyPeriodMonths: 60, // 5 year warranty
          warrantyType: 'Full System',
          warrantyDetails: 'Covers parts and labor for entire HVAC system',
        },
        {
          workType: 'Plumbing',
          description: 'Water heater replacement',
          workDate: new Date('2021-11-10'),
          cost: 1200,
          contractorName: 'Plano Plumbing',
          contractorPhone: '(972) 555-0102',
          warrantyPeriodMonths: 12, // 1 year warranty
          warrantyType: 'Labor',
          warrantyDetails: '1 year labor warranty on installation',
        },
      ],
      rentalSignals: [
        {
          startDate: new Date('2019-01-01'),
          endDate: new Date('2020-06-30'),
          source: 'mls',
          confidence: 0.85,
        },
      ],
      insuranceClaims: [
        {
          claimType: 'Water Damage',
          claimDate: new Date('2022-08-15'),
          amount: 15000,
          status: 'Paid',
          contractorName: 'Restoration Experts LLC',
          contractorPhone: '(972) 555-0103',
          workDescription: 'Water damage restoration and repair work',
        },
      ],
    },
    {
      property: {
        apn: '987654321',
        address: '5678 Oak Avenue',
        city: 'Frisco',
        state: 'TX',
        zipCode: '75034',
        latitude: 33.1507,
        longitude: -96.8236,
        lotSize: 10000,
        livingArea: 3200,
        bedrooms: 5,
        bathrooms: 3.5,
        yearBuilt: 2015,
        propertyType: 'Single Family',
      },
      sales: [
        {
          saleDate: new Date('2024-01-10'),
          salePrice: 625000,
          saleType: "Arm's Length",
          buyerName: 'Jennifer Martinez',
          sellerName: 'David Thompson',
        },
        {
          saleDate: new Date('2019-08-22'),
          salePrice: 495000,
          saleType: "Arm's Length",
          buyerName: 'David Thompson',
          sellerName: 'Builder Corp',
        },
      ],
      ownership: [
        {
          ownerName: 'Jennifer Martinez',
          ownerType: 'Individual',
          fromDate: new Date('2024-01-10'),
          isCurrent: true,
        },
        {
          ownerName: 'David Thompson',
          ownerType: 'Individual',
          fromDate: new Date('2019-08-22'),
          toDate: new Date('2024-01-10'),
          isCurrent: false,
        },
      ],
      permits: [
        {
          permitNumber: 'PER-2023-2156',
          permitType: 'Building',
          status: 'Issued',
          issuedDate: new Date('2023-11-01'),
          description: 'Deck addition and outdoor kitchen',
          contractorName: 'Outdoor Living Designs',
          jurisdiction: 'Frisco',
        },
        {
          permitNumber: 'PER-2020-1789',
          permitType: 'Electrical',
          status: 'Completed',
          issuedDate: new Date('2020-02-15'),
          completedDate: new Date('2020-03-01'),
          description: 'EV charging station installation',
          contractorName: 'Green Energy Solutions',
          jurisdiction: 'Frisco',
        },
      ],
      workEvents: [
        {
          workType: 'Landscaping',
          description: 'Complete yard renovation with irrigation system',
          workDate: new Date('2020-04-15'),
          cost: 12000,
          contractorName: 'Frisco Landscaping',
          contractorPhone: '(972) 555-0104',
          warrantyPeriodMonths: 24, // 2 year warranty
          warrantyType: 'Materials & Installation',
          warrantyDetails: '2 year warranty on plants and irrigation system',
        },
      ],
      rentalSignals: [],
      insuranceClaims: [],
    },
    {
      property: {
        apn: '456789123',
        address: '9012 Elm Drive',
        city: 'McKinney',
        state: 'TX',
        zipCode: '75070',
        latitude: 33.1972,
        longitude: -96.6397,
        lotSize: 12000,
        livingArea: 2800,
        bedrooms: 4,
        bathrooms: 2.5,
        yearBuilt: 2005,
        propertyType: 'Single Family',
      },
      sales: [
        {
          saleDate: new Date('2022-09-05'),
          salePrice: 420000,
          saleType: "Arm's Length",
          buyerName: 'James Anderson',
          sellerName: 'Patricia Brown',
        },
        {
          saleDate: new Date('2015-04-12'),
          salePrice: 310000,
          saleType: "Arm's Length",
          buyerName: 'Patricia Brown',
          sellerName: 'Original Owner LLC',
        },
        {
          saleDate: new Date('2005-08-20'),
          salePrice: 225000,
          saleType: "Arm's Length",
          buyerName: 'Original Owner LLC',
          sellerName: 'Builder Corp',
        },
      ],
      ownership: [
        {
          ownerName: 'James Anderson',
          ownerType: 'Individual',
          fromDate: new Date('2022-09-05'),
          isCurrent: true,
        },
        {
          ownerName: 'Patricia Brown',
          ownerType: 'Individual',
          fromDate: new Date('2015-04-12'),
          toDate: new Date('2022-09-05'),
          isCurrent: false,
        },
        {
          ownerName: 'Original Owner LLC',
          ownerType: 'LLC',
          fromDate: new Date('2005-08-20'),
          toDate: new Date('2015-04-12'),
          isCurrent: false,
        },
      ],
      permits: [
        {
          permitNumber: 'PER-2023-3012',
          permitType: 'Plumbing',
          status: 'Completed',
          issuedDate: new Date('2023-03-10'),
          completedDate: new Date('2023-03-20'),
          description: 'Complete plumbing system update',
          contractorName: 'McKinney Plumbing Services',
          jurisdiction: 'McKinney',
        },
        {
          permitNumber: 'PER-2021-1987',
          permitType: 'Building',
          status: 'Completed',
          issuedDate: new Date('2021-06-01'),
          completedDate: new Date('2021-08-15'),
          description: 'Master bathroom renovation',
          contractorName: 'Luxury Bath Remodeling',
          jurisdiction: 'McKinney',
        },
        {
          permitNumber: 'PER-2016-0567',
          permitType: 'Roofing',
          status: 'Completed',
          issuedDate: new Date('2016-05-15'),
          completedDate: new Date('2016-06-01'),
          description: 'Roof repair after hail damage',
          contractorName: 'Storm Damage Roofing',
          jurisdiction: 'McKinney',
        },
      ],
      workEvents: [
        {
          workType: 'Roofing',
          description: 'Hail damage repair',
          workDate: new Date('2016-05-15'),
          cost: 8500,
          contractorName: 'Storm Damage Roofing',
          contractorPhone: '(972) 555-0105',
          warrantyPeriodMonths: 120, // 10 year warranty (expired)
          warrantyType: 'Materials',
          warrantyDetails: '10 year material warranty on shingles',
        },
        {
          workType: 'HVAC',
          description: 'AC unit replacement',
          workDate: new Date('2017-07-10'),
          cost: 6200,
          contractorName: 'Cool Air Systems',
          contractorPhone: '(972) 555-0106',
          warrantyPeriodMonths: 60, // 5 year warranty (expired)
          warrantyType: 'Full System',
          warrantyDetails: '5 year warranty on parts and labor',
        },
      ],
      rentalSignals: [
        {
          startDate: new Date('2016-01-01'),
          endDate: new Date('2018-12-31'),
          source: 'listing_site',
          confidence: 0.75,
        },
      ],
      insuranceClaims: [
        {
          claimType: 'Wind/Hail',
          claimDate: new Date('2016-05-10'),
          amount: 12000,
          status: 'Paid',
          contractorName: 'Storm Damage Roofing',
          contractorPhone: '(972) 555-0105',
          workDescription: 'Roof repair and replacement due to hail damage',
        },
        {
          claimType: 'Water Damage',
          claimDate: new Date('2020-02-05'),
          amount: 8500,
          status: 'Paid',
          contractorName: 'Water Damage Specialists',
          contractorPhone: '(972) 555-0107',
          workDescription: 'Water damage restoration and mold remediation',
        },
      ],
    },
    {
      property: {
        apn: '789123456',
        address: '3456 Maple Court',
        city: 'Allen',
        state: 'TX',
        zipCode: '75013',
        latitude: 33.1032,
        longitude: -96.6706,
        lotSize: 7500,
        livingArea: 2200,
        bedrooms: 3,
        bathrooms: 2,
        yearBuilt: 2012,
        propertyType: 'Single Family',
      },
      sales: [
        {
          saleDate: new Date('2023-11-20'),
          salePrice: 395000,
          saleType: "Arm's Length",
          buyerName: 'Lisa Garcia',
          sellerName: 'Mark Davis',
        },
        {
          saleDate: new Date('2017-02-14'),
          salePrice: 295000,
          saleType: "Arm's Length",
          buyerName: 'Mark Davis',
          sellerName: 'Builder Corp',
        },
      ],
      ownership: [
        {
          ownerName: 'Lisa Garcia',
          ownerType: 'Individual',
          fromDate: new Date('2023-11-20'),
          isCurrent: true,
        },
        {
          ownerName: 'Mark Davis',
          ownerType: 'Individual',
          fromDate: new Date('2017-02-14'),
          toDate: new Date('2023-11-20'),
          isCurrent: false,
        },
      ],
      permits: [
        {
          permitNumber: 'PER-2024-0012',
          permitType: 'Building',
          status: 'Issued',
          issuedDate: new Date('2024-01-15'),
          description: 'Garage conversion to office space',
          contractorName: 'Allen Construction',
          jurisdiction: 'Allen',
        },
      ],
      workEvents: [],
      rentalSignals: [],
      insuranceClaims: [],
    },
    {
      property: {
        apn: '321654987',
        address: '7890 Pine Street',
        city: 'Richardson',
        state: 'TX',
        zipCode: '75080',
        latitude: 32.9483,
        longitude: -96.7299,
        lotSize: 9000,
        livingArea: 2700,
        bedrooms: 4,
        bathrooms: 3,
        yearBuilt: 2008,
        propertyType: 'Single Family',
      },
      sales: [
        {
          saleDate: new Date('2021-05-18'),
          salePrice: 445000,
          saleType: "Arm's Length",
          buyerName: 'Robert Lee',
          sellerName: 'Susan White',
        },
        {
          saleDate: new Date('2013-09-30'),
          salePrice: 325000,
          saleType: "Arm's Length",
          buyerName: 'Susan White',
          sellerName: 'Original Builder',
        },
      ],
      ownership: [
        {
          ownerName: 'Robert Lee',
          ownerType: 'Individual',
          fromDate: new Date('2021-05-18'),
          isCurrent: true,
        },
        {
          ownerName: 'Susan White',
          ownerType: 'Individual',
          fromDate: new Date('2013-09-30'),
          toDate: new Date('2021-05-18'),
          isCurrent: false,
        },
      ],
      permits: [
        {
          permitNumber: 'PER-2022-1456',
          permitType: 'Electrical',
          status: 'Completed',
          issuedDate: new Date('2022-03-01'),
          completedDate: new Date('2022-03-15'),
          description: 'Smart home automation system installation',
          contractorName: 'Tech Home Solutions',
          jurisdiction: 'Richardson',
        },
        {
          permitNumber: 'PER-2014-0789',
          permitType: 'Building',
          status: 'Completed',
          issuedDate: new Date('2014-05-10'),
          completedDate: new Date('2014-07-20'),
          description: 'Second story addition',
          contractorName: 'Richardson Builders',
          jurisdiction: 'Richardson',
        },
      ],
      workEvents: [
        {
          workType: 'Electrical',
          description: 'Smart home system',
          workDate: new Date('2022-03-01'),
          cost: 15000,
          contractorName: 'Tech Home Solutions',
          contractorPhone: '(972) 555-0108',
          contractorEmail: 'info@techhomesolutions.com',
          contractorWebsite: 'https://techhomesolutions.com',
          warrantyPeriodMonths: 36, // 3 year warranty
          warrantyType: 'Parts & Labor',
          warrantyDetails: '3 year warranty on all smart home components and installation',
        },
        {
          workType: 'Plumbing',
          description: 'Bathroom fixture upgrades',
          workDate: new Date('2021-08-10'),
          cost: 3500,
          contractorName: 'Richardson Plumbing',
          contractorPhone: '(972) 555-0109',
          warrantyPeriodMonths: 12, // 1 year warranty (expired)
          warrantyType: 'Labor',
          warrantyDetails: '1 year warranty on installation work',
        },
      ],
      rentalSignals: [],
      insuranceClaims: [
        {
          claimType: 'Fire',
          claimDate: new Date('2019-12-10'),
          amount: 25000,
          status: 'Paid',
          contractorName: 'Fire Restoration Pro',
          contractorPhone: '(972) 555-0110',
          workDescription: 'Fire damage restoration, smoke remediation, and structural repairs',
        },
      ],
    },
  ];

  try {
    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🧹 Clearing existing data...');
    await prisma.insuranceClaim.deleteMany();
    await prisma.rentalSignal.deleteMany();
    await prisma.workEvent.deleteMany();
    await prisma.permit.deleteMany();
    await prisma.sale.deleteMany();
    await prisma.ownershipEvent.deleteMany();
    await prisma.sourceRecord.deleteMany();
    await prisma.property.deleteMany();

    // Ingest each property with its history
    for (const propertyData of sampleProperties) {
      console.log(`\n📦 Ingesting property: ${propertyData.property.address}`);

      // Ingest property
      const property = await ingestionService.ingestProperty(
        propertyData.property,
        'sample_data',
        propertyData.property.apn,
        propertyData.property
      );

      // Ingest sales
      for (const sale of propertyData.sales) {
        await ingestionService.ingestSale(property.id, sale, 'sample_data');
      }

      // Ingest ownership events
      for (const ownership of propertyData.ownership) {
        await ingestionService.ingestOwnershipEvent(property.id, ownership, 'sample_data');
      }

      // Ingest permits
      for (const permit of propertyData.permits) {
        await ingestionService.ingestPermit(property.id, permit, 'sample_data');
      }

      // Ingest work events (need to create contractors first)
      for (const workEvent of propertyData.workEvents) {
        let contractor = null;
        if (workEvent.contractorName) {
          // Check if contractor exists first
          contractor = await prisma.contractorCompany.findFirst({
            where: { name: workEvent.contractorName },
          });
          
          if (!contractor) {
            contractor = await prisma.contractorCompany.create({
              data: {
                name: workEvent.contractorName,
                state: 'TX',
                verificationStatus: 'verified',
                phone: (workEvent as any).contractorPhone,
                email: (workEvent as any).contractorEmail,
                website: (workEvent as any).contractorWebsite,
              },
            });
          }
        }

        // Calculate warranty expiration if period provided
        let warrantyExpirationDate = null;
        if ((workEvent as any).warrantyPeriodMonths && workEvent.workDate) {
          const workDate = new Date(workEvent.workDate);
          warrantyExpirationDate = new Date(workDate);
          warrantyExpirationDate.setMonth(warrantyExpirationDate.getMonth() + (workEvent as any).warrantyPeriodMonths);
        }

        await prisma.workEvent.create({
          data: {
            propertyId: property.id,
            contractorId: contractor?.id,
            workType: workEvent.workType,
            description: workEvent.description,
            workDate: workEvent.workDate,
            cost: workEvent.cost,
            warrantyPeriodMonths: (workEvent as any).warrantyPeriodMonths,
            warrantyExpirationDate,
            warrantyType: (workEvent as any).warrantyType,
            warrantyDetails: (workEvent as any).warrantyDetails,
            verificationStatus: 'verified',
          },
        });
      }

      // Ingest rental signals
      for (const rental of propertyData.rentalSignals) {
        await prisma.rentalSignal.create({
          data: {
            propertyId: property.id,
            source: rental.source,
            startDate: rental.startDate,
            endDate: rental.endDate,
            confidence: rental.confidence,
          },
        });
      }

      // Ingest insurance claims (need to create contractors first)
      for (const claim of propertyData.insuranceClaims) {
        let contractor = null;
        if ((claim as any).contractorName) {
          contractor = await prisma.contractorCompany.findFirst({
            where: { name: (claim as any).contractorName },
          });
          
          if (!contractor) {
            contractor = await prisma.contractorCompany.create({
              data: {
                name: (claim as any).contractorName,
                state: 'TX',
                verificationStatus: 'verified',
                phone: (claim as any).contractorPhone,
              },
            });
          }
        }

        await prisma.insuranceClaim.create({
          data: {
            propertyId: property.id,
            claimType: claim.claimType,
            claimDate: claim.claimDate,
            amount: claim.amount,
            status: claim.status,
            contractorId: contractor?.id,
            workDescription: (claim as any).workDescription,
            verificationStatus: 'verified',
          },
        });
      }

      console.log(`✅ Completed: ${propertyData.property.address}`);
    }

    console.log('\n🎉 Data seeding completed successfully!');
    console.log(`\n📊 Summary:`);
    const counts = {
      properties: await prisma.property.count(),
      sales: await prisma.sale.count(),
      ownershipEvents: await prisma.ownershipEvent.count(),
      permits: await prisma.permit.count(),
      workEvents: await prisma.workEvent.count(),
      rentalSignals: await prisma.rentalSignal.count(),
      insuranceClaims: await prisma.insuranceClaim.count(),
    };
    console.log(JSON.stringify(counts, null, 2));
  } catch (error) {
    console.error('❌ Error seeding data:', error);
    throw error;
  } finally {
    await app.close();
  }
}

// Run the seed script
seedSampleData()
  .then(() => {
    console.log('\n✨ Seed script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
