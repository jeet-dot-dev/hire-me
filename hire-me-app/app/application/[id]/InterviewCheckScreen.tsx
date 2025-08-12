"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Mic,
  MicOff,
  Video,
  VideoOff,
  X,
  Volume2,
  ArrowLeft,
} from "lucide-react";
import React, {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

const InterviewCheckScreen = ({
  setShowInterviewCheck,
}: {
  setShowInterviewCheck: Dispatch<SetStateAction<boolean>>;
}) => {
  const [audioPermissionGranted, setAudioPermissionGranted] = useState(false);
  const [videoPermissionGranted, setVideoPermissionGranted] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVoiceTesting, setIsVoiceTesting] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);

  // Get permissions & devices
  const requestPermission = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      const audioTracks = stream.getAudioTracks();
      const videoTracks = stream.getVideoTracks();

      if (audioTracks.length > 0) {
        setAudioPermissionGranted(true);
        setAudioStream(new MediaStream(audioTracks));
      }
      if (videoTracks.length > 0) {
        setVideoPermissionGranted(true);
        setVideoStream(new MediaStream(videoTracks));
      }

      // Get available devices
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      setDevices(allDevices.filter((d) => d.kind === "audioinput"));
      if (allDevices.filter((d) => d.kind === "audioinput").length > 0) {
        setSelectedDevice(allDevices.filter((d) => d.kind === "audioinput")[0].deviceId);
      }

      // Stop initial preview
      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Permission error:", error);
      setAudioPermissionGranted(false);
      setVideoPermissionGranted(false);
    }
  }, []);

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  // Toggle mic
  const toggleAudio = async () => {
    if (!audioPermissionGranted) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { deviceId: selectedDevice ? { exact: selectedDevice } : undefined },
        });
        setAudioPermissionGranted(true);
        setAudioStream(stream);
      } catch (err) {
        console.error(err);
      }
    } else {
      audioStream?.getTracks().forEach((track) => track.stop());
      setAudioPermissionGranted(false);
      setAudioStream(null);
    }
  };

  // Toggle camera
  const toggleVideo = async () => {
    if (!videoPermissionGranted) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setVideoPermissionGranted(true);
        setVideoStream(stream);
      } catch (err) {
        console.error(err);
      }
    } else {
      videoStream?.getTracks().forEach((track) => track.stop());
      setVideoPermissionGranted(false);
      setVideoStream(null);
    }
  };

  // Test mic — play back audio live
  const testMic = async () => {
    if (!audioPermissionGranted) {
      setError("Enable your mic before testing.");
      return;
    }
    
    if (isVoiceTesting) {
      // Stop voice testing
      if (audioContext) {
        audioContext.close();
        setAudioContext(null);
      }
      setIsVoiceTesting(false);
    } else {
      // Start voice testing
      try {
        const newAudioCtx = new AudioContext();
        const source = newAudioCtx.createMediaStreamSource(audioStream!);
        source.connect(newAudioCtx.destination);
        setAudioContext(newAudioCtx);
        setIsVoiceTesting(true);
      } catch (err) {
        console.error("Error starting voice test:", err);
        setError("Failed to start voice test.");
      }
    }
  };

  // Validate before starting interview
  const startInterview = () => {
    if (!audioPermissionGranted || !videoPermissionGranted || !agreed) {
      setError("Please enable mic, camera, and agree to the terms before starting.");
      return;
    }
    setError(null);
    alert("Interview started! 🚀"); // Replace with navigation or API call
  };

  return (
    <div className="w-full min-h-screen fixed inset-0 bg-black/90 backdrop-blur-lg flex justify-center z-50 overflow-y-auto">
      <div className="w-full min-h-screen flex justify-center items-start lg:items-center p-4 py-8 lg:py-4">
      {/* Back button for mobile */}
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 left-4 text-white hover:bg-white/10 lg:hidden"
        onClick={() => setShowInterviewCheck(false)}
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back
      </Button>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Left Column - Main Content */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-zinc-800">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">Frontend Developer</h2>
                <p className="text-zinc-400 text-sm mb-2">IndianHacker</p>
                <div className="flex items-center gap-2 text-zinc-400">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">30min</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800 hidden lg:flex"
                onClick={() => setShowInterviewCheck(false)}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Device Selection */}
          <div className="p-6 border-b border-zinc-800">
            <label className="block text-sm font-medium text-white mb-3">
              Select Microphone
            </label>
            <select
              value={selectedDevice}
              onChange={(e) => setSelectedDevice(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Default</option>
              {devices.map((device) => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label || `Mic ${device.deviceId.slice(0, 8)}...`}
                </option>
              ))}
            </select>
          </div>

          {/* Media Controls */}
          <div className="p-6 border-b border-zinc-800">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">Audio</span>
                <button
                  onClick={toggleAudio}
                  className={`p-2 rounded-lg transition-colors ${
                    audioPermissionGranted
                      ? "bg-green-600 text-white"
                      : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                  }`}
                >
                  {audioPermissionGranted ? (
                    <Mic className="w-5 h-5" />
                  ) : (
                    <MicOff className="w-5 h-5" />
                  )}
                </button>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white font-medium">Video</span>
                <button
                  onClick={toggleVideo}
                  className={`p-2 rounded-lg transition-colors ${
                    videoPermissionGranted
                      ? "bg-green-600 text-white"
                      : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                  }`}
                >
                  {videoPermissionGranted ? (
                    <Video className="w-5 h-5" />
                  ) : (
                    <VideoOff className="w-5 h-5" />
                  )}
                </button>
              </div>

              <Button
                onClick={testMic}
                className={`w-full border border-zinc-700 transition-all duration-200 ${
                  isVoiceTesting 
                    ? "bg-red-600 hover:bg-red-700 text-white" 
                    : "bg-zinc-800 hover:bg-zinc-700 text-white"
                }`}
                variant="outline"
              >
                <div className="flex items-center justify-center">
                  {isVoiceTesting ? (
                    <>
                      <div className="flex items-center mr-2">
                        <div className="w-1 h-3 bg-white mr-1 animate-pulse"></div>
                        <div className="w-1 h-4 bg-white mr-1 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                        <div className="w-1 h-2 bg-white mr-1 animate-pulse" style={{animationDelay: '0.4s'}}></div>
                        <div className="w-1 h-5 bg-white mr-1 animate-pulse" style={{animationDelay: '0.6s'}}></div>
                        <div className="w-1 h-3 bg-white animate-pulse" style={{animationDelay: '0.8s'}}></div>
                      </div>
                      Stop Voice Test
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4 mr-2" />
                      Check Your Voice
                    </>
                  )}
                </div>
              </Button>
            </div>
          </div>

          {/* Agreement and Actions */}
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <input
                type="checkbox"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-1 w-4 h-4 bg-zinc-800 border-zinc-600 rounded focus:ring-blue-500"
              />
              <label className="text-sm text-zinc-300 leading-relaxed cursor-pointer" onClick={() => setAgreed(!agreed)}>
                I have read and agree to the above instructions
              </label>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-800 rounded-lg">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={startInterview}
                className="flex-1 cursor-pointer text-black  font-medium py-6"
                variant="outline"
              >
                Proceed to Interview
              </Button>
            </div>
          </div>
        </div>

        {/* Right Column - Instructions */}
        <div className="bg-zinc-900 rounded-2xl border border-zinc-800 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Interview Instructions</h3>
          
          <div className="space-y-4 text-sm text-zinc-300 leading-relaxed">
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-medium">1</span>
              <p>This is a frontend developer interview held for 30 min</p>
            </div>
            
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-medium">2</span>
              <p>Check your mic and video before going to interview</p>
            </div>
            
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-medium">3</span>
              <p>In the interview time you can't turn off your video</p>
            </div>
            
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-medium">4</span>
              <p>Any suspicious activity can immediately cancel your interview (e.g., tab switch)</p>
            </div>
            
            <div className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-medium">5</span>
              <p>Window will take random screenshots during the interview so be prepared</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
            <h4 className="text-white font-medium mb-2">Tips for Success</h4>
            <ul className="text-xs text-zinc-400 space-y-1">
              <li>• Ensure stable internet connection</li>
              <li>• Use a quiet, well-lit environment</li>
              <li>• Have your resume and portfolio ready</li>
              <li>• Test your setup beforehand</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default InterviewCheckScreen;