import React from "react";
import { useNavigate } from "react-router-dom";

const AdminPanel = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white p-5 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/admin-panel")}
            className="text-left hover:bg-gray-700 p-2 rounded"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/admin-panel/users")}
            className="text-left hover:bg-gray-700 p-2 rounded"
          >
            Manage Users
          </button>
          <button
            onClick={() => navigate("/admin-panel/campaigns")}
            className="text-left hover:bg-gray-700 p-2 rounded"
          >
            Manage Campaigns
          </button>
          <button
            onClick={() => navigate("/admin-panel/orders")}
            className="text-left hover:bg-gray-700 p-2 rounded"
          >
            Manage Orders
          </button>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-auto bg-red-600 hover:bg-red-700 py-2 px-4 rounded"
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-100">
        <h1 className="text-3xl font-bold mb-4">Welcome, {username} 👋</h1>
        <p className="text-gray-700">
          This is your custom admin dashboard. From here you can manage users,
          campaigns, and orders.
        </p>
      </main>
    </div>
  );
};

export default AdminPanel;
