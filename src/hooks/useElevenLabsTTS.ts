import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseElevenLabsTTSOptions {
  voiceId?: string;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (error: string) => void;
}

interface UseElevenLabsTTSReturn {
  speak: (text: string) => Promise<void>;
  stop: () => void;
  isSpeaking: boolean;
  isLoading: boolean;
  error: string | null;
}

// Available voice IDs
export const ELEVENLABS_VOICES = {
  george: 'JBFqnCBsd6RMkjVDRZzb', // George - British, warm
  sarah: 'EXAVITQu4vr4xnSDxMaL', // Sarah - American, friendly
  charlie: 'IKne3meq5aSn9XLyUdCD', // Charlie - Australian
  matilda: 'XrExE9yKIg1WjnnlVkGX', // Matilda - American, warm
  brian: 'nPczCjzI2devNBz1zQrb', // Brian - American, deep
  lily: 'pFZP5JQG7iQjIQuC4Bku', // Lily - British, gentle
};

export function useElevenLabsTTS(options: UseElevenLabsTTSOptions = {}): UseElevenLabsTTSReturn {
  const { 
    voiceId = ELEVENLABS_VOICES.george, 
    onStart, 
    onEnd, 
    onError 
  } = options;
  
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speak = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    // Stop any current audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error: functionError } = await supabase.functions.invoke('elevenlabs-tts', {
        body: { text, voiceId },
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      if (data.error) {
        throw new Error(data.error);
      }

      if (!data.audioContent) {
        throw new Error('No audio content received');
      }

      // Use data URI for base64 audio playback
      const audioUrl = `data:audio/mpeg;base64,${data.audioContent}`;
      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsSpeaking(true);
        setIsLoading(false);
        onStart?.();
      };

      audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
        onEnd?.();
      };

      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setIsSpeaking(false);
        setIsLoading(false);
        const errorMsg = 'Failed to play audio';
        setError(errorMsg);
        onError?.(errorMsg);
      };

      await audio.play();
    } catch (err) {
      console.error('ElevenLabs TTS error:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to generate speech';
      setError(errorMsg);
      setIsLoading(false);
      onError?.(errorMsg);
    }
  }, [voiceId, onStart, onEnd, onError]);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
      setIsSpeaking(false);
      onEnd?.();
    }
  }, [onEnd]);

  return {
    speak,
    stop,
    isSpeaking,
    isLoading,
    error,
  };
}
