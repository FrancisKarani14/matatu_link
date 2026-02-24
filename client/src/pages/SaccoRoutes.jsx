import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function SaccoRoutes() {
  const { saccoId } = useParams();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [receipt, setReceipt] = useState(null);

  useEffect(() => {
    fetch(`/saccos/${saccoId}/routes`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch routes");
        return res.json();
      })
      .then((data) => {
        setRoutes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching routes:", err);
        setLoading(false);
      });
  }, [saccoId]);

  const handlePayment = (route) => {
    setSelectedRoute(null);

    const refNumber = "MP" + Math.floor(100000 + Math.random() * 900000);
    const timestamp = new Date().toLocaleString();

    setReceipt({
      start: route.start,
      end: route.end,
      fare: 100,
      ref: refNumber,
      date: timestamp,
    });
  };

  if (loading) return <p>Loading routes...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Routes for Sacco #{saccoId}</h1>

      {routes.length === 0 ? (
        <p>No routes found for this sacco.</p>
      ) : (
        <div className="grid gap-4">
          {routes.map((route) => (
            <div
              key={route.id}
              className="p-4 border rounded-lg shadow bg-white cursor-pointer hover:shadow-md"
              onClick={() => setSelectedRoute(route)}
            >
              <h2 className="text-lg font-semibold">
                {route.start} → {route.end}
              </h2>
            </div>
          ))}
        </div>
      )}

      {/* Payment Modal */}
      {selectedRoute && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">
              Route: {selectedRoute.start} → {selectedRoute.end}
            </h2>
            <p className="mb-2 text-gray-700">Fare: <strong>KSh 100</strong></p>
            <p className="mb-4 text-gray-700">
              Pay using M-Pesa Till Number: <strong>123456</strong>
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setSelectedRoute(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => handlePayment(selectedRoute)}
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
              <p><strong>Route:</strong> {receipt.start} → {receipt.end}</p>
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
