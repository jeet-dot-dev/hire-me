"use client";
import Lottie from "lottie-react";
import resumeLoader from "../../src/animations/resumeLoader.json";

export default function ResumeLoader({msg}:{msg:string[]}) {
  return (
    <div className="fixed inset-0 w-screen h-screen bg-black flex flex-col items-center justify-center p-6 z-50">
      <div className="bg-black backdrop-blur-lg rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-6">
        <Lottie
          animationData={resumeLoader}
          loop
          style={{ width: 500, height: 500 }}
        />
        <p className="text-lg md:text-xl font-medium text-center text-white">
          <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent animate-pulse">
            {msg[0]}
          </span>
        </p>
        <p className="text-sm text-gray-400 text-center">
         {msg[1]}
        </p>
      </div>
    </div>
  );
}
