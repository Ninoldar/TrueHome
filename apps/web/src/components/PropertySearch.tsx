'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

export default function PropertySearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  // Autocomplete as user types
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([])
        setShowSuggestions(false)
        return
      }

      try {
        const response = await fetch(`${API_URL}/search/autocomplete?q=${encodeURIComponent(query)}`)
        if (!response.ok) {
          console.error('Autocomplete response not OK:', response.status)
          setSuggestions([])
          return
        }
        const data = await response.json()
        setSuggestions(data.suggestions || [])
        setShowSuggestions(data.suggestions && data.suggestions.length > 0)
      } catch (error) {
        console.error('Autocomplete error:', error)
        setSuggestions([])
        setShowSuggestions(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    setShowSuggestions(false)
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`)
      if (!response.ok) {
        console.error('Search response not OK:', response.status)
        setResults([])
        return
      }
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

  const handleSelectSuggestion = (suggestion: any) => {
    setQuery(suggestion.fullAddress)
    setShowSuggestions(false)
    setSelectedSuggestionIndex(-1)
    
    // Automatically search for the selected suggestion
    handleSelectProperty(suggestion.id)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : -1))
    } else if (e.key === 'Enter' && selectedSuggestionIndex >= 0) {
      e.preventDefault()
      handleSelectSuggestion(suggestions[selectedSuggestionIndex])
    } else if (e.key === 'Escape') {
      setShowSuggestions(false)
      setSelectedSuggestionIndex(-1)
    }
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative flex gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => query.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Start typing an address..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-900 placeholder:text-gray-500"
            />
            
            {/* Autocomplete Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                      index === selectedSuggestionIndex ? 'bg-primary-50 border-l-4 border-primary-500' : ''
                    } ${index > 0 ? 'border-t border-gray-100' : ''}`}
                  >
                    <div className="font-medium text-gray-900">{suggestion.address}</div>
                    <div className="text-sm text-gray-600">
                      {suggestion.city}, {suggestion.state} {suggestion.zipCode}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
