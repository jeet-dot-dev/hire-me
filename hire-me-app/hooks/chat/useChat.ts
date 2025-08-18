import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { ApplicationType } from "@/types/applicationType";
import { JobFormDataUI } from "@/zod/job";
import { useRecording } from "./useRecording"; 

type Message = { role: string; text: string };

export function useChat({
  job,

  timeLeft,
}: {
  isJoining: boolean;
  job: JobFormDataUI;
  application: ApplicationType;
  timeLeft: string;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isRecruiterTyping, setIsRecruiterTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { isRecording, startRecording, stopRecording } = useRecording(setInput);

  // Load saved messages
  useEffect(() => {
    const saved = sessionStorage.getItem("interviewMessages");
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem("interviewMessages", JSON.stringify(messages));
    }
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim()) {
      toast.warning("Please enter a message");
      return;
    }

    const newMsg: Message = { role: "candidate", text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    setIsRecruiterTyping(true);

    try {
      const res = await fetch("/api/interview/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, newMsg],
          instruction: job.interviewInstruction,
          jobinfo: job.description,
        }),
      });

      if (!res.ok) throw new Error("Failed recruiter response");
      const { reply } = await res.json();

     if(timeLeft !== "00:00") {
        await playTTS(reply);
      }
    } catch (err) {
      setIsRecruiterTyping(false);
      console.error(err);
      toast.error("Failed to get recruiter response");
    }
  };

   const playTTS = async (text: string) => {
    try {
      const res = await fetch("/api/interview/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("TTS failed");

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const audio = new Audio(url);

      setMessages((prev) => [...prev, { role: "recruiter", text }]);
      await audio.play();
      setIsRecruiterTyping(false);
    } catch {
      toast.error("Failed to play recruiter voice");
    }
  };

  return {
    messages,
    input,
    setInput,
    isRecording,
    startRecording,
    stopRecording,
    sendMessage,
    isRecruiterTyping,
    messagesEndRef,
    setMessages,
    setIsRecruiterTyping
  };
}
