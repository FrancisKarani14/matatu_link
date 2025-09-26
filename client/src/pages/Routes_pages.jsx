import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Routes_pages() {
  const { saccoId } = useParams(); 
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log("saccoId param:", saccoId);
    let url = "http://127.0.0.1:5000/routes"; 
    if (saccoId) {
      url = `http://127.0.0.1:5000/saccos/${saccoId}/routes`;
    }

    console.log("Fetching from:", url); // 👈 Debugging line

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch routes");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched routes:", data); // 👈 Debugging line
        setRoutes(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching routes:", err);
        setLoading(false);
      });
  }, [saccoId]);

  if (loading) {
    return <p>Loading routes...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {saccoId ? `Routes for Sacco ${saccoId}` : "All Routes"}
      </h2>
      {routes.length === 0 ? (
        <p>No routes available.</p>
      ) : (
        <ul className="space-y-3">
          {routes.map((route) => (
            <li key={route.id} className="p-4 bg-white shadow rounded-lg border">
              <p>
                <strong>From:</strong> {route.start} → <strong>To:</strong> {route.end}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
