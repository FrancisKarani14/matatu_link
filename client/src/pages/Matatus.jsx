import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { API_BASE_URL } from "../config"
import { FaBus } from "react-icons/fa"

export default function Matatus() {
  const { saccoId } = useParams()
  const [matatus, setMatatus] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const url = saccoId
      ? `${API_BASE_URL}/saccos/${saccoId}/matatus`
      : `${API_BASE_URL}/matatus`

    setLoading(true)
    setError(null)

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch matatus: ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setMatatus(Array.isArray(data) ? data : data.matatus || [])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [saccoId])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f5] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 w-48 skeleton mb-8" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="h-12 w-12 skeleton rounded-xl mb-4" />
                <div className="h-6 w-3/4 skeleton mb-2" />
                <div className="h-4 w-1/2 skeleton" />
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
          <span className="text-red-900 text-sm font-semibold tracking-widest uppercase">Fleet</span>
          <h1 className="text-4xl font-bold text-gray-900 mt-1 tracking-tight">
            {saccoId ? `Sacco #${saccoId} Matatus` : "All Matatus"}
          </h1>
          <p className="text-gray-500 mt-2">{matatus.length} vehicles registered</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {matatus.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FaBus className="text-2xl text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No matatus available{saccoId ? " for this sacco" : ""}.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matatus.map((matatu, i) => (
              <div
                key={matatu.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover animate-fade-up"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                    <FaBus className="text-red-900 text-lg" />
                  </div>
                  {matatu.year && (
                    <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                      {matatu.year}
                    </span>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{matatu.plate_number}</h2>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-900 text-sm font-semibold rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {matatu.capacity} seats
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
