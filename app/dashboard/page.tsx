'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  FileText,
  Search,
  TrendingUp,
  MapPin,
  ArrowRight,
  Plus,
  Eye,
  Home,
  ClipboardPlus,
  CheckCircle,
} from 'lucide-react'
import { format } from 'date-fns'

interface Purchase {
  id: string
  amount: number
  status: string
  purchasedAt: string
  report: {
    id: string
    reportNumber: string
    generatedAt: string
    property: {
      id: string
      address: string
      city: string
      state: string
      zipCode: string
    }
  }
}

interface ClaimedProperty {
  claimId: string
  claimedAt: string
  verificationStatus: string
  property: {
    id: string
    address: string
    city: string
    state: string
    zipCode: string
    propertyType: string | null
    source: string
  }
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchSuggestions, setSearchSuggestions] = useState<any[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [creditBalance, setCreditBalance] = useState({
    availableCredits: 0,
    totalCredits: 0,
    usedCredits: 0,
  })
  const [claimedProperties, setClaimedProperties] = useState<ClaimedProperty[]>([])
  const [claimingProperty, setClaimingProperty] = useState(false)
  const [activeUpdatePropertyId, setActiveUpdatePropertyId] = useState<string | null>(null)
  const [submittingUpdate, setSubmittingUpdate] = useState(false)
  const [claimForm, setClaimForm] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    propertyType: '',
    yearBuilt: '',
    squareFeet: '',
    lotSize: '',
  })
  const [updateForm, setUpdateForm] = useState({
    title: '',
    description: '',
    workDate: '',
    contractor: '',
    cost: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin')
      return
    }

    if (status === 'authenticated') {
      fetchPurchases()
      fetchCreditBalance()
      fetchClaimedProperties()
      
      // Check for payment success parameter
      const params = new URLSearchParams(window.location.search)
      if (params.get('payment') === 'success') {
        // Refresh credit balance after successful payment
        setTimeout(() => {
          fetchCreditBalance()
          // Remove query parameter
          router.replace('/dashboard')
        }, 1000)
      }
    }
  }, [status, router])

  const fetchPurchases = async () => {
    try {
      const response = await fetch('/api/user/purchases')
      if (response.ok) {
        const data = await response.json()
        setPurchases(data.purchases || [])
      }
    } catch (error) {
      console.error('Error fetching purchases:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchCreditBalance = async () => {
    try {
      const response = await fetch('/api/credits/balance')
      if (response.ok) {
        const data = await response.json()
        setCreditBalance({
          availableCredits: data.availableCredits || 0,
          totalCredits: data.totalCredits || 0,
          usedCredits: data.usedCredits || 0,
        })
      }
    } catch (error) {
      console.error('Error fetching credit balance:', error)
    }
  }

  const fetchClaimedProperties = async () => {
    try {
      const response = await fetch('/api/properties/claims')
      if (response.ok) {
        const data = await response.json()
        setClaimedProperties(data.properties || [])
      }
    } catch (error) {
      console.error('Error fetching claimed properties:', error)
    }
  }

  // Autocomplete search
  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchSuggestions([])
      setShowSuggestions(false)
      return
    }

    const debounce = setTimeout(async () => {
      try {
        const response = await fetch(`/api/properties/autocomplete?q=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()
        if (response.ok) {
          setSearchSuggestions(data.suggestions || [])
          setShowSuggestions(data.suggestions && data.suggestions.length > 0)
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      }
    }, 300)

    return () => clearTimeout(debounce)
  }, [searchQuery])

  const handleSuggestionClick = (suggestion: any) => {
    router.push(`/property/${suggestion.id}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchSuggestions.length > 0) {
      router.push(`/property/${searchSuggestions[0].id}`)
    }
  }

  const handleClaimInputChange = (field: string, value: string) => {
    setClaimForm((prev) => ({
      ...prev,
      [field]: field === 'state' ? value.toUpperCase() : value,
    }))
  }

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setClaimingProperty(true)
    try {
      const payload: Record<string, any> = {
        address: claimForm.address.trim(),
        city: claimForm.city.trim(),
        state: claimForm.state.trim(),
        zipCode: claimForm.zipCode.trim(),
        propertyType: claimForm.propertyType.trim() || 'Unknown',
      }

      if (claimForm.yearBuilt) {
        payload.yearBuilt = Number(claimForm.yearBuilt)
      }
      if (claimForm.squareFeet) {
        payload.squareFeet = Number(claimForm.squareFeet)
      }
      if (claimForm.lotSize) {
        payload.lotSize = Number(claimForm.lotSize)
      }

      const response = await fetch('/api/properties/claims', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to claim property')
      }

      setClaimForm({
        address: '',
        city: '',
        state: '',
        zipCode: '',
        propertyType: '',
        yearBuilt: '',
        squareFeet: '',
        lotSize: '',
      })
      await fetchClaimedProperties()
      alert('Property claimed successfully! You can now add updates to its history.')
    } catch (error: any) {
      console.error('Error claiming property:', error)
      alert(error.message || 'Failed to claim property. Please try again.')
    } finally {
      setClaimingProperty(false)
    }
  }

  const openUpdateForm = (propertyId: string) => {
    setActiveUpdatePropertyId(propertyId)
    setUpdateForm({
      title: '',
      description: '',
      workDate: '',
      contractor: '',
      cost: '',
    })
  }

  const handleUpdateSubmit = async (e: React.FormEvent, propertyId: string) => {
    e.preventDefault()
    if (!updateForm.title || !updateForm.description || !updateForm.workDate) {
      alert('Please fill in the title, description, and date.')
      return
    }

    setSubmittingUpdate(true)
    try {
      const response = await fetch('/api/properties/updates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          propertyId,
          title: updateForm.title.trim(),
          description: updateForm.description.trim(),
          workDate: updateForm.workDate,
          contractor: updateForm.contractor.trim() || undefined,
          cost: updateForm.cost ? Number(updateForm.cost) : undefined,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add update')
      }

      alert('Update added successfully! It is marked as self-entered.')
      setActiveUpdatePropertyId(null)
    } catch (error: any) {
      console.error('Error adding update:', error)
      alert(error.message || 'Failed to add update. Please try again.')
    } finally {
      setSubmittingUpdate(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-16 pb-24 flex items-center justify-center min-h-[60vh]">
          <div className="text-muted-foreground">Loading dashboard...</div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!session) {
    return null
  }

  const completedPurchases = purchases.filter(p => p.status === 'COMPLETED')
  const totalSpent = completedPurchases.reduce((sum, p) => sum + p.amount, 0)

  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-16 pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              Welcome back, {session.user?.name || 'User'}!
            </h1>
            <p className="text-muted-foreground">
              Manage your property reports and discover new properties
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Reports</p>
                    <p className="text-2xl font-bold text-foreground">
                      {completedPurchases.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Total Spent</p>
                    <p className="text-2xl font-bold text-foreground">
                      ${totalSpent.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Available Credits</p>
                    <p className="text-2xl font-bold text-foreground">
                      {creditBalance.availableCredits}
                    </p>
                  </div>
                </div>
              </div>
              {creditBalance.availableCredits === 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-3"
                  onClick={() => router.push('/pricing')}
                >
                  Buy Credits
                </Button>
              )}
            </div>
          </div>

          {/* Claimed Properties */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="flex flex-col gap-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <Home className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold text-foreground">
                    Claim Your Property
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  Claim your home to add updates, track services, and maintain its history. Claimed addresses appear in search results and are flagged as self-entered entries.
                </p>
              </div>

              <form onSubmit={handleClaimSubmit} className="grid gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Street Address
                    </label>
                    <Input
                      value={claimForm.address}
                      onChange={(e) => handleClaimInputChange('address', e.target.value)}
                      placeholder="123 Main Street"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Property Type
                    </label>
                    <Input
                      value={claimForm.propertyType}
                      onChange={(e) => handleClaimInputChange('propertyType', e.target.value)}
                      placeholder="Single Family, Condo, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      City
                    </label>
                    <Input
                      value={claimForm.city}
                      onChange={(e) => handleClaimInputChange('city', e.target.value)}
                      placeholder="City"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        State
                      </label>
                      <Input
                        value={claimForm.state}
                        onChange={(e) => handleClaimInputChange('state', e.target.value.slice(0, 2))}
                        placeholder="TX"
                        required
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-muted-foreground mb-1">
                        ZIP Code
                      </label>
                      <Input
                        value={claimForm.zipCode}
                        onChange={(e) => handleClaimInputChange('zipCode', e.target.value)}
                        placeholder="75023"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Year Built
                    </label>
                    <Input
                      type="number"
                      min="1800"
                      max={new Date().getFullYear()}
                      value={claimForm.yearBuilt}
                      onChange={(e) => handleClaimInputChange('yearBuilt', e.target.value)}
                      placeholder="1998"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Square Feet
                    </label>
                    <Input
                      type="number"
                      min="0"
                      value={claimForm.squareFeet}
                      onChange={(e) => handleClaimInputChange('squareFeet', e.target.value)}
                      placeholder="2500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">
                      Lot Size (acres)
                    </label>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={claimForm.lotSize}
                      onChange={(e) => handleClaimInputChange('lotSize', e.target.value)}
                      placeholder="0.25"
                    />
                  </div>
                </div>

                <Button type="submit" size="lg" disabled={claimingProperty}>
                  {claimingProperty ? 'Claiming...' : 'Claim this Property'}
                </Button>
              </form>
            </div>

            {claimedProperties.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Your Claimed Properties ({claimedProperties.length})
                </h3>
                <div className="space-y-4">
                  {claimedProperties.map((claimed) => (
                    <div
                      key={claimed.claimId}
                      className="border border-border rounded-lg p-5 bg-muted/30"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-lg font-semibold text-foreground">
                              {claimed.property.address}
                            </h4>
                            {claimed.verificationStatus === 'VERIFIED' ? (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-full">
                                <CheckCircle className="w-3 h-3" />
                                Verified
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                                Self-entered
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {claimed.property.city}, {claimed.property.state}{' '}
                            {claimed.property.zipCode}
                          </p>
                          {claimed.property.propertyType && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {claimed.property.propertyType}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground mt-2">
                            Claimed on {format(new Date(claimed.claimedAt), 'MMM d, yyyy')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/property/${claimed.property.id}`)}
                          >
                            View Property
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openUpdateForm(claimed.property.id)}
                          >
                            <ClipboardPlus className="w-4 h-4 mr-2" />
                            Add Update
                          </Button>
                        </div>
                      </div>

                      {activeUpdatePropertyId === claimed.property.id && (
                        <form
                          className="mt-4 border-t border-border pt-4 space-y-4"
                          onSubmit={(e) => handleUpdateSubmit(e, claimed.property.id)}
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-muted-foreground mb-1">
                                Update Title
                              </label>
                              <Input
                                value={updateForm.title}
                                onChange={(e) =>
                                  setUpdateForm((prev) => ({ ...prev, title: e.target.value }))
                                }
                                placeholder="Roof replacement, HVAC service, etc."
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-muted-foreground mb-1">
                                Date Performed
                              </label>
                              <Input
                                type="date"
                                value={updateForm.workDate}
                                onChange={(e) =>
                                  setUpdateForm((prev) => ({ ...prev, workDate: e.target.value }))
                                }
                                required
                              />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-1">
                              Description / Notes
                            </label>
                            <textarea
                              value={updateForm.description}
                              onChange={(e) =>
                                setUpdateForm((prev) => ({ ...prev, description: e.target.value }))
                              }
                              placeholder="Describe the work or maintenance performed. Include any details you want to remember."
                              required
                              className="w-full min-h-[120px] rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            />
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-muted-foreground mb-1">
                                Contractor / Company (optional)
                              </label>
                              <Input
                                value={updateForm.contractor}
                                onChange={(e) =>
                                  setUpdateForm((prev) => ({ ...prev, contractor: e.target.value }))
                                }
                                placeholder="Company or person who did the work"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-muted-foreground mb-1">
                                Cost (optional)
                              </label>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                value={updateForm.cost}
                                onChange={(e) =>
                                  setUpdateForm((prev) => ({ ...prev, cost: e.target.value }))
                                }
                                placeholder="e.g. 2500"
                              />
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button type="submit" size="sm" disabled={submittingUpdate}>
                              {submittingUpdate ? 'Saving...' : 'Save Update'}
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => setActiveUpdatePropertyId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </form>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick Search Section */}
          <div className="bg-card border border-border rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <Search className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold text-foreground">
                Search New Property
              </h2>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Search for any property address to view its history and generate a report
            </p>
            <form onSubmit={handleSearch} className="relative">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value)
                      setShowSuggestions(true)
                    }}
                    onFocus={() => {
                      if (searchSuggestions.length > 0) {
                        setShowSuggestions(true)
                      }
                    }}
                    placeholder="Enter property address..."
                    className="w-full"
                  />
                  
                  {/* Suggestions Dropdown */}
                  {showSuggestions && searchSuggestions.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-60 overflow-auto">
                      {searchSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.id}
                          type="button"
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 focus:bg-gray-100 dark:focus:bg-gray-800 focus:outline-none transition-colors border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                        >
                          <div className="font-medium text-gray-900 dark:text-gray-100">
                            {suggestion.address}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {suggestion.city}, {suggestion.state} {suggestion.zipCode}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <Button type="submit" size="lg">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </form>
          </div>

          {/* My Reports Section */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  My Reports ({completedPurchases.length})
                </h2>
              </div>
              <Button
                variant="outline"
                onClick={() => router.push('/')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Get New Report
              </Button>
            </div>

            {completedPurchases.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No reports yet
                </h3>
                <p className="text-muted-foreground mb-6">
                  Start by searching for a property and generating your first report
                </p>
                <Button onClick={() => router.push('/')}>
                  Search Properties
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {completedPurchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <h3 className="font-semibold text-foreground">
                            {purchase.report.property.address}
                          </h3>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {purchase.report.property.city}, {purchase.report.property.state} {purchase.report.property.zipCode}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>Report #{purchase.report.reportNumber}</span>
                          <span>•</span>
                          <span>
                            Purchased {format(new Date(purchase.purchasedAt), 'MMM d, yyyy')}
                          </span>
                          <span>•</span>
                          <span>${purchase.amount.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => router.push(`/report/${purchase.report.id}`)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View Report
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => router.push(`/property/${purchase.report.property.id}`)}
                        >
                          View Property
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}

