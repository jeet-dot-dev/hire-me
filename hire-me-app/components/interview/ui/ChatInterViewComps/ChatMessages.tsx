import React from "react";
import MessageBubble from "./MessageBubble";

type Message = { role: string; text: string };

const ChatMessages = ({
  messages,
  messagesEndRef,
  showChatLoading,
  isRecruiterTyping
}: {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  showChatLoading: boolean;
  isRecruiterTyping: boolean;
}) => {
  if (showChatLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full space-y-4">
        {/* Spinner */}
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        
        {/* Message */}
        <p className="text-lg font-medium text-gray-600 animate-pulse">
          Preparing your interview…
        </p>
        <p className="text-sm text-gray-400">Please wait a moment</p>
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {messages.map((msg, i) => (
        <MessageBubble key={i} msg={msg} />
      ))}

      {isRecruiterTyping && (
        <div className="text-gray-400 italic text-sm">Recruiter is typing…</div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
