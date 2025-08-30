import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Zap, Check, X, Star, Shield, Headphones } from 'lucide-react';
import { toast } from 'sonner';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCredits?: number;
}

export function UpgradeModal({ 
  isOpen, 
  onClose, 
  currentCredits = 0 
}: UpgradeModalProps) {
  const premiumFeatures = [
    {
      icon: Zap,
      title: "Unlimited AI Interviews",
      description: "Practice as many times as you want"
    },
    {
      icon: Star,
      title: "Advanced Analytics",
      description: "Detailed performance insights and progress tracking"
    },
    {
      icon: Shield,
      title: "Priority Processing",
      description: "Skip the queue with priority application processing"
    },
    {
      icon: Headphones,
      title: "Expert Coaching",
      description: "Detailed feedback and personalized improvement suggestions"
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-white/20 text-white max-w-md sm:max-w-lg lg:max-w-2xl xl:max-w-3xl mx-4 p-0" showCloseButton={false}>
        <DialogHeader className="space-y-3 p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/10 rounded-full">
                <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <DialogTitle className="text-lg sm:text-xl font-bold text-white">
                  Upgrade to Premium
                </DialogTitle>
                <DialogDescription className="text-white/60 text-sm mt-1">
                  Unlock unlimited potential
                </DialogDescription>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-white/60 hover:text-white hover:bg-white/10 p-2 h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6">
          {/* Current Status */}
          <div className="bg-white/5 border border-white/20 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/80 text-sm font-medium">Current Status</span>
              <span className="text-white font-semibold text-sm bg-white/10 px-2 py-1 rounded">Free Tier</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/80 text-sm">Credits Remaining</span>
              <span className="text-white font-bold">{currentCredits}/3</span>
            </div>
          </div>

          {/* Premium Features */}
          <div className="mb-4">
            <h3 className="text-white font-semibold text-base mb-3">Premium Features</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              {premiumFeatures.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-start gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="p-2 bg-white/10 rounded-full flex-shrink-0">
                      <IconComponent className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm leading-tight mb-1">
                        {feature.title}
                      </h4>
                      <p className="text-white/60 text-xs leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                    <Check className="w-4 h-4 text-white mt-0.5 flex-shrink-0" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coming Soon Section */}
          <div className="bg-white/5 border border-white/20 rounded-lg p-4 text-center mb-4">
            <div className="text-xl font-bold text-white mb-1">Coming Soon</div>
            <p className="text-white/60 text-sm">
              Premium features are being finalized. Stay tuned for launch!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => toast.info("🚀 We'll notify you as soon as premium features are available!", {
                description: "Get ready for unlimited interviews and advanced AI features"
              })}
              className="flex-1 bg-white text-black hover:bg-white/90 cursor-pointer transition-colors duration-200 py-2.5 text-sm font-medium"
            >
              <Crown className="w-4 h-4 mr-2" />
              Notify Me When Available
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 border-white/20 hover:text-white hover:bg-black text-black cursor-pointer py-2.5 text-sm"
            >
              Maybe Later
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}