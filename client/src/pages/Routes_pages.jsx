import React, { useEffect, useState } from "react"
import { API_BASE_URL } from "../config"
import { FaArrowRight, FaRoute } from "react-icons/fa"

export default function Routes_pages() {
  const [matatuRoutes, setMatatuRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`${API_BASE_URL}/matatu_routes`)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch matatu routes: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setMatatuRoutes(data.matatu_routes || data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f5] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 w-48 skeleton mb-8" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="h-6 w-full skeleton mb-3" />
                <div className="h-4 w-1/2 skeleton mb-2" />
                <div className="h-4 w-1/3 skeleton mb-4" />
                <div className="h-8 w-24 skeleton rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#f8f7f5] flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-red-100 max-w-md w-full text-center">
          <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-4">
            <span className="text-red-900 font-bold text-lg">!</span>
          </div>
          <p className="text-gray-700 font-medium">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f7f5]">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <span className="text-red-900 text-sm font-semibold tracking-widest uppercase">Network</span>
          <h1 className="text-4xl font-bold text-gray-900 mt-1 tracking-tight">Matatu Routes</h1>
          <p className="text-gray-500 mt-2">{matatuRoutes.length} active routes with fares</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {matatuRoutes.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FaRoute className="text-2xl text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No matatu routes available.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matatuRoutes.map((mr, i) => (
              <div
                key={mr.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover animate-fade-up"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                {/* Route */}
                <div className="flex items-center gap-2 mb-5">
                  <span className="text-lg font-bold text-gray-900">{mr.route.start}</span>
                  <div className="flex-1 flex items-center gap-1">
                    <div className="flex-1 h-px bg-gray-200" />
                    <FaArrowRight className="text-gray-400 text-xs shrink-0" />
                    <div className="flex-1 h-px bg-gray-200" />
                  </div>
                  <span className="text-lg font-bold text-gray-900">{mr.route.end}</span>
                </div>

                {/* Details */}
                <div className="space-y-2 mb-5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Matatu</span>
                    <span className="font-semibold text-gray-800">{mr.matatu.plate_number}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Capacity</span>
                    <span className="font-semibold text-gray-800">{mr.matatu.capacity} seats</span>
                  </div>
                </div>

                {/* Fare */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">Fare</span>
                  <span className="text-xl font-bold text-red-900">KES {mr.fare}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
