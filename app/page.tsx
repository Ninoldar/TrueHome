'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface Suggestion {
  id: string
  label: string
  address: string
  city: string
  state: string
  zipCode: string
  propertyType: string | null
}

export default function Home() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null)
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Fetch suggestions as user types
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (searchQuery.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const response = await fetch(`/api/properties/autocomplete?q=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()
        if (response.ok) {
          setSuggestions(data.suggestions || [])
          setShowSuggestions(data.suggestions && data.suggestions.length > 0)
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      }
    }, 300) // 300ms debounce

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [searchQuery])

  const handleSuggestionClick = (suggestion: Suggestion) => {
    setSelectedSuggestion(suggestion)
    setSearchQuery(suggestion.label)
    setShowSuggestions(false)
    // Navigate directly to property page
    router.push(`/property/${suggestion.id}`)
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (selectedSuggestion) {
      router.push(`/property/${selectedSuggestion.id}`)
      return
    }

    // If no suggestion selected, try to search
    setLoading(true)
    try {
      // Parse the search query to extract address components
      const parts = searchQuery.split(',').map(s => s.trim())
      const address = parts[0] || ''
      const city = parts[1] || ''
      const stateZip = parts[2]?.split(' ') || []
      const state = stateZip[0] || ''
      const zipCode = stateZip[1] || ''

      if (!address || !city || !state) {
        alert('Please select a property from the suggestions or enter a complete address (Address, City, State ZIP)')
        setLoading(false)
        return
      }

      const params = new URLSearchParams({
        address,
        city,
        state,
        ...(zipCode && { zipCode }),
      })

      const response = await fetch(`/api/properties/search?${params}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Property not found')
      }

      router.push(`/property/${data.property.id}`)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to search property. Please select from suggestions.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">
              TrueHome
            </h1>
            <p className="text-2xl text-gray-600 mb-2">
              Know Your Home&apos;s Complete History
            </p>
            <p className="text-lg text-gray-500">
              Complete property history reports for buyers and realtors
            </p>
          </div>

          {/* Search Form with Autocomplete */}
          <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Search Property History
            </h2>
            
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="relative" ref={searchRef}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search by Address
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setSelectedSuggestion(null)
                    setShowSuggestions(true)
                  }}
                  onFocus={() => {
                    if (suggestions.length > 0) {
                      setShowSuggestions(true)
                    }
                  }}
                  placeholder="Start typing an address..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-900 bg-white placeholder:text-gray-400"
                  autoComplete="off"
                />
                
                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions.length > 0 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.id}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-4 py-3 hover:bg-indigo-50 focus:bg-indigo-50 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0"
                      >
                        <div className="font-medium text-gray-900">
                          {suggestion.address}
                        </div>
                        <div className="text-sm text-gray-600">
                          {suggestion.city}, {suggestion.state} {suggestion.zipCode}
                        </div>
                        {suggestion.propertyType && (
                          <div className="text-xs text-gray-500 mt-1">
                            {suggestion.propertyType}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {showSuggestions && suggestions.length === 0 && searchQuery.length >= 2 && (
                  <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4">
                    <div className="text-gray-500 text-center">
                      No properties found. Try a different search.
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
              >
                {loading ? 'Searching...' : 'Search Property'}
              </button>
            </form>

            <p className="text-sm text-gray-500 mt-4">
              💡 Tip: Start typing an address and select from the suggestions for best results
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Complete History
              </h3>
              <p className="text-gray-600">
                View all sales, work records, insurance claims, and warranties
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-3xl mb-3">🔍</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Smart Recommendations
              </h3>
              <p className="text-gray-600">
                Get AI-powered insights based on property history
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="text-3xl mb-3">🛡️</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                Warranty Tracking
              </h3>
              <p className="text-gray-600">
                Track active warranties and expiration dates
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
