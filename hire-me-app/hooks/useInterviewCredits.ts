import { useState, useEffect } from 'react';

interface InterviewCreditsData {
  creditsRemaining: number;
  totalCredits: number;
  candidateId: string;
  candidateName: string;
}

interface UseInterviewCreditsResult {
  credits: InterviewCreditsData | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
  hasCredits: boolean;
}

export function useInterviewCredits(): UseInterviewCreditsResult {
  const [credits, setCredits] = useState<InterviewCreditsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCredits = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/candidate/credits');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch credits');
      }
      
      setCredits(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching interview credits:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCredits();
  }, []);

  return {
    credits,
    loading,
    error,
    refetch: fetchCredits,
    hasCredits: credits ? credits.creditsRemaining > 0 : false
  };
}

export function useInterviewCreditsCheck() {
  const { credits, loading, hasCredits } = useInterviewCredits();

  const checkCreditsBeforeAction = (action: () => void, onInsufficientCredits?: () => void) => {
    if (!loading && !hasCredits) {
      if (onInsufficientCredits) {
        onInsufficientCredits();
      } else {
        alert('Free tier limit reached. Please upgrade to continue.');
      }
      return false;
    }
    
    if (!loading && hasCredits) {
      action();
      return true;
    }
    
    return false;
  };

  return {
    credits,
    loading,
    hasCredits,
    checkCreditsBeforeAction
  };
}
