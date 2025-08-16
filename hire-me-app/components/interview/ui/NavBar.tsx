"use client"
import React from "react";
import { ArrowLeft, Signal, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  connectionQuality: "excellent" | "good" | "poor";
};

const NavBar = ({ connectionQuality }: Props) => {
  const router = useRouter()
  const getSignalColor = () => {
    switch (connectionQuality) {
      case "excellent":
        return "text-green-500";
      case "good":
        return "text-yellow-500";
      case "poor":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <nav className="flex w-full min-h-[50px] justify-between px-5 py-3 border-b border-gray-800">
      <div className="cursor-pointer rounded-full hover:bg-gray-800 transition-colors h-8 w-8 flex justify-center items-center">
        <ArrowLeft className="text-lg text-muted-foreground" 
          onClick={()=>router.back()}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="logo font-extrabold text-2xl">Hire-me</div>
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-800 rounded-full">
          <Signal className={`w-4 h-4 ${getSignalColor()}`} />
          <span className="text-xs text-muted-foreground capitalize">
            {connectionQuality}
          </span>
        </div>
      </div>

      <div className="cursor-pointer rounded-full hover:bg-gray-800 transition-colors h-8 w-8 flex justify-center items-center">
        <Settings className="w-4 h-4 text-muted-foreground" />
      </div>
    </nav>
  );
};

export default NavBar;
