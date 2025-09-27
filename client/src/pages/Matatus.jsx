import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Matatus() {
  const { saccoId } = useParams();
  const [matatus, setMatatus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMatatu, setSelectedMatatu] = useState(null);

  // Form state for editing
  const [formData, setFormData] = useState({ plate_number: "", capacity: "" });

  useEffect(() => {
    let url = "http://localhost:5000/matatus";
    if (saccoId) {
      url = `http://localhost:5000/saccos/${saccoId}/matatus`;
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

  // Handle edit button click
  const handleEditClick = (matatu) => {
    setSelectedMatatu(matatu);
    setFormData({ plate_number: matatu.plate_number, capacity: matatu.capacity });
    setShowEditModal(true);
  };

  // Handle delete button click
  const handleDeleteClick = (matatu) => {
    setSelectedMatatu(matatu);
    setShowDeleteModal(true);
  };

  // Save edit
  const handleSaveEdit = () => {
    setMatatus((prev) =>
      prev.map((m) =>
        m.id === selectedMatatu.id
          ? { ...m, plate_number: formData.plate_number, capacity: formData.capacity }
          : m
      )
    );
    setShowEditModal(false);
    setSelectedMatatu(null);
  };

  // Confirm delete
  const handleConfirmDelete = () => {
    setMatatus((prev) => prev.filter((m) => m.id !== selectedMatatu.id));
    setShowDeleteModal(false);
    setSelectedMatatu(null);
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        {saccoId ? `Matatus in Sacco #${saccoId}` : "All Matatus"}
      </h1>

      {matatus.length === 0 ? (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          No matatus available{saccoId ? " for this sacco" : ""}.
        </div>
      ) : (
        <ul className="space-y-3">
          {matatus.map((matatu) => (
            <li
              key={matatu.id}
              className="p-4 border rounded-lg shadow bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  {/* ✅ Plate number always visible */}
                  <h2 className="text-lg font-semibold text-blue-600">
                    {matatu.plate_number}
                  </h2>
                  <p className="text-sm text-gray-600">
                    <strong>Capacity:</strong> {matatu.capacity} passengers
                  </p>
                  {matatu.year && (
                    <p className="text-sm text-gray-600">
                      <strong>Year:</strong> {matatu.year}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditClick(matatu)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteClick(matatu)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {/* ✏️ Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Edit Matatu: {selectedMatatu?.plate_number}
            </h2>
            <label className="block mb-2">
              Plate Number
              <input
                type="text"
                value={formData.plate_number}
                onChange={(e) =>
                  setFormData({ ...formData, plate_number: e.target.value })
                }
                className="w-full border p-2 rounded mt-1"
              />
            </label>
            <label className="block mb-4">
              Capacity
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) =>
                  setFormData({ ...formData, capacity: e.target.value })
                }
                className="w-full border p-2 rounded mt-1"
              />
            </label>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🗑 Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h2 className="text-xl font-bold mb-4">Confirm Delete</h2>
            <p>
              Are you sure you want to delete{" "}
              <strong>{selectedMatatu?.plate_number}</strong>?
            </p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
