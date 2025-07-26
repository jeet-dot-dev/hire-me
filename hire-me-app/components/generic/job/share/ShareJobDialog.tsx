"use client";

import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Facebook,
  Linkedin,
  Send,
  MessageCircleMore,
  Copy,
  Check,
} from "lucide-react";

type ShareJobDialogProps = {
  jobId: string | undefined;
    children?: React.ReactNode;
};

const ShareJobDialog = ({ jobId,children }: ShareJobDialogProps) => {
  const [copied, setCopied] = useState(false);

  const jobUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/jobs/${jobId}`;
  const encodedUrl = encodeURIComponent(jobUrl);
  //console.log(encodedUrl)

  const shareUrls = {
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=Check%20out%20this%20job%20opportunity!`,
    whatsapp: `https://wa.me/?text=${encodedUrl}`,
    telegram: `https://t.me/share/url?url=${encodedUrl}&text=Check%20out%20this%20job`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(jobUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
       {children}
      </PopoverTrigger>

      <PopoverContent className="w-[300px] space-y-3 bg-[#262626] text-white">
        <div className="text-sm font-semibold text-white">Share this job</div>
        <p className="text-xs text-gray-300">
          Help others find this opportunity
        </p>

        <div className="flex items-center gap-2">
          <Input
            className="text-xs  border-white text-white placeholder:text-gray-400 focus:ring-white focus:border-white"
            value={encodedUrl }
            readOnly
            onClick={(e) => (e.target as HTMLInputElement).select()}
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={handleCopy}
            className="hover:bg-gray-800 border border-white text-white hover:text-white"
          >
            {copied ? (
              <Check className="w-4 h-4 text-white" />
            ) : (
              <Copy className="w-4 h-4 text-white" />
            )}
          </Button>
        </div>

        <div className="flex justify-between items-center pt-1 px-1">
          <a href={shareUrls.facebook} target="_blank" rel="noopener noreferrer">
            <Facebook className="w-5 h-5 text-white hover:text-gray-300 transition-colors" />
          </a>
          <a href={shareUrls.linkedin} target="_blank" rel="noopener noreferrer">
            <Linkedin className="w-5 h-5 text-white hover:text-gray-300 transition-colors" />
          </a>
          <a href={shareUrls.telegram} target="_blank" rel="noopener noreferrer">
            <Send className="w-5 h-5 text-white hover:text-gray-300 transition-colors" />
          </a>
          <a href={shareUrls.whatsapp} target="_blank" rel="noopener noreferrer">
            <MessageCircleMore className="w-5 h-5 text-white hover:text-gray-300 transition-colors" />
          </a>
          <a href={shareUrls.twitter} target="_blank" rel="noopener noreferrer">
            <svg
              className="w-5 h-5 fill-white hover:fill-gray-300 transition-colors"
              viewBox="0 0 24 24"
            >
              <path d="M8.29 20c7.547 0 11.675-6.155 11.675-11.49 0-.175 0-.349-.012-.522A8.18 8.18 0 0022 5.924a8.28 8.28 0 01-2.357.634 4.07 4.07 0 001.804-2.234 8.19 8.19 0 01-2.605.98A4.1 4.1 0 0016.616 4c-2.27 0-4.107 1.812-4.107 4.046 0 .317.036.625.105.921C8.283 8.82 5.1 7.1 3 4.525a4.026 4.026 0 00-.555 2.034c0 1.403.722 2.643 1.82 3.368a4.105 4.105 0 01-1.86-.508v.05c0 1.96 1.41 3.6 3.285 3.97a4.093 4.093 0 01-1.853.07c.522 1.604 2.037 2.77 3.833 2.8A8.233 8.233 0 012 18.408a11.616 11.616 0 006.29 1.84" />
            </svg>
          </a>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareJobDialog;