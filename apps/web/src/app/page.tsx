import PropertySearch from '../components/PropertySearch'
import { Home as HomeIcon, Shield, FileText, TrendingUp } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
              TrueHome
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Comprehensive Property History Reports
              <span className="block mt-2 text-lg">A Carfax for Homes</span>
            </p>
            
            {/* Search Section */}
            <div className="max-w-3xl mx-auto mt-12">
              <PropertySearch />
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Everything You Need to Know About a Property
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <HomeIcon className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Property History</h3>
              <p className="text-gray-600">
                Complete ownership timeline, sales history, and property details
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                <FileText className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Permits & Work</h3>
              <p className="text-gray-600">
                Building permits, contractor work history, and warranty information
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-full mb-4">
                <Shield className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Risk Assessment</h3>
              <p className="text-gray-600">
                Insurance claims, property condition, and risk factors
              </p>
            </div>

            <div className="text-center p-6 rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Market Insights</h3>
              <p className="text-gray-600">
                Price trends, comparable properties, and market analysis
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Make Informed Property Decisions
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Search for any property to view its complete history including sales, permits, work events, insurance claims, and more.
          </p>
        </div>
      </div>
    </div>
  )
}
