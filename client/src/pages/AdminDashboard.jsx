import React, { useState, useEffect } from "react";
import { FaBuilding, FaRoute, FaBus, FaChartBar, FaPlus } from "react-icons/fa";
import { API_BASE_URL } from "../config";

export default function AdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [sacco, setSacco] = useState(null);
  const [matatus, setMatatus] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [showSaccoModal, setShowSaccoModal] = useState(false);
  const [showRouteModal, setShowRouteModal] = useState(false);
  const [showMatatuModal, setShowMatatuModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  
  // Form states
  const [saccoForm, setSaccoForm] = useState({ name: "", reg_number: "" });
  const [routeForm, setRouteForm] = useState({ start: "", end: "" });
  const [matatuForm, setMatatuForm] = useState({ plate_number: "", capacity: "" });
  const [linkForm, setLinkForm] = useState({ matatu_id: "", route_id: "", fare: "" });

  useEffect(() => {
    // Fetch admin's sacco (assuming admin has sacco_id = 1)
    const adminSaccoId = 1;
    Promise.all([
      fetch(`${API_BASE_URL}/saccos`).then(res => res.json()),
      fetch(`${API_BASE_URL}/saccos/${adminSaccoId}/matatus`).then(res => res.json()),
      fetch(`${API_BASE_URL}/saccos/${adminSaccoId}/routes`).then(res => res.json())
    ])
      .then(([saccosData, matatusData, routesData]) => {
        setSacco(saccosData[0]);
        setMatatus(matatusData);
        setRoutes(routesData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleCreateSacco = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/saccos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ...saccoForm, admin_id: user.id })
      });
      const data = await response.json();
      if (response.ok) {
        setSacco(data.sacco);
        setShowSaccoModal(false);
        setSaccoForm({ name: "", reg_number: "" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddRoute = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/routes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ...routeForm, sacco_id: sacco.id })
      });
      const data = await response.json();
      if (response.ok) {
        setRoutes([...routes, data.route]);
        setShowRouteModal(false);
        setRouteForm({ start: "", end: "" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddMatatu = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/matatus`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ ...matatuForm, sacco_id: sacco.id })
      });
      const data = await response.json();
      if (response.ok) {
        setMatatus([...matatus, data.matatu]);
        setShowMatatuModal(false);
        setMatatuForm({ plate_number: "", capacity: "" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLinkMatatuRoute = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/matatu_routes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(linkForm)
      });
      if (response.ok) {
        setShowLinkModal(false);
        setLinkForm({ matatu_id: "", route_id: "", fare: "" });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: FaChartBar },
    { id: "sacco", label: "My Sacco", icon: FaBuilding },
    { id: "routes", label: "Routes", icon: FaRoute },
    { id: "matatus", label: "Matatus", icon: FaBus }
  ];

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-red-900 text-white flex flex-col">
        <div className="p-6 border-b border-red-800">
          <h2 className="text-2xl font-bold">Admin</h2>
          <p className="text-red-200 text-sm mt-1">Dashboard</p>
        </div>
        <nav className="flex-1 p-4">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition ${
                activeSection === item.id ? 'bg-red-800' : 'hover:bg-red-800'
              }`}
            >
              <item.icon className="text-xl" />
              <span className="font-semibold">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-red-800">
          <p className="text-red-200 text-sm">Logged in as</p>
          <p className="font-semibold">admin@matatulink.com</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Overview */}
        {activeSection === "overview" && (
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">My Sacco</p>
                    <p className="text-2xl font-bold text-red-900">{sacco ? sacco.name : "Not Created"}</p>
                  </div>
                  <FaBuilding className="text-5xl text-red-200" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Routes</p>
                    <p className="text-4xl font-bold text-red-900">{routes.length}</p>
                  </div>
                  <FaRoute className="text-5xl text-red-200" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Matatus</p>
                    <p className="text-4xl font-bold text-red-900">{matatus.length}</p>
                  </div>
                  <FaBus className="text-5xl text-red-200" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* My Sacco */}
        {activeSection === "sacco" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800">My Sacco</h1>
              {!sacco && (
                <button
                  onClick={() => setShowSaccoModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-red-900 text-white rounded-lg hover:bg-red-950 transition font-semibold"
                >
                  <FaPlus /> Create Sacco
                </button>
              )}
            </div>
            {sacco ? (
              <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl">
                <h2 className="text-2xl font-bold text-red-900 mb-4">{sacco.name}</h2>
                <p className="text-gray-600"><strong>Registration Number:</strong> {sacco.reg_number}</p>
              </div>
            ) : (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
                You haven't created a sacco yet. Click "Create Sacco" to get started.
              </div>
            )}
          </div>
        )}

        {/* Routes */}
        {activeSection === "routes" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800">Routes</h1>
              {sacco && (
                <button
                  onClick={() => setShowRouteModal(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-red-900 text-white rounded-lg hover:bg-red-950 transition font-semibold"
                >
                  <FaPlus /> Add Route
                </button>
              )}
            </div>
            {!sacco ? (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
                No sacco found. Please create a sacco first.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {routes.map((route) => (
                  <div key={route.id} className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800">
                      <span className="text-red-900">{route.start}</span>
                      <span className="mx-2 text-gray-400">→</span>
                      <span className="text-red-900">{route.end}</span>
                    </h3>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Matatus */}
        {activeSection === "matatus" && (
          <div>
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800">Matatus</h1>
              {sacco && (
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowMatatuModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-red-900 text-white rounded-lg hover:bg-red-950 transition font-semibold"
                  >
                    <FaPlus /> Add Matatu
                  </button>
                  <button
                    onClick={() => setShowLinkModal(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition font-semibold"
                  >
                    <FaPlus /> Link to Route
                  </button>
                </div>
              )}
            </div>
            {!sacco ? (
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
                No sacco found. Please create a sacco first.
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {matatus.map((matatu) => (
                  <div key={matatu.id} className="bg-white p-6 rounded-2xl shadow-lg">
                    <h3 className="text-2xl font-bold text-red-900 mb-2">{matatu.plate_number}</h3>
                    <p className="text-gray-600"><strong>Capacity:</strong> {matatu.capacity} passengers</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Create Sacco Modal */}
      {showSaccoModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Create Sacco</h2>
            <form onSubmit={handleCreateSacco} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Sacco Name</label>
                <input
                  type="text"
                  value={saccoForm.name}
                  onChange={(e) => setSaccoForm({ ...saccoForm, name: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Registration Number</label>
                <input
                  type="text"
                  value={saccoForm.reg_number}
                  onChange={(e) => setSaccoForm({ ...saccoForm, reg_number: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowSaccoModal(false)} className="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition font-semibold">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-950 transition font-semibold">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Route Modal */}
      {showRouteModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Route</h2>
            <form onSubmit={handleAddRoute} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Start Location</label>
                <input
                  type="text"
                  value={routeForm.start}
                  onChange={(e) => setRouteForm({ ...routeForm, start: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">End Location</label>
                <input
                  type="text"
                  value={routeForm.end}
                  onChange={(e) => setRouteForm({ ...routeForm, end: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowRouteModal(false)} className="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition font-semibold">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-950 transition font-semibold">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Matatu Modal */}
      {showMatatuModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Matatu</h2>
            <form onSubmit={handleAddMatatu} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Plate Number</label>
                <input
                  type="text"
                  value={matatuForm.plate_number}
                  onChange={(e) => setMatatuForm({ ...matatuForm, plate_number: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Capacity</label>
                <input
                  type="number"
                  value={matatuForm.capacity}
                  onChange={(e) => setMatatuForm({ ...matatuForm, capacity: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowMatatuModal(false)} className="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition font-semibold">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-950 transition font-semibold">
                  Add
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Link Matatu to Route Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Link Matatu to Route</h2>
            <form onSubmit={handleLinkMatatuRoute} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Select Matatu</label>
                <select
                  value={linkForm.matatu_id}
                  onChange={(e) => setLinkForm({ ...linkForm, matatu_id: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900"
                >
                  <option value="">-- Select Matatu --</option>
                  {matatus.map(matatu => (
                    <option key={matatu.id} value={matatu.id}>{matatu.plate_number}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Select Route</label>
                <select
                  value={linkForm.route_id}
                  onChange={(e) => setLinkForm({ ...linkForm, route_id: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900"
                >
                  <option value="">-- Select Route --</option>
                  {routes.map(route => (
                    <option key={route.id} value={route.id}>{route.start} → {route.end}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">Fare (KES)</label>
                <input
                  type="number"
                  value={linkForm.fare}
                  onChange={(e) => setLinkForm({ ...linkForm, fare: e.target.value })}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-900"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowLinkModal(false)} className="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition font-semibold">
                  Cancel
                </button>
                <button type="submit" className="flex-1 px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-950 transition font-semibold">
                  Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
