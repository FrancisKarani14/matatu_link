import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Routes_page() {
  const { saccoId } = useParams(); // grab saccoId if present
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let url = "http://127.0.0.1:5000/routes"; // default → all routes
    if (saccoId) {
      url = `http://127.0.0.1:5000/saccos/${saccoId}/routes`; // sacco-specific routes
    }

    fetch(url)
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
        console.error(err);
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
            <li
              key={route.id}
              className="p-4 bg-white shadow rounded-lg border border-gray-200"
            >
              <p>
                <strong>From:</strong> {route.start} {" → "}
                <strong>To:</strong> {route.end}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
