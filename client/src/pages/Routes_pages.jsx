import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Routes_pages() {
  const { sacco_id } = useParams();
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/saccos/${sacco_id}/routes`)
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
  }, [sacco_id]);

  if (loading) return <p>Loading routes...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Routes in Sacco #{sacco_id}</h1>
      {routes.length === 0 ? (
        <p>No routes found for this sacco.</p>
      ) : (
        <ul className="space-y-2">
          {routes.map((route) => (
            <li
              key={route.id}
              className="p-4 border rounded-lg shadow bg-white"
            >
              <p><strong>From:</strong> {route.start_point}</p>
              <p><strong>To:</strong> {route.end_point}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
