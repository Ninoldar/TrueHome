'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'

export default function PropertySearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`)
      const data = await response.json()
      setResults(data.results || [])
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  const handleSelectProperty = (propertyId: string) => {
    router.push(`/property/${propertyId}`)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={handleSearch} className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter address, APN, or ZIP code..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {!loading && query && results.length === 0 && (
        <div className="mt-4 text-center py-8">
          <p className="text-gray-500">No properties found. Try a different search term.</p>
          <p className="text-sm text-gray-400 mt-2">
            Try searching by address, city, ZIP code, or APN
          </p>
        </div>
      )}

      {results.length > 0 && (
        <div className="mt-4 space-y-2">
          <h3 className="font-semibold text-gray-700 mb-2">
            Search Results ({results.length}):
          </h3>
          {results.map((property) => (
            <button
              key={property.id}
              onClick={() => handleSelectProperty(property.id)}
              className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-primary-300"
            >
              <div className="font-medium text-gray-900">{property.address}</div>
              <div className="text-sm text-gray-600">
                {property.city}, {property.state} {property.zipCode}
              </div>
              {property.apn && (
                <div className="text-xs text-gray-500 mt-1">APN: {property.apn}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

