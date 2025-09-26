import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Matatus() {
  const { saccoId } = useParams(); // Changed from sacco_id to saccoId to match your route
  const [matatus, setMatatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("✅ saccoId param:", saccoId);

    // Build URL based on whether we have a saccoId parameter
    let url = "http://localhost:5000/matatus";
    if (saccoId) {
      url = `http://localhost:5000/saccos/${saccoId}/matatus`;
    }

    console.log("🌍 Fetching from:", url);

    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch matatus: ${res.status} ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("✅ Fetched matatus:", data);
        // Ensure data is an array, or extract matatus from response object
        const matatusData = Array.isArray(data) ? data : data.matatus || [];
        setMatatus(matatusData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error fetching matatus:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [saccoId]);

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2">Loading matatus...</span>
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
      <h1 className="text-2xl font-bold mb-6">
        {saccoId ? `Matatus in Sacco #${saccoId}` : "All Matatus"}
      </h1>
      
      {matatus.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>No matatus available{saccoId ? ` for this sacco` : ""}.</p>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">
            Showing {matatus.length} matatu{matatus.length !== 1 ? 's' : ''}
            {saccoId ? ` for Sacco ${saccoId}` : ' in total'}
          </p>
          <ul className="space-y-3">
            {matatus.map((matatu) => (
              <li
                key={matatu.id}
                className="p-4 border rounded-lg shadow bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-lg font-semibold text-blue-600 mb-2">
                      {matatu.plate_number}
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        <strong>Model:</strong> {matatu.model}
                      </p>
                      <p className="text-sm text-gray-600">
                        <strong>Capacity:</strong> {matatu.capacity} passengers
                      </p>
                      {matatu.year && (
                        <p className="text-sm text-gray-600">
                          <strong>Year:</strong> {matatu.year}
                        </p>
                      )}
                      {matatu.sacco_name && !saccoId && (
                        <p className="text-sm text-gray-600">
                          <strong>Sacco:</strong> {matatu.sacco_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    ID: {matatu.id}
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