import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  FaUsers, 
  FaBullhorn, 
  FaTags, 
  FaHeart, 
  FaUsersCog, 
  FaEnvelope, 
  FaBars, 
  FaTimes, 
  FaSignOutAlt 
} from 'react-icons/fa';

const AdminPanel = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const username = localStorage.getItem('username') || 'Admin';

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setDrawerOpen(false);
      else setDrawerOpen(true);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // Close drawer on tablet/mobile only
  const handleDrawerItemClick = () => {
    if (window.innerWidth < 1024) setDrawerOpen(false);
  };

  const menuItems = [
    { path: 'users', label: 'All Users', icon: <FaUsers /> },
    { path: 'campaigns', label: 'Donation Campaigns', icon: <FaBullhorn /> },
    { path: 'categories', label: 'Donation Categories', icon: <FaTags /> },
    { path: 'alldonations', label: 'All Donations', icon: <FaHeart /> },
    { path: 'teams', label: 'Teams', icon: <FaUsersCog /> },
    { path: 'contacts', label: 'Contacts', icon: <FaEnvelope /> },
  ];

  return (
    <div className="flex min-h-screen bg-black">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-30 h-16 flex items-center justify-between px-4 transition-all duration-300"
        style={{ backgroundColor: '#F74F22', boxShadow: '0 4px 20px rgba(247, 79, 34, 0.3)' }}>
        <div className="flex items-center">
          <button
            onClick={handleDrawerToggle}
            className="text-white p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200 mr-2 lg:mr-3 flex items-center justify-center">
            {drawerOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
          <h1 className="text-white text-lg lg:text-xl font-bold">Admin Panel</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-200 text-white font-semibold">
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>

      {/* Drawer */}
      <div className={`fixed left-0 top-16 bottom-0 z-20 w-72 transition-transform duration-300 ease-in-out ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ background: 'linear-gradient(180deg, #F74F22 0%, #d63c14 100%)' }}>
        <div className="p-6 border-b border-white border-opacity-20">
          <h3 className="text-white text-lg font-bold">Welcome, {username}</h3>
          <p className="text-white text-sm opacity-80 mt-1">Manage your dashboard</p>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                  isActive ? 'bg-white bg-opacity-20 text-white font-semibold' : 'text-white hover:bg-white hover:bg-opacity-10'
                }`
              }
              onClick={handleDrawerItemClick} // <- use helper function
            >
              <span className="text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className={`flex-1 pt-16 transition-all duration-300 min-h-screen ${drawerOpen ? 'ml-72' : 'ml-0'}`}
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)' }}>
        <Outlet /> {/* renders the child route from App.jsx */}
      </div>

      {/* Overlay for mobile */}
      {drawerOpen && window.innerWidth < 1024 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden" onClick={handleDrawerToggle} />
      )}
    </div>
  );
};

export default AdminPanel;
