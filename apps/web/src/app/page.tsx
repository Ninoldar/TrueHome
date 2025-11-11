import PropertySearch from '../components/PropertySearch'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            TrueHome
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Comprehensive Property History Reports - A Carfax for Homes
          </p>
        </div>
        
        <div className="max-w-2xl mx-auto">
          <PropertySearch />
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-500">
            Search for any property to view its complete history including sales, permits, work events, and more.
          </p>
        </div>
      </div>
    </div>
  )
}
