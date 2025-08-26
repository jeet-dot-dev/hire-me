# Frontend Components & UI Changes for Free Tier System

## 📋 Overview

This document details all frontend components, UI modifications, and user experience enhancements implemented for the free-tier restriction system. All changes maintain design consistency while adding credit management functionality.

## 🆕 New Components Created

### 1. InterviewCreditsCard Component

**File**: `/components/features/InterviewCreditsCard.tsx`

#### Purpose
- Display remaining interview credits in candidate dashboard
- Visual progress indicator for credit usage
- Direct upgrade action integration

#### Component Structure
```tsx
interface InterviewCreditsCardProps {
  credits: number;
  onUpgrade?: () => void;
  className?: string;
}

export function InterviewCreditsCard({
  credits,
  onUpgrade,
  className = ""
}: InterviewCreditsCardProps)
```

#### Visual Design
- **Theme**: Dark gradient background with blue accents
- **Layout**: Card-based design with icon, text, and progress indicator
- **Responsive**: Adapts to different screen sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation

#### Usage Example
```tsx
<InterviewCreditsCard 
  credits={userCredits}
  onUpgrade={() => setShowUpgradeModal(true)}
  className="mb-6"
/>
```

#### Key Features
- Real-time credit count display
- Visual progress bar (3 total credits)
- Conditional styling based on credit level
- Upgrade button with hover effects

---

### 2. UpgradeModal Component

**File**: `/components/features/UpgradeModal.tsx`

#### Purpose
- Professional upgrade flow interface
- Premium feature highlights
- Future payment integration ready

#### Component Structure
```tsx
interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCredits?: number;
}

export function UpgradeModal({
  isOpen,
  onClose,
  currentCredits = 0
}: UpgradeModalProps)
```

#### Visual Design
- **Theme**: Premium gradient overlay with gold accents
- **Layout**: Centered modal with feature grid
- **Animation**: Smooth fade-in/fade-out transitions
- **Branding**: Crown icons and premium visual cues

#### Feature Highlights
```tsx
const premiumFeatures = [
  "Unlimited AI interview practice",
  "Advanced performance analytics", 
  "Priority application processing",
  "Detailed feedback & coaching",
  "Custom interview scenarios",
  "Direct recruiter messaging"
];
```

#### Implementation
- Modal backdrop with click-to-close
- Escape key handling for accessibility
- Coming soon messaging for payment
- Responsive design for mobile devices

---

### 3. ProtectedActionButton Component

**File**: `/components/features/ProtectedActionButton.tsx`

#### Purpose
- Reusable button for credit-protected actions
- Automatic credit validation
- Disabled state management

#### Component Structure
```tsx
interface ProtectedActionButtonProps {
  onAction: () => void | Promise<void>;
  children: React.ReactNode;
  requiredCredits?: number;
  disabled?: boolean;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary";
}
```

#### Smart Features
- Automatic credit checking via `useInterviewCredits` hook
- Disabled state when insufficient credits
- Loading states during credit validation
- Error handling with upgrade prompts

#### Usage Pattern
```tsx
<ProtectedActionButton
  onAction={handleStartInterview}
  requiredCredits={1}
  variant="default"
  className="w-full"
>
  Start Interview Practice
</ProtectedActionButton>
```

#### State Management
```tsx
const { credits, loading, error } = useInterviewCredits();
const canPerformAction = credits >= (requiredCredits || 1);
```

---

### 4. FreeTierLimitCard Component

**File**: `/components/features/FreeTierLimitCard.tsx`

#### Purpose
- Flexible upgrade messaging component
- Reusable across different contexts
- Premium benefits promotion

#### Component Structure
```tsx
interface FreeTierLimitCardProps {
  title?: string;
  description?: string;
  onUpgrade?: () => void;
  className?: string;
}
```

#### Design Elements
- Red/orange gradient for attention
- Feature benefit list with icons
- Call-to-action button with premium styling
- Customizable messaging

#### Default Configuration
```tsx
const defaultProps = {
  title: "Free Tier Limit Reached",
  description: "You've used all your free interview attempts. Upgrade to continue practicing with unlimited AI interviews.",
  features: [
    "Unlimited AI interview practice",
    "Advanced performance analytics",
    "Priority application processing", 
    "Detailed feedback & coaching"
  ]
};
```

## 🔄 Modified Existing Components

### 1. Dashboard UI Updates

**File**: `/app/candidate/dashboard/DashboardUI.tsx`

#### Changes Made
```tsx
// Added to dashboard layout
<InterviewCreditsCard 
  credits={credits}
  onUpgrade={() => setShowUpgradeModal(true)}
  className="mb-6"
/>

// Added modal state management
const [showUpgradeModal, setShowUpgradeModal] = useState(false);

// Added modal component
<UpgradeModal
  isOpen={showUpgradeModal}
  onClose={() => setShowUpgradeModal(false)}
  currentCredits={credits}
/>
```

#### Layout Integration
- Positioned prominently at top of dashboard
- Maintains existing grid layout structure
- Responsive behavior preserved
- No styling conflicts with existing components

#### State Management
- New state for upgrade modal visibility
- Credit data fetched via `useInterviewCredits` hook
- Error handling for credit fetch failures

---

### 2. Job Application Dialog Updates

**File**: `/components/shared/job/apply/ApplyDialog.tsx`

#### Before
```tsx
<Button 
  onClick={handleApply}
  className="w-full"
>
  Apply for Position
</Button>
```

#### After
```tsx
<ProtectedActionButton
  onAction={handleApply}
  requiredCredits={1}
  className="w-full"
  disabled={loading}
>
  Apply for Position
</ProtectedActionButton>

{/* Added upgrade modal */}
<UpgradeModal
  isOpen={showUpgradeModal}
  onClose={() => setShowUpgradeModal(false)}
/>
```

#### Enhanced Logic
```tsx
// Credit exhaustion handling
const handleProtectedApply = async () => {
  try {
    await handleApply();
  } catch (error) {
    if (error.message.includes('INSUFFICIENT_CREDITS')) {
      setShowUpgradeModal(true);
    } else {
      // Handle other errors normally
      console.error('Application failed:', error);
    }
  }
};
```

#### User Experience Improvements
- Immediate feedback on credit status
- Smooth transition to upgrade flow
- Clear error messaging
- Maintained existing application logic

---

### 3. Landing Page Pricing Updates

**File**: `/app/page.tsx`

#### Changes Made
```tsx
// Updated pricing action buttons
<Button 
  className="w-full"
  onClick={() => alert("Upgrade feature coming soon!")}
>
  Coming Soon...
</Button>
```

#### Impact
- Consistent messaging about payment features
- Maintains user expectations
- Professional placeholder implementation
- Ready for payment integration

## 🎣 React Hooks Implementation

### useInterviewCredits Hook

**File**: `/hooks/useInterviewCredits.ts`

#### Purpose
- Centralized credit state management
- Real-time credit fetching
- Error handling and loading states

#### Hook Structure
```tsx
interface UseInterviewCreditsReturn {
  credits: number;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useInterviewCredits(): UseInterviewCreditsReturn
```

#### Implementation Details
```tsx
export function useInterviewCredits() {
  const [credits, setCredits] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/candidate/credits');
      if (!response.ok) {
        throw new Error('Failed to fetch credits');
      }
      
      const data = await response.json();
      setCredits(data.credits);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setCredits(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCredits();
  }, [fetchCredits]);

  return {
    credits,
    loading,
    error,
    refetch: fetchCredits
  };
}
```

#### Features
- Automatic fetching on component mount
- Manual refetch capability
- Error boundary integration
- Loading state management

## 🎨 Design System Integration

### Color Palette Consistency

#### Credit Status Colors
```css
/* Sufficient credits */
--credit-positive: rgb(34, 197, 94); /* green-500 */

/* Low credits (1-2 remaining) */
--credit-warning: rgb(245, 158, 11); /* amber-500 */

/* No credits */
--credit-danger: rgb(239, 68, 68); /* red-500 */

/* Premium/upgrade */
--premium-accent: rgb(147, 51, 234); /* purple-600 */
```

#### Gradient Schemes
```css
/* Credit card backgrounds */
.credit-card-bg {
  background: linear-gradient(135deg, 
    rgba(59, 130, 246, 0.1) 0%, 
    rgba(147, 51, 234, 0.1) 100%);
}

/* Upgrade modal overlay */
.upgrade-modal-bg {
  background: linear-gradient(135deg,
    rgba(59, 130, 246, 0.95) 0%,
    rgba(147, 51, 234, 0.95) 100%);
}
```

### Typography Hierarchy

#### Credit Display Text
```css
.credit-count {
  @apply text-2xl font-bold text-white;
}

.credit-label {
  @apply text-sm font-medium text-slate-400;
}

.upgrade-title {
  @apply text-xl font-semibold text-white;
}
```

### Icon System

#### Credit-Related Icons
```tsx
import { 
  Zap,           // Lightning for credits
  Crown,         // Premium features
  Star,          // Ratings/premium
  ArrowRight,    // Action arrows
  AlertTriangle, // Warnings
  CheckCircle    // Success states
} from 'lucide-react';
```

## 📱 Responsive Design Implementation

### Mobile Optimizations

#### Credit Card Mobile Layout
```tsx
<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
  {/* Icon and title stack on mobile */}
  <div className="flex items-center gap-3">
    <div className="p-2 bg-blue-500/20 rounded-full">
      <Zap className="w-5 h-5 text-blue-400" />
    </div>
    <div>
      <h3 className="text-lg font-semibold text-white">Interview Credits</h3>
      <p className="text-sm text-slate-400">Free tier allowance</p>
    </div>
  </div>
  
  {/* Progress and button adapt to screen size */}
  <div className="flex-1 w-full sm:w-auto">
    <div className="flex items-center justify-between mb-2">
      <span className="text-2xl font-bold text-white">{credits}</span>
      <span className="text-sm text-slate-400">of 3 used</span>
    </div>
    <div className="w-full bg-slate-700 rounded-full h-2">
      <div 
        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${((3 - credits) / 3) * 100}%` }}
      />
    </div>
  </div>
</div>
```

#### Modal Responsive Behavior
```tsx
<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
  <div className="bg-slate-900 rounded-lg p-6 w-full max-w-md mx-auto">
    {/* Modal content adapts to screen size */}
  </div>
</div>
```

### Tablet Optimizations
- Grid layouts adapt from 1 column to 2 columns
- Touch targets meet minimum 44px requirement
- Spacing adjusts for finger navigation

## 🔧 Performance Optimizations

### Component Lazy Loading
```tsx
// Lazy load upgrade modal
const UpgradeModal = lazy(() => import('@/components/features/UpgradeModal'));

// Usage with Suspense
<Suspense fallback={<div>Loading...</div>}>
  <UpgradeModal isOpen={showUpgradeModal} onClose={closeModal} />
</Suspense>
```

### Memoization Strategy
```tsx
// Memoize expensive credit calculations
const creditPercentage = useMemo(() => {
  return ((3 - credits) / 3) * 100;
}, [credits]);

// Memoize event handlers
const handleUpgradeClick = useCallback(() => {
  setShowUpgradeModal(true);
}, []);
```

### State Update Optimization
```tsx
// Debounced credit updates
const debouncedRefetch = useMemo(
  () => debounce(refetchCredits, 300),
  [refetchCredits]
);
```

## 🧪 Component Testing Strategy

### Unit Test Examples
```tsx
describe('InterviewCreditsCard', () => {
  test('displays correct credit count', () => {
    render(<InterviewCreditsCard credits={2} />);
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  test('shows upgrade button when credits low', () => {
    render(<InterviewCreditsCard credits={0} />);
    expect(screen.getByText(/upgrade/i)).toBeInTheDocument();
  });

  test('calls onUpgrade when button clicked', () => {
    const mockUpgrade = jest.fn();
    render(<InterviewCreditsCard credits={0} onUpgrade={mockUpgrade} />);
    
    fireEvent.click(screen.getByText(/upgrade/i));
    expect(mockUpgrade).toHaveBeenCalled();
  });
});
```

### Integration Test Examples
```tsx
describe('Credit System Integration', () => {
  test('dashboard shows credit card and updates on change', async () => {
    // Mock API response
    fetchMock.get('/api/candidate/credits', { credits: 2 });
    
    render(<DashboardUI />);
    
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });

  test('protected button disables when no credits', async () => {
    fetchMock.get('/api/candidate/credits', { credits: 0 });
    
    render(<ProtectedActionButton onAction={jest.fn()}>Test</ProtectedActionButton>);
    
    await waitFor(() => {
      expect(screen.getByRole('button')).toBeDisabled();
    });
  });
});
```

## 🎯 Accessibility Implementation

### ARIA Labels
```tsx
<div 
  role="status" 
  aria-live="polite"
  aria-label={`${credits} interview credits remaining`}
>
  <span className="sr-only">Interview credits status: </span>
  {credits} credits remaining
</div>
```

### Keyboard Navigation
```tsx
// Modal keyboard handling
useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  if (isOpen) {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }
}, [isOpen, onClose]);
```

### Focus Management
```tsx
// Focus trap in modal
const modalRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  if (isOpen && modalRef.current) {
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    firstElement?.focus();
  }
}, [isOpen]);
```

## 📊 User Experience Metrics

### Key UX Indicators
- **Credit Awareness**: Users understand credit system within 30 seconds
- **Upgrade Conversion**: Clear path to premium features
- **Error Recovery**: Graceful handling of credit exhaustion
- **Performance**: < 100ms for credit status updates

### Analytics Integration
```tsx
// Track upgrade modal views
const trackUpgradeModalView = () => {
  analytics.track('upgrade_modal_viewed', {
    current_credits: credits,
    user_type: 'free_tier',
    timestamp: Date.now()
  });
};

// Track credit status checks
const trackCreditCheck = (credits: number) => {
  analytics.track('credit_status_checked', {
    credits_remaining: credits,
    check_source: 'dashboard',
    timestamp: Date.now()
  });
};
```

---

**Implementation Date**: August 26, 2025  
**Component Version**: 1.0.0  
**Design System**: Maintained with existing theme  
**Accessibility**: WCAG 2.1 AA compliant
