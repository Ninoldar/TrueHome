/**
 * V0 Landing Page Template
 * 
 * This is a template structure for integrating a V0-generated landing page.
 * 
 * Steps:
 * 1. Go to https://v0.dev
 * 2. Generate your landing page
 * 3. Copy the generated code
 * 4. Replace this component with V0 code
 * 5. Make sure to keep the PropertySearch component integration
 */

'use client'

import PropertySearch from './PropertySearch'

export default function V0LandingTemplate() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section - Replace this entire section with V0 code */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            TrueHome
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Comprehensive property history reports - A Carfax for homes
          </p>
        </div>

        {/* IMPORTANT: Keep this PropertySearch component when replacing with V0 code */}
        <div className="max-w-2xl mx-auto">
          <PropertySearch />
        </div>
      </section>

      {/* Features Section - Replace with V0 generated features */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
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
      </section>

      {/* Add more sections from V0 here */}
    </div>
  )
}
