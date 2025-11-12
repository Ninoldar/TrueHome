import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function makeAdmin() {
  const email = process.argv[2]

  if (!email) {
    console.error('Please provide an email address')
    console.log('Usage: pnpm run make-admin your-email@example.com')
    process.exit(1)
  }

  console.log(`Updating user ${email} to ADMIN role...`)

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      console.error(`❌ User with email ${email} not found`)
      console.log('\nAvailable users:')
      const allUsers = await prisma.user.findMany({
        select: { email: true, name: true, role: true },
      })
      allUsers.forEach((u) => {
        console.log(`  - ${u.email} (${u.name}) - ${u.role}`)
      })
      process.exit(1)
    }

    if (user.role === 'ADMIN') {
      console.log('✅ User is already an ADMIN')
      return
    }

    await prisma.user.update({
      where: { email },
      data: { role: 'ADMIN' },
    })

    console.log('✅ Successfully updated user to ADMIN role!')
    console.log(`   Email: ${user.email}`)
    console.log(`   Name: ${user.name}`)
    console.log(`   Role: ADMIN`)
    console.log('\n⚠️  Sign out and sign back in to see the Admin button in the header')
  } catch (error) {
    console.error('Error updating user:', error)
    process.exit(1)
  }
}

makeAdmin()
  .finally(async () => {
    await prisma.$disconnect()
  })

