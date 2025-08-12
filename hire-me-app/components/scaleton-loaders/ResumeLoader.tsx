"use client";

export default function ResumeLoader() {
  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center p-6">
      {/* Animated Circle Loader */}
      <div className="relative">
        {/* Outer pulse */}
        <div className="absolute w-20 h-20 border-4 border-blue-500 rounded-full animate-ping opacity-40"></div>
        {/* Inner spinner */}
        <div className="w-20 h-20 border-4 border-gray-700 border-t-blue-500 rounded-full animate-spin"></div>
      </div>

      {/* Message */}
      <p className="text-gray-300 mt-6 text-lg font-medium text-center">
        ⏳ It will take a few minutes, please wait...
      </p>
    </div>
  );
}
