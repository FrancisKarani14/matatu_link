import React, { useState, useEffect } from "react";
import { FaUsers, FaBuilding, FaChartBar, FaCog, FaSignOutAlt } from "react-icons/fa";
import { API_BASE_URL } from "../config";
import { useNavigate } from "react-router-dom";

export default function SuperAdminDashboard() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("overview");
  const [saccos, setSaccos] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token:", token);
    if (!token) {
      setLoading(false);
      return;
    }
    
    Promise.all([
      fetch(`${API_BASE_URL}/saccos`, {
        headers: { "Authorization": `Bearer ${token}` }
      }),
      fetch(`${API_BASE_URL}/users`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
    ])
      .then(async ([saccosRes, usersRes]) => {
        console.log("Saccos response:", saccosRes.status);
        console.log("Users response:", usersRes.status);
        const saccosData = saccosRes.ok ? await saccosRes.json() : [];
        const usersData = usersRes.ok ? await usersRes.json() : [];
        console.log("Users data:", usersData);
        setSaccos(Array.isArray(saccosData) ? saccosData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setSaccos([]);
        setUsers([]);
        setLoading(false);
      });
  }, []);

  const upgradeToAdmin = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ role: "admin" })
      });
      
      if (response.ok) {
        const data = await response.json();
        setUsers(users.map(u => u.id === userId ? data.user : u));
        setShowUpgradeModal(false);
        setSelectedUser(null);
      }
    } catch (err) {
      console.error("Failed to upgrade user:", err);
    }
  };

  const handleUpgradeClick = (user) => {
    setSelectedUser(user);
    setShowUpgradeModal(true);
  };

  const menuItems = [
    { id: "overview", label: "Overview", icon: FaChartBar },
    { id: "saccos", label: "Saccos", icon: FaBuilding },
    { id: "users", label: "Users", icon: FaUsers },
    { id: "settings", label: "Settings", icon: FaCog }
  ];

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-red-900 text-white flex flex-col">
        <div className="p-6 border-b border-red-800">
          <h2 className="text-2xl font-bold">Super Admin</h2>
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
          <button
            onClick={() => {
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              navigate("/login");
            }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-800 transition"
          >
            <FaSignOutAlt className="text-xl" />
            <span className="font-semibold">Logout</span>
          </button>
        </div>
        <div className="p-4 border-t border-red-800">
          <p className="text-red-200 text-sm">Logged in as</p>
          <p className="font-semibold">{JSON.parse(localStorage.getItem("user") || "{}").email || "admin@matatulink.com"}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Overview */}
        {activeSection === "overview" && (
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard Overview</h1>
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Saccos</p>
                    <p className="text-4xl font-bold text-red-900">{saccos.length}</p>
                  </div>
                  <FaBuilding className="text-5xl text-red-200" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Users</p>
                    <p className="text-4xl font-bold text-red-900">{users.length}</p>
                  </div>
                  <FaUsers className="text-5xl text-red-200" />
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Admins</p>
                    <p className="text-4xl font-bold text-red-900">
                      {users.filter(u => u.role === 'admin' && u.role !== 'super_admin').length}
                    </p>
                  </div>
                  <FaUsers className="text-5xl text-red-200" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Saccos */}
        {activeSection === "saccos" && (
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-8">All Saccos</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {saccos.map((sacco) => (
                <div key={sacco.id} className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition">
                  <h3 className="text-xl font-bold text-red-900 mb-2">{sacco.name}</h3>
                  <p className="text-gray-600">Reg: {sacco.reg_number}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users */}
        {activeSection === "users" && (
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-8">User Management</h1>
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-red-900 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Name</th>
                    <th className="px-6 py-4 text-left">Email</th>
                    <th className="px-6 py-4 text-left">Role</th>
                    <th className="px-6 py-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.filter(u => u.role !== "super_admin").map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold">{user.full_name}</td>
                      <td className="px-6 py-4 text-gray-600">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          user.role === 'admin' ? 'bg-red-100 text-red-900' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleUpgradeClick(user)}
                            className="px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-950 transition text-sm font-semibold"
                          >
                            Upgrade to Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings */}
        {activeSection === "settings" && (
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-8">Settings</h1>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">System Configuration</h3>
              <p className="text-gray-600">Configure system-wide settings here.</p>
            </div>
          </div>
        )}
      </main>

      {/* Upgrade Confirmation Modal */}
      {showUpgradeModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center z-[60]">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Confirm Upgrade</h2>
            <p className="text-gray-700 mb-4">
              You are about to upgrade <strong>{selectedUser.full_name}</strong> to Admin.
            </p>
            <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
              <p className="text-yellow-800 font-semibold mb-2">Consequences:</p>
              <ul className="list-disc list-inside text-yellow-700 text-sm space-y-1">
                <li>User will gain access to Admin Dashboard</li>
                <li>User can create and manage their own Sacco</li>
                <li>User can add/edit/delete Matatus and Routes</li>
                <li>This action cannot be easily reversed</li>
              </ul>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowUpgradeModal(false);
                  setSelectedUser(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={() => upgradeToAdmin(selectedUser.id)}
                className="flex-1 px-4 py-2 bg-red-900 text-white rounded-lg hover:bg-red-950 transition font-semibold"
              >
                Upgrade
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
