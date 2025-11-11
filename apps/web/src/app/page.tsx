import Link from 'next/link'
import PropertySearch from '../components/PropertySearch'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            TrueHome
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Comprehensive property history reports - A Carfax for homes
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <PropertySearch />
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Ownership History</h3>
            <p className="text-gray-600">
              Complete ownership chain and transfer history
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Permits & Inspections</h3>
            <p className="text-gray-600">
              Building permits, inspections, and contractor work
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-2">Risk Assessment</h3>
            <p className="text-gray-600">
              Insurance claims, rental history, and property insights
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}

