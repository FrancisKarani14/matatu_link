import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { API_BASE_URL } from "../config"
import { FaBus, FaTimes, FaCheckCircle } from "react-icons/fa"

export default function SaccoMatatus() {
  const { saccoId } = useParams()
  const [matatus, setMatatus] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMatatu, setSelectedMatatu] = useState(null)
  const [receipt, setReceipt] = useState(null)

  useEffect(() => {
    fetch(`${API_BASE_URL}/saccos/${saccoId}/matatus`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch matatus")
        return res.json()
      })
      .then((data) => {
        setMatatus(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [saccoId])

  const handlePayment = (matatu) => {
    setSelectedMatatu(null)
    setReceipt({
      plate: matatu.plate_number,
      capacity: matatu.capacity,
      fare: 100,
      ref: "MP" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toLocaleString(),
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f7f5] p-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-10 w-64 skeleton mb-8" />
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

  return (
    <div className="min-h-screen bg-[#f8f7f5]">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <span className="text-red-900 text-sm font-semibold tracking-widest uppercase">Fleet</span>
          <h1 className="text-4xl font-bold text-gray-900 mt-1 tracking-tight">
            Sacco #{saccoId} Matatus
          </h1>
          <p className="text-gray-500 mt-2">{matatus.length} vehicles — click a card to pay</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {matatus.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <FaBus className="text-2xl text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium">No matatus found for this sacco.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matatus.map((matatu, i) => (
              <div
                key={matatu.id}
                onClick={() => setSelectedMatatu(matatu)}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 card-hover cursor-pointer group animate-fade-up"
                style={{ animationDelay: `${i * 0.04}s` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center group-hover:from-red-100 group-hover:to-red-200 transition-colors">
                    <FaBus className="text-red-900 text-lg" />
                  </div>
                  <span className="text-xs font-semibold text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                    Available
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">{matatu.plate_number}</h2>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-900 text-sm font-semibold rounded-lg">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {matatu.capacity} seats
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-4">Click to pay fare</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {selectedMatatu && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedMatatu(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-up">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-gray-900">Confirm Payment</h2>
              <button
                onClick={() => setSelectedMatatu(null)}
                className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <FaTimes className="text-gray-500 text-sm" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Matatu</span>
                  <span className="font-semibold text-gray-900">{selectedMatatu.plate_number}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Capacity</span>
                  <span className="font-semibold text-gray-900">{selectedMatatu.capacity} passengers</span>
                </div>
                <div className="flex justify-between text-sm border-t border-gray-200 pt-3">
                  <span className="text-gray-500">Fare</span>
                  <span className="font-bold text-red-900 text-lg">KSh 100</span>
                </div>
              </div>
              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                <p className="text-sm text-green-800 font-medium">M-Pesa Till Number</p>
                <p className="text-2xl font-bold text-green-900 mt-1">123456</p>
              </div>
            </div>
            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => setSelectedMatatu(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePayment(selectedMatatu)}
                className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setReceipt(null)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md animate-fade-up">
            <div className="p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-green-600 text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Payment Successful</h2>
              <p className="text-gray-500 text-sm mb-6">Your receipt has been generated</p>

              <div className="bg-gray-50 rounded-xl p-5 text-left space-y-3 mb-6">
                {[
                  ["Reference", receipt.ref],
                  ["Date", receipt.date],
                  ["Matatu", receipt.plate],
                  ["Capacity", `${receipt.capacity} passengers`],
                  ["Fare Paid", `KSh ${receipt.fare}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between text-sm">
                    <span className="text-gray-500">{label}</span>
                    <span className="font-semibold text-gray-900">{value}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setReceipt(null)}
                className="w-full py-3 btn-primary rounded-xl font-semibold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
