import React from "react";
import MessageBubble from "./MessageBubble"; 

type Message = { role: string; text: string };

const ChatMessages = ({
  messages,
  messagesEndRef,
}: {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
}) => {
  return (
    <div
      className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {messages.map((msg, i) => (
        <MessageBubble key={i} msg={msg} />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessages;
