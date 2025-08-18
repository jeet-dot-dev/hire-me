import React from "react";
import { User } from "lucide-react";

const MessageBubble = ({ msg }: { msg: { role: string; text: string } }) => {
  return (
    <div
      className={`flex items-start gap-3 ${
        msg.role === "candidate" ? "flex-row-reverse" : ""
      }`}
    >
      <div
        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
          msg.role === "candidate"
            ? "bg-gradient-to-r from-blue-500 to-blue-600"
            : "bg-gradient-to-r from-purple-500 to-purple-600"
        }`}
      >
        <User size={16} className="text-white" />
      </div>

      <div
        className={`flex flex-col max-w-[75%] ${
          msg.role === "candidate" ? "items-end" : "items-start"
        }`}
      >
        <span
          className={`text-xs font-medium mb-1 ${
            msg.role === "candidate" ? "text-blue-400" : "text-purple-400"
          }`}
        >
          {msg.role === "candidate" ? "You" : "Recruiter"}
        </span>

        <div
          className={`p-3 rounded-2xl shadow-lg ${
            msg.role === "candidate"
              ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-tr-sm"
              : "bg-gradient-to-r from-gray-700 to-gray-800 text-gray-100 rounded-tl-sm"
          }`}
        >
          <p className="text-sm leading-relaxed">{msg.text}</p>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
