import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { 
  Home, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  Shield, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  Users,
  FileText,
  Wrench,
  Building2,
  Car,
  TreePine,
  Droplets,
  Zap,
  Flame
} from "lucide-react"

export default function SampleReportPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Header />
      <div className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Header Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
              <Shield className="w-4 h-4" />
              Official Property Report
            </div>
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sample Property Report
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive property history and analysis for informed decision-making
            </p>
          </div>

          {/* Property Header Card */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Home className="w-5 h-5" />
                  <span className="text-blue-100 text-sm">Property Address</span>
                </div>
                <h2 className="text-3xl font-bold mb-2">123 Main Street</h2>
                <p className="text-xl text-blue-100">Plano, TX 75023</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 min-w-[200px]">
                <div className="text-sm text-blue-100 mb-1">Risk Score</div>
                <div className="text-4xl font-bold">Low</div>
                <div className="text-xs text-blue-100 mt-1">Excellent Condition</div>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-6 border-2 border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium">Year Built</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">1995</div>
              <div className="text-xs text-gray-500 mt-1">29 years old</div>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-green-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <Home className="w-5 h-5" />
                <span className="text-sm font-medium">Square Feet</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">2,400</div>
              <div className="text-xs text-gray-500 mt-1">Living area</div>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-purple-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">Bedrooms</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">4 / 2.5</div>
              <div className="text-xs text-gray-500 mt-1">Bed / Bath</div>
            </div>
            <div className="bg-white rounded-xl p-6 border-2 border-orange-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-2 text-orange-600 mb-2">
                <TreePine className="w-5 h-5" />
                <span className="text-sm font-medium">Lot Size</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">0.25</div>
              <div className="text-xs text-gray-500 mt-1">Acres</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Property Details */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Home className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Property Details</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Property Type</div>
                      <div className="font-semibold text-gray-900">Single Family Residence</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">County</div>
                      <div className="font-semibold text-gray-900">Collin County</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">School District</div>
                      <div className="font-semibold text-gray-900">Plano ISD</div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm text-gray-500 mb-1">APN / Parcel ID</div>
                      <div className="font-semibold text-gray-900 font-mono text-sm">R-12345-678-90</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Property Tax ID</div>
                      <div className="font-semibold text-gray-900">TX-2024-001234</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 mb-1">Zoning</div>
                      <div className="font-semibold text-gray-900">Residential (R-1)</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ownership Timeline */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Ownership History</h3>
                </div>
                <div className="space-y-4">
                  <div className="relative pl-8 border-l-4 border-green-500">
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-green-500 rounded-full border-4 border-white"></div>
                    <div className="bg-green-50 rounded-xl p-5 border border-green-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900">Current Owner</span>
                            <span className="px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">Active</span>
                          </div>
                          <div className="text-sm text-gray-600">March 2020 - Present</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">$425,000</div>
                          <div className="text-xs text-gray-500">Purchase Price</div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-green-200">
                        <div className="text-sm text-gray-600">Ownership Duration: 4+ years</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative pl-8 border-l-4 border-blue-300">
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-blue-300 rounded-full border-4 border-white"></div>
                    <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-bold text-gray-900 mb-1">Previous Owner</div>
                          <div className="text-sm text-gray-600">June 2015 - March 2020</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-blue-600">$350,000</div>
                          <div className="text-xs text-gray-500">Sale Price</div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-blue-200">
                        <div className="text-sm text-gray-600">Ownership Duration: ~5 years</div>
                        <div className="text-sm text-green-600 font-medium mt-1">+21% value increase</div>
                      </div>
                    </div>
                  </div>

                  <div className="relative pl-8 border-l-4 border-gray-300">
                    <div className="absolute -left-3 top-0 w-6 h-6 bg-gray-300 rounded-full border-4 border-white"></div>
                    <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <div className="font-bold text-gray-900 mb-1">Original Owner</div>
                          <div className="text-sm text-gray-600">1995 - June 2015</div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-600">$185,000</div>
                          <div className="text-xs text-gray-500">Original Purchase</div>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="text-sm text-gray-600">Ownership Duration: 20 years</div>
                        <div className="text-sm text-green-600 font-medium mt-1">+130% value increase over ownership</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sales History */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Sales History</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-green-600" />
                          <span className="font-bold text-gray-900">March 15, 2020</span>
                        </div>
                        <div className="text-sm text-gray-600">Most Recent Sale</div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-green-600">$425,000</div>
                        <div className="text-xs text-gray-500">Sale Price</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-green-200">
                      <div>
                        <div className="text-xs text-gray-500">Price per sq ft</div>
                        <div className="font-semibold text-gray-900">$177</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Days on Market</div>
                        <div className="font-semibold text-gray-900">12 days</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500">Sale Type</div>
                        <div className="font-semibold text-gray-900">Traditional</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span className="font-bold text-gray-900">June 22, 2015</span>
                        </div>
                        <div className="text-sm text-gray-600">Previous Sale</div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-600">$350,000</div>
                        <div className="text-xs text-gray-500">Sale Price</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-blue-200">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">+21.4% appreciation in 5 years</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Work History & Maintenance */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Wrench className="w-5 h-5 text-orange-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Work History & Maintenance</h3>
                </div>
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-6 border-2 border-orange-200">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                            <Wrench className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-bold text-lg text-gray-900">Roof Replacement</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Completed</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">March 2022</div>
                        <div className="text-sm text-gray-700">Complete roof replacement with 30-year warranty. Includes new shingles, underlayment, and flashing.</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 pt-4 border-t border-orange-200">
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <Shield className="w-3 h-3" />
                        <span>30-year warranty</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-600">
                        <CheckCircle2 className="w-3 h-3 text-green-600" />
                        <span>Verified</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <div className="flex items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                            <Zap className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-bold text-lg text-gray-900">HVAC System Update</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Completed</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">August 2021</div>
                        <div className="text-sm text-gray-700">New central air conditioning system installed. Energy-efficient model with smart thermostat.</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                    <div className="flex items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                            <Home className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-bold text-lg text-gray-900">Kitchen Renovation</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Completed</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">January 2019</div>
                        <div className="text-sm text-gray-700">Complete kitchen remodel with new appliances, cabinets, countertops, and flooring.</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-cyan-50 rounded-xl p-6 border border-cyan-200">
                    <div className="flex items-start mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                            <Droplets className="w-4 h-4 text-white" />
                          </div>
                          <span className="font-bold text-lg text-gray-900">Plumbing Update</span>
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">Completed</span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">November 2018</div>
                        <div className="text-sm text-gray-700">Replaced main water line and updated fixtures throughout the home.</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-sm text-gray-500 mb-2">Maintenance History</div>
                    <div className="text-lg font-semibold text-green-600">Well Maintained</div>
                    <div className="text-xs text-gray-500 mt-1">Regular maintenance and updates over the past 6 years</div>
                  </div>
                </div>
              </div>

              {/* Building Permits */}
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Building Permits</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-gray-900 mb-1">Kitchen Remodel Permit</div>
                        <div className="text-sm text-gray-600 mb-2">Permit #2019-01234</div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm text-gray-600">Issued: January 2019</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">Completed</span>
                    </div>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-5 border border-indigo-200">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="font-bold text-gray-900 mb-1">Electrical Upgrade</div>
                        <div className="text-sm text-gray-600 mb-2">Permit #2018-04567</div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-indigo-600" />
                          <span className="text-sm text-gray-600">Issued: March 2018</span>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">Completed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Risk Assessment Card */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 shadow-lg border-2 border-green-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Risk Assessment</h3>
                </div>
                <div className="text-center mb-6">
                  <div className="text-5xl font-bold text-green-600 mb-2">Low</div>
                  <div className="text-sm text-gray-600">Overall Risk Score</div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Structural</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-green-500"></div>
                      </div>
                      <span className="text-sm font-semibold text-green-600">Excellent</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Systems</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-green-500"></div>
                      </div>
                      <span className="text-sm font-semibold text-green-600">Excellent</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Maintenance</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className="w-full h-full bg-green-500"></div>
                      </div>
                      <span className="text-sm font-semibold text-green-600">Excellent</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-green-200">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle2 className="w-5 h-5" />
                    <span className="text-sm font-medium">No major concerns identified</span>
                  </div>
                </div>
              </div>

              {/* Property Value Trend */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Value Trend</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 mb-1">Current Estimated Value</div>
                    <div className="text-2xl font-bold text-gray-900">$485,000</div>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-sm font-medium">+14.1% since purchase</span>
                    </div>
                    <div className="text-xs text-gray-500">Based on recent sales and market trends</div>
                  </div>
                </div>
              </div>

              {/* Key Features */}
              <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Key Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Car className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-sm text-gray-700">2-Car Garage</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <TreePine className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">Mature Landscaping</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Flame className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-sm text-gray-700">Fireplace</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Zap className="w-4 h-4 text-orange-600" />
                    </div>
                    <span className="text-sm text-gray-700">Energy Efficient</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
              <h3 className="text-3xl font-bold mb-4">Ready to Get Your Property Report?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                Get comprehensive property history reports for any address. Make informed decisions with confidence.
              </p>
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/pricing">Get Your Report Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
