'use client'

import { useSession } from 'next-auth/react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useEffect, useState } from 'react'

export default function DebugSessionPage() {
  const { data: session, status, update } = useSession()
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    console.log('Session updated:', session)
  }, [session])

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
              <div className="pt-4 border-t border-border">
                <button
                  onClick={async () => {
                    setRefreshing(true)
                    await update()
                    setRefreshing(false)
                  }}
                  disabled={refreshing}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
                >
                  {refreshing ? 'Refreshing...' : 'Refresh Session'}
                </button>
                <p className="text-xs text-muted-foreground mt-2">
                  Click to force refresh your session from the database
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

