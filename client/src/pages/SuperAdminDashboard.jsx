import React, { useEffect, useState } from "react";
import { FaUsers, FaBuilding, FaChartBar, FaCog } from "react-icons/fa";
import { API_BASE_URL } from "../config";

export default function SuperAdminDashboard() {
  const [activeSection, setActiveSection] = useState("overview");
  const [saccos, setSaccos] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE_URL}/saccos`).then(res => res.json()),
      Promise.resolve([
        { id: 1, name: "John Doe", email: "john@example.com", role: "user" },
        { id: 2, name: "Jane Smith", email: "jane@example.com", role: "admin" },
        { id: 3, name: "Bob Wilson", email: "bob@example.com", role: "user" }
      ])
    ])
      .then(([saccosData, usersData]) => {
        setSaccos(saccosData);
        setUsers(usersData);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const upgradeToAdmin = (userId) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: "admin" } : u));
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
                      {users.filter(u => u.role === 'admin').length}
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
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-semibold">{user.name}</td>
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
                            onClick={() => upgradeToAdmin(user.id)}
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
    </div>
  );
}
