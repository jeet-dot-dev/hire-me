import React, { forwardRef } from "react";
import { Mic, Maximize, VideoOff } from "lucide-react";

type Props = {
  micOn: boolean;
  videoOn: boolean;
};

const CandidateVideo = forwardRef<HTMLVideoElement, Props>(
  ({ micOn, videoOn }, ref) => {
    return (
      <div className="candidate relative min-h-[400px] bg-[#1c1c1c] rounded-2xl shadow-2xl overflow-hidden border border-gray-700 group">
        <video
          ref={ref}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />

        {!videoOn && (
          <div className="absolute inset-0 flex justify-center items-center flex-col bg-gradient-to-br from-[#1c1c1c] to-[#2a2a2a]">
            <div className="bg-gray-800 p-6 rounded-full mb-4">
              <VideoOff className="w-12 h-12 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">Camera Off</p>
            <p className="text-sm text-muted-foreground/70">
              Click to enable camera
            </p>
          </div>
        )}

        <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
          <div className="bg-red-600/90 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full border border-red-500">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
              Rec
            </span>
          </div>
        </div>

        <div className="absolute top-3 left-3 flex items-center gap-2 z-10 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
          <p className="text-white text-sm font-medium">You</p>
        </div>

        {micOn && (
          <div className="absolute bottom-3 left-3 z-10">
            <div className="bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
              <div className="flex items-center gap-1">
                <Mic className="w-3 h-3 text-green-500" />
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-3 bg-green-500 rounded-full animate-pulse"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition-colors">
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }
);

CandidateVideo.displayName = "CandidateVideo";
export default CandidateVideo;
