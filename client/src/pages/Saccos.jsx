import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function Saccos() {
  const [saccos, setSaccos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_BASE_URL}/saccos`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch saccos");
        }
        return res.json();
      })
      .then((data) => {
        setSaccos(data.saccos || data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching saccos:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading saccos...</p>;

  // ✅ filter saccos by name or reg_number
  const filteredSaccos = saccos.filter(
    (sacco) =>
      sacco.name.toLowerCase().includes(search.toLowerCase()) ||
      sacco.reg_number.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-red-900 mb-6">Saccos</h1>

        <input
          type="text"
          placeholder="Search by name or reg number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 p-3 mb-8 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-red-900"
        />

        {filteredSaccos.length === 0 ? (
          <p className="text-gray-600">No saccos found.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSaccos.map((sacco) => (
              <div
                key={sacco.id}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition"
              >
                <h2 className="text-2xl font-bold text-red-900 mb-2">{sacco.name}</h2>
                <p className="text-gray-600 mb-4">Reg: {sacco.reg_number}</p>

                <div className="flex gap-3">
                  <button
                    onClick={() => navigate(`/saccos/${sacco.id}/matatus`)}
                    className="flex-1 px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-950 transition"
                  >
                    Matatus
                  </button>
                  <Link
                    to={`/saccos/${sacco.id}/routes`}
                    className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition text-center"
                  >
                    Routes
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
