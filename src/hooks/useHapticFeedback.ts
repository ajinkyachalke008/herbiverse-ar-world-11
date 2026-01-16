import { useCallback } from 'react';

type HapticPattern = 'light' | 'medium' | 'heavy' | 'success' | 'warning' | 'error' | 'selection';

interface VibrationPatterns {
  light: number | number[];
  medium: number | number[];
  heavy: number | number[];
  success: number[];
  warning: number[];
  error: number[];
  selection: number;
}

const VIBRATION_PATTERNS: VibrationPatterns = {
  light: 10,
  medium: 25,
  heavy: 50,
  success: [10, 50, 20],
  warning: [30, 50, 30],
  error: [50, 100, 50, 100, 50],
  selection: 5,
};

export function useHapticFeedback() {
  const isSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const vibrate = useCallback((pattern: HapticPattern = 'medium') => {
    if (!isSupported) return false;

    try {
      const vibrationPattern = VIBRATION_PATTERNS[pattern];
      return navigator.vibrate(vibrationPattern);
    } catch (error) {
      console.warn('Haptic feedback failed:', error);
      return false;
    }
  }, [isSupported]);

  const vibrateStart = useCallback(() => {
    return vibrate('medium');
  }, [vibrate]);

  const vibrateStop = useCallback(() => {
    return vibrate('light');
  }, [vibrate]);

  const vibrateSuccess = useCallback(() => {
    return vibrate('success');
  }, [vibrate]);

  const vibrateError = useCallback(() => {
    return vibrate('error');
  }, [vibrate]);

  const vibrateSelection = useCallback(() => {
    return vibrate('selection');
  }, [vibrate]);

  const cancel = useCallback(() => {
    if (isSupported) {
      navigator.vibrate(0);
    }
  }, [isSupported]);

  return {
    isSupported,
    vibrate,
    vibrateStart,
    vibrateStop,
    vibrateSuccess,
    vibrateError,
    vibrateSelection,
    cancel,
  };
}
