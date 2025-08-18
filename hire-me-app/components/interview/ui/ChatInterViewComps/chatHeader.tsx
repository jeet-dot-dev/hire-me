import React from "react";

const ChatHeader = ({ isRecruiterTyping }: { isRecruiterTyping: boolean }) => {
  return (
    <div className="p-4 border-b border-gray-600 bg-gradient-to-r from-gray-800 to-gray-700">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-white">Interview Session</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400 font-medium">Live</span>
        </div>
      </div>

      {isRecruiterTyping && (
        <div className="mt-2 flex items-center gap-2 text-blue-400 text-sm">
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
          </div>
          <span>Recruiter is typing...</span>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
