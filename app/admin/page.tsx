'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { 
  Users, 
  FileText, 
  DollarSign, 
  TrendingUp,
  CreditCard,
  Calendar,
  Mail,
  Shield
} from 'lucide-react'
import { format } from 'date-fns'

interface AdminStats {
  totalUsers: number
  totalReports: number
  totalRevenue: number
  totalCredits: number
  recentUsers: Array<{
    id: string
    name: string
    email: string
    role: string
    createdAt: string
    _count: {
      purchasedReports: number
      reportCredits: number
    }
  }>
  recentPurchases: Array<{
    id: string
    amount: number
    purchasedAt: string
    user: {
      name: string
      email: string
    }
    report?: {
      reportNumber: string
      property: {
        address: string
        city: string
        state: string
      }
    }
  }>
  recentCredits: Array<{
    id: string
    credits: number
    packType: string
    amount: number
    purchasedAt: string
    user: {
      name: string
      email: string
    }
  }>
  allUsers: Array<{
    id: string
    name: string
    email: string
    role: string
    createdAt: string
    _count: {
      purchasedReports: number
      reportCredits: number
    }
  }>
  allReports: Array<{
    id: string
    reportNumber: string
    generatedAt: string
    price: number
    status: string
    property: {
      address: string
      city: string
      state: string
      zipCode: string
    }
    _count: {
      purchases: number
    }
  }>
  allCredits: Array<{
    id: string
    credits: number
    packType: string
    amount: number
    purchasedAt: string
    user: {
      name: string
      email: string
    }
  }>
  allPurchases: Array<{
    id: string
    amount: number
    purchasedAt: string
    user: {
      name: string
      email: string
    }
    report?: {
      reportNumber: string
      property: {
        address: string
        city: string
        state: string
      }
    }
  }>
}

export default function AdminDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports' | 'revenue'>('overview')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
      return
    }

    if (status === 'authenticated') {
      // Check if user is admin
      if ((session?.user as any)?.role !== 'ADMIN') {
        router.push('/dashboard')
        return
      }

      fetchAdminData()
    }
  }, [status, session, router])

  const fetchAdminData = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else if (response.status === 403) {
        router.push('/dashboard')
      }
    } catch (error) {
      console.error('Error fetching admin data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-16 pb-24 flex items-center justify-center min-h-[60vh]">
          <div className="text-muted-foreground">Loading admin dashboard...</div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!session || (session?.user as any)?.role !== 'ADMIN') {
    return null
  }

  if (!stats) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-16 pb-24 flex items-center justify-center min-h-[60vh]">
          <div className="text-muted-foreground">No data available</div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-16 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-primary" />
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
                Admin Dashboard
              </h1>
            </div>
            <p className="text-muted-foreground">
              Manage users, monitor revenue, and track platform activity
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.totalUsers}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Reports</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.totalReports}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${stats.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-orange-500/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Credits Sold</p>
                    <p className="text-2xl font-bold text-foreground">
                      {stats.totalCredits}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-border">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'users'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'reports'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Reports
            </button>
            <button
              onClick={() => setActiveTab('revenue')}
              className={`px-4 py-2 font-medium transition-colors ${
                activeTab === 'revenue'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Revenue
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Recent Users */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Recent User Sign-ups
                </h2>
                <div className="space-y-4">
                  {stats.recentUsers.length === 0 ? (
                    <p className="text-muted-foreground">No users yet</p>
                  ) : (
                    stats.recentUsers.map((user) => (
                      <div
                        key={user.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{user.name}</p>
                            <p className="text-sm text-muted-foreground flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              {user.email}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Joined {format(new Date(user.createdAt), 'MMM d, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-foreground">
                            {user._count.purchasedReports} reports
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {user._count.reportCredits} credit packs
                          </p>
                          <span className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                            user.role === 'ADMIN' 
                              ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                              : user.role === 'REALTOR'
                              ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                              : 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
                          }`}>
                            {user.role}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Recent Credit Purchases */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Recent Credit Purchases
                </h2>
                <div className="space-y-4">
                  {stats.recentCredits.length === 0 ? (
                    <p className="text-muted-foreground">No credit purchases yet</p>
                  ) : (
                    stats.recentCredits.map((credit) => (
                      <div
                        key={credit.id}
                        className="flex items-center justify-between p-4 border border-border rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-foreground">
                            {credit.user.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {credit.user.email}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-foreground">
                            {credit.credits} credits ({credit.packType})
                          </p>
                          <p className="text-sm text-green-600 dark:text-green-400">
                            ${credit.amount.toFixed(2)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(credit.purchasedAt), 'MMM d, yyyy h:mm a')}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                All Users ({stats.allUsers.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 text-sm font-semibold text-foreground">Name</th>
                      <th className="text-left p-3 text-sm font-semibold text-foreground">Email</th>
                      <th className="text-left p-3 text-sm font-semibold text-foreground">Role</th>
                      <th className="text-left p-3 text-sm font-semibold text-foreground">Reports</th>
                      <th className="text-left p-3 text-sm font-semibold text-foreground">Credits</th>
                      <th className="text-left p-3 text-sm font-semibold text-foreground">Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.allUsers.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-4 text-center text-muted-foreground">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      stats.allUsers.map((user) => (
                        <tr key={user.id} className="border-b border-border hover:bg-muted/50">
                          <td className="p-3 text-sm text-foreground">{user.name}</td>
                          <td className="p-3 text-sm text-foreground">{user.email}</td>
                          <td className="p-3">
                            <span className={`inline-block px-2 py-1 rounded text-xs ${
                              user.role === 'ADMIN' 
                                ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400'
                                : user.role === 'REALTOR'
                                ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                                : 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="p-3 text-sm text-foreground">{user._count.purchasedReports}</td>
                          <td className="p-3 text-sm text-foreground">{user._count.reportCredits}</td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {format(new Date(user.createdAt), 'MMM d, yyyy')}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4">
                All Reports ({stats.allReports.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left p-3 text-sm font-semibold text-foreground">Report #</th>
                      <th className="text-left p-3 text-sm font-semibold text-foreground">Property</th>
                      <th className="text-left p-3 text-sm font-semibold text-foreground">Location</th>
                      <th className="text-left p-3 text-sm font-semibold text-foreground">Price</th>
                      <th className="text-left p-3 text-sm font-semibold text-foreground">Purchases</th>
                      <th className="text-left p-3 text-sm font-semibold text-foreground">Generated</th>
                      <th className="text-left p-3 text-sm font-semibold text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.allReports.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-4 text-center text-muted-foreground">
                          No reports found
                        </td>
                      </tr>
                    ) : (
                      stats.allReports.map((report) => (
                        <tr key={report.id} className="border-b border-border hover:bg-muted/50">
                          <td className="p-3 text-sm font-mono text-foreground">{report.reportNumber}</td>
                          <td className="p-3 text-sm text-foreground">{report.property.address}</td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {report.property.city}, {report.property.state} {report.property.zipCode}
                          </td>
                          <td className="p-3 text-sm text-foreground">${report.price.toFixed(2)}</td>
                          <td className="p-3 text-sm text-foreground">{report._count.purchases}</td>
                          <td className="p-3 text-sm text-muted-foreground">
                            {format(new Date(report.generatedAt), 'MMM d, yyyy')}
                          </td>
                          <td className="p-3">
                            <span className={`inline-block px-2 py-1 rounded text-xs ${
                              report.status === 'GENERATED' 
                                ? 'bg-green-500/10 text-green-600 dark:text-green-400'
                                : report.status === 'PENDING'
                                ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400'
                                : 'bg-gray-500/10 text-gray-600 dark:text-gray-400'
                            }`}>
                              {report.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'revenue' && (
            <div className="space-y-6">
              {/* Revenue Summary */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Revenue Summary
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
                    <p className="text-3xl font-bold text-foreground">
                      ${stats.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Credits Sold</p>
                    <p className="text-3xl font-bold text-foreground">
                      {stats.totalCredits}
                    </p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Avg Revenue per User</p>
                    <p className="text-3xl font-bold text-foreground">
                      ${stats.totalUsers > 0 ? (stats.totalRevenue / stats.totalUsers).toFixed(2) : '0.00'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Credit Purchases Table */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Credit Purchases ({stats.allCredits.length})
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 text-sm font-semibold text-foreground">User</th>
                        <th className="text-left p-3 text-sm font-semibold text-foreground">Email</th>
                        <th className="text-left p-3 text-sm font-semibold text-foreground">Pack Type</th>
                        <th className="text-left p-3 text-sm font-semibold text-foreground">Credits</th>
                        <th className="text-left p-3 text-sm font-semibold text-foreground">Amount</th>
                        <th className="text-left p-3 text-sm font-semibold text-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.allCredits.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-muted-foreground">
                            No credit purchases found
                          </td>
                        </tr>
                      ) : (
                        stats.allCredits.map((credit) => (
                          <tr key={credit.id} className="border-b border-border hover:bg-muted/50">
                            <td className="p-3 text-sm text-foreground">{credit.user.name}</td>
                            <td className="p-3 text-sm text-muted-foreground">{credit.user.email}</td>
                            <td className="p-3 text-sm text-foreground">{credit.packType}</td>
                            <td className="p-3 text-sm text-foreground">{credit.credits}</td>
                            <td className="p-3 text-sm text-green-600 dark:text-green-400 font-medium">
                              ${credit.amount.toFixed(2)}
                            </td>
                            <td className="p-3 text-sm text-muted-foreground">
                              {format(new Date(credit.purchasedAt), 'MMM d, yyyy h:mm a')}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Report Purchases Table */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Report Purchases ({stats.allPurchases.length})
                </h2>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 text-sm font-semibold text-foreground">User</th>
                        <th className="text-left p-3 text-sm font-semibold text-foreground">Email</th>
                        <th className="text-left p-3 text-sm font-semibold text-foreground">Report #</th>
                        <th className="text-left p-3 text-sm font-semibold text-foreground">Property</th>
                        <th className="text-left p-3 text-sm font-semibold text-foreground">Amount</th>
                        <th className="text-left p-3 text-sm font-semibold text-foreground">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.allPurchases.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="p-4 text-center text-muted-foreground">
                            No report purchases found
                          </td>
                        </tr>
                      ) : (
                        stats.allPurchases.map((purchase) => (
                          <tr key={purchase.id} className="border-b border-border hover:bg-muted/50">
                            <td className="p-3 text-sm text-foreground">{purchase.user.name}</td>
                            <td className="p-3 text-sm text-muted-foreground">{purchase.user.email}</td>
                            <td className="p-3 text-sm font-mono text-foreground">
                              {purchase.report?.reportNumber || 'N/A'}
                            </td>
                            <td className="p-3 text-sm text-muted-foreground">
                              {purchase.report?.property 
                                ? `${purchase.report.property.address}, ${purchase.report.property.city}, ${purchase.report.property.state}`
                                : 'N/A'}
                            </td>
                            <td className="p-3 text-sm text-green-600 dark:text-green-400 font-medium">
                              ${purchase.amount.toFixed(2)}
                            </td>
                            <td className="p-3 text-sm text-muted-foreground">
                              {format(new Date(purchase.purchasedAt), 'MMM d, yyyy h:mm a')}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}

