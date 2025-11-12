import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkUser() {
  const email = process.argv[2] || 'nguyen.jonathan1@gmail.com'

  console.log(`Checking user: ${email}\n`)

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
      },
    })

    if (!user) {
      console.error(`❌ User with email ${email} not found`)
      console.log('\nAvailable users:')
      const allUsers = await prisma.user.findMany({
        select: { email: true, name: true, role: true },
        orderBy: { createdAt: 'desc' },
      })
      allUsers.forEach((u) => {
        console.log(`  - ${u.email} (${u.name}) - Role: ${u.role}`)
      })
      process.exit(1)
    }

    console.log('User found:')
    console.log(`  ID: ${user.id}`)
    console.log(`  Email: ${user.email}`)
    console.log(`  Name: ${user.name}`)
    console.log(`  Role: ${user.role}`)
    console.log(`  Created: ${user.createdAt}`)
    console.log(`\n${user.role === 'ADMIN' ? '✅' : '❌'} Role is ${user.role === 'ADMIN' ? 'ADMIN' : 'NOT ADMIN'}`)

    if (user.role !== 'ADMIN') {
      console.log('\nUpdating to ADMIN...')
      await prisma.user.update({
        where: { email },
        data: { role: 'ADMIN' },
      })
      console.log('✅ Updated to ADMIN!')
      console.log('\n⚠️  Please sign out and sign back in for the change to take effect.')
    }
  } catch (error) {
    console.error('Error checking user:', error)
    process.exit(1)
  }
}

checkUser()
  .finally(async () => {
    await prisma.$disconnect()
  })

