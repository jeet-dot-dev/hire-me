
import Image from "next/image";
import React from "react";
import { Badge } from "../ui/badge";

const Tablet = () => {
  return (
    <div className="relative bg-black w-full flex items-center flex-col justify-center py-20 overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-[#94725d]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#b8956d]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-80 h-80 bg-[#765d52]/5 rounded-full blur-3xl animate-pulse delay-500"></div>

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
        {/* Header Section */}
        <div className="text-center mb-16">
          <Badge className="px-5 py-3 rounded-3xl font-bold mb-6">
            <span className="w-3 h-3 rounded-full bg-[#94725d] mr-2 animate-pulse"></span>
            Platform Preview
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Experience the <span className="text-[#896a59]">Future</span> of Hiring
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto mb-8">
            Our intuitive dashboard brings AI-powered recruitment to your fingertips, 
            making hiring decisions faster and more accurate than ever before.
          </p>
        </div>

        {/* Main Tablet Display */}
        <div className="relative flex justify-center">
          {/* Glow Effect Behind Tablet */}
          <div className="absolute inset-0 flex justify-center items-center">
            <div className="w-[920px] h-[420px] bg-gradient-to-r from-[#94725d]/20 via-[#896a59]/30 to-[#765d52]/20 rounded-3xl blur-2xl"></div>
          </div>
          
          {/* Tablet Container with Glass Effect */}
          <div className="relative bg-black/20 backdrop-blur-sm rounded-3xl p-6 border border-gray-700/30 shadow-2xl">
            {/* Floating Elements Around Tablet */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-[#94725d] rounded-full animate-bounce delay-300"></div>
            <div className="absolute -top-6 -right-6 w-6 h-6 bg-[#896a59] rounded-full animate-bounce delay-700"></div>
            <div className="absolute -bottom-4 -left-6 w-10 h-10 bg-[#765d52] rounded-full animate-bounce delay-1000"></div>
            <div className="absolute -bottom-6 -right-4 w-4 h-4 bg-[#b8956d] rounded-full animate-bounce delay-500"></div>
            
            {/* Main Tablet Image */}
            <div className="relative group">
              <Image
                src="/assets/tablet.png"
                alt="AI Recruitment Platform Dashboard"
                width={900}
                height={400}
                className="rounded-2xl transition-transform duration-500 group-hover:scale-105 shadow-2xl"
                style={{ objectFit: "cover" }}
              />
              
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              {/* Floating Action Buttons */}
              <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
                <div className="flex gap-2">
                  <div className="px-4 py-2 cursor-pointer bg-[#94725d] text-white text-sm rounded-full font-medium shadow-lg">
                    Start AI Interviews
                  </div>
                  <div className="px-4 py-2 cursor-pointer bg-[#896a59] text-white text-sm rounded-full font-medium shadow-lg">
                    Start Job Posting
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

       
       
      </div>
    </div>
  );
};

export default Tablet;
