// app/loading.tsx
"use client";

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center relative"
         style={{
           background: "linear-gradient(135deg, rgba(0, 0, 0, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%)"
         }}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full opacity-10 animate-pulse"
             style={{
               background: "radial-gradient(circle, rgba(137, 106, 89, 0.3) 0%, transparent 70%)",
               top: "20%",
               left: "10%",
               animationDuration: "4s"
             }}></div>
        <div className="absolute w-72 h-72 rounded-full opacity-10 animate-pulse"
             style={{
               background: "radial-gradient(circle, rgba(118, 93, 82, 0.3) 0%, transparent 70%)",
               bottom: "20%",
               right: "15%",
               animationDuration: "3s",
               animationDelay: "1s"
             }}></div>
      </div>

      {/* Main loader container */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        {/* Logo or brand text */}
        <div className="text-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
            Hire<span style={{ color: "#896a59" }}>Me</span>
          </h1>
          <p className="text-gray-400 text-sm">Loading your experience...</p>
        </div>

        {/* Animated loader */}
        <div className="relative">
          {/* Outer ring */}
          <div className="w-20 h-20 rounded-full border-4 border-gray-800 border-t-transparent animate-spin"
               style={{
                 borderTopColor: "#896a59",
                 animationDuration: "1s"
               }}></div>
          
          {/* Inner ring */}
          <div className="absolute inset-2 w-12 h-12 rounded-full border-4 border-gray-700 border-b-transparent animate-spin"
               style={{
                 borderBottomColor: "#8d675a",
                 animationDuration: "1.5s",
                 animationDirection: "reverse"
               }}></div>
          
          {/* Center dot */}
          <div className="absolute inset-6 w-8 h-8 rounded-full animate-pulse"
               style={{
                 background: "linear-gradient(135deg, #896a59 0%, #8d675a 100%)",
                 animationDuration: "2s"
               }}></div>
        </div>

        {/* Loading dots */}
        <div className="flex space-x-2">
          <div className="w-2 h-2 rounded-full animate-bounce"
               style={{
                 backgroundColor: "#896a59",
                 animationDelay: "0s",
                 animationDuration: "1.4s"
               }}></div>
          <div className="w-2 h-2 rounded-full animate-bounce"
               style={{
                 backgroundColor: "#8d675a",
                 animationDelay: "0.2s",
                 animationDuration: "1.4s"
               }}></div>
          <div className="w-2 h-2 rounded-full animate-bounce"
               style={{
                 backgroundColor: "#765d52",
                 animationDelay: "0.4s",
                 animationDuration: "1.4s"
               }}></div>
        </div>
      </div>
    </div>
  );
}
