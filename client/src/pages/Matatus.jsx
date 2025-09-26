import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Matatus() {
  const { sacco_id } = useParams();
  const [matatus, setMatatus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/saccos/${sacco_id}/matatus`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch matatus");
        return res.json();
      })
      .then((data) => {
        setMatatus(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching matatus:", err);
        setLoading(false);
      });
  }, [sacco_id]);

  if (loading) return <p>Loading matatus...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Matatus in Sacco #{sacco_id}</h1>
      {matatus.length === 0 ? (
        <p>No matatus found for this sacco.</p>
      ) : (
        <ul className="space-y-2">
          {matatus.map((matatu) => (
            <li
              key={matatu.id}
              className="p-4 border rounded-lg shadow bg-white"
            >
              <p><strong>Plate:</strong> {matatu.plate_number}</p>
              <p><strong>Model:</strong> {matatu.model}</p>
              <p><strong>Capacity:</strong> {matatu.capacity}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
