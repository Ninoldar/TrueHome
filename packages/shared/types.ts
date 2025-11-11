export interface PropertySearchResult {
  id: string
  address: string
  city: string
  state: string
  zipCode: string
  apn?: string | null
}

export interface PropertyDetails {
  id: string
  address: string
  city: string
  state: string
  zipCode: string
  apn?: string | null
  lotSize?: number | null
  livingArea?: number | null
  bedrooms?: number | null
  bathrooms?: number | null
  yearBuilt?: number | null
  propertyType?: string | null
}

