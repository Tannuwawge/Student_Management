 
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./context/UserProvider"; // make sure this exists
export default function Navbar() {
    const navigate = useNavigate();
      const { logout, email: userEmail, theme, toggleTheme} = useUser(); 
        const [showDropdown, setShowDropdown] = useState(false);
         useEffect(() => {
            const handleClickOutside = (e) => {
              if (!e.target.closest(".relative")) {
                setShowDropdown(false);
              }
            };
            document.addEventListener("click", handleClickOutside);
            return () => {
              document.removeEventListener("click", handleClickOutside);
            };
          }, []);
           const handleLogout = () => {
    logout(); // clear user data from context
    navigate("/login"); // redirect to login
  };
const handleThemeToggle = () => {
    toggleTheme(); // toggle theme in context
  };
  
  const bgGradient = theme === "dark" 
    ? "from-gray-900 via-gray-800 to-gray-900" 
    : "from-slate-50 via-blue-50 to-indigo-100";
    
  const navbarBg = theme === "dark" 
    ? "bg-gray-800/80 border-gray-700" 
    : "bg-white/80 border-white/20";
    
  const textColor = theme === "dark" ? "text-gray-100" : "text-gray-800";
  const secondaryTextColor = theme === "dark" ? "text-gray-300" : "text-gray-600";
  const cardBg = theme === "dark" ? "bg-gray-700/60 border-gray-600" : "bg-white/60 border-white/20";
  return (
 <>
       <div className={`backdrop-blur-md ${navbarBg} border-b shadow-sm`}>
  <div className="flex justify-between items-center px-6 py-4">
    {/* Left Side - Logo and Title */}
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-lg">D</span>
      </div>
      <h1 className={`text-2xl font-bold bg-gradient-to-r ${theme === "dark" ? "from-gray-100 to-gray-300" : "from-gray-800 to-gray-600"} bg-clip-text text-transparent`}>
        Dashboard
      </h1>
    </div>

      {/* Center: Conditionally show heading for /dashboard/interview */}
      {location.pathname === "/dashboard/interview" && (
  <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
    <h1 className="text-xl md:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-transparent bg-clip-text leading-tight">
      DSA (Chedo Sheets)
    </h1>
  </div>
)}


    {/* Right Side - Dropdown */}
    <div className="relative">
      <button
        onClick={() => setShowDropdown(prev => !prev)}
        className={`flex items-center space-x-2 px-4 py-2 ${theme === "dark" ? "bg-gray-700/50" : "bg-white/50"} rounded-full shadow-sm transition`}
      >
        <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
          <span className="text-white text-sm font-medium">
            {userEmail ? userEmail.charAt(0).toUpperCase() : "U"}
          </span>
        </div>
        <span className={`${theme === "dark" ? "text-gray-200" : "text-gray-700"} font-medium`}>
          {userEmail}
        </span>
        <svg
          className="w-4 h-4 text-gray-500"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      <div className="absolute right-0 mt-2 w-48 bg-gray-800 text-white rounded-lg shadow-lg z-50">
      {showDropdown && (
  <div className={`absolute right-0 mt-2 w-48 rounded-xl shadow-xl z-50 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
    
    {/* Theme toggle */}
    <button
      onClick={toggleTheme}
      className={`w-full text-left px-4 py-2 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}
    >
      {theme === "dark" ? "Light Mode" : " Dark Mode"}
    </button>
  
    {/* Change Password */}
    <button
      onClick={() => navigate("/dashboard/changepassword")}
      className={`w-full text-left px-4 py-2 ${theme === "dark" ? "text-gray-200" : "text-gray-800"}`}
    >
       Change Password
    </button>

    {/* Logout */}
    <button
      onClick={handleLogout}
      className={`w-full text-left px-4 py-2 rounded-b-xl font-medium ${
        theme === "dark" ? "text-red-400" : "text-red-600"
      }`}
    >
      Logout
    </button>

  </div>
)}  
</div>

  

    </div>
  </div>
</div>
 </>
  )
}
