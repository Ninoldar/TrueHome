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
    <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 border border-gray-100">
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative flex gap-3">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => query.length >= 2 && suggestions.length > 0 && setShowSuggestions(true)}
              placeholder="Enter address, city, ZIP code, or APN..."
              className="w-full px-5 py-4 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 placeholder:text-gray-400 shadow-sm transition-all"
            />
            
            {/* Autocomplete Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div
                ref={suggestionsRef}
                className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-64 overflow-y-auto"
              >
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.id}
                    type="button"
                    onClick={() => handleSelectSuggestion(suggestion)}
                    className={`w-full text-left px-5 py-3 hover:bg-blue-50 transition-colors ${
                      index === selectedSuggestionIndex ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                    } ${index > 0 ? 'border-t border-gray-100' : ''}`}
                  >
                    <div className="font-semibold text-gray-900">{suggestion.address}</div>
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
            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
        <div className="mt-6 space-y-3">
          <h3 className="font-bold text-lg text-gray-900 mb-4">
            Search Results ({results.length})
          </h3>
          {results.map((property) => (
            <button
              key={property.id}
              onClick={() => handleSelectProperty(property.id)}
              className="w-full text-left p-4 bg-gradient-to-r from-gray-50 to-white hover:from-blue-50 hover:to-white rounded-xl transition-all border-2 border-gray-100 hover:border-blue-300 hover:shadow-md"
            >
              <div className="font-semibold text-gray-900 text-lg">{property.address}</div>
              <div className="text-sm text-gray-600 mt-1">
                {property.city}, {property.state} {property.zipCode}
              </div>
              {property.apn && (
                <div className="text-xs text-gray-500 mt-2 font-mono">APN: {property.apn}</div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
