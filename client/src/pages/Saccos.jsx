import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Saccos() {
  const [saccos, setSaccos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(""); 
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/saccos")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch saccos");
        }
        return res.json();
      })
      .then((data) => {
        setSaccos(data);
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Saccos</h1>

      {/* ✅ Search bar */}
      <input
        type="text"
        placeholder="Search by name or reg number..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/2 p-2 mb-6 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {filteredSaccos.length === 0 ? (
        <p>No saccos found.</p>
      ) : (
        <div className="grid gap-4">
          {filteredSaccos.map((sacco) => (
            <div
              key={sacco.id}
              className="p-4 border rounded-lg shadow bg-white"
            >
              <h2 className="text-lg font-semibold">{sacco.name}</h2>
              <p className="text-gray-600">Reg Number: {sacco.reg_number}</p>

              <div className="mt-4 flex gap-2 flex-wrap">
                {/* ✅ View Matatus button */}
                <button
                  onClick={() => navigate(`/saccos/${sacco.id}/matatus`)}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                >
                  View Matatus
                </button>

                {/* ✅ View Routes button */}
                <Link
                  to={`/saccos/${sacco.id}/routes`}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition text-center no-underline inline-block"
                >
                  View Routes
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
