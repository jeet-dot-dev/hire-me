import { useRef, useState } from "react";
import { toast } from "sonner";

export function useRecording(setInput: React.Dispatch<React.SetStateAction<string>>) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch {
      toast.error("Mic access denied");
    }
  };

  const stopRecording = async () => {
    return new Promise<void>((resolve) => {
      if (!mediaRecorderRef.current) return;

      mediaRecorderRef.current.onstop = async () => {
        try {
          const audioBlob = new Blob(chunksRef.current, { type: "audio/webm" });
          const formData = new FormData();
          formData.append("audio", audioBlob, "speech.webm");

          const res = await fetch("/api/interview/stt", {
            method: "POST",
            body: formData,
          });

          if (!res.ok) throw new Error("STT failed");
          const { text } = await res.json();
          setInput((prev) => (prev ? prev + " " + text : text));
        } catch {
          toast.error("Speech-to-text failed");
        }
        resolve();
      };

      mediaRecorderRef.current.stop();
      setIsRecording(false);
    });
  };

  return { isRecording, startRecording, stopRecording };
}
