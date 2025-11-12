'use client'

import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { User, LogOut } from 'lucide-react'

export function UserMenu() {
  const { data: session, status } = useSession()
  const router = useRouter()

  if (status === 'loading') {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-muted rounded-full animate-pulse" />
      </div>
    )
  }

  if (session?.user) {
    const isAdmin = (session.user as any)?.role === 'ADMIN'
    
    return (
      <div className="flex items-center gap-3">
        {isAdmin && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push('/admin')}
            className="hidden sm:inline-flex"
          >
            Admin
          </Button>
        )}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard')}
          className="hidden sm:inline-flex"
        >
          Dashboard
        </Button>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
          <User className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-foreground hidden sm:inline">
            {session.user.name || session.user.email}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => signOut({ callbackUrl: '/' })}
          className="hidden sm:inline-flex"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Button 
        variant="ghost" 
        size="sm" 
        className="hidden sm:inline-flex"
        onClick={() => router.push('/signin')}
      >
        Sign In
      </Button>
      <Button 
        size="sm"
        onClick={() => router.push('/signup')}
      >
        Get Started
      </Button>
    </div>
  )
}

