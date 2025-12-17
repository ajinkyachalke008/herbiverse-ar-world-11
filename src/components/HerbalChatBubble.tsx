import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Mic, MicOff, Send, Volume2, VolumeX, Loader2, Bot, User, Radio } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { useWakeWordDetection } from '@/hooks/useWakeWordDetection';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

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

  const { speak, stop, isSpeaking, isSupported: ttsSupported } = useTextToSpeech({ rate: 0.9 });
  
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    isSupported: sttSupported 
  } = useVoiceRecognition({
    onResult: (text) => {
      setInputText(text);
    }
  });

  // Wake word detection callback
  const handleWakeWordDetected = useCallback(() => {
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
  }, [sttSupported, startListening]);

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
  const toggleWakeWord = useCallback(() => {
    if (wakeWordEnabled) {
      stopWakeWordDetection();
      setWakeWordEnabled(false);
      toast.info('Wake word detection disabled');
    } else {
      startWakeWordDetection();
      setWakeWordEnabled(true);
      toast.success('Say "Hey Herbiverse" to activate!', {
        description: 'Wake word detection is now active',
        duration: 3000
      });
    }
  }, [wakeWordEnabled, startWakeWordDetection, stopWakeWordDetection]);

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

  // Update input with live transcript
  useEffect(() => {
    if (isListening && transcript) {
      setInputText(transcript);
    }
  }, [transcript, isListening]);

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

      // Auto-speak response if enabled
      if (autoSpeak && ttsSupported) {
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

  const toggleVoiceInput = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
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
            {/* Wake word toggle button */}
            {wakeWordSupported && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Button
                  onClick={toggleWakeWord}
                  variant="outline"
                  size="sm"
                  className={`rounded-full shadow-md transition-all ${
                    wakeWordEnabled 
                      ? 'bg-primary/10 border-primary text-primary animate-pulse' 
                      : 'bg-card border-border text-muted-foreground'
                  }`}
                >
                  <Radio className={`h-4 w-4 mr-2 ${wakeWordEnabled ? 'text-primary' : ''}`} />
                  {wakeWordEnabled ? 'Listening for "Hey Herbiverse"' : 'Enable Wake Word'}
                </Button>
              </motion.div>
            )}
            
            {/* Main chat button with wake word indicator */}
            <div className="relative">
              {wakeWordEnabled && isWakeWordDetecting && (
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-green-500 border-2 border-card"
                />
              )}
              <Button
                onClick={() => setIsOpen(true)}
                className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-accent shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all"
              >
                <MessageCircle className="h-6 w-6" />
              </Button>
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
                {ttsSupported && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setAutoSpeak(!autoSpeak)}
                    className={autoSpeak ? 'text-primary' : 'text-muted-foreground'}
                  >
                    {autoSpeak ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </Button>
                )}
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
                      {message.role === 'assistant' && ttsSupported && (
                        <button
                          onClick={() => speakMessage(message.content)}
                          className="mt-1 text-xs text-muted-foreground hover:text-primary flex items-center gap-1"
                        >
                          <Volume2 className="h-3 w-3" />
                          {isSpeaking ? 'Stop' : 'Read aloud'}
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
                  placeholder={isListening ? 'Listening...' : 'Ask about herbs, remedies...'}
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
