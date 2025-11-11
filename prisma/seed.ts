import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create sample users
  const buyer = await prisma.user.upsert({
    where: { email: 'buyer@example.com' },
    update: {},
    create: {
      email: 'buyer@example.com',
      name: 'John Buyer',
      password: await bcrypt.hash('password123', 10),
      role: 'BUYER',
    },
  })

  const realtor = await prisma.user.upsert({
    where: { email: 'realtor@example.com' },
    update: {},
    create: {
      email: 'realtor@example.com',
      name: 'Jane Realtor',
      password: await bcrypt.hash('password123', 10),
      role: 'REALTOR',
    },
  })

  console.log('Created users')

  // Sample properties with full history
  const properties = [
    {
      address: '123 Oak Street',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90001',
      propertyType: 'Single Family',
      yearBuilt: 1995,
      squareFeet: 2500,
      lotSize: 0.25,
      sales: [
        {
          saleDate: new Date('2023-06-15'),
          salePrice: 850000,
          buyerName: 'Sarah Johnson',
          sellerName: 'Michael Chen',
          saleType: 'Standard',
        },
        {
          saleDate: new Date('2018-03-20'),
          salePrice: 650000,
          buyerName: 'Michael Chen',
          sellerName: 'Robert Williams',
          saleType: 'Standard',
        },
        {
          saleDate: new Date('2012-11-10'),
          salePrice: 450000,
          buyerName: 'Robert Williams',
          sellerName: 'Original Builder',
          saleType: 'Standard',
        },
      ],
      work: [
        {
          workType: 'Roofing',
          description: 'Complete roof replacement with asphalt shingles',
          contractor: 'ABC Roofing Co.',
          contractorLicense: 'LIC-12345',
          workDate: new Date('2021-05-10'),
          cost: 15000,
          permitNumber: 'PER-2021-001',
          permitIssued: true,
          warrantyYears: 20,
        },
        {
          workType: 'HVAC',
          description: 'New central air conditioning system installation',
          contractor: 'Cool Air Solutions',
          contractorLicense: 'LIC-67890',
          workDate: new Date('2020-08-15'),
          cost: 8000,
          permitNumber: 'PER-2020-045',
          permitIssued: true,
          warrantyYears: 10,
        },
        {
          workType: 'Kitchen Remodel',
          description: 'Complete kitchen renovation with new cabinets and appliances',
          contractor: 'Home Renovations Inc.',
          contractorLicense: 'LIC-11111',
          workDate: new Date('2019-02-20'),
          cost: 35000,
          permitNumber: 'PER-2019-012',
          permitIssued: true,
          warrantyYears: 5,
        },
      ],
      claims: [
        {
          claimDate: new Date('2022-01-15'),
          claimType: 'Water Damage',
          claimAmount: 12000,
          status: 'Approved',
          description: 'Burst pipe in basement',
          insuranceCompany: 'State Farm',
        },
      ],
      warranties: [
        {
          warrantyType: 'Home Warranty',
          provider: 'American Home Shield',
          startDate: new Date('2023-06-15'),
          endDate: new Date('2024-06-15'),
          coverage: 'Major systems and appliances',
          isActive: true,
        },
      ],
    },
    {
      address: '456 Maple Avenue',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      propertyType: 'Condo',
      yearBuilt: 2010,
      squareFeet: 1200,
      lotSize: null,
      sales: [
        {
          saleDate: new Date('2022-09-10'),
          salePrice: 1200000,
          buyerName: 'David Kim',
          sellerName: 'Lisa Anderson',
          saleType: 'Standard',
        },
        {
          saleDate: new Date('2015-04-05'),
          salePrice: 750000,
          buyerName: 'Lisa Anderson',
          sellerName: 'Developer',
          saleType: 'Standard',
        },
      ],
      work: [
        {
          workType: 'Electrical',
          description: 'Electrical panel upgrade to 200 amps',
          contractor: 'Spark Electric',
          contractorLicense: 'LIC-22222',
          workDate: new Date('2021-11-05'),
          cost: 4500,
          permitNumber: 'PER-2021-089',
          permitIssued: true,
          warrantyYears: 5,
        },
        {
          workType: 'Bathroom Remodel',
          description: 'Master bathroom renovation',
          contractor: 'Bathroom Specialists',
          contractorLicense: 'LIC-33333',
          workDate: new Date('2020-03-12'),
          cost: 18000,
          permitNumber: 'PER-2020-023',
          permitIssued: true,
          warrantyYears: 3,
        },
      ],
      claims: [],
      warranties: [
        {
          warrantyType: 'Manufacturer',
          provider: 'Whirlpool',
          startDate: new Date('2022-09-10'),
          endDate: new Date('2027-09-10'),
          coverage: 'Kitchen appliances',
          isActive: true,
        },
      ],
    },
    {
      address: '789 Pine Drive',
      city: 'San Diego',
      state: 'CA',
      zipCode: '92101',
      propertyType: 'Townhouse',
      yearBuilt: 2005,
      squareFeet: 1800,
      lotSize: 0.15,
      sales: [
        {
          saleDate: new Date('2021-12-01'),
          salePrice: 720000,
          buyerName: 'Emily Rodriguez',
          sellerName: 'James Taylor',
          saleType: 'Standard',
        },
        {
          saleDate: new Date('2017-07-18'),
          salePrice: 580000,
          buyerName: 'James Taylor',
          sellerName: 'Patricia Brown',
          saleType: 'Standard',
        },
        {
          saleDate: new Date('2010-02-14'),
          salePrice: 420000,
          buyerName: 'Patricia Brown',
          sellerName: 'Original Owner',
          saleType: 'Standard',
        },
      ],
      work: [
        {
          workType: 'Plumbing',
          description: 'Complete plumbing system replacement',
          contractor: 'Plumb Perfect',
          contractorLicense: 'LIC-44444',
          workDate: new Date('2019-09-20'),
          cost: 12000,
          permitNumber: 'PER-2019-067',
          permitIssued: true,
          warrantyYears: 10,
        },
        {
          workType: 'Foundation',
          description: 'Foundation repair and waterproofing',
          contractor: 'Solid Foundations',
          contractorLicense: 'LIC-55555',
          workDate: new Date('2018-05-15'),
          cost: 25000,
          permitNumber: 'PER-2018-034',
          permitIssued: true,
          warrantyYears: 15,
        },
      ],
      claims: [
        {
          claimDate: new Date('2020-08-30'),
          claimType: 'Storm Damage',
          claimAmount: 8500,
          status: 'Approved',
          description: 'Roof damage from hailstorm',
          insuranceCompany: 'Allstate',
        },
        {
          claimDate: new Date('2016-03-10'),
          claimType: 'Water Damage',
          claimAmount: 6000,
          status: 'Approved',
          description: 'Basement flooding',
          insuranceCompany: 'Allstate',
        },
      ],
      warranties: [
        {
          warrantyType: 'Contractor',
          provider: 'Solid Foundations',
          startDate: new Date('2018-05-15'),
          endDate: new Date('2033-05-15'),
          coverage: 'Foundation workmanship and materials',
          isActive: true,
        },
      ],
    },
    {
      address: '321 Elm Boulevard',
      city: 'Sacramento',
      state: 'CA',
      zipCode: '95814',
      propertyType: 'Single Family',
      yearBuilt: 1988,
      squareFeet: 2200,
      lotSize: 0.3,
      sales: [
        {
          saleDate: new Date('2023-03-22'),
          salePrice: 550000,
          buyerName: 'Thomas Wilson',
          sellerName: 'Jennifer Martinez',
          saleType: 'Standard',
        },
        {
          saleDate: new Date('2019-11-08'),
          salePrice: 480000,
          buyerName: 'Jennifer Martinez',
          sellerName: 'William Davis',
          saleType: 'Standard',
        },
        {
          saleDate: new Date('2014-06-12'),
          salePrice: 320000,
          buyerName: 'William Davis',
          sellerName: 'Foreclosure Bank',
          saleType: 'Foreclosure',
        },
        {
          saleDate: new Date('2008-09-20'),
          salePrice: 280000,
          buyerName: 'Original Owner',
          sellerName: 'Builder',
          saleType: 'Standard',
        },
      ],
      work: [
        {
          workType: 'Roofing',
          description: 'Roof repair and partial replacement',
          contractor: 'Top Roofing',
          contractorLicense: 'LIC-66666',
          workDate: new Date('2020-04-10'),
          cost: 9000,
          permitNumber: 'PER-2020-056',
          permitIssued: true,
          warrantyYears: 15,
        },
        {
          workType: 'HVAC',
          description: 'Furnace replacement',
          contractor: 'Warm Air Co.',
          contractorLicense: 'LIC-77777',
          workDate: new Date('2017-10-05'),
          cost: 5500,
          permitNumber: 'PER-2017-091',
          permitIssued: true,
          warrantyYears: 10,
        },
      ],
      claims: [
        {
          claimDate: new Date('2021-12-05'),
          claimType: 'Fire',
          claimAmount: 35000,
          status: 'Approved',
          description: 'Kitchen fire damage',
          insuranceCompany: 'Farmers Insurance',
        },
      ],
      warranties: [],
    },
    {
      address: '654 Cedar Lane',
      city: 'Oakland',
      state: 'CA',
      zipCode: '94601',
      propertyType: 'Single Family',
      yearBuilt: 2015,
      squareFeet: 2800,
      lotSize: 0.35,
      sales: [
        {
          saleDate: new Date('2022-05-18'),
          salePrice: 950000,
          buyerName: 'Christopher Lee',
          sellerName: 'Amanda White',
          saleType: 'Standard',
        },
        {
          saleDate: new Date('2018-08-30'),
          salePrice: 820000,
          buyerName: 'Amanda White',
          sellerName: 'Builder',
          saleType: 'Standard',
        },
      ],
      work: [
        {
          workType: 'Solar Installation',
          description: 'Complete solar panel system installation',
          contractor: 'Sun Power Solutions',
          contractorLicense: 'LIC-88888',
          workDate: new Date('2021-07-20'),
          cost: 28000,
          permitNumber: 'PER-2021-123',
          permitIssued: true,
          warrantyYears: 25,
        },
        {
          workType: 'Landscaping',
          description: 'Complete yard landscaping and irrigation',
          contractor: 'Green Thumb Landscaping',
          contractorLicense: 'LIC-99999',
          workDate: new Date('2019-04-15'),
          cost: 15000,
          permitIssued: false,
        },
      ],
      claims: [],
      warranties: [
        {
          warrantyType: 'Manufacturer',
          provider: 'SunPower',
          startDate: new Date('2021-07-20'),
          endDate: new Date('2046-07-20'),
          coverage: 'Solar panels and inverters',
          isActive: true,
        },
        {
          warrantyType: 'Home Warranty',
          provider: 'Choice Home Warranty',
          startDate: new Date('2022-05-18'),
          endDate: new Date('2023-05-18'),
          coverage: 'Systems and appliances',
          isActive: false,
        },
      ],
    },
  ]

  // Create properties with all related data
  for (const propData of properties) {
    const { sales, work, claims, warranties, ...propertyData } = propData

    const property = await prisma.property.upsert({
      where: {
        address_city_state_zipCode: {
          address: propertyData.address,
          city: propertyData.city,
          state: propertyData.state,
          zipCode: propertyData.zipCode,
        },
      },
      update: {},
      create: propertyData,
    })

    // Create sales (delete existing first to avoid duplicates)
    await prisma.sale.deleteMany({
      where: { propertyId: property.id },
    })
    for (const sale of sales) {
      await prisma.sale.create({
        data: {
          propertyId: property.id,
          ...sale,
        },
      })
    }

    // Create work records (delete existing first)
    await prisma.workRecord.deleteMany({
      where: { propertyId: property.id },
    })
    for (const workRecord of work) {
      let warrantyExpires: Date | null = null
      if (workRecord.warrantyYears) {
        warrantyExpires = new Date(workRecord.workDate)
        warrantyExpires.setFullYear(warrantyExpires.getFullYear() + workRecord.warrantyYears)
      }

      await prisma.workRecord.create({
        data: {
          propertyId: property.id,
          ...workRecord,
          warrantyExpires,
        },
      })
    }

    // Create insurance claims (delete existing first)
    await prisma.insuranceClaim.deleteMany({
      where: { propertyId: property.id },
    })
    for (const claim of claims) {
      await prisma.insuranceClaim.create({
        data: {
          propertyId: property.id,
          ...claim,
        },
      })
    }

    // Create warranties (delete existing first)
    await prisma.warranty.deleteMany({
      where: { propertyId: property.id },
    })
    for (const warranty of warranties) {
      await prisma.warranty.create({
        data: {
          propertyId: property.id,
          ...warranty,
        },
      })
    }

    console.log(`Created property: ${propertyData.address}`)
  }

  console.log('Seeding completed!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

