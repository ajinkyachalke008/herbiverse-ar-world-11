import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Mic, MicOff, Send, Volume2, VolumeX, Loader2, Bot, User, Radio, Bell, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useElevenLabsSTT } from '@/hooks/useElevenLabsSTT';
import { useElevenLabsTTS } from '@/hooks/useElevenLabsTTS';
import { useWakeWordDetection } from '@/hooks/useWakeWordDetection';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import WaveformAnimation from './WaveformAnimation';

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
  const [wakeWordEnabled, setWakeWordEnabled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  // ElevenLabs TTS for natural voice
  const { speak, stop, isSpeaking, isLoading: ttsLoading } = useElevenLabsTTS({
    onError: (error) => {
      console.error('TTS error:', error);
      toast.error('Voice playback failed');
    }
  });
  
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
      setInputText(prev => prev + (prev ? ' ' : '') + text);
    },
    onError: (error) => {
      console.error('STT error:', error);
      toast.error('Voice recognition failed');
    }
  });
  
  const sttSupported = typeof navigator !== 'undefined' && 'mediaDevices' in navigator;

  // Push notifications
  const { 
    isSupported: notificationsSupported, 
    permission: notificationPermission,
    requestPermission: requestNotificationPermission,
    sendNotification 
  } = usePushNotifications();

  // Wake word detection callback
  const handleWakeWordDetected = useCallback(() => {
    // Send push notification
    if (notificationPermission === 'granted') {
      sendNotification('🌿 Herbiverse Activated!', {
        body: 'I heard "Hey Herbiverse" - ready to help with herbal guidance!',
        tag: 'wake-word',
      });
    }
    
    toast.success('👋 Hey! I heard you!', { 
      description: 'Opening Herbiverse AI assistant...',
      duration: 2000 
    });
    setIsOpen(true);
    // Start listening for the actual query after a brief delay
    setTimeout(() => {
      if (sttSupported) {
        startListening();
      }
    }, 500);
  }, [sttSupported, startListening, notificationPermission, sendNotification]);

  const { 
    isDetecting: isWakeWordDetecting, 
    startDetection: startWakeWordDetection, 
    stopDetection: stopWakeWordDetection,
    isSupported: wakeWordSupported 
  } = useWakeWordDetection({
    wakeWord: 'hey herbiverse',
    onWakeWordDetected: handleWakeWordDetected,
    enabled: wakeWordEnabled && !isOpen, // Only detect when chat is closed
  });

  // Toggle wake word detection
  const toggleWakeWord = useCallback(async () => {
    if (wakeWordEnabled) {
      stopWakeWordDetection();
      setWakeWordEnabled(false);
      toast.info('Wake word detection disabled');
    } else {
      // Request notification permission when enabling wake word
      if (notificationsSupported && notificationPermission !== 'granted') {
        const granted = await requestNotificationPermission();
        if (granted) {
          toast.success('Notifications enabled for wake word alerts');
        }
      }
      
      startWakeWordDetection();
      setWakeWordEnabled(true);
      toast.success('Say "Hey Herbiverse" to activate!', {
        description: 'Wake word detection is now active',
        duration: 3000
      });
    }
  }, [wakeWordEnabled, startWakeWordDetection, stopWakeWordDetection, notificationsSupported, notificationPermission, requestNotificationPermission]);

  // Stop wake word detection when chat opens, restart when closed
  useEffect(() => {
    if (isOpen && wakeWordEnabled) {
      stopWakeWordDetection();
    } else if (!isOpen && wakeWordEnabled) {
      startWakeWordDetection();
    }
  }, [isOpen, wakeWordEnabled, startWakeWordDetection, stopWakeWordDetection]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Update input with live partial transcript
  useEffect(() => {
    if (isListening && partialTranscript) {
      // Show partial transcript as placeholder effect
      setInputText(prev => {
        const baseText = prev.replace(/\s*\[.*\]$/, ''); // Remove any previous partial
        return baseText + (baseText ? ' ' : '') + `[${partialTranscript}]`;
      });
    }
  }, [partialTranscript, isListening]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputText.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Build message history for context
      const messageHistory = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));

      const { data, error } = await supabase.functions.invoke('deepseek-chat', {
        body: {
          messages: [...messageHistory, { role: 'user', content: userMessage.content }],
          stream: false,
          context: user ? { healthProfile: null } : undefined, // Could load user health profile here
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

      // Auto-speak response if enabled (using ElevenLabs)
      if (autoSpeak) {
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleVoiceInput = async () => {
    if (isListening) {
      stopListening();
      // Clean up partial transcript markers
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
            {/* Wake word toggle button with waveform */}
            {wakeWordSupported && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="flex items-center gap-2"
              >
                {/* Waveform visualization when detecting */}
                <AnimatePresence>
                  {wakeWordEnabled && isWakeWordDetecting && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="bg-card/90 backdrop-blur-sm border border-primary/30 rounded-full px-4 py-2 shadow-lg"
                    >
                      <div className="flex items-center gap-2">
                        <WaveformAnimation isActive={true} barCount={5} color="bg-primary" />
                        <span className="text-xs text-primary font-medium">Listening...</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                <Button
                  onClick={toggleWakeWord}
                  variant="outline"
                  size="sm"
                  className={`rounded-full shadow-md transition-all ${
                    wakeWordEnabled 
                      ? 'bg-primary/10 border-primary text-primary' 
                      : 'bg-card border-border text-muted-foreground'
                  }`}
                >
                  <Radio className={`h-4 w-4 mr-2 ${wakeWordEnabled ? 'text-primary' : ''}`} />
                  {wakeWordEnabled ? '"Hey Herbiverse"' : 'Enable Wake Word'}
                  {notificationsSupported && (
                    <span className="ml-2">
                      {notificationPermission === 'granted' ? (
                        <Bell className="h-3 w-3 text-primary" />
                      ) : (
                        <BellOff className="h-3 w-3 text-muted-foreground" />
                      )}
                    </span>
                  )}
                </Button>
              </motion.div>
            )}
            
            {/* Main chat button with wake word indicator */}
            <div className="relative">
              {wakeWordEnabled && isWakeWordDetecting && (
                <motion.div
                  animate={{ 
                    scale: [1, 1.3, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                  className="absolute -inset-2 rounded-full bg-primary/20"
                />
              )}
              <Button
                onClick={() => setIsOpen(true)}
                className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all relative z-10"
              >
                <MessageCircle className="h-6 w-6" />
              </Button>
              {wakeWordEnabled && isWakeWordDetecting && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-card z-20"
                />
              )}
            </div>
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
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Herbiverse AI</h3>
                  <p className="text-xs text-muted-foreground">Voice-enabled herbal assistant</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setAutoSpeak(!autoSpeak)}
                  className={autoSpeak ? 'text-primary' : 'text-muted-foreground'}
                  title={autoSpeak ? 'Auto-speak enabled (ElevenLabs)' : 'Enable auto-speak'}
                >
                  {ttsLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : autoSpeak ? (
                    <Volume2 className="h-4 w-4" />
                  ) : (
                    <VolumeX className="h-4 w-4" />
                  )}
                </Button>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea ref={scrollRef} className="flex-1 p-4">
              {messages.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-center p-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Bot className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-medium text-foreground mb-2">Welcome to Herbiverse AI!</h4>
                  <p className="text-sm text-muted-foreground">
                    Ask me about medicinal plants, herbal remedies, or health concerns. 
                    I can help with personalized recommendations.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-4 justify-center">
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
                {sttSupported && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleVoiceInput}
                    className={`flex-shrink-0 ${isListening ? 'text-red-500 animate-pulse' : 'text-muted-foreground'}`}
                  >
                    {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                )}
                <Input
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isListening ? 'Listening with ElevenLabs...' : 'Ask about herbs, remedies...'}
                  className="flex-1 bg-muted border-0"
                  disabled={isLoading}
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
