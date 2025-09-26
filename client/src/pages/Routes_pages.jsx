import React, { useEffect, useState } from "react";

export default function Routes_pages() {
  const [matatuRoutes, setMatatuRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const url = "http://localhost:5000/matatu_routes";
    console.log("🌍 Fetching from:", url);

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
        console.log("✅ Fetched matatu_routes:", data);
        setMatatuRoutes(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching matatu_routes:", err);
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
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Matatu Routes</h2>

      {matatuRoutes.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No matatu routes available.</p>
        </div>
      ) : (
        <ul className="space-y-3">
          {matatuRoutes.map((mr) => (
            <li
              key={mr.id}
              className="p-4 bg-white shadow rounded-lg border hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-lg font-medium text-gray-800">
                    <span className="text-blue-600">{mr.route.start}</span>
                    <span className="mx-2 text-gray-400">→</span>
                    <span className="text-green-600">{mr.route.end}</span>
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Matatu: <span className="font-semibold">{mr.matatu.plate_number}</span>  
                    ({mr.matatu.capacity} seater)
                  </p>
                  <p className="text-sm text-gray-500">
                    Fare: <span className="font-semibold">KES {mr.fare}</span>
                  </p>
                </div>
                <div className="text-sm text-gray-400">#{mr.id}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
