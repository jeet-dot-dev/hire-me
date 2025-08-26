import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Zap, ArrowRight } from 'lucide-react';

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
  return (
    <Card className={`bg-gradient-to-br from-red-900/20 to-orange-900/20 border-red-500/30 ${className}`}>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-500/20 rounded-full">
            <Zap className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <CardTitle className="text-red-400">{title}</CardTitle>
            <CardDescription className="text-red-300">
              {description}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 font-semibold">Upgrade Benefits</span>
            </div>
            <ul className="text-sm text-slate-300 space-y-1">
              <li>• Unlimited AI interview practice</li>
              <li>• Advanced performance analytics</li>
              <li>• Priority application processing</li>
              <li>• Detailed feedback & coaching</li>
            </ul>
          </div>
          
          <Button 
            onClick={onUpgrade || (() => alert("Upgrade feature coming soon!"))}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade Now
            <ArrowRight className="w-4 h-4 ml-2" />
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
