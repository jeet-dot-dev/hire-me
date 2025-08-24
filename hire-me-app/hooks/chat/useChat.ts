import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { ApplicationType } from "@/types/applicationType";
import { JobFormDataUI } from "@/zod/job";
import { useRecording } from "./useRecording";

type Message = { role: string; text: string };

export function useChat({
  application,
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
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioQueueRef = useRef<string[]>([]);
  const isProcessingAudioRef = useRef(false);
  const [showChatLoading, setShowChatLoading] = useState(true);

  // Audio queue processing function
  const processAudioQueue = useCallback(async () => {
    if (isProcessingAudioRef.current || audioQueueRef.current.length === 0)
      return;

    isProcessingAudioRef.current = true;
    setIsAudioPlaying(true);

    while (audioQueueRef.current.length > 0) {
      const text = audioQueueRef.current.shift()!;
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
        currentAudioRef.current = audio;
        setMessages((prev) => [...prev, { role: "recruiter", text }]);
        setShowChatLoading(false);
        setIsRecruiterTyping(true);
        await new Promise<void>((resolve, reject) => {
          audio.onended = () => {
            URL.revokeObjectURL(url);
            currentAudioRef.current = null;
             setIsRecruiterTyping(false);
            resolve();
          };
          audio.onerror = () => {
            URL.revokeObjectURL(url);
            currentAudioRef.current = null;
            setIsRecruiterTyping(false);
            reject(new Error("Audio playback failed"));
          };
          audio.play().catch(reject);
        });
      } catch (error) {
        console.log("Audio playback error:", error);
        setIsRecruiterTyping(false);
      }
    }

    setIsAudioPlaying(false);
    isProcessingAudioRef.current = false;
  }, []);

  // Public TTS function that queues audio
  const playTTS = useCallback(
    (text: string) => {
      audioQueueRef.current.push(text);

      processAudioQueue();
    },
    [processAudioQueue]
  );

  // Stop all audio
  const stopAllAudio = useCallback(() => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
    }
    audioQueueRef.current = [];
    setIsAudioPlaying(false);
    setIsRecruiterTyping(false);
    isProcessingAudioRef.current = false;
  }, []);

  // Send message function
  const sendMessage = useCallback(async () => {
    if (!input.trim()) {
      toast.warning("Please enter a message");
      return;
    }

    // Stop any current audio when user sends a message
    stopAllAudio();

    const newMsg: Message = { role: "candidate", text: input };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");
    
   // setIsRecruiterTyping(true);

    try {
      const res = await fetch("/api/interview/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, newMsg],
          instruction: job.interviewInstruction,
          jobinfo: job.description,
          resume: application.resumeText,
        }),
      });

      if (!res.ok) throw new Error("Failed recruiter response");
      const { reply } = await res.json();

      setIsRecruiterTyping(false);

      if (timeLeft !== "00:00") {
        playTTS(reply);
      }
    } catch (err) {
      // setIsRecruiterTyping(false);
      console.error(err);
      toast.error("Failed to get recruiter response");
    }
  }, [
    input,
    messages,
    job.interviewInstruction,
    application.resumeText,
    job.description,
    timeLeft,
    stopAllAudio,
    playTTS,
    setMessages,
    setInput,
    setIsRecruiterTyping,
  ]);

  const { isRecording, startRecording, stopRecording, setAutoSendCallback } =
    useRecording(setInput);

  // Set up auto-send callback
  useEffect(() => {
    setAutoSendCallback(sendMessage);
  }, [setAutoSendCallback, sendMessage]);

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
    setIsRecruiterTyping,
    playTTS,
    stopAllAudio,
    isAudioPlaying,
    showChatLoading,
  };
}
