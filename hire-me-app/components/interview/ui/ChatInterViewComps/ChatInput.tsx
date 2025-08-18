import React from "react";
import { Mic, Send } from "lucide-react";
import Lottie from "lottie-react";
import voiceAnimation from "../../../../src/animations/voice.json"

const ChatInput = ({
  input,
  setInput,
  isRecording,
  startRecording,
  stopRecording,
  sendMessage,
}: {
  input: string;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isRecording: boolean;
  startRecording: () => void;
  stopRecording: () => Promise<void>;
  sendMessage: () => void;
}) => {
  return (
    <div className="p-4 border-t border-gray-600 bg-gradient-to-r from-gray-800 to-gray-700">
      <div className="flex items-center gap-3">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`relative p-3 rounded-full transition-all duration-200 ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-500/50"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
        >
          <Mic size={20} className="text-white" />
        </button>

        <div className="flex-1 relative">
          {isRecording ? (
            <div className="h-12 bg-gray-800 rounded-xl border border-gray-600 flex items-center justify-center">
              <Lottie animationData={voiceAnimation} loop style={{ width: 40, height: 40 }} />
              <span className="text-red-400 text-sm font-medium">Recording...</span>
            </div>
          ) : (
            <textarea
              className="w-full bg-gray-800 text-white rounded-xl p-3 resize-none h-12 border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors scrollbar-hide placeholder-gray-400"
              placeholder="Type your response or use the microphone..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              rows={1}
            />
          )}
        </div>

        <button
          onClick={sendMessage}
          disabled={!input.trim() || isRecording}
          className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
        >
          <Send size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
