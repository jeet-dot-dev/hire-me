"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Badge } from "../ui/badge";
import { ShimmerButton } from "@/src/components/magicui/shimmer-button";
import { useRouter } from "next/navigation";
const heroObj = [
  {
    fact: "500",
    text: "Applications",
  },
  {
    fact: "200",
    text: "Companies",
  },
  {
    fact: "100",
    text: "Interviews",
  },
  {
    fact: "50",
    text: "Countries",
  },
];

const CountingNumber = ({
  targetNumber,
  index,
}: {
  targetNumber: string;
  index: number;
}) => {
  const [currentNumber, setCurrentNumber] = useState(0);

  useEffect(() => {
    const target = parseInt(targetNumber);
    const duration = 2000; // 2 seconds
    const startDelay = index * 200; // Stagger the animations
    const increment = target / (duration / 50);

    const timer = setTimeout(() => {
      let current = 0;
      const counter = setInterval(() => {
        current += increment;
        if (current >= target) {
          setCurrentNumber(target);
          clearInterval(counter);
        } else {
          setCurrentNumber(Math.floor(current));
        }
      }, 50);

      return () => clearInterval(counter);
    }, startDelay);

    return () => clearTimeout(timer);
  }, [targetNumber, index]);

  return currentNumber;
};

const Hero = () => {
  const router = useRouter();
  return (
    <section id="home">
      <div className="w-full min-h-[600px] pt-10 md:pt-0 sm:min-h-[700px] md:min-h-[800px] bg-black relative flex items-center justify-center">
        <Image
          src="/assets/hero2.png"
          alt="Hero Image"
          width={1920}
          height={600}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40"></div>

        {/* Main content container - perfectly centered */}
        <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center min-h-[600px] sm:min-h-[700px] md:min-h-[800px] py-8 sm:py-12">
          <Badge className="px-3 py-2 sm:px-4 sm:py-2 md:px-5 md:py-3 rounded-3xl font-bold mb-4 sm:mb-6 text-xs sm:text-sm">
            <span className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-[#94725d] mr-1 sm:mr-2 animate-pulse"></span>
            <span className="hidden sm:inline">Saas AI Driven Interview</span>
            <span className="sm:hidden">AI Interview</span>
          </Badge>

          <div className="w-full max-w-6xl">
            <h1 className="text-white text-2xl sm:text-3xl md:text-4xl lg:text-6xl xl:text-7xl font-bold mb-3 sm:mb-4 leading-tight drop-shadow-lg px-2">
              The Future of <span style={{ color: "#896a59" }}>Hiring</span> is
              Here
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-medium max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl mx-auto drop-shadow-md mb-6 sm:mb-8 px-2">
              <span className="text-gray-200">
                Transform your recruitment process with{" "}
              </span>
              <span
                style={{ color: "#896a59" }}
                className="font-bold text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl"
              >
                intelligent AI interviews
              </span>
              <span className="text-gray-200">
                {" "}
                and instant candidate insights
              </span>
            </p>

            <div className="mb-8 sm:mb-10 md:mb-12 flex justify-center px-2">
              <ShimmerButton
                onClick={() => router.push("/auth/login")}
                className="shadow-2xl bg-gradient-to-r from-[#8d675a] to-[#896a59] hover:from-[#896a59] hover:to-[#8d675a] transition-all duration-300 w-full max-w-xs sm:w-auto"
              >
                <span className="whitespace-pre-wrap py-2 px-4 sm:px-6 text-center text-sm sm:text-base font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                  Get Started Free
                </span>
              </ShimmerButton>
            </div>

            {/* Stats section - centered */}
            <div className="w-full flex justify-center px-2">
              <div className="bg-black/20 backdrop-blur-sm rounded-xl sm:rounded-2xl p-4 sm:p-6 md:p-8 border border-gray-700/30 w-full max-w-5xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                  {heroObj.map((item, index) => {
                    return (
                      <div
                        key={index}
                        className="relative w-full px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8 rounded-xl sm:rounded-2xl bg-gradient-to-br from-gray-900/90 to-black/90 backdrop-blur-md border border-gray-700/50 flex flex-col justify-center items-center hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-[#765d52]/20"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(30, 30, 30, 0.95) 0%, rgba(10, 10, 10, 0.95) 100%)",
                          backdropFilter: "blur(20px)",
                          border: "1px solid rgba(118, 93, 82, 0.3)",
                          boxShadow:
                            "0 8px 32px 0 rgba(0, 0, 0, 0.37), 0 0 20px rgba(118, 93, 82, 0.1)",
                        }}
                      >
                        {/* Subtle glow effect on hover */}
                        <div
                          className="absolute inset-0 rounded-xl sm:rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(118, 93, 82, 0.05) 0%, rgba(118, 93, 82, 0.02) 100%)",
                          }}
                        ></div>

                        <span className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-1 sm:mb-2 z-10">
                          <CountingNumber
                            targetNumber={item.fact}
                            index={index}
                          />
                          <span className="text-lg sm:text-xl md:text-2xl text-[#765d52]">
                            +
                          </span>
                        </span>
                        <span className="relative text-xs sm:text-sm md:text-base text-gray-300 font-medium text-center leading-tight z-10">
                          {item.text}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
