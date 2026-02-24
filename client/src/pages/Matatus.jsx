import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function Matatus() {
  const { saccoId } = useParams();
  const [matatus, setMatatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let url = `${API_BASE_URL}/matatus`;
    if (saccoId) {
      url = `${API_BASE_URL}/saccos/${saccoId}/matatus`;
    }

    setLoading(true);
    setError(null);

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`Failed to fetch matatus: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const matatusData = Array.isArray(data) ? data : data.matatus || [];
        setMatatus(matatusData);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [saccoId]);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-900"></div>
        <span className="ml-2">Loading matatus...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-red-900 mb-8">
          {saccoId ? `Matatus in Sacco #${saccoId}` : "All Matatus"}
        </h1>

        {matatus.length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
            No matatus available{saccoId ? " for this sacco" : ""}.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {matatus.map((matatu) => (
              <div
                key={matatu.id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition"
              >
                <h2 className="text-2xl font-bold text-red-900 mb-2">
                  {matatu.plate_number}
                </h2>
                <p className="text-gray-600 mb-1">
                  <strong>Capacity:</strong> {matatu.capacity} passengers
                </p>
                {matatu.year && (
                  <p className="text-gray-600">
                    <strong>Year:</strong> {matatu.year}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
