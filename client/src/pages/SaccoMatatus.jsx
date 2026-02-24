import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_BASE_URL from "../config";

export default function SaccoMatatus() {
  const { saccoId } = useParams();
  const [matatus, setMatatus] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedMatatu, setSelectedMatatu] = useState(null);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE_URL}/saccos/${saccoId}/matatus`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch matatus");
        return res.json();
      })
      .then((data) => {
        setMatatus(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching matatus:", err);
        setLoading(false);
      });
  }, [saccoId]);

  const handlePayment = (matatu) => {
    setSelectedMatatu(null);

    const refNumber = "MP" + Math.floor(100000 + Math.random() * 900000); // fake ref
    const timestamp = new Date().toLocaleString();

    setReceipt({
      plate: matatu.plate_number,
      capacity: matatu.capacity,
      fare: 100,
      ref: refNumber,
      date: timestamp,
    });
  };

  if (loading) return <p>Loading matatus...</p>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-red-900 mb-8">Matatus for Sacco #{saccoId}</h1>

        {matatus.length === 0 ? (
          <p className="text-gray-600">No matatus found for this sacco.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matatus.map((matatu) => (
              <div
                key={matatu.id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer"
                onClick={() => setSelectedMatatu(matatu)}
              >
                <h2 className="text-2xl font-bold text-red-900 mb-2">
                  {matatu.plate_number}
                </h2>
                <p className="text-gray-600">Capacity: {matatu.capacity} passengers</p>
              </div>
            ))}
          </div>
        )}

      {/* Payment Modal */}
      {selectedMatatu && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">
              Matatu {selectedMatatu.plate_number}
            </h2>
            <p className="mb-2 text-gray-700">
              Capacity: {selectedMatatu.capacity} passengers
            </p>
            <p className="mb-2 text-gray-700">Fare: <strong>KSh 100</strong></p>
            <p className="mb-4 text-gray-700">
              Pay using M-Pesa Till Number: <strong>123456</strong>
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedMatatu(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePayment(selectedMatatu)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {receipt && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96 text-center">
            <h2 className="text-xl font-bold mb-4 text-green-600">
              ✅ Payment Successful
            </h2>
            <div className="text-left space-y-2">
              <p><strong>Reference:</strong> {receipt.ref}</p>
              <p><strong>Date:</strong> {receipt.date}</p>
              <p><strong>Matatu:</strong> {receipt.plate}</p>
              <p><strong>Capacity:</strong> {receipt.capacity}</p>
              <p><strong>Fare Paid:</strong> KSh {receipt.fare}</p>
            </div>
            <button
              onClick={() => setReceipt(null)}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
