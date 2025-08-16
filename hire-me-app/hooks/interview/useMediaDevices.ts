import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export function useMediaDevices(videoRef: React.RefObject<HTMLVideoElement | null>) {
  const audioStreamRef = useRef<MediaStream | null>(null);
  const videoStreamRef = useRef<MediaStream | null>(null);
  const [micOn, setMicOn] = useState(false);
  const [videoOn, setVideoOn] = useState(false);

  const initAudio = async () => {
    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioStreamRef.current = audioStream;
      setMicOn(true);
      toast.success("Mic ready");
    } catch {
      toast.error("Mic access denied");
    }
  };

  const initVideo =useCallback( async () => {
    try {
      const videoStream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoStreamRef.current = videoStream;
      if (videoRef.current) {
        videoRef.current.srcObject = videoStream;
      }
      setVideoOn(true);
      toast.success("Camera ready");
    } catch {
      toast.error("Camera access denied");
    }
  }, [videoRef]);

  const toggleMic = () => {
    const audioTrack = audioStreamRef.current?.getAudioTracks()[0];
    if (!audioTrack) return toast.error("No mic available");
    audioTrack.enabled = !audioTrack.enabled;
    setMicOn(audioTrack.enabled);
    toast(audioTrack.enabled ? "Mic unmuted" : "Mic muted");
  };

  const toggleVideo = () => {
    const videoTrack = videoStreamRef.current?.getVideoTracks()[0];
    if (!videoTrack) return toast.error("No camera available");
    videoTrack.enabled = !videoTrack.enabled;
    setVideoOn(videoTrack.enabled);
    toast(videoTrack.enabled ? "Camera on" : "Camera off");
  };

  useEffect(() => {
    initAudio();
    initVideo();
  }, [initVideo]);

  return { micOn, videoOn, toggleMic, toggleVideo };
}
