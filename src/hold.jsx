{/* <div className="border ">
<div className="mb-8">
  <h2 className={`text-3xl font-bold ${textColor} mb-2`}>Welcome  back! </h2>

</div>



{/* Stats */}
<div className="mb-12 grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-6">

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
<p className={`${secondaryTextColor} text-sm font-medium`}>Total  Users</p>
<p className={`text-2xl font-bold ${textColor}`}>4</p>
</div>
<div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
<span className="text-white text-xl">👥</span>
</div>
</div>
</div>

{/* Active Sesbodysions */}
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
   <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-min px-3">

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
<div className="mt-12 px-3">
<div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-white w-full">
<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
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

</div> */}