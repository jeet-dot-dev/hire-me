import React from 'react';
import { Button } from '@/components/ui/button';
import { useInterviewCreditsCheck } from '@/hooks/useInterviewCredits';
import { AlertCircle, Lock } from 'lucide-react';

interface ProtectedActionButtonProps {
  children: React.ReactNode;
  onAction: () => void;
  onUpgradeRequired?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg';
  className?: string;
  disabled?: boolean;
}

export function ProtectedActionButton({
  children,
  onAction,
  onUpgradeRequired,
  variant = 'default',
  size = 'default',
  className = '',
  disabled = false,
  ...props
}: ProtectedActionButtonProps) {
  const { credits, loading, hasCredits, checkCreditsBeforeAction } = useInterviewCreditsCheck();

  const handleClick = () => {
    if (disabled) return;

    checkCreditsBeforeAction(
      onAction,
      onUpgradeRequired || (() => {
        // Show default upgrade message
        alert('Free tier limit reached. Please upgrade to continue.');
      })
    );
  };

  // Show loading state
  if (loading) {
    return (
      <Button 
        variant={variant} 
        size={size} 
        className={className} 
        disabled 
        {...props}
      >
        Loading...
      </Button>
    );
  }

  // Show credits exhausted state
  if (!hasCredits) {
    return (
      <Button 
        variant="outline" 
        size={size} 
        className={`${className} border-red-500/50 text-red-400 hover:bg-red-500/10`}
        onClick={handleClick}
        {...props}
      >
        <Lock className="w-4 h-4 mr-2" />
        Upgrade to Apply
      </Button>
    );
  }

  // Show low credits warning
  const isLowCredits = credits && credits.creditsRemaining <= 1;

  return (
    <div className="relative">
      <Button 
        variant={variant} 
        size={size} 
        className={className}
        onClick={handleClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </Button>
      {isLowCredits && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-yellow-500 text-black rounded-full p-1">
            <AlertCircle className="w-3 h-3" />
          </div>
        </div>
      )}
    </div>
  );
}

// Higher-order component for protecting any component with credit checks
export function withCreditProtection<T extends object>(
  Component: React.ComponentType<T>,
  onInsufficientCredits?: () => void
) {
  return function ProtectedComponent(props: T) {
    const { hasCredits, loading } = useInterviewCreditsCheck();

    if (loading) {
      return <div>Loading...</div>;
    }

    if (!hasCredits) {
      return (
        <div className="text-center p-6 bg-red-500/10 border border-red-500/20 rounded-lg">
          <Lock className="w-8 h-8 text-red-400 mx-auto mb-2" />
          <h3 className="text-red-400 font-semibold mb-2">Free Tier Limit Reached</h3>
          <p className="text-red-300 text-sm mb-3">
            You&apos;ve used all your free interview attempts. Upgrade to continue.
          </p>
          <Button 
            onClick={onInsufficientCredits || (() => alert('Upgrade feature coming soon!'))}
            className="bg-red-600 hover:bg-red-700"
          >
            Upgrade Now
          </Button>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
