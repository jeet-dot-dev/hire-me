"use client";

import ErrorAnimation from "@/components/loaders/ErrorAnimation";

interface TimeoutErrorProps {
  currentPath: string;
}

export default function TimeoutErrorComponent({ currentPath }: TimeoutErrorProps) {
  const handleTryAgain = () => {
    window.location.reload();
  };

  const handleContinueAnyway = () => {
    window.location.href = `${currentPath}?skipResume=true`;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <ErrorAnimation msg="Resume download is taking longer than expected. This might be due to file size or network issues." />
      <div className="mt-4 text-center max-w-md">
        <p className="text-sm text-gray-600 mb-4">
          You can still proceed with the interview, but some resume-specific questions may not be available.
        </p>
        <button 
          onClick={handleTryAgain}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 mr-2 transition-colors"
        >
          Try Again
        </button>
        <button 
          onClick={handleContinueAnyway}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
        >
          Continue Anyway
        </button>
      </div>
    </div>
  );
}