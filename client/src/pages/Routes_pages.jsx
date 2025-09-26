import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Routes_pages() {
  const { saccoId } = useParams();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("✅ saccoId param:", saccoId);

    // Build URL based on whether we have a saccoId parameter
    let url = "http://localhost:5000/routes";
    if (saccoId) {
      url = `http://localhost:5000/saccos/${saccoId}/routes`;
    }

    console.log("🌍 Fetching from:", url);

    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch routes: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Fetched routes:", data);
        // Ensure data is an array, or extract routes from response object
        const routesData = Array.isArray(data) ? data : data.routes || [];
        setRoutes(routesData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching routes:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [saccoId]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading routes...</span>
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
      <h2 className="text-2xl font-bold mb-4">
        {saccoId ? `Routes for Sacco ${saccoId}` : "All Routes"}
      </h2>
      
      {routes.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No routes available{saccoId ? ` for this sacco` : ""}.</p>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">
            Showing {routes.length} route{routes.length !== 1 ? 's' : ''}
            {saccoId ? ` for Sacco ${saccoId}` : ' in total'}
          </p>
          <ul className="space-y-3">
            {routes.map((route) => (
              <li key={route.id} className="p-4 bg-white shadow rounded-lg border hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-medium">
                      <span className="text-blue-600">{route.start}</span>
                      <span className="mx-2 text-gray-400">→</span>
                      <span className="text-green-600">{route.end}</span>
                    </p>
                    {route.distance && (
                      <p className="text-sm text-gray-500 mt-1">
                        Distance: {route.distance} km
                      </p>
                    )}
                    {route.fare && (
                      <p className="text-sm text-gray-500">
                        Fare: KES {route.fare}
                      </p>
                    )}
                  </div>
                  <div className="text-sm text-gray-400">
                    Route #{route.id}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}