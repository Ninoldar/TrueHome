import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.purchase.deleteMany()
  await prisma.report.deleteMany()
  await prisma.maintenanceRecord.deleteMany()
  await prisma.environmentalAssessment.deleteMany()
  await prisma.usageRecord.deleteMany()
  await prisma.titleIssue.deleteMany()
  await prisma.warranty.deleteMany()
  await prisma.insuranceClaim.deleteMany()
  await prisma.workRecord.deleteMany()
  await prisma.sale.deleteMany()
  await prisma.property.deleteMany()

  console.log('✅ Existing data cleared')

  // Create sample properties with full history
  const properties = [
    {
      address: '1234 Oak Street',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      propertyType: 'Single Family Home',
      yearBuilt: 1985,
      squareFeet: 2400,
      lotSize: 0.15,
      salesHistory: [
        {
          saleDate: new Date('2023-06-15'),
          salePrice: 950000,
          saleType: 'Standard',
          buyerName: 'John & Sarah Smith',
          sellerName: 'Michael Johnson',
        },
        {
          saleDate: new Date('2018-03-22'),
          salePrice: 720000,
          saleType: 'Standard',
          buyerName: 'Michael Johnson',
          sellerName: 'Estate of Robert Williams',
        },
        {
          saleDate: new Date('2012-11-08'),
          salePrice: 485000,
          saleType: 'Foreclosure',
          buyerName: 'ABC Investment Group',
          sellerName: 'Previous Owner',
        },
      ],
      workHistory: [
        {
          workType: 'Roofing',
          description: 'Complete roof replacement with 30-year warranty',
          contractor: 'TrueHome Certified: Bay Area Roofing Co.',
          workDate: new Date('2023-08-10'),
          cost: 18500,
          permitIssued: true,
          permitNumber: 'PER-2023-08452',
        },
        {
          workType: 'HVAC',
          description: 'New central air conditioning system installed',
          contractor: 'TrueHome Certified: Climate Control Solutions',
          workDate: new Date('2023-05-20'),
          cost: 12500,
          permitIssued: true,
          permitNumber: 'PER-2023-05231',
        },
        {
          workType: 'Electrical',
          description: 'Electrical panel upgrade to 200A service',
          contractor: 'TrueHome Certified: SafeWire Electric',
          workDate: new Date('2022-11-15'),
          cost: 4200,
          permitIssued: true,
          permitNumber: 'PER-2022-11245',
        },
      ],
      insuranceClaims: [
        {
          claimDate: new Date('2021-03-15'),
          claimType: 'Water Damage',
          claimAmount: 12500,
          status: 'Settled',
          description: 'Burst pipe in master bathroom - fully repaired',
          insuranceCompany: 'State Farm',
        },
        {
          claimDate: new Date('2019-11-08'),
          claimType: 'Storm Damage',
          claimAmount: 8500,
          status: 'Settled',
          description: 'Roof damage from severe storm - partial replacement',
          insuranceCompany: 'Allstate',
        },
      ],
      warranties: [
        {
          warrantyType: 'Roofing',
          provider: 'Bay Area Roofing Co.',
          startDate: new Date('2023-08-10'),
          endDate: new Date('2053-08-10'),
          isActive: true,
          coverage: '30-year material and labor warranty',
        },
        {
          warrantyType: 'HVAC',
          provider: 'Climate Control Solutions',
          startDate: new Date('2023-05-20'),
          endDate: new Date('2028-05-20'),
          isActive: true,
          coverage: '5-year parts and labor warranty',
        },
      ],
      titleIssues: [
        {
          issueType: 'Lien',
          description: 'Unpaid contractor lien from 2012 - amount: $8,500',
          recordedDate: new Date('2012-10-15'),
          isResolved: false,
          amount: 8500,
          recordedBy: 'County Recorder',
        },
      ],
      usageHistory: [
        {
          usageType: 'Owner Occupied',
          startDate: new Date('2023-06-15'),
          isCurrent: true,
          notes: 'Current owner residence',
        },
        {
          usageType: 'Rental',
          startDate: new Date('2018-03-22'),
          endDate: new Date('2023-06-14'),
          isCurrent: false,
          notes: 'Property was rented out for 5 years',
        },
      ],
      environmentalAssessments: [
        {
          assessmentType: 'Lead Paint',
          assessmentDate: new Date('2023-06-20'),
          result: 'Pass',
          details: 'No lead-based paint detected',
        },
        {
          assessmentType: 'Radon',
          assessmentDate: new Date('2023-06-20'),
          result: 'Presence Detected',
          details: 'Radon levels at 4.2 pCi/L - mitigation system recommended',
        },
      ],
      maintenanceRecords: [
        {
          maintenanceType: 'HVAC Service',
          serviceDate: new Date('2023-10-15'),
          nextDueDate: new Date('2024-10-15'),
          notes: 'Annual maintenance completed - system in good condition',
          serviceProvider: 'Climate Control Solutions',
        },
        {
          maintenanceType: 'Gutter Cleaning',
          serviceDate: new Date('2023-09-20'),
          nextDueDate: new Date('2024-03-20'),
          notes: 'Fall cleaning completed',
          serviceProvider: 'Home Maintenance Pro',
        },
      ],
    },
    {
      address: '5678 Maple Avenue',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90028',
      propertyType: 'Condo',
      yearBuilt: 2010,
      squareFeet: 1200,
      lotSize: 0.05,
      salesHistory: [
        {
          saleDate: new Date('2022-01-10'),
          salePrice: 650000,
          saleType: 'Standard',
          buyerName: 'Emily Chen',
          sellerName: 'David Martinez',
        },
        {
          saleDate: new Date('2015-07-22'),
          salePrice: 420000,
          saleType: 'Standard',
          buyerName: 'David Martinez',
          sellerName: 'Original Developer',
        },
      ],
      workHistory: [
        {
          workType: 'Kitchen',
          description: 'Complete kitchen remodel with new appliances',
          contractor: 'Home Renovations LLC',
          workDate: new Date('2022-05-15'),
          cost: 35000,
          permitIssued: true,
          permitNumber: 'PER-2022-05123',
        },
        {
          workType: 'Bathroom',
          description: 'Master bathroom renovation',
          contractor: 'TrueHome Certified: AquaFlow Plumbing',
          workDate: new Date('2021-09-30'),
          cost: 28000,
          permitIssued: true,
          permitNumber: 'PER-2021-09301',
        },
      ],
      insuranceClaims: [
        {
          claimDate: new Date('2020-08-12'),
          claimType: 'Fire',
          claimAmount: 45000,
          status: 'Settled',
          description: 'Kitchen fire - full restoration completed',
          insuranceCompany: 'Farmers Insurance',
        },
      ],
      warranties: [
        {
          warrantyType: 'Home Warranty',
          provider: 'American Home Shield',
          startDate: new Date('2022-01-10'),
          endDate: new Date('2025-01-10'),
          isActive: true,
          coverage: 'Comprehensive home warranty coverage',
        },
      ],
      titleIssues: [],
      usageHistory: [
        {
          usageType: 'Owner Occupied',
          startDate: new Date('2022-01-10'),
          isCurrent: true,
          notes: 'Current owner residence',
        },
      ],
      environmentalAssessments: [
        {
          assessmentType: 'Lead Paint',
          assessmentDate: new Date('2022-01-15'),
          result: 'Pass',
          details: 'No lead-based paint detected',
        },
      ],
      maintenanceRecords: [
        {
          maintenanceType: 'HVAC Service',
          serviceDate: new Date('2023-11-01'),
          nextDueDate: new Date('2024-11-01'),
          notes: 'Annual service completed',
          serviceProvider: 'HVAC Experts',
        },
      ],
    },
    {
      address: '9012 Pine Drive',
      city: 'San Diego',
      state: 'CA',
      zipCode: '92101',
      propertyType: 'Townhouse',
      yearBuilt: 2000,
      squareFeet: 1800,
      lotSize: 0.12,
      salesHistory: [
        {
          saleDate: new Date('2021-04-20'),
          salePrice: 580000,
          saleType: 'Standard',
          buyerName: 'Robert & Lisa Anderson',
          sellerName: 'Jennifer White',
        },
        {
          saleDate: new Date('2016-09-15'),
          salePrice: 380000,
          saleType: 'Standard',
          buyerName: 'Jennifer White',
          sellerName: 'Previous Owner',
        },
      ],
      workHistory: [
        {
          workType: 'Foundation',
          description: 'Foundation crack repair and waterproofing',
          contractor: 'Foundation Experts Inc.',
          workDate: new Date('2020-04-12'),
          cost: 15000,
          permitIssued: true,
          permitNumber: 'PER-2020-04120',
        },
        {
          workType: 'Plumbing',
          description: 'Complete plumbing system upgrade',
          contractor: 'TrueHome Certified: AquaFlow Plumbing',
          workDate: new Date('2019-07-22'),
          cost: 12000,
          permitIssued: true,
          permitNumber: 'PER-2019-07220',
        },
      ],
      insuranceClaims: [],
      warranties: [
        {
          warrantyType: 'Contractor',
          provider: 'Foundation Experts Inc.',
          startDate: new Date('2020-04-12'),
          endDate: new Date('2030-04-12'),
          isActive: true,
          coverage: '10-year foundation warranty',
        },
      ],
      titleIssues: [],
      usageHistory: [
        {
          usageType: 'Owner Occupied',
          startDate: new Date('2021-04-20'),
          isCurrent: true,
          notes: 'Current owner residence',
        },
      ],
      environmentalAssessments: [
        {
          assessmentType: 'Asbestos',
          assessmentDate: new Date('2021-04-25'),
          result: 'Pass',
          details: 'No asbestos detected',
        },
      ],
      maintenanceRecords: [
        {
          maintenanceType: 'Roof Inspection',
          serviceDate: new Date('2023-08-15'),
          nextDueDate: new Date('2024-08-15'),
          notes: 'Annual inspection - roof in good condition',
          serviceProvider: 'Roofing Specialists',
        },
      ],
    },
    {
      address: '3456 Elm Street',
      city: 'Oakland',
      state: 'CA',
      zipCode: '94601',
      propertyType: 'Single Family Home',
      yearBuilt: 1975,
      squareFeet: 2200,
      lotSize: 0.18,
      salesHistory: [
        {
          saleDate: new Date('2020-11-05'),
          salePrice: 780000,
          saleType: 'Standard',
          buyerName: 'Michael & Sarah Johnson',
          sellerName: 'Estate of Patricia Brown',
        },
        {
          saleDate: new Date('2008-06-10'),
          salePrice: 320000,
          saleType: 'Standard',
          buyerName: 'Patricia Brown',
          sellerName: 'Previous Owner',
        },
      ],
      workHistory: [
        {
          workType: 'Roofing',
          description: 'Partial roof replacement',
          contractor: 'Bay Area Roofing Co.',
          workDate: new Date('2019-11-08'),
          cost: 12000,
          permitIssued: true,
          permitNumber: 'PER-2019-11080',
        },
      ],
      insuranceClaims: [
        {
          claimDate: new Date('2019-11-08'),
          claimType: 'Storm Damage',
          claimAmount: 8500,
          status: 'Settled',
          description: 'Roof damage from severe storm',
          insuranceCompany: 'Allstate',
        },
      ],
      warranties: [],
      titleIssues: [
        {
          issueType: 'Easement',
          description: 'Utility easement - resolved and documented',
          recordedDate: new Date('2005-01-10'),
          isResolved: true,
          recordedBy: 'County Recorder',
        },
      ],
      usageHistory: [
        {
          usageType: 'Owner Occupied',
          startDate: new Date('2020-11-05'),
          isCurrent: true,
          notes: 'Current owner residence',
        },
      ],
      environmentalAssessments: [],
      maintenanceRecords: [],
    },
    {
      address: '7890 Cedar Lane',
      city: 'San Jose',
      state: 'CA',
      zipCode: '95110',
      propertyType: 'Single Family Home',
      yearBuilt: 1995,
      squareFeet: 2600,
      lotSize: 0.20,
      salesHistory: [
        {
          saleDate: new Date('2023-02-14'),
          salePrice: 1100000,
          saleType: 'Standard',
          buyerName: 'James & Maria Garcia',
          sellerName: 'Thomas Wilson',
        },
        {
          saleDate: new Date('2017-05-20'),
          salePrice: 750000,
          saleType: 'Standard',
          buyerName: 'Thomas Wilson',
          sellerName: 'Previous Owner',
        },
      ],
      workHistory: [
        {
          workType: 'HVAC',
          description: 'New HVAC system installation',
          contractor: 'TrueHome Certified: Climate Control Solutions',
          workDate: new Date('2023-03-10'),
          cost: 15000,
          permitIssued: true,
          permitNumber: 'PER-2023-03100',
        },
        {
          workType: 'Electrical',
          description: 'Electrical system upgrade',
          contractor: 'TrueHome Certified: SafeWire Electric',
          workDate: new Date('2022-08-20'),
          cost: 8000,
          permitIssued: true,
          permitNumber: 'PER-2022-08200',
        },
      ],
      insuranceClaims: [],
      warranties: [
        {
          warrantyType: 'HVAC',
          provider: 'Climate Control Solutions',
          startDate: new Date('2023-03-10'),
          endDate: new Date('2028-03-10'),
          isActive: true,
          coverage: '5-year parts and labor warranty',
        },
      ],
      titleIssues: [],
      usageHistory: [
        {
          usageType: 'Owner Occupied',
          startDate: new Date('2023-02-14'),
          isCurrent: true,
          notes: 'Current owner residence',
        },
      ],
      environmentalAssessments: [
        {
          assessmentType: 'Radon',
          assessmentDate: new Date('2023-02-20'),
          result: 'Pass',
          details: 'Radon levels within acceptable range',
        },
      ],
      maintenanceRecords: [
        {
          maintenanceType: 'HVAC Service',
          serviceDate: new Date('2023-10-01'),
          nextDueDate: new Date('2024-10-01'),
          notes: 'Annual maintenance completed',
          serviceProvider: 'Climate Control Solutions',
        },
      ],
    },
  ]

  console.log(`📦 Creating ${properties.length} sample properties...`)

  for (const propertyData of properties) {
    const {
      salesHistory,
      workHistory,
      insuranceClaims,
      warranties,
      titleIssues,
      usageHistory,
      environmentalAssessments,
      maintenanceRecords,
      ...propertyInfo
    } = propertyData

    const property = await prisma.property.create({
      data: {
        ...propertyInfo,
        salesHistory: {
          create: salesHistory,
        },
        workHistory: {
          create: workHistory,
        },
        insuranceClaims: {
          create: insuranceClaims,
        },
        warranties: {
          create: warranties,
        },
        titleIssues: {
          create: titleIssues,
        },
        usageHistory: {
          create: usageHistory,
        },
        environmentalAssessments: {
          create: environmentalAssessments,
        },
        maintenanceRecords: {
          create: maintenanceRecords,
        },
      },
    })

    console.log(`✅ Created property: ${property.address}, ${property.city}, ${property.state}`)
  }

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
