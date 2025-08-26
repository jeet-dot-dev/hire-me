import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useInterviewCredits } from '@/hooks/useInterviewCredits';
import { UpgradeModal } from './UpgradeModal';
import { Crown, Loader2, AlertCircle, Lock } from 'lucide-react';

interface ProtectedActionButtonProps {
  onAction: () => void | Promise<void>;
  children: React.ReactNode;
  requiredCredits?: number;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function ProtectedActionButton({
  onAction,
  children,
  requiredCredits = 1,
  disabled = false,
  className = "",
  variant = "default"
}: ProtectedActionButtonProps) {
  const { credits, loading, error } = useInterviewCredits();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const currentCredits = credits?.creditsRemaining || 0;
  const hasEnoughCredits = currentCredits >= requiredCredits;
  const isDisabled = disabled || loading || !hasEnoughCredits;

  const handleClick = async () => {
    if (!hasEnoughCredits) {
      setShowUpgradeModal(true);
      return;
    }

    try {
      setActionLoading(true);
      await onAction();
    } catch (error) {
      console.error('Protected action failed:', error);
      // Check if error is related to credits
      if (error instanceof Error && error.message.includes('INSUFFICIENT_CREDITS')) {
        setShowUpgradeModal(true);
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Error state
  if (error) {
    return (
      <Button
        disabled
        className={`bg-white/10 text-white/60 border-white/20 cursor-not-allowed ${className}`}
        variant="outline"
      >
        <span className="text-xs sm:text-sm">Error loading credits</span>
      </Button>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Button
        disabled
        className={`bg-white/10 text-white border-white/20 ${className}`}
        variant="outline"
      >
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        <span className="text-xs sm:text-sm">Checking credits...</span>
      </Button>
    );
  }

  // No credits state
  if (!hasEnoughCredits) {
    return (
      <>
        <Button
          onClick={handleClick}
          className={`bg-white/10 text-white border-white/20 hover:bg-white/20 transition-colors duration-200 ${className}`}
          variant="outline"
        >
          <Crown className="w-4 h-4 mr-2" />
          <span className="text-xs sm:text-sm">Upgrade Required</span>
        </Button>
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          currentCredits={currentCredits}
        />
      </>
    );
  }

  // Normal state with credits available
  const buttonVariants = {
    default: "bg-white text-black hover:bg-white/90",
    destructive: "bg-white text-black hover:bg-white/90",
    outline: "border-white/20 text-white hover:bg-white/10",
    secondary: "bg-white/10 text-white hover:bg-white/20",
    ghost: "text-white hover:bg-white/10",
    link: "text-white underline hover:text-white/80"
  };

  return (
    <div className="relative">
      <Button
        onClick={handleClick}
        disabled={isDisabled || actionLoading}
        className={`${buttonVariants[variant]} transition-colors duration-200 ${className}`}
        variant={variant === "default" ? undefined : variant}
      >
        {actionLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            <span className="text-xs sm:text-sm">Processing...</span>
          </>
        ) : (
          <>
            {children}
            {currentCredits <= 1 && currentCredits > 0 && (
              <span className="ml-2 text-xs opacity-60">
                ({currentCredits} left)
              </span>
            )}
          </>
        )}
      </Button>
      
      {/* Low credits warning indicator */}
      {currentCredits <= 1 && currentCredits > 0 && (
        <div className="absolute -top-2 -right-2">
          <div className="bg-white text-black rounded-full p-1">
            <AlertCircle className="w-3 h-3" />
          </div>
        </div>
      )}
      
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        currentCredits={currentCredits}
      />
    </div>
  );
}

// Higher-order component for protecting any component with credit checks
export function withCreditProtection<T extends object>(
  Component: React.ComponentType<T>,
  onInsufficientCredits?: () => void
) {
  return function ProtectedComponent(props: T) {
    const { credits, loading } = useInterviewCredits();
    const currentCredits = credits?.creditsRemaining || 0;
    const hasCredits = currentCredits > 0;

    if (loading) {
      return (
        <div className="flex items-center justify-center p-4">
          <Loader2 className="w-6 h-6 animate-spin text-white" />
          <span className="ml-2 text-white text-sm">Loading...</span>
        </div>
      );
    }

    if (!hasCredits) {
      return (
        <div className="text-center p-4 sm:p-6 bg-white/5 border border-white/20 rounded-lg">
          <Lock className="w-6 h-6 sm:w-8 sm:h-8 text-white mx-auto mb-2" />
          <h3 className="text-white font-semibold mb-2 text-sm sm:text-base">Free Tier Limit Reached</h3>
          <p className="text-white/60 text-xs sm:text-sm mb-3 leading-relaxed">
            You&apos;ve used all your free interview attempts. Upgrade to continue.
          </p>
          <Button 
            onClick={onInsufficientCredits || (() => alert('Upgrade feature coming soon!'))}
            className="bg-white text-black hover:bg-white/90 text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-2"
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade Now
          </Button>
        </div>
      );
    }

    return <Component {...props} />;
  };
}
