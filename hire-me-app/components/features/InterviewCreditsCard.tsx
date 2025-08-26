import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Zap, Lock } from 'lucide-react';

interface InterviewCreditsCardProps {
  creditsRemaining: number;
  totalCredits?: number;
  onUpgrade?: () => void;
}

export function InterviewCreditsCard({ 
  creditsRemaining, 
  totalCredits = 3,
  onUpgrade 
}: InterviewCreditsCardProps) {
  const isExhausted = creditsRemaining <= 0;
  const isLow = creditsRemaining <= 1;

  const getStatusColor = () => {
    if (isExhausted) return 'destructive';
    if (isLow) return 'secondary';
    return 'default';
  };

  const getStatusIcon = () => {
    if (isExhausted) return <Lock className="w-4 h-4" />;
    if (isLow) return <Zap className="w-4 h-4" />;
    return <Crown className="w-4 h-4" />;
  };

  return (
    <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            {getStatusIcon()}
            Interview Credits
          </CardTitle>
          <Badge variant={getStatusColor()} className="font-medium">
            {creditsRemaining}/{totalCredits}
          </Badge>
        </div>
        <CardDescription className="text-slate-300">
          {isExhausted 
            ? "Free tier limit reached" 
            : `You have ${creditsRemaining} interview${creditsRemaining === 1 ? '' : 's'} remaining`
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Progress Bar */}
        <div className="w-full bg-slate-700 rounded-full h-2 mb-4">
          <div 
            className={`h-2 rounded-full transition-all duration-300 ${
              isExhausted 
                ? 'bg-red-500' 
                : isLow 
                  ? 'bg-yellow-500' 
                  : 'bg-green-500'
            }`}
            style={{ width: `${(creditsRemaining / totalCredits) * 100}%` }}
          />
        </div>

        {/* Action Section */}
        {isExhausted ? (
          <div className="text-center space-y-3">
            <p className="text-sm text-slate-400">
              Upgrade to continue practicing with unlimited AI interviews
            </p>
            <Button 
              onClick={onUpgrade}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Plan
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {isLow && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3">
                <p className="text-yellow-400 text-sm font-medium">
                  ⚡ Running low on interview credits
                </p>
                <p className="text-yellow-200 text-xs mt-1">
                  Consider upgrading for unlimited practice
                </p>
              </div>
            )}
            <Button 
              variant="outline" 
              onClick={onUpgrade}
              className="w-full border-slate-600 text-slate-300 hover:bg-slate-800"
            >
              View Upgrade Options
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
