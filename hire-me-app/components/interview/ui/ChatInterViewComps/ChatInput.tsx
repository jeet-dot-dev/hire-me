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
  const [isConverting, setIsConverting] = React.useState(false);

  const handleStopRecording = async () => {
    setIsConverting(true);
    await stopRecording();
    // Simulate conversion delay
    setTimeout(() => {
      setIsConverting(false);
    }, 1500);
  };

  return (
    <div className="p-4 border-t border-gray-600 bg-gradient-to-r from-gray-800 to-gray-700">
      <div className="flex items-center gap-3">
        <button
          onClick={isRecording ? handleStopRecording : startRecording}
          className={`relative p-3 rounded-full transition-all duration-200 ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 animate-pulse shadow-lg shadow-red-500/50"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
        >
          <Mic size={20} className="text-white" />
          {isRecording && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
          )}
        </button>

        <div className="flex-1 relative">
          {isRecording ? (
            <div className="h-12 bg-gray-800 rounded-xl border border-red-500 flex items-center justify-center">
              <Lottie animationData={voiceAnimation} loop style={{ width: 40, height: 40 }} />
              <span className="text-red-400 text-sm font-medium">Recording...</span>
            </div>
          ) : isConverting ? (
            <div className="h-12 bg-gray-800 rounded-xl border border-blue-500 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-100"></div>
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-200"></div>
              </div>
              <span className="text-blue-400 text-sm font-medium ml-3">Converting to text...</span>
            </div>
          ) : (
            <textarea
              className="w-full bg-gray-800 text-white rounded-xl p-3 resize-none h-12 border border-gray-600 focus:border-blue-500 focus:outline-none transition-colors placeholder-gray-400"
              style={{ 
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
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
          disabled={!input.trim() || isRecording || isConverting}
          className="p-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
        >
          <Send size={20} className="text-white" />
        </button>
      </div>

      <style jsx>{`
        textarea::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default ChatInput;