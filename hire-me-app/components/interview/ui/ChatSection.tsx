"use client";
import React, { useState, useRef } from "react";
import { Mic, Send } from "lucide-react";

type messagetype = {
  role: string;
  text: string;
};

const ChatSection = () => {
  const [messages, setMessages] = useState<messagetype[]>([]);
  const [input, setInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  

  // 🎤 Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Mic error:", error);
    }
  };

  // ⏹ Stop recording and send audio
  const stopRecording = async () => {
    return new Promise<void>((resolve) => {
      if (!mediaRecorderRef.current) return;

      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("audio", audioBlob, "speech.webm");

        const res = await fetch("/api/interview/stt", {
          method: "POST",
          body: formData,
        });

        const { text } = await res.json();
        console.log("Transcribed:", text);

        setInput(text);
        setMessages((prev) => [...prev, { role: "candidate", text }]);

        resolve();
      };

      mediaRecorderRef.current.stop();
      setIsRecording(false);
    });
  };

  return (
    <div className="chat min-h-[400px] bg-[#1c1c1c] rounded-2xl shadow-2xl border border-gray-700 flex flex-col">
      {/* Chat Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h3 className="font-medium">Interview Chat</h3>
        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-xl max-w-[80%] ${
              msg.role === "candidate"
                ? "ml-auto bg-blue-600 text-white"
                : "bg-gray-800 text-gray-200"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>

      {/* Input Section */}
      <div className="p-4 border-t border-gray-700 flex items-center gap-2">
        {/* Mic button */}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          className={`p-3 rounded-full ${
            isRecording ? "bg-red-500 animate-pulse" : "bg-gray-700"
          }`}
        >
          <Mic size={20} />
        </button>

        {/* Textarea */}
        <textarea
          className="flex-1 bg-gray-800 text-white rounded-xl p-2 resize-none h-12"
          placeholder="Type your response..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {/* Send button */}
        <button className="p-3 rounded-full bg-blue-600 hover:bg-blue-700">
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatSection;
