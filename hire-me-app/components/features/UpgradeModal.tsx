import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Zap, Check, Sparkles } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditsRemaining: number;
}

export function UpgradeModal({ isOpen, onClose, creditsRemaining }: UpgradeModalProps) {
  const features = [
    "Unlimited AI Interview Practice",
    "Advanced Performance Analytics",
    "Personalized Interview Coaching",
    "Priority Application Processing",
    "Advanced Resume Analysis",
    "Interview Recording & Playback"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto bg-slate-900 border-slate-700">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <Crown className="w-8 h-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Upgrade to Pro
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            {creditsRemaining === 0 
              ? "You've used all your free interviews. Upgrade to continue practicing!"
              : "Unlock unlimited interviews and advanced features"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Status */}
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-yellow-500" />
                  <span className="text-slate-200 font-medium">Free Plan</span>
                </div>
                <Badge variant="secondary">
                  {creditsRemaining}/3 interviews left
                </Badge>
              </div>
              {creditsRemaining === 0 && (
                <p className="text-red-400 text-sm mt-2">
                  ❌ No more free interviews available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Pro Features */}
          <Card className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <Crown className="w-5 h-5 text-blue-400" />
                <span className="text-white font-semibold">Pro Plan Benefits</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-slate-300">
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Coming Soon Section */}
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <span className="text-amber-400 font-semibold">Coming Soon</span>
            </div>
            <p className="text-amber-200 text-sm">
              We&apos;re working hard to bring you premium features. Stay tuned for updates!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              Maybe Later
            </Button>
            <Button 
              onClick={() => {
                // TODO: Implement upgrade flow
                alert("Upgrade feature coming soon!");
                onClose();
              }}
              disabled
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50"
            >
              Upgrade Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
