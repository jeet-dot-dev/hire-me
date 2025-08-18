import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Signal, Maximize } from "lucide-react";

type Props = {
  isJoining: boolean;
  joiningStep: number;
  joiningSteps: string[];
};



const VideoSection = ({ isJoining, joiningStep, joiningSteps }: Props) => {
  return (
    <div className="ai min-h-[400px] bg-[#1c1c1c] rounded-2xl shadow-2xl relative border border-gray-700 overflow-hidden group">
      <AnimatePresence mode="wait">
        {isJoining ? (
          <motion.div
            key="joining"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex flex-col justify-center items-center bg-gradient-to-br from-[#1c1c1c] to-[#2a2a2a] z-20"
          >
            <div className="text-center space-y-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-12 h-12 text-blue-500 mx-auto" />
              </motion.div>

              <motion.div
                key={joiningStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <p className="text-white font-medium">{joiningSteps[joiningStep]}</p>
                <div className="flex justify-center space-x-1">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="video"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full h-full"
          >
            <div className="absolute top-3 left-3 flex items-center gap-2 z-10 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-full">
              <p className="text-white text-sm font-medium">AI Recruiter</p>
            </div>

            <div className="absolute top-3 right-3 z-10 flex gap-2 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
              <Signal className="w-4 h-4 text-green-500" />
            </div>

            <div className="absolute bottom-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="bg-black/50 backdrop-blur-sm p-2 rounded-full hover:bg-black/70 transition-colors">
                <Maximize className="w-4 h-4" />
              </button>
            </div>

            <video
              className="w-full h-full object-cover rounded-2xl"
              loop
              autoPlay
              muted
              playsInline
            >
              <source src="/Jammy2.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VideoSection;
