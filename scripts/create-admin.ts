import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function createAdmin() {
  const email = process.argv[2] || 'admin@truehome.com'
  const password = process.argv[3] || 'admin123'
  const name = process.argv[4] || 'Admin User'

  console.log('Creating admin user...')
  console.log(`Email: ${email}`)
  console.log(`Name: ${name}`)

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  })

  if (existingAdmin) {
    // Update to admin role
    if (existingAdmin.role !== 'ADMIN') {
      await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
      })
      console.log('✅ Updated existing user to ADMIN role')
    } else {
      console.log('✅ Admin user already exists')
    }
    return
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10)

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created successfully!')
  console.log(`   ID: ${admin.id}`)
  console.log(`   Email: ${admin.email}`)
  console.log(`   Role: ${admin.role}`)
  console.log('\n⚠️  Please change the default password after first login!')
}

createAdmin()
  .catch((error) => {
    console.error('Error creating admin:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

