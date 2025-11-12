'use client'

import { useSession } from 'next-auth/react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

export default function DebugSessionPage() {
  const { data: session, status } = useSession()

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-16 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="mt-12 bg-card border border-border rounded-lg p-6">
            <h1 className="text-2xl font-bold mb-4">Session Debug Info</h1>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Status:</p>
                <p className="font-mono">{status}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Session Data:</p>
                <pre className="bg-muted p-4 rounded-lg overflow-auto text-xs">
                  {JSON.stringify(session, null, 2)}
                </pre>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">User Role:</p>
                <p className="font-mono text-lg">
                  {(session?.user as any)?.role || 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Is Admin?</p>
                <p className="font-mono text-lg">
                  {(session?.user as any)?.role === 'ADMIN' ? '✅ YES' : '❌ NO'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

