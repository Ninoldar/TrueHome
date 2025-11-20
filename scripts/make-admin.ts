import { PrismaClient } from '@prisma/client'
import { config } from 'dotenv'
import { resolve } from 'path'

// Load environment variables
config({ path: resolve(process.cwd(), '.env.local') })

const prisma = new PrismaClient()

async function makeAdmin() {
  const email = process.argv[2]

  if (!email) {
    console.error('Usage: tsx scripts/make-admin.ts <email>')
    process.exit(1)
  }

  try {
    const user = await prisma.user.findFirst({
      where: {
        email: {
          equals: email.toLowerCase(),
          mode: 'insensitive'
        }
      }
    })

    if (!user) {
      console.error(`User with email ${email} not found`)
      process.exit(1)
    }

    if (user.role === 'admin') {
      console.log(`User ${email} is already an admin`)
      process.exit(0)
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: { role: 'admin' }
    })

    console.log(`✅ Successfully updated ${updated.email} to admin role`)
    console.log(`User ID: ${updated.id}`)
    console.log(`Role: ${updated.role}`)
  } catch (error) {
    console.error('Error updating user:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

makeAdmin()

