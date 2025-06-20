import React from 'react';
import { useUser } from './context/UserProvider';

export default function Sidebar() {
  const { sidebarLocked, setSidebarLocked } = useUser();

  return (
    <div className="h-full flex flex-col justify-between p-4 relative">
      {/* Top content */}
      <div>
        <div className="flex items-center mb-4">
          <span className="text-lg">📂</span>
        </div>

        {/* Sidebar menu here */}
        
      </div>

      {/* Lock / Unlock Button – Always visible at bottom */}
      <div className="flex justify-center">
        <button
          onClick={() => setSidebarLocked(!sidebarLocked)}
          className="text-xs bg-white/10 text-white px-3 py-2 rounded-full hover:bg-white/20 transition-all duration-300"
        >
          {sidebarLocked ? '🔓 Unlock' : '🔒 Lock'}
        </button>
      </div>
    </div>
  );
}
