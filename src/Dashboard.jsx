import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./context/UserProvider"; // make sure this exists

const Dashboard = () => {
  const navigate = useNavigate();
  const { logout, email: userEmail, theme, toggleTheme, role } = useUser(); // now including toggleTheme
  const [showDropdown, setShowDropdown] = useState(false);
  const { currentUserDetails } = useUser();
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
  
 


  useEffect(() => {
    // Fetch user role from backend if needed
    const fetchRole = async () => {
      try {
        // Simulate API call or use actual logic
        setRole("admin");
      } catch (err) {
        console.error("Error fetching role:", err);
      }
    };
    fetchRole();
  }, [userEmail]);

  const handleLogout = () => {
    logout(); // clear user data from context
    navigate("/login"); // redirect to login
  };

 
  const cardData = [
    {
      id: "details",
      icon: "📋",
      title: "Personal Info",
      description: currentUserDetails
        ? `Hi ${currentUserDetails.name}, you're a ${currentUserDetails.Role}`
        : "Loading your personal info...",
      color: "from-white to-gray-100", // 🌤️ Soft neutral for light mode
      darkColor: "from-gray-200 to-gray-300", // 🕶️ Light gray in dark theme
      size: "large",
      link: "/dashboard/updatedetails",
      visible: !!currentUserDetails,
      userInfo: currentUserDetails,
    }
    
    ,
    {
      id: "crud",
      icon: "⚙️",
      title: "CRUD Students",
      description: "Manage student records efficiently",
      color: "from-orange-500 to-red-600",
      darkColor: "from-orange-600 to-red-700",
      size: "medium",
      link: "/dashboard/students",
      visible:
        currentUserDetails?.Role === "admin" ||
        currentUserDetails?.Role === "superadmin",
    },
    {
      id: "reports",
      icon: "📈",
      title: "Reports",
      description: "Analyze student data and  reports",
      color: "from-indigo-500 to-fuchsia-600",
      darkColor: "from-indigo-600 to-fuchsia-700",
      size: "medium",
      link: "/dashboard/reports",
      visible:
        currentUserDetails?.Role === "admin" ||
        currentUserDetails?.Role === "superadmin",
      width: 266,
    },
    {
      id: "enrollments",
      icon: "📚",
      title: "Manage Enrollments",
      description: "Handle course assignments",
      color: "from-cyan-500 to-blue-600",
      darkColor: "from-cyan-600 to-blue-700",
      size: "small",
      link: "/dashboard/enrollments",
      visible:
        currentUserDetails?.Role === "admin" ||
        currentUserDetails?.Role === "superadmin",
    },
    {
      id: "roles",
      icon: "👑",
      title: "Manage Roles",
      description: "Grant or revoke permissions",
      color: "from-purple-600 to-pink-600",
      darkColor: "from-purple-700 to-pink-700",
      size: "large",
      link: "/dashboard/superadmin",
      visible: currentUserDetails?.Role === "superadmin",
    },
    {
      id: "notes",
      icon: "📝",
      title: "Study Notes",
      description: "Access curated notes and study materials",
      color: "from-yellow-400 to-yellow-600",
      darkColor: "from-yellow-500 to-yellow-700",
      size: "medium",
      link: "https://w3chedo.web.app/note-web-view", // External site
      visible: currentUserDetails?.Role === "student", // ✅ Only students
    },
    {
      id: "mcq",
      icon: "🧠",
      title: "MCQ Quiz",
      description: "Practice and test your knowledge",
      color: "from-emerald-500 to-lime-600",
      darkColor: "from-emerald-600 to-lime-700",
      size: "medium",
      link: "/dashboard/mcq", // ← make sure this route leads to quiz page
      visible: currentUserDetails?.Role === "student",
    },
    {
      id: "mynotes",
      icon: "📓",
      title: "My Notes",
      description: "Your saved study notes and materials",
      color: "from-sky-500 to-blue-600",
      darkColor: "from-sky-600 to-blue-700",
      size: "medium",
      link: "/dashboard/mynotes", // ✅ update to your notes page route
      visible: currentUserDetails?.Role === "student",
    },
    {
      id: "receipts",
      icon: "🧾",
      title: "My Receipts",
      description: "View your payment history and receipts",
      color: "from-rose-500 to-pink-600",
      darkColor: "from-rose-600 to-pink-700",
      size: "medium",
      link: "/dashboard/receipts", // ✅ point to your receipts page
      visible: currentUserDetails?.Role === "student",
    },
    
    {
      id: "complaints",
      icon: "📣",
      title: "Complaints",
      description: "View and manage student complaints",
      color: "from-rose-500 to-pink-600",
      darkColor: "from-rose-600 to-pink-700",
      size: "medium",
      link: "/dashboard/complaints",
      visible:
        currentUserDetails?.Role === "admin" ||
        currentUserDetails?.Role === "superadmin"||
        currentUserDetails?.Role === "student",
    },
    {
      id: "interview",
      icon: "🎯",
      title: "Interview Prep",
      description: "Practice DSA, puzzles & HR questions",
      color: "from-blue-500 to-indigo-600",
      darkColor: "from-blue-600 to-indigo-700",
      size: "medium",
      link: "/dashboard/interview", // 🔗 point to your interview prep page
      visible:
        currentUserDetails?.Role === "student" ||
        currentUserDetails?.Role === "admin" ||
        currentUserDetails?.Role === "superadmin", // 🎓 Everyone benefits from prep!
    },
    
            
  ];
  
  

  const visibleCards = cardData.filter((card) => card.visible);

  const getCardClasses = (size) => {
    const baseClasses =
      "group relative overflow-hidden rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer";
    switch (size) {
      case "large":
        return `${baseClasses} col-span-2 row-span-2 min-h-[280px]`;
      case "medium":
        return `${baseClasses} col-span-1 row-span-2 min-h-[240px]`;
      case "small":
        return `${baseClasses} col-span-1 row-span-1 min-h-[140px]`;
      default:
        return `${baseClasses} col-span-1 row-span-1 min-h-[160px]`;
    }
  };

  const handleCardClick = (card) => {
    if (card.link) {
      navigate(card.link); // actually navigate now
    } else {
      console.log(`Clicked: ${card.title}`);
    }
  };

  // Theme-based styles
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
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient}`}>
      {/* Navbar */}
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




      {/* Body */}
      <div className="px-6 py-8">
        <div className="mb-8">
          <h2 className={`text-3xl font-bold ${textColor} mb-2`}>Welcome back!</h2>
   
        </div>

     

        {/* Stats */}
        <div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
  {/* Current Role */}
  <div className={`${cardBg} backdrop-blur-md rounded-2xl p-6 border transition-all duration-300`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={`${secondaryTextColor} text-sm font-medium`}>Current Role</p>
        <p className={`text-2xl font-bold ${textColor} capitalize`}>
          {role || "User"}
        </p>
      </div>
      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
        <span className="text-white text-xl">🎯</span>
      </div>
    </div>
  </div>

  {/* Total Users */}
  <div className={`${cardBg} backdrop-blur-md rounded-2xl p-6 border transition-all duration-300`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={`${secondaryTextColor} text-sm font-medium`}>Total Users</p>
        <p className={`text-2xl font-bold ${textColor}`}>4</p>
      </div>
      <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
        <span className="text-white text-xl">👥</span>
      </div>
    </div>
  </div>

  {/* Active Sessions */}
  <div className={`${cardBg} backdrop-blur-md rounded-2xl p-6 border transition-all duration-300`}>
    <div className="flex items-center justify-between">
      <div>
        <p className={`${secondaryTextColor} text-sm font-medium`}>Active Sessions</p>
        <p className={`text-2xl font-bold ${textColor}`}>1</p>
      </div>
      <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center">
        <span className="text-white text-xl">📊</span>
      </div>
    </div>
  </div>
</div>

           {/* heading for grid */}
           <p className={secondaryTextColor}>Here's what you can do today</p>
           {/* grid */}
           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-min max-w-7xl mx-auto">
  {visibleCards.map((card) => (
  <div
  onClick={() => {
    if (card.link.startsWith("http")) {
      window.open(card.link, "_blank"); // 🔗 Open external links in new tab
    } else {
      navigate(card.link); // 🔁 Internal routing
    }
  }}
  className={getCardClasses(card.size)}
>

      {/* Backgrounds and effects */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${
          theme === "dark" ? card.darkColor : card.color

        } opacity-90`}
      ></div>

      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div
          className="absolute bottom-0 -right-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      {/* 🧠 Content Area */}
      {card.id === "details" ? (
     <div className="relative z-10 p-6 h-full flex flex-col justify-between text-gray-900">
     {card.userInfo ? (
       <>
         {/* Personal Details */}
         <div className="space-y-3">
           <h3 className="text-xl font-bold text-indigo-800 flex items-center gap-2">
             👋 Hello, <span>{card.userInfo.name}</span>
           </h3>
           <div className="text-sm">
             <span className="block text-gray-600 font-medium">📧 Email:</span>
             <span className="block text-gray-800 font-bold">
               {card.userInfo.email}
             </span>
           </div>
           <div className="text-sm">
             <span className="block text-gray-600 font-medium">🧩 Role:</span>
             <span className="block text-gray-800 font-bold capitalize">
               {card.userInfo.Role}
             </span>
           </div>
         </div>
 
         {/* Button */}
         <div className="mt-4 flex justify-end">
           <button
             className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition duration-300"
             onClick={(e) => {
               e.stopPropagation();
               handleCardClick(card);
             }}
           >
             View Full Info
             <svg
               className="w-4 h-4 ml-2"
               fill="none"
               stroke="currentColor"
               viewBox="0 0 24 24"
             >
               <path
                 strokeLinecap="round"
                 strokeLinejoin="round"
                 strokeWidth={2}
                 d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
               />
             </svg>
           </button>
         </div>
 
         {/* Badge */}
         <div className="absolute top-4 right-4 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold shadow-sm">
           You
         </div>
       </>
     ) : (
       <p className="text-gray-600 animate-pulse">Loading your info...</p>
     )}
   </div>
      ) : (
        <div className="relative z-10 p-6 h-full flex flex-col justify-between text-white">
          <div>
            <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
              {card.icon}
            </div>
            <h3 className="text-xl font-bold mb-2 group-hover:text-yellow-200 transition-colors duration-300">
              {card.title}
            </h3>
            <p className="text-white/80 text-sm leading-relaxed">
              {card.description}
            </p>
          </div>

          <div className="mt-4">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-white font-medium hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
              {card.link ? "Get Started" : "Open"}
              <svg
                className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </div>
          </div>

          {(card.id === "crud" || card.id === "enrollments") && (
            <div className="absolute top-4 right-4 px-2 py-1 bg-yellow-400/20 backdrop-blur-md rounded-full text-xs font-medium text-yellow-100">
              Admin
            </div>
          )}
          {card.id === "roles" && (
            <div className="absolute top-4 right-4 px-2 py-1 bg-pink-400/20 backdrop-blur-md rounded-full text-xs font-medium text-pink-100">
              Super Admin
            </div>
          )}
        </div>
      )}

      {/* Hover overlay */}
      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
  ))}
</div>


        {/* Help Section */}
        <div className="mt-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-2xl font-bold mb-2">Need help getting started?</h3>
              <p className="text-white/80">
                Check out our comprehensive guide to make the most of your dashboard
              </p>
            </div>
            <button className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-full font-medium hover:bg-white/30 transition-all duration-300 transform hover:scale-105">
              View Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;