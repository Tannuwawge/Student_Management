import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Cards from './cards';
import { useUser } from './context/UserProvider';

export default function Dashboard() {
  const location = useLocation();
  const isMainDashboard = location.pathname === '/dashboard';

  // Sidebar state for hover and lock
// ✅ pull from context instead
const {
  sidebarOpen,
  setSidebarOpen,
  sidebarLocked,
  setSidebarLocked,
} = useUser();


  const handleSidebarHover = (entering) => {
    if (!sidebarLocked) {
      setSidebarOpen(entering);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* --- Navbar (always at the top) --- */}
      <Navbar />

      {/* --- Sidebar + Main Content --- */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div
          className={`transition-all duration-300 bg-gray-800 text-white ${
            sidebarOpen || sidebarLocked ? 'w-64' : 'w-16'
          }`}
          onMouseEnter={() => handleSidebarHover(true)}
          onMouseLeave={() => handleSidebarHover(false)}
        >
          <Sidebar
            sidebarLocked={sidebarLocked}
            setSidebarLocked={setSidebarLocked}
          />
        </div>

        {/* Main body (cards or routed pages) */}
        <div className="flex-1 overflow-y-auto p-4">
          {isMainDashboard ? <Cards /> : <Outlet />}
        </div>
      </div>

      
    </div>
  );
}
