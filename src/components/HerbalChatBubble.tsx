import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Mic, MicOff, Send, Volume2, VolumeX, Loader2, Bot, User, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useElevenLabsSTT } from '@/hooks/useElevenLabsSTT';
import { useElevenLabsTTS } from '@/hooks/useElevenLabsTTS';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import WaveformAnimation from './WaveformAnimation';
import { useIsMobile } from '@/hooks/use-mobile';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const HerbalChatBubble: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  const [isPushToTalkActive, setIsPushToTalkActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const isMobile = useIsMobile();

  // Push-to-talk refs
  const pttActiveRef = useRef(false);
  const pttTranscriptRef = useRef('');
  const pttCancelOnConnectRef = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // ElevenLabs TTS for natural voice
  const { speak, stop, isSpeaking, isLoading: ttsLoading } = useElevenLabsTTS({
    onError: (error) => {
      console.error('TTS error:', error);
      toast.error('Voice playback failed');
    }
  });
  
  // Function to send message
  const doSendMessage = async (text: string, forceSpeak: boolean = false) => {
    if (!text.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const messageHistory = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const { data, error } = await supabase.functions.invoke('deepseek-chat', {
        body: {
          messages: [...messageHistory, { role: 'user', content: userMessage.content }],
          stream: false,
          context: user ? { healthProfile: null } : undefined,
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || 'I apologize, but I could not generate a response. Please try again.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Auto-speak response if enabled OR if triggered by push-to-talk
      if (autoSpeak || forceSpeak) {
        speak(assistantMessage.content);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again later.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // ElevenLabs STT for accurate voice transcription
  const { 
    isListening, 
    transcript, 
    partialTranscript,
    startListening, 
    stopListening, 
    error: sttError
  } = useElevenLabsSTT({
    onResult: (text) => {
      if (pttActiveRef.current) {
        // Accumulate transcript during push-to-talk
        pttTranscriptRef.current += (pttTranscriptRef.current ? ' ' : '') + text;
      } else {
        setInputText(prev => prev + (prev ? ' ' : '') + text);
      }
    },
    onError: (error) => {
      console.error('STT error:', error);
      toast.error('Voice recognition failed');
    }
  });
  
  const sttSupported = typeof navigator !== 'undefined' && !!navigator.mediaDevices?.getUserMedia;

  const isSpaceKey = (e: KeyboardEvent) =>
    e.code === 'Space' || e.key === ' ' || e.key === 'Spacebar';

  // Push-to-talk: Start listening when spacebar is pressed (in chat)
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Only activate if chat is open and spacebar pressed
    if (!isOpen) return;
    if (!isSpaceKey(e)) return;
    if (e.repeat) return;

    // If focus is in a text field, only allow PTT when it's empty (prevents breaking normal typing)
    const activeElement = document.activeElement as HTMLElement | null;
    const isTextField =
      activeElement?.tagName === 'INPUT' ||
      activeElement?.tagName === 'TEXTAREA' ||
      (activeElement as HTMLElement | null)?.isContentEditable;

    if (isTextField) {
      const value = (activeElement as HTMLInputElement | HTMLTextAreaElement).value ?? '';
      if (value.trim().length > 0) return;
      // Ensure Space doesn't insert a character
      activeElement?.blur();
    }

    // Prevent page scroll / focused-button activation
    e.preventDefault();

    // Don't restart if already active
    if (pttActiveRef.current) return;

    pttCancelOnConnectRef.current = false;
    pttActiveRef.current = true;
    pttTranscriptRef.current = '';
    setIsPushToTalkActive(true);

    if (sttSupported) {
      // Note: startListening is async internally; PTT cancel is handled in a separate effect
      void startListening();
    }
  }, [isOpen, sttSupported, startListening]);

  // Push-to-talk: Stop listening and send when spacebar is released
  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (!isSpaceKey(e)) return;
    if (!pttActiveRef.current) return;

    e.preventDefault();

    // If the STT connection hasn't fully started yet, mark cancel so we can stop on connect.
    if (!isListening) {
      pttCancelOnConnectRef.current = true;
    }

    pttActiveRef.current = false;
    setIsPushToTalkActive(false);

    stopListening();

    // Small delay to ensure final transcript is captured
    setTimeout(() => {
      const finalText = pttTranscriptRef.current.trim();
      if (finalText) {
        // Send the message and force speak the response
        doSendMessage(finalText, true);
      }
      pttTranscriptRef.current = '';
    }, 300);
  }, [isListening, stopListening, doSendMessage]);

  // Mobile PTT handlers
  const handleMobilePTTStart = useCallback(() => {
    if (pttActiveRef.current) return;
    
    pttActiveRef.current = true;
    pttTranscriptRef.current = '';
    setIsPushToTalkActive(true);
    
    if (sttSupported) {
      startListening();
    }
  }, [sttSupported, startListening]);

  const handleMobilePTTEnd = useCallback(() => {
    if (!pttActiveRef.current) return;
    
    pttActiveRef.current = false;
    setIsPushToTalkActive(false);
    
    if (isListening) {
      stopListening();
    }
    
    // Small delay to ensure final transcript is captured
    setTimeout(() => {
      const finalText = pttTranscriptRef.current.trim();
      if (finalText) {
        doSendMessage(finalText, true);
      }
      pttTranscriptRef.current = '';
    }, 300);
  }, [isListening, stopListening, doSendMessage]);

  // Add/remove keyboard listeners
  useEffect(() => {
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen, handleKeyDown, handleKeyUp]);

  // Clean up when chat closes
  useEffect(() => {
    if (!isOpen && isListening) {
      stopListening();
      pttActiveRef.current = false;
      pttTranscriptRef.current = '';
      pttCancelOnConnectRef.current = false;
      setIsPushToTalkActive(false);
    }
  }, [isOpen, isListening, stopListening]);

  // If user released Space before STT fully connected, stop immediately once it connects.
  useEffect(() => {
    if (isListening && !pttActiveRef.current && pttCancelOnConnectRef.current) {
      pttCancelOnConnectRef.current = false;
      stopListening();
    }
  }, [isListening, stopListening]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Update input with live partial transcript (only for non-PTT mode)
  useEffect(() => {
    if (isListening && partialTranscript && !isPushToTalkActive) {
      setInputText(prev => {
        const baseText = prev.replace(/\s*\[.*\]$/, '');
        return baseText + (baseText ? ' ' : '') + `[${partialTranscript}]`;
      });
    }
  }, [partialTranscript, isListening, isPushToTalkActive]);

  const sendMessage = () => {
    doSendMessage(inputText);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleVoiceInput = async () => {
    if (isListening) {
      stopListening();
      setInputText(prev => prev.replace(/\s*\[.*\]$/, ''));
    } else {
      setInputText('');
      await startListening();
    }
  };

  const speakMessage = (content: string) => {
    if (isSpeaking) {
      stop();
    } else {
      speak(content);
    }
  };

  return (
    <>
      {/* Floating chat button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2"
          >
            {/* Push-to-talk hint */}
            {sttSupported && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card/90 backdrop-blur-sm border border-border rounded-full px-3 py-1.5 shadow-md flex items-center gap-2"
              >
                <Keyboard className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Hold <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px] font-mono">Space</kbd> to talk</span>
              </motion.div>
            )}
            
            <Button
              onClick={() => setIsOpen(true)}
              className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] max-w-md h-[70vh] max-h-[600px] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-primary/10 to-accent/10">
              <div className="flex items-center gap-3">
                 <div className={`h-10 w-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center ${isSpeaking || isListening ? 'animate-pulse' : ''}`}
                 >
                   <Bot className="h-5 w-5 text-primary-foreground" />
                 </div>
                 <div>
                   <h3 className="font-semibold text-foreground">Herbiverse AI</h3>
                   <p className="text-xs text-muted-foreground">
                     {isSpeaking
                       ? '🔊 Speaking...'
                       : isPushToTalkActive
                         ? '🎤 Recording...'
                         : isListening
                           ? '🎤 Recording...'
                           : isMobile
                             ? 'Hold mic to talk'
                             : 'Hold Space to talk'}
                   </p>
                 </div>

              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setAutoSpeak(!autoSpeak)}
                  className={autoSpeak ? 'text-primary' : 'text-muted-foreground'}
                  title={autoSpeak ? 'Auto-speak enabled' : 'Enable auto-speak'}
                >
                  {ttsLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : autoSpeak ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    if (isListening) stopListening();
                    pttActiveRef.current = false;
                    setIsPushToTalkActive(false);
                    setIsOpen(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Push-to-talk indicator bar */}
            <AnimatePresence>
              {isPushToTalkActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-gradient-to-r from-red-500/20 to-orange-500/20 px-4 py-3 flex items-center gap-3 border-b border-red-500/30"
                >
                  <div className="relative">
                    <Mic className="h-5 w-5 text-red-500" />
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="absolute inset-0 rounded-full bg-red-500/30"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <WaveformAnimation isActive={true} barCount={8} color="bg-red-500" />
                      <span className="text-sm text-red-600 font-medium">Push-to-Talk Active</span>
                    </div>
                    {partialTranscript && (
                      <p className="text-xs text-muted-foreground mt-1 italic">"{partialTranscript}"</p>
                    )}
                  </div>
                  <kbd className="px-2 py-1 bg-red-500/20 rounded text-xs font-mono text-red-600">Space</kbd>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Speaking indicator bar */}
            <AnimatePresence>
              {isSpeaking && !isPushToTalkActive && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="bg-gradient-to-r from-primary/20 to-accent/20 px-4 py-2 flex items-center gap-3 border-b border-primary/20"
                >
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ height: [8, 16, 8] }}
                        transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                        className="w-1 bg-primary rounded-full"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-primary font-medium">AI is speaking...</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={stop}
                    className="ml-auto text-primary hover:text-primary/80 h-7 px-2"
                  >
                    Stop
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Messages */}
            <ScrollArea ref={scrollRef} className="flex-1 p-4">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-medium text-foreground mb-2">Welcome to Herbiverse AI!</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    Ask me about medicinal plants, herbal remedies, or health concerns.
                  </p>
                  <div className="bg-muted/50 rounded-lg px-4 py-2 mb-4">
                    <p className="text-xs text-muted-foreground flex items-center gap-2">
                      {isMobile ? (
                        <>
                          <Mic className="h-3 w-3" />
                          Hold the mic button to speak
                        </>
                      ) : (
                        <>
                          <Keyboard className="h-3 w-3" />
                          Hold <kbd className="px-1.5 py-0.5 bg-background rounded text-[10px] font-mono">Space</kbd> to speak
                        </>
                      )}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2 justify-center">
                    {['What herbs help with sleep?', 'Tell me about Ashwagandha', 'Natural remedies for headaches'].map((suggestion) => (
                      <button
                        key={suggestion}
                        onClick={() => setInputText(suggestion)}
                        className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                  >
                    <div className={`h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-gradient-to-r from-primary/20 to-accent/20'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4 text-primary" />
                      )}
                    </div>
                    <div className={`max-w-[80%] ${message.role === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block p-3 rounded-2xl ${
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground rounded-tr-sm'
                          : 'bg-muted rounded-tl-sm'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      </div>
                      {message.role === 'assistant' && (
                        <button
                          onClick={() => speakMessage(message.content)}
                          disabled={ttsLoading}
                          className="mt-1 text-xs text-muted-foreground hover:text-primary flex items-center gap-1 disabled:opacity-50"
                        >
                          {ttsLoading ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <Volume2 className="h-3 w-3" />
                          )}
                          {isSpeaking ? 'Stop' : ttsLoading ? 'Loading...' : 'Read aloud'}
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}

                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                      <Bot className="h-4 w-4 text-primary" />
                    </div>
                    <div className="bg-muted p-3 rounded-2xl rounded-tl-sm">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                    </div>
                  </motion.div>
                )}
              </div>
            </ScrollArea>

            {/* Input area */}
            <div className="p-4 border-t border-border bg-background/50">
              <div className="flex items-center gap-2">
                {/* Mobile Push-to-Talk button */}
                {isMobile && sttSupported && (
                  <Button
                    variant={isPushToTalkActive ? "default" : "outline"}
                    size="icon"
                    className={`flex-shrink-0 transition-all touch-none select-none ${
                      isPushToTalkActive 
                        ? 'bg-red-500 hover:bg-red-600 text-white scale-110 animate-pulse' 
                        : 'text-muted-foreground hover:text-primary'
                    }`}
                    onTouchStart={(e) => {
                      e.preventDefault();
                      handleMobilePTTStart();
                    }}
                    onTouchEnd={(e) => {
                      e.preventDefault();
                      handleMobilePTTEnd();
                    }}
                    onTouchCancel={(e) => {
                      e.preventDefault();
                      handleMobilePTTEnd();
                    }}
                    onMouseDown={handleMobilePTTStart}
                    onMouseUp={handleMobilePTTEnd}
                    onMouseLeave={() => {
                      if (isPushToTalkActive) handleMobilePTTEnd();
                    }}
                    title="Hold to talk"
                  >
                    <Mic className={`h-5 w-5 ${isPushToTalkActive ? 'animate-pulse' : ''}`} />
                  </Button>
                )}
                
                {/* Desktop click-to-toggle voice input */}
                {!isMobile && sttSupported && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleVoiceInput}
                    className={`flex-shrink-0 ${isListening && !isPushToTalkActive ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`}
                    title="Click to toggle voice input"
                  >
                    {isListening && !isPushToTalkActive ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                )}
                
                <Input
                  ref={inputRef}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isPushToTalkActive ? 'Listening...' : isListening ? 'Speaking...' : isMobile ? 'Hold mic to talk...' : 'Type or hold Space...'}
                  className="flex-1 bg-muted border-0"
                  disabled={isLoading || isPushToTalkActive}
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputText.trim() || isLoading}
                  size="icon"
                  className="flex-shrink-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default HerbalChatBubble;
