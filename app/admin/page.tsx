'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, DollarSign, TrendingUp, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface AdminStats {
  totalUsers: number
  totalReports: number
  totalRevenue: number
  todaySignups: number
  todayReports: number
  todayRevenue: number
  recentUsers: Array<{
    id: string
    email: string
    name: string | null
    createdAt: string
  }>
  recentReports: Array<{
    id: string
    propertyId: string
    generatedAt: string
  }>
}

export default function AdminPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
      return
    }

    if (status === 'authenticated') {
      // Check if user is admin (case-insensitive)
      const userRole = session?.user?.role?.toLowerCase()
      console.log('[AdminPage] User role:', userRole, 'Full session:', session)
      
      if (userRole !== 'admin') {
        console.log('[AdminPage] User is not admin, redirecting to dashboard')
        router.push('/dashboard')
        return
      }
      
      console.log('[AdminPage] User is admin, fetching stats')
      fetchStats()
    }
  }, [status, session, router])

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      console.log('[AdminPage] Fetching admin stats...')
      const response = await fetch('/api/admin/stats')
      
      console.log('[AdminPage] Response status:', response.status)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error('[AdminPage] Error response:', errorData)
        throw new Error(errorData.error || 'Failed to fetch admin stats')
      }

      const data = await response.json()
      console.log('[AdminPage] Stats received:', data)
      setStats(data)
    } catch (err) {
      console.error('[AdminPage] Error fetching admin stats:', err)
      setError(err instanceof Error ? err.message : 'Failed to load admin stats')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto">
            <p>Loading...</p>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (error && !stats) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center py-12">
              <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
              <p className="text-destructive mb-4">{error}</p>
              <p className="text-sm text-muted-foreground mb-4">
                Make sure you are signed in with an admin account. Check the browser console for details.
              </p>
              <Button onClick={fetchStats}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground mt-2">Overview of platform statistics and activity</p>
            </div>
            <Button onClick={fetchStats} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                ⚠️ {error} - Some data may not be available.
              </p>
            </div>
          )}

          {/* Overview Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers ?? 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.todaySignups ?? 0} signed up today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalReports ?? 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.todayReports ?? 0} generated today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${(stats?.totalRevenue ?? 0).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  ${(stats?.todayRevenue ?? 0).toLocaleString()} today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reports Purchased</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats?.totalReports ?? 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.todayReports ?? 0} purchased today
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Signups Today</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {stats?.todaySignups ?? 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  New users registered
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Reports Generated Today</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {stats?.todayReports ?? 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Reports created today
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Revenue Today</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  ${(stats?.todayRevenue ?? 0).toLocaleString()}
                </div>
                <p className="text-xs text-muted-foreground">
                  Revenue generated today
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Recent Users</CardTitle>
                <CardDescription>Latest user signups</CardDescription>
              </CardHeader>
              <CardContent>
                {stats?.recentUsers && stats.recentUsers.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{user.name || user.email}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No recent users</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Reports</CardTitle>
                <CardDescription>Latest generated reports</CardDescription>
              </CardHeader>
              <CardContent>
                {stats?.recentReports && stats.recentReports.length > 0 ? (
                  <div className="space-y-4">
                    {stats.recentReports.map((report) => (
                      <div key={report.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">Report #{report.id.slice(0, 8)}</p>
                          <p className="text-sm text-muted-foreground">Property: {report.propertyId.slice(0, 8)}</p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(report.generatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No recent reports</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

