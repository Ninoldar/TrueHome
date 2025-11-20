'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Loader2 } from "lucide-react"

interface Suggestion {
  id: string
  label: string
  address: string
  city: string
  state: string
  zipCode: string
  propertyType: string | null
}

export function CTA() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false)
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
        setIsFetchingSuggestions(true)
        const response = await fetch(`/api/search/autocomplete?q=${encodeURIComponent(searchQuery)}`)
        const data = await response.json()
        if (response.ok) {
          const suggestionsList = (data.suggestions || []).map((s: any) => ({
            ...s,
            label: s.label || `${s.address}, ${s.city}, ${s.state} ${s.zipCode}`
          }))
          setSuggestions(suggestionsList)
          setShowSuggestions(suggestionsList.length > 0)
        } else {
          console.error('API error:', data)
          setSuggestions([])
          setShowSuggestions(false)
        }
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        setSuggestions([])
        setShowSuggestions(false)
      } finally {
        setIsFetchingSuggestions(false)
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
    setSearchQuery(suggestion.label || `${suggestion.address}, ${suggestion.city}, ${suggestion.state} ${suggestion.zipCode}`)
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
    setIsSearching(true)
    try {
      // Parse the search query to extract address components
      const parts = searchQuery.split(',').map(s => s.trim())
      const address = parts[0] || ''
      const city = parts[1] || ''
      const stateZip = parts[2]?.split(' ') || []
      const state = stateZip[0] || ''
      const zipCode = stateZip[1] || ''

      // Use the search API with the query parameter
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Property not found')
      }

      if (data.results && data.results.length > 0) {
        // Use the first result
        router.push(`/property/${data.results[0].id}`)
      } else {
        alert('No properties found. Please select from the suggestions or try a different search.')
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to search property. Please select from suggestions.')
    } finally {
      setIsSearching(false)
    }
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
      <div className="container mx-auto">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-balance">
            {"Ready to discover your home's true story?"}
          </h2>
          <p className="text-lg text-primary-foreground/80 mb-12 leading-relaxed max-w-2xl mx-auto">
            {"Get started with a property address and receive your comprehensive report in minutes."}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
            <div className="flex-1 relative" ref={searchRef}>
              <Input
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
                placeholder="Enter property address..."
                className="h-14 text-base bg-background text-foreground border-0 pr-12"
                autoComplete="off"
                disabled={isSearching}
                aria-busy={isFetchingSuggestions}
              />
              {isFetchingSuggestions && !isSearching && (
                <div className="absolute inset-y-0 right-4 flex items-center text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
                </div>
              )}
              
              {/* Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl max-h-60 overflow-auto">
                  {suggestions.map((suggestion) => (
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
                      {suggestion.propertyType && (
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {suggestion.propertyType}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {showSuggestions && suggestions.length === 0 && searchQuery.length >= 2 && (
                <div className="absolute z-50 w-full mt-1 bg-background border border-border rounded-lg shadow-lg p-4">
                  <div className="text-muted-foreground text-center">
                    No properties found. Try a different search.
                  </div>
                </div>
              )}
            </div>
            <Button 
              size="lg" 
              variant="secondary" 
              className="h-14 px-8 text-base"
              onClick={handleSearch}
              disabled={isSearching}
            >
              <Search className="w-5 h-5 mr-2" />
              {isSearching ? 'Searching...' : 'Search Property'}
            </Button>
          </div>

          <p className="text-sm text-primary-foreground/70">
            {"Try it free • No credit card required • Instant access"}
          </p>
        </div>
      </div>
    </section>
  )
}
