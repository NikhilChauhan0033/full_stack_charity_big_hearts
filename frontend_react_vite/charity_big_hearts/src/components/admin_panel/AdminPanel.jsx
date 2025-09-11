import React, { useState, useEffect } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  FaUsers, FaBullhorn, FaTags, FaHeart, 
  FaUsersCog, FaEnvelope, FaBars, FaTimes, FaSignOutAlt 
} from 'react-icons/fa';
import ToastMessage from '../toastmessage/ToastMessage'; // ✅ import your custom toast

const AdminPanel = () => {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const username = localStorage.getItem('username') || 'Admin';

  // ✅ Toast state
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('');

  // Auto-hide toast
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage('');
        setToastType('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const showToast = (message, type) => {
    setToastMessage(message);
    setToastType(type);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      setDrawerOpen(!mobile);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDrawerToggle = () => setDrawerOpen(!drawerOpen);

  // ✅ Updated logout to show toast
  const handleLogout = () => {
    showToast('Logged out successfully', 'success');

    setTimeout(() => {
      localStorage.clear();
      window.location.href = '/login';
    }, 1000); // wait 1s to show toast
  };

  const handleDrawerItemClick = () => {
    if (isMobile) setDrawerOpen(false);
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
    <div className="flex h-screen overflow-hidden bg-black">
      {/* ✅ Toast */}
      <ToastMessage message={toastMessage} type={toastType} />

      {/* Header */}
      <div 
        className="fixed top-0 left-0 right-0 z-30 h-14 sm:h-16 flex items-center justify-between px-3 sm:px-4"
        style={{ backgroundColor: '#F74F22'}}
      >
        <div className="flex items-center">
          <button
            onClick={handleDrawerToggle}
            className="text-white p-1.5 sm:p-2 rounded-lg hover:bg-white hover:bg-opacity-20 transition-all duration-200 mr-2 flex items-center justify-center"
          >
            {drawerOpen ? <FaTimes size={isMobile ? 20 : 24} /> : <FaBars size={isMobile ? 20 : 24} />}
          </button>
          <h1 className="text-white text-base sm:text-lg lg:text-xl font-bold">Admin Panel</h1>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center space-x-1 sm:space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all duration-200 text-white font-semibold text-sm sm:text-base"
        >
          <FaSignOutAlt size={isMobile ? 14 : 16} />
          <span>Logout</span>
        </button>
      </div>

      {/* Drawer */}
      <div 
        className={`fixed left-0 z-20 transition-transform duration-300 ease-in-out ${
          isMobile 
            ? `top-14 bottom-0 w-64 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`
            : `top-16 bottom-0 w-72 ${drawerOpen ? 'translate-x-0' : '-translate-x-full'}`
        }`}
        style={{ background: 'linear-gradient(180deg, #F74F22 0%, #d63c14 100%)' }}
      >
        <div className="p-4 sm:p-6 border-b border-white border-opacity-20">
          <h3 className="text-white text-base sm:text-lg font-bold">Welcome, {username}</h3>
          <p className="text-white text-xs sm:text-sm opacity-80 mt-1">Manage your dashboard</p>
        </div>

        <nav className="p-3 sm:p-4 space-y-1 sm:space-y-2 overflow-y-auto">
          {menuItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-left transition-all duration-200 text-sm sm:text-base ${
                  isActive 
                    ? 'bg-white bg-opacity-20 text-white font-semibold' 
                    : 'text-white hover:bg-white hover:bg-opacity-10'
                }`
              }
              onClick={handleDrawerItemClick}
            >
              <span className="text-lg sm:text-xl flex-shrink-0">{item.icon}</span>
              <span className="truncate">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ${
          !isMobile && drawerOpen ? 'ml-72' : 'ml-0'
        }`}
        style={{ 
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
          marginTop: isMobile ? '56px' : '64px',
          height: isMobile ? 'calc(100vh - 56px)' : 'calc(100vh - 64px)'
        }}
      >
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>

      {/* Mobile Overlay */}
      {drawerOpen && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10"
          style={{ top: '56px' }}
          onClick={handleDrawerToggle} 
        />
      )}
    </div>
  );
};

export default AdminPanel;
