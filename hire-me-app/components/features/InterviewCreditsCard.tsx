import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Crown } from 'lucide-react';

interface InterviewCreditsCardProps {
  credits: number;
  onUpgrade?: () => void;
  className?: string;
}

export function InterviewCreditsCard({
  credits,
  onUpgrade,
  className = ""
}: InterviewCreditsCardProps) {
  return (
    <Card className={`bg-black border-white/20 ${className} w-full`}>
      <CardContent className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-6">
          {/* Left Section - Credits Info */}
          <div className="flex items-center gap-4 flex-1">
            <div className="p-3 bg-white/10 rounded-full shrink-0">
              <Zap className="w-6 h-6 text-white" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-2xl md:text-3xl font-bold text-white">
                  {credits}
                </span>
                <span className="text-sm text-white/60">of 3 interviews remaining</span>
              </div>
              
              <div className="w-full max-w-[200px] bg-white/20 rounded-full h-2 mb-1">
                <div 
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(credits / 3) * 100}%` }}
                />
              </div>
              
              <p className="text-sm text-white/60">
                Free tier allowance
              </p>
            </div>
          </div>

          {/* Right Section - Upgrade Info & Button */}
          <div className="flex flex-col md:flex-row items-start md:items-center  gap-4 md:gap-6 w-full md:w-auto">
            {credits <= 1 && (
              <div className="text-center md:text-right flex-1 md:flex-initial">
                <p className="text-white font-medium mb-1">
                  {credits === 0 ? "Credits exhausted!" : "Running low on credits"}
                </p>
                <p className="text-sm text-white/60">
                  Upgrade to continue practicing interviews
                </p>
              </div>
            )}
            
            <Button 
              onClick={onUpgrade || (() => alert("Upgrade feature coming soon!"))}
              className="w-full md:w-auto cursor-pointer bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center gap-2 px-6 py-3 shrink-0"
            >
              <Crown className="w-4 h-4" />
              <span>Upgrade to Premium</span>
            
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}