"use client";
import { Button } from "@/components/ui/button";
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
import { toast } from "sonner";
import Lottie from "lottie-react";
import voiceAnimation from "../../../src/animations/voice.json";
import { JobFormDataUI } from "@/zod/job";
import { ApplycationType } from "@/types/applicationType";
import { useRouter } from "next/navigation";


type InterviewCheckScreenProp = {
   setShowInterviewCheck: Dispatch<SetStateAction<boolean>>,
    job : JobFormDataUI,
    application : ApplycationType
} 
const InterviewCheckScreen = ({
  setShowInterviewCheck,job,application
}:InterviewCheckScreenProp) => {
  const [audioPermissionGranted, setAudioPermissionGranted] = useState(false);
  const [videoPermissionGranted, setVideoPermissionGranted] = useState(false);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string>("");
  const [agreed, setAgreed] = useState(false);
  const [isVoiceTesting, setIsVoiceTesting] = useState(false);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const router = useRouter()
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

      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs = allDevices.filter((d) => d.kind === "audioinput");
      setDevices(audioInputs);
      if (audioInputs.length > 0) {
        setSelectedDevice(audioInputs[0].deviceId);
      }

      stream.getTracks().forEach((track) => track.stop());
    } catch (error) {
      console.error("Permission error:", error);
      toast.error("Please allow microphone and camera permissions.");
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
        toast.success("Microphone enabled");
      } catch (err) {
        console.error(err);
        toast.error("Unable to access microphone.");
      }
    } else {
      audioStream?.getTracks().forEach((track) => track.stop());
      setAudioPermissionGranted(false);
      setAudioStream(null);
      toast("Microphone disabled");
    }
  };

  // Toggle camera
  const toggleVideo = async () => {
    if (!videoPermissionGranted) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setVideoPermissionGranted(true);
        setVideoStream(stream);
        toast.success("Camera enabled");
      } catch (err) {
        console.error(err);
        toast.error("Unable to access camera.");
      }
    } else {
      videoStream?.getTracks().forEach((track) => track.stop());
      setVideoPermissionGranted(false);
      setVideoStream(null);
      toast("Camera disabled");
    }
  };

  // Test mic — play back audio live
  const testMic = async () => {
    if (!audioPermissionGranted) {
      toast.error("Enable your mic before testing.");
      return;
    }

    if (isVoiceTesting) {
      if (audioContext) {
        await audioContext.close();
        setAudioContext(null);
      }
      setIsVoiceTesting(false);
      toast("Stopped mic test");
    } else {
      try {
        const newAudioCtx = new AudioContext();
        const source = newAudioCtx.createMediaStreamSource(audioStream!);
        source.connect(newAudioCtx.destination);
        setAudioContext(newAudioCtx);
        setIsVoiceTesting(true);
        toast.success("Mic test started");
      } catch (err) {
        console.error("Error starting voice test:", err);
        toast.error("Failed to start voice test.");
      }
    }
  };

  // Validate before starting interview
  const startInterview = () => {
    if (!audioPermissionGranted) {
      toast.error("Please enable your microphone.");
      return;
    }
    if (!videoPermissionGranted) {
      toast.error("Please enable your camera.");
      return;
    }
    if (!agreed) {
      toast.error("Please agree to the instructions before starting.");
      return;
    }
    sessionStorage.setItem("job",JSON.stringify(job));
    sessionStorage.setItem("application",JSON.stringify(application));

    router.push(`${application.id}/interview/session`)
    // navigation or API call here
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
          {/* Left Column */}
          <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-zinc-800">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-white mb-1">{job.jobTitle}</h2>
                  <p className="text-zinc-400 text-sm mb-2">{job.companyName}</p>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{job.interviewDuration}min</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-zinc-400 cursor-pointer hover:text-white hover:bg-zinc-800 hidden lg:flex"
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
                className="w-full cursor-pointer bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className={`p-2 rounded-lg cursor-pointer transition-colors ${
                      audioPermissionGranted
                        ? "bg-green-600 text-white"
                        : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                    }`}
                  >
                    {audioPermissionGranted ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                  </button>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-white font-medium">Video</span>
                  <button
                    onClick={toggleVideo}
                    className={`p-2 rounded-lg cursor-pointer transition-colors ${
                      videoPermissionGranted
                        ? "bg-green-600 text-white"
                        : "bg-zinc-700 text-zinc-400 hover:bg-zinc-600"
                    }`}
                  >
                    {videoPermissionGranted ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                  </button>
                </div>

                <Button
                  onClick={testMic}
                  className={`w-full cursor-pointer border border-zinc-700 transition-all duration-200 ${
                    isVoiceTesting
                      ? "bg-green-600 hover:bg-green-700 text-white"
                      : "bg-zinc-800 hover:bg-zinc-700 text-white"
                  }`}
                  variant="outline"
                >
                  <div className="flex items-center justify-center gap-2">
                    {isVoiceTesting ? (
                      <>
                        <Lottie animationData={voiceAnimation} loop style={{ width: 40, height: 40 }} />
                        Stop Voice Test
                      </>
                    ) : (
                      <>
                        <Volume2 className="w-4 h-4" />
                        Check Your Voice
                      </>
                    )}
                  </div>
                </Button>
              </div>
            </div>

            {/* Agreement & Actions */}
            <div className="p-6">
              <div className="flex items-start gap-3 mb-4">
                <input
                  type="checkbox"
                  checked={agreed}
                  onChange={(e) => setAgreed(e.target.checked)}
                  className="mt-1 w-4 h-4 bg-zinc-800 border-zinc-600 rounded focus:ring-blue-500"
                />
                <label
                  className="text-sm text-zinc-300 leading-relaxed cursor-pointer"
                  onClick={() => setAgreed(!agreed)}
                >
                  I have read and agree to the above instructions
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={startInterview}
                  className="flex-1 cursor-pointer text-black font-medium py-6"
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
              {[
                `This is a frontend developer interview held for ${job.interviewDuration} min`,
                "Check your mic and video before going to interview",
                "In the interview time you can't turn off your video",
                "Any suspicious activity can immediately cancel your interview (e.g., tab switch)",
                "Window will take random screenshots during the interview so be prepared",
              ].map((text, i) => (
                <div className="flex gap-3" key={i}>
                  <span className="flex-shrink-0 w-6 h-6 bg-zinc-800 rounded-full flex items-center justify-center text-xs font-medium">
                    {i + 1}
                  </span>
                  <p>{text}</p>
                </div>
              ))}
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
