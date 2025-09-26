import React, { useEffect, useState } from "react";

function Saccos() {
  const [saccos, setSaccos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // fetch from Flask backend
    fetch("http://localhost:5000/saccos")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch");
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
  }, []); // empty [] → runs once when component mounts

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>Saccos</h1>
      <ul>
        {saccos.map((sacco) => (
          <li key={sacco.id}>{sacco.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Saccos;
