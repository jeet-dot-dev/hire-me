import { useRef, useState, useCallback } from "react";
import { toast } from "sonner";

export function useRecording(setInput: React.Dispatch<React.SetStateAction<string>>) {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceStartRef = useRef<number>(0);
  const autoSendCallbackRef = useRef<(() => void) | null>(null);

  const SILENCE_THRESHOLD = 30; // -30dB
  const SILENCE_DURATION = 3000; // 3 seconds of silence before auto-send
  const MIN_RECORDING_DURATION = 1000; // Minimum 1 second recording

  const stopRecording = useCallback(async (autoSend = false) => {
    return new Promise<void>((resolve) => {
      if (!mediaRecorderRef.current) return resolve();

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
          
          if (text.trim()) {
            setInput((prev) => (prev ? prev + " " + text : text));
            
            // Auto-send if triggered by silence detection
            if (autoSend && autoSendCallbackRef.current) {
              setTimeout(() => {
                autoSendCallbackRef.current?.();
              }, 500); // Small delay to allow input to update
            }
          }
        } catch {
          toast.error("Speech-to-text failed");
        }

        // Cleanup
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
        analyserRef.current = null;
        silenceStartRef.current = 0;
        
        resolve();
      };

      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop all tracks
      const stream = mediaRecorderRef.current.stream;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    });
  }, [setInput]);

  // Monitor audio levels for silence detection
  const monitorAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate average volume
    const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
    const volume = Math.max(0, Math.min(100, average));

    const isSilent = volume < SILENCE_THRESHOLD;
    const now = Date.now();

    if (isSilent) {
      if (silenceStartRef.current === 0) {
        silenceStartRef.current = now;
      } else if (now - silenceStartRef.current >= SILENCE_DURATION) {
        // Auto-send after silence
        const recordingDuration = now - (silenceStartRef.current - SILENCE_DURATION);
        if (recordingDuration >= MIN_RECORDING_DURATION) {
          stopRecording(true); // Auto-send flag
        }
        return;
      }
    } else {
      silenceStartRef.current = 0; // Reset silence timer
    }

    // Continue monitoring
    if (isRecording) {
      requestAnimationFrame(monitorAudioLevel);
    }
  }, [isRecording, stopRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      // Set up audio analysis for silence detection
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 2048;
      source.connect(analyserRef.current);

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
      silenceStartRef.current = 0;

      // Start monitoring audio levels
      monitorAudioLevel();

    } catch {
      toast.error("Mic access denied");
    }
  };

  // Set auto-send callback
  const setAutoSendCallback = (callback: () => void) => {
    autoSendCallbackRef.current = callback;
  };

  return { 
    isRecording, 
    startRecording, 
    stopRecording, 
    setAutoSendCallback 
  };
}
