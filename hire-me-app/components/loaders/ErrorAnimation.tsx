"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import errorAnim from "../../src/animations/error-animation.json";
import { ArrowLeft } from "lucide-react";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

const ErrorAnimation = ({ msg }: { msg: string }) => {
  const router = useRouter();

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center p-6">
      <div className="max-w-xs sm:max-w-sm md:max-w-md text-center">
        <div aria-hidden="true">
          <Lottie animationData={errorAnim} loop />
        </div>
        <h1 className="mt-6 text-lg sm:text-xl md:text-xl font-medium text-gray-300 dark:text-gray-100 leading-relaxed">
          {msg || "Something went wrong!"}
        </h1>
        <button
          onClick={() => router.back()}
          className="mt-6  cursor-pointer px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
        >
          <div className="flex items-center justify-center gap-2">
            <ArrowLeft className="inline-block  w-4 h-4" />
            <span>Go Back</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ErrorAnimation;
