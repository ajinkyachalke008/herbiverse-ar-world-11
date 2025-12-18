import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseElevenLabsSTTOptions {
  onResult?: (transcript: string) => void;
  onError?: (error: string) => void;
}

interface UseElevenLabsSTTReturn {
  isListening: boolean;
  transcript: string;
  partialTranscript: string;
  startListening: () => Promise<void>;
  stopListening: () => void;
  error: string | null;
}

export function useElevenLabsSTT(options: UseElevenLabsSTTOptions = {}): UseElevenLabsSTTReturn {
  const { onResult, onError } = options;
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [partialTranscript, setPartialTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const wsRef = useRef<WebSocket | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopListening = useCallback(() => {
    console.log('Stopping ElevenLabs STT...');
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    
    setIsListening(false);
  }, []);

  const startListening = useCallback(async () => {
    setError(null);
    setTranscript('');
    setPartialTranscript('');

    try {
      console.log('Getting ElevenLabs scribe token...');
      const { data, error: tokenError } = await supabase.functions.invoke('elevenlabs-scribe-token');
      
      if (tokenError || !data?.token) {
        throw new Error(tokenError?.message || 'Failed to get token');
      }

      console.log('Got token, requesting microphone access...');
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        }
      });
      streamRef.current = stream;

      console.log('Connecting to ElevenLabs WebSocket...');
      const ws = new WebSocket(
        `wss://api.elevenlabs.io/v1/speech-to-text/realtime?token=${data.token}&model_id=scribe_v2_realtime`
      );
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('ElevenLabs WebSocket connected');
        setIsListening(true);

        // Send session config
        ws.send(JSON.stringify({
          type: 'session_config',
          commit_strategy: 'vad',
          audio_format: {
            type: 'pcm',
            sample_rate: 16000,
            encoding: 'pcm_s16le'
          }
        }));

        // Start recording audio
        const audioContext = new AudioContext({ sampleRate: 16000 });
        const source = audioContext.createMediaStreamSource(stream);
        const processor = audioContext.createScriptProcessor(4096, 1, 1);

        processor.onaudioprocess = (e) => {
          if (ws.readyState === WebSocket.OPEN) {
            const inputData = e.inputBuffer.getChannelData(0);
            const int16Data = new Int16Array(inputData.length);
            
            for (let i = 0; i < inputData.length; i++) {
              const s = Math.max(-1, Math.min(1, inputData[i]));
              int16Data[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
            }

            // Convert to base64
            const uint8Array = new Uint8Array(int16Data.buffer);
            let binary = '';
            for (let i = 0; i < uint8Array.length; i++) {
              binary += String.fromCharCode(uint8Array[i]);
            }
            const base64Audio = btoa(binary);

            ws.send(JSON.stringify({
              type: 'audio',
              audio: base64Audio
            }));
          }
        };

        source.connect(processor);
        processor.connect(audioContext.destination);
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('ElevenLabs STT message:', data.type);

          if (data.type === 'partial_transcript') {
            setPartialTranscript(data.text || '');
          } else if (data.type === 'committed_transcript') {
            const finalText = data.text || '';
            setTranscript(prev => prev + (prev ? ' ' : '') + finalText);
            setPartialTranscript('');
            onResult?.(finalText);
          } else if (data.type === 'error') {
            console.error('ElevenLabs STT error:', data);
            setError(data.message || 'Transcription error');
            onError?.(data.message || 'Transcription error');
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };

      ws.onerror = (event) => {
        console.error('ElevenLabs WebSocket error:', event);
        setError('Connection error');
        onError?.('Connection error');
        stopListening();
      };

      ws.onclose = () => {
        console.log('ElevenLabs WebSocket closed');
        setIsListening(false);
      };

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start listening';
      console.error('Error starting ElevenLabs STT:', err);
      setError(errorMessage);
      onError?.(errorMessage);
      stopListening();
    }
  }, [onResult, onError, stopListening]);

  return {
    isListening,
    transcript,
    partialTranscript,
    startListening,
    stopListening,
    error,
  };
}
