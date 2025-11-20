'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard, Plus, Home, History, FileText } from "lucide-react"

interface CreditBalance {
  available: number
}

interface ClaimedProperty {
  id: string
  propertyId: string
  property: {
    id: string
    address: string
    city: string
    state: string
    zipCode: string
  }
  createdAt: string
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [creditBalance, setCreditBalance] = useState<CreditBalance | null>(null)
  const [claimedProperties, setClaimedProperties] = useState<ClaimedProperty[]>([])
  const [loading, setLoading] = useState(true)
  const [updateForm, setUpdateForm] = useState({
    propertyId: '',
    updateType: 'maintenance',
    description: '',
    date: new Date().toISOString().split('T')[0],
    cost: ''
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
      return
    }

    if (status === 'authenticated') {
      fetchDashboardData()
    }
  }, [status, router])

  const fetchDashboardData = async () => {
    try {
      const [creditsRes, propertiesRes] = await Promise.all([
        fetch('/api/credits/balance'),
        fetch('/api/properties/claims')
      ])

      if (creditsRes.ok) {
        const creditsData = await creditsRes.json()
        setCreditBalance(creditsData)
      }

      if (propertiesRes.ok) {
        const propertiesData = await propertiesRes.json()
        setClaimedProperties(propertiesData.claims || [])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!updateForm.propertyId || !updateForm.description) {
      alert('Please select a property and enter a description')
      return
    }

    try {
      const response = await fetch('/api/properties/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateForm)
      })

      if (response.ok) {
        alert('Update added successfully!')
        setUpdateForm({
          propertyId: '',
          updateType: 'maintenance',
          description: '',
          date: new Date().toISOString().split('T')[0],
          cost: ''
        })
        fetchDashboardData()
      } else {
        const error = await response.json()
        alert(error.error || 'Failed to add update')
      }
    } catch (error) {
      console.error('Error adding update:', error)
      alert('Failed to add update')
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

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <h1 className="text-4xl font-bold mb-8">Dashboard</h1>

          {/* Credits Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Available Credits
              </CardTitle>
              <CardDescription>
                Credits are used to generate property reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-4xl font-bold">
                    {creditBalance?.available ?? 0}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    credits available
                  </p>
                </div>
                <Button onClick={() => router.push('/pricing')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Buy Credits
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Claimed Properties Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home className="w-5 h-5" />
                My Properties
              </CardTitle>
              <CardDescription>
                Properties you've claimed and can add updates to
              </CardDescription>
            </CardHeader>
            <CardContent>
              {claimedProperties.length === 0 ? (
                <p className="text-muted-foreground">
                  You haven't claimed any properties yet. Search for a property and claim it to add updates.
                </p>
              ) : (
                <div className="space-y-4">
                  {claimedProperties.map((claim) => (
                    <div
                      key={claim.id}
                      className="border rounded-lg p-4 hover:bg-accent/50 transition-colors cursor-pointer"
                      onClick={() => router.push(`/property/${claim.property.id}`)}
                    >
                      <div className="font-semibold">
                        {claim.property.address}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {claim.property.city}, {claim.property.state} {claim.property.zipCode}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Add Update Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="w-5 h-5" />
                Add Property Update
              </CardTitle>
              <CardDescription>
                Add maintenance, repairs, or other updates to your claimed properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddUpdate} className="space-y-4">
                <div>
                  <label htmlFor="propertyId" className="block text-sm font-medium mb-2">
                    Property
                  </label>
                  <select
                    id="propertyId"
                    value={updateForm.propertyId}
                    onChange={(e) => setUpdateForm({ ...updateForm, propertyId: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  >
                    <option value="">Select a property</option>
                    {claimedProperties.map((claim) => (
                      <option key={claim.id} value={claim.property.id}>
                        {claim.property.address}, {claim.property.city}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="updateType" className="block text-sm font-medium mb-2">
                    Update Type
                  </label>
                  <select
                    id="updateType"
                    value={updateForm.updateType}
                    onChange={(e) => setUpdateForm({ ...updateForm, updateType: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="maintenance">Maintenance</option>
                    <option value="repair">Repair</option>
                    <option value="renovation">Renovation</option>
                    <option value="service">Service</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">
                    Description
                  </label>
                  <Input
                    id="description"
                    value={updateForm.description}
                    onChange={(e) => setUpdateForm({ ...updateForm, description: e.target.value })}
                    placeholder="Describe the update..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium mb-2">
                      Date
                    </label>
                    <Input
                      id="date"
                      type="date"
                      value={updateForm.date}
                      onChange={(e) => setUpdateForm({ ...updateForm, date: e.target.value })}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="cost" className="block text-sm font-medium mb-2">
                      Cost (optional)
                    </label>
                    <Input
                      id="cost"
                      type="number"
                      step="0.01"
                      value={updateForm.cost}
                      onChange={(e) => setUpdateForm({ ...updateForm, cost: e.target.value })}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Update
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </main>
  )
}

