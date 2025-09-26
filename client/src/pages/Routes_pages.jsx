import React, { useEffect, useState } from "react";

export default function Routes_pages() {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hardcode sacco_id for now (later you can pass via props, params, etc.)
  const saccoId = 1;

  useEffect(() => {
    fetch(`http://localhost:5000/saccos/${saccoId}/routes`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch routes");
        }
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

  if (loading) return <p>Loading routes...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">
        Routes for Sacco #{saccoId}
      </h1>
      {routes.length === 0 ? (
        <p>No routes found for this sacco.</p>
      ) : (
        <ul className="list-disc pl-6">
          {routes.map((route) => (
            <li key={route.id}>
              {route.start_point} → {route.end_point}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
