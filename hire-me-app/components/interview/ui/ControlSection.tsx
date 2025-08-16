"use client";

import { motion } from "framer-motion";
import {
  EllipsisVertical,
  Mic,
  MicOffIcon,
  Phone,
  Video,
  VideoOff,
  Volume2,
  Settings,
  MessageSquare,
  Share,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

type ControlSectionProp = {
     micOn : boolean ,
     videoOn :boolean,
     toggleMic : ()=>void ,
     toggleVideo : ()=>void 
}

// Add these to your existing component
const ControlSection = ({ micOn, videoOn, toggleMic, toggleVideo }:ControlSectionProp) => {
  return (
    <section>
      <div className="w-full justify-center pb-8 items-center">
        {/* Glass control panel */}
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="backdrop-blur-xl bg-white/5 border  border-white/10 rounded-3xl px-6 py-4 flex mx-auto mt-14 justify-center items-center gap-4 max-w-fit shadow-2xl"
        >
          {/* End call button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 12 }}
            whileTap={{ scale: 0.9 }}
            className="bg-red-500/80 hover:bg-red-500 cursor-pointer backdrop-blur-sm p-4 rounded-full transition-all duration-200 shadow-lg border border-red-400/30"
          >
            <Phone className="w-5 h-5" />
          </motion.button>

          {/* Mic control */}
          <motion.button
            onClick={toggleMic}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative p-4 rounded-full cursor-pointer transition-all duration-300 shadow-lg ${
              micOn
                ? "bg-white/10 hover:bg-white/20 border border-white/20"
                : "bg-red-500/80 hover:bg-red-500 border border-red-400/30"
            }`}
          >
            <motion.div
              animate={micOn ? { rotate: 0 } : { rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              {micOn ? <Mic className="w-5 h-5" /> : <MicOffIcon className="w-5 h-5" />}
            </motion.div>
            
            {/* Pulsing indicator when mic is on */}
            {micOn && (
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute inset-0 bg-green-500/30 rounded-full"
              />
            )}
          </motion.button>

          {/* Video control */}
          <motion.button
            onClick={toggleVideo}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`relative p-4 rounded-full cursor-pointer transition-all duration-300 shadow-lg ${
              videoOn
                ? "bg-white/10 hover:bg-white/20 border border-white/20"
                : "bg-red-500/80 hover:bg-red-500 border border-red-400/30"
            }`}
          >
            <motion.div
              animate={videoOn ? { rotate: 0 } : { rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </motion.div>
          </motion.button>

          {/* More options with popover */}
          <Popover>
            <PopoverTrigger asChild>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/10 hover:bg-white/20 cursor-pointer border border-white/20 p-4 rounded-full transition-all duration-200 shadow-lg"
              >
                <EllipsisVertical className="w-5 h-5" />
              </motion.button>
            </PopoverTrigger>
            <PopoverContent className="w-48 bg-black/10 text-white backdrop-blur-xl border border-white/20 shadow-2xl">
              <div className="space-y-2">
                <motion.button
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 w-full p-2 hover:bg-white/10 rounded-lg transition-colors text-left"
                >
                  <Volume2 className="w-4 h-4" />
                  <span className="text-sm">Audio Settings</span>
                </motion.button>
                <motion.button
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 w-full p-2 hover:bg-white/10 rounded-lg transition-colors text-left"
                >
                  <Settings className="w-4 h-4" />
                  <span className="text-sm">Video Settings</span>
                </motion.button>
                <motion.button
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 w-full p-2 hover:bg-white/10 rounded-lg transition-colors text-left"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span className="text-sm">Chat</span>
                </motion.button>
                <motion.button
                  whileHover={{ x: 4 }}
                  className="flex items-center gap-3 w-full p-2 hover:bg-white/10 rounded-lg transition-colors text-left"
                >
                  <Share className="w-4 h-4" />
                  <span className="text-sm">Share Screen</span>
                </motion.button>
              </div>
            </PopoverContent>
          </Popover>
        </motion.div>

       
      </div>
    </section>
  );
};

export default ControlSection;