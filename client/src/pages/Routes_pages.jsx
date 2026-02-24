import React, { useEffect, useState } from "react";
import API_BASE_URL from "../config";

export default function Routes_pages() {
  const [matatuRoutes, setMatatuRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = `${API_BASE_URL}/matatu_routes`;
    console.log("Fetching from:", url);

    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch matatu routes: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log(" Fetched matatu_routes:", data);
        setMatatuRoutes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(" Error fetching matatu_routes:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading matatu routes...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-red-900 mb-8">Matatu Routes</h2>

        {matatuRoutes.length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
            <p>No matatu routes available.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matatuRoutes.map((mr) => (
              <div
                key={mr.id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition"
              >
                <div className="mb-4">
                  <p className="text-2xl font-bold text-gray-800">
                    <span className="text-red-900">{mr.route.start}</span>
                    <span className="mx-2 text-gray-400">→</span>
                    <span className="text-red-900">{mr.route.end}</span>
                  </p>
                </div>
                <p className="text-gray-600 mb-2">
                  <strong>Matatu:</strong> {mr.matatu.plate_number}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Capacity:</strong> {mr.matatu.capacity} seater
                </p>
                <p className="text-lg font-bold text-red-900">
                  KES {mr.fare}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
