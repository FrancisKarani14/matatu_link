import React, { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { API_BASE_URL } from "../config"
import { FaBus, FaRoute, FaSearch } from "react-icons/fa"

export default function Saccos() {
  const [saccos, setSaccos] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetch(`${API_BASE_URL}/saccos`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch saccos")
        return res.json()
      })
      .then((data) => {
        setSaccos(data.saccos || data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filteredSaccos = saccos.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.reg_number.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f5] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 w-48 skeleton mb-8" />
          <div className="h-12 w-80 skeleton mb-10" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="h-6 w-3/4 skeleton mb-3" />
                <div className="h-4 w-1/2 skeleton mb-6" />
                <div className="flex gap-3">
                  <div className="h-10 flex-1 skeleton rounded-xl" />
                  <div className="h-10 flex-1 skeleton rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f8f7f5]">
      {/* Page Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-red-900 text-sm font-semibold tracking-widest uppercase">Directory</span>
              <h1 className="text-4xl font-bold text-gray-900 mt-1 tracking-tight">Saccos</h1>
              <p className="text-gray-500 mt-2">
                {saccos.length} registered saccos across Kenya
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                placeholder="Search by name or reg number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {filteredSaccos.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FaBus className="text-2xl text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No saccos found matching "{search}"</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSaccos.map((sacco, i) => (
              <div
                key={sacco.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover animate-fade-up"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
                    <FaBus className="text-red-900 text-lg" />
                  </div>
                  <span className="text-xs font-semibold text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                    {sacco.reg_number}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-1">{sacco.name}</h2>
                <p className="text-gray-500 text-sm mb-6">Registered Sacco</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/saccos/${sacco.id}/matatus`)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-900 text-white text-sm font-semibold rounded-xl hover:bg-red-800 transition-colors"
                  >
                    <FaBus className="text-xs" /> Matatus
                  </button>
                  <Link
                    to={`/saccos/${sacco.id}/routes`}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    <FaRoute className="text-xs" /> Routes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
