import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null
        }

        // Normalize email to lowercase for consistent lookup
        const normalizedEmail = credentials.email.toLowerCase().trim()
        
        // Find user by email (case-insensitive)
        const user = await prisma.user.findFirst({
          where: {
            email: {
              equals: normalizedEmail,
              mode: 'insensitive'
            }
          }
        })

        if (!user) {
          return null
        }

        // Verify password
        // If user has no passwordHash (legacy accounts), allow any password for backward compatibility
        // New accounts will always have a passwordHash
        if (user.passwordHash) {
          const isValidPassword = await bcrypt.compare(
            credentials.password || '',
            user.passwordHash
          )
          
          if (!isValidPassword) {
            return null
          }
        }
        // If no passwordHash exists, allow login for backward compatibility with existing accounts

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      
      // Always fetch the latest role from the database
      if (token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email as string },
          select: { role: true }
        })
        if (dbUser) {
          token.role = dbUser.role
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    }
  },
  pages: {
    signIn: '/signin'
  },
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV === 'development'
}

