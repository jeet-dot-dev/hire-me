import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Zap, ArrowRight, Check } from 'lucide-react';

interface FreeTierLimitCardProps {
  title?: string;
  description?: string;
  onUpgrade?: () => void;
  className?: string;
}

export function FreeTierLimitCard({
  title = "Free Tier Limit Reached",
  description = "You've used all your free interview attempts. Upgrade to continue practicing with unlimited AI interviews.",
  onUpgrade,
  className = ""
}: FreeTierLimitCardProps) {
  const upgradeFeatures = [
    "Unlimited AI interview practice",
    "Advanced performance analytics", 
    "Priority application processing",
    "Detailed feedback & coaching"
  ];

  return (
    <Card className={`bg-black border-white/20 ${className}`}>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <div className="p-2 bg-white/10 rounded-full flex-shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-white text-lg sm:text-xl">{title}</CardTitle>
            <CardDescription className="text-white/60 text-sm leading-relaxed mt-1">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white/5 border border-white/20 rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-4 h-4 text-white" />
              <span className="text-white font-semibold text-sm sm:text-base">Upgrade Benefits</span>
            </div>
            <ul className="space-y-2">
              {upgradeFeatures.map((feature, index) => (
                <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-white/80">
                  <Check className="w-3 h-3 sm:w-4 sm:h-4 text-white mt-0.5 flex-shrink-0" />
                  <span className="leading-tight">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <Button 
            onClick={onUpgrade || (() => alert("Upgrade feature coming soon!"))}
            className="w-full bg-white text-black hover:bg-white/90 transition-colors duration-200 flex items-center justify-center gap-2 py-2 sm:py-3"
          >
            <Crown className="w-4 h-4" />
            <span className="text-sm sm:text-base">Upgrade Now</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook to quickly show upgrade prompts
export function useUpgradePrompt() {
  const showUpgradeAlert = (message?: string) => {
    alert(message || "Free tier limit reached. Upgrade feature coming soon!");
  };

  return { showUpgradeAlert };
}
