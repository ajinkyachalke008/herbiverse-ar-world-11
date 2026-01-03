import { useState, useCallback, useRef, useEffect } from 'react';

interface UseWakeWordDetectionOptions {
  wakeWord?: string;
  onWakeWordDetected?: () => void;
  enabled?: boolean;
}

interface UseWakeWordDetectionReturn {
  isDetecting: boolean;
  startDetection: () => void;
  stopDetection: () => void;
  isSupported: boolean;
  lastHeard: string;
}

// Type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

export function useWakeWordDetection(options: UseWakeWordDetectionOptions = {}): UseWakeWordDetectionReturn {
  const { 
    wakeWord = 'hey herbiverse', 
    onWakeWordDetected, 
    enabled = true 
  } = options;
  
  const [isDetecting, setIsDetecting] = useState(false);
  const [lastHeard, setLastHeard] = useState('');
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isActiveRef = useRef(false);

  const isSupported = typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const normalizeText = (text: string): string => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const checkWakeWord = useCallback((transcript: string): boolean => {
    const normalized = normalizeText(transcript);
    const normalizedWakeWord = normalizeText(wakeWord);

    // Make matching resilient to spacing / common misrecognitions.
    const t = normalized.replace(/\s+/g, '');
    const w = normalizedWakeWord.replace(/\s+/g, '');

    // Prefer a distinctive keyword match ("herbiverse" is uncommon, good signal).
    const keywordsNoSpaces = [
      w,
      'heyherbiverse',
      'herbiverse',
      'heyherbverse',
      'herbverse',
      'heyherbalverse',
      'herbalverse',
      'heyherbiverseai',
      'herbiverseai',
      // very common speech-recognition mishears
      'heyherbivores',
      'herbivores',
    ];

    return keywordsNoSpaces.some((k) => k && t.includes(k));
  }, [wakeWord]);

  const startRecognition = useCallback(() => {
    if (!recognitionRef.current || !isActiveRef.current) return;
    
    try {
      recognitionRef.current.start();
      setIsDetecting(true);
    } catch (err) {
      // Recognition might already be running
      console.log('Wake word detection restart attempt');
    }
  }, []);

  useEffect(() => {
    if (!isSupported) {
      console.log('Wake word detection: Speech Recognition not supported');
      return;
    }

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognitionClass();
    recognitionRef.current.continuous = true;
    recognitionRef.current.interimResults = true;
    recognitionRef.current.lang = 'en-US';

    recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
      const results = Array.from({ length: event.results.length }, (_, i) => event.results[i]);
      const transcript = results
        .map(result => result[0].transcript)
        .join(' ');
      
      setLastHeard(transcript);
      console.log('Wake word detection heard:', transcript);
      
      if (checkWakeWord(transcript)) {
        console.log('Wake word detected!', transcript);
        // Stop detection temporarily to prevent multiple triggers
        recognitionRef.current?.stop();
        setIsDetecting(false);
        onWakeWordDetected?.();
        
        // Clear the last heard after wake word detected
        setTimeout(() => setLastHeard(''), 500);
      }
    };

    recognitionRef.current.onerror = (event: SpeechRecognitionErrorEvent) => {
      console.log('Wake word detection error:', event.error);
      if (event.error === 'not-allowed') {
        console.error('Microphone access denied for wake word detection');
        setIsDetecting(false);
        return;
      }
      
      // For other errors, try to restart after a delay
      if (isActiveRef.current && event.error !== 'aborted') {
        restartTimeoutRef.current = setTimeout(() => {
          startRecognition();
        }, 1000);
      }
    };

    recognitionRef.current.onend = () => {
      console.log('Wake word detection ended, isActive:', isActiveRef.current);
      // Auto-restart if still active (for continuous listening)
      if (isActiveRef.current) {
        restartTimeoutRef.current = setTimeout(() => {
          startRecognition();
        }, 100);
      } else {
        setIsDetecting(false);
      }
    };

    return () => {
      isActiveRef.current = false;
      if (restartTimeoutRef.current) {
        clearTimeout(restartTimeoutRef.current);
      }
      recognitionRef.current?.abort();
    };
  }, [isSupported, checkWakeWord, onWakeWordDetected, startRecognition]);

  const startDetection = useCallback(() => {
    if (!recognitionRef.current) {
      console.log('Wake word: No recognition instance available');
      return;
    }
    
    console.log('Wake word: Starting detection');
    isActiveRef.current = true;
    startRecognition();
  }, [startRecognition]);

  const stopDetection = useCallback(() => {
    console.log('Wake word: Stopping detection');
    isActiveRef.current = false;
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
    }
    recognitionRef.current?.stop();
    setIsDetecting(false);
  }, []);

  return {
    isDetecting,
    startDetection,
    stopDetection,
    isSupported,
    lastHeard,
  };
}
