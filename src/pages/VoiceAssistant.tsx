import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, Send, ArrowLeft, Scan, Stethoscope, Heart, Bot, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useVoiceRecognition } from '@/hooks/useVoiceRecognition';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const VoiceAssistant: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const { speak, stop, isSpeaking, isSupported: ttsSupported } = useTextToSpeech({ rate: 0.9 });
  
  const { 
    isListening, 
    transcript, 
    startListening, 
    stopListening, 
    isSupported: sttSupported,
    error: sttError
  } = useVoiceRecognition({
    onResult: (text) => {
      if (text.trim()) {
        setInputText(text);
        // Auto-send after voice input
        setTimeout(() => sendMessageWithText(text), 500);
      }
    }
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (isListening && transcript) {
      setInputText(transcript);
    }
  }, [transcript, isListening]);

  const sendMessageWithText = async (text: string) => {
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
        },
      });

      if (error) throw error;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || 'I apologize, but I could not generate a response.',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);

      if (autoSpeak && ttsSupported) {
        speak(assistantMessage.content);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = () => sendMessageWithText(inputText);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const toggleVoiceInput = () => {
    if (isSpeaking) stop();
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const quickActions = [
    { label: 'Scan Plant', icon: Scan, path: '/', action: 'scan' },
    { label: 'Check Symptoms', icon: Stethoscope, path: '/symptom-checker' },
    { label: 'Health Profile', icon: Heart, path: '/health-profile' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full pt-20">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                  <Bot className="h-6 w-6 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="font-bold text-xl text-foreground">Voice Assistant</h1>
                  <p className="text-sm text-muted-foreground">Speak or type your questions</p>
                </div>
              </div>
            </div>
            {ttsSupported && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoSpeak(!autoSpeak)}
                className={autoSpeak ? 'border-primary text-primary' : ''}
              >
                {autoSpeak ? <Volume2 className="h-4 w-4 mr-2" /> : <VolumeX className="h-4 w-4 mr-2" />}
                Auto-speak {autoSpeak ? 'On' : 'Off'}
              </Button>
            )}
          </div>
        </div>

        {/* Messages Area */}
        <ScrollArea ref={scrollRef} className="flex-1 p-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-8">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="h-24 w-24 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center mb-6"
              >
                <Bot className="h-12 w-12 text-primary" />
              </motion.div>
              <h2 className="text-2xl font-bold text-foreground mb-3">Hello! I'm Herbiverse AI</h2>
              <p className="text-muted-foreground max-w-md mb-8">
                Your voice-enabled herbal medicine assistant. Ask me about medicinal plants, 
                natural remedies, or describe your health concerns for personalized guidance.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-lg mb-8">
                {quickActions.map((action) => (
                  <Button
                    key={action.label}
                    variant="outline"
                    onClick={() => navigate(action.path)}
                    className="flex items-center gap-2 h-auto py-3"
                  >
                    <action.icon className="h-5 w-5 text-primary" />
                    <span>{action.label}</span>
                  </Button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  'What herbs help with anxiety?',
                  'Benefits of turmeric',
                  'Natural sleep remedies',
                  'Herbs for digestion'
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInputText(suggestion)}
                    className="px-4 py-2 rounded-full bg-muted text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4 pb-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  <div className={`h-10 w-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-gradient-to-r from-primary/20 to-accent/20'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="h-5 w-5" />
                    ) : (
                      <Bot className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <div className={`max-w-[75%] ${message.role === 'user' ? 'text-right' : ''}`}>
                    <div className={`inline-block p-4 rounded-2xl ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-muted rounded-tl-sm'
                    }`}>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                    {message.role === 'assistant' && ttsSupported && (
                      <button
                        onClick={() => isSpeaking ? stop() : speak(message.content)}
                        className="mt-2 text-sm text-muted-foreground hover:text-primary flex items-center gap-1"
                      >
                        <Volume2 className="h-4 w-4" />
                        {isSpeaking ? 'Stop reading' : 'Read aloud'}
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}

              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary" />
                  </div>
                  <div className="bg-muted p-4 rounded-2xl rounded-tl-sm">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Voice Input Area */}
        <div className="p-4 border-t border-border bg-background/95 backdrop-blur">
          {/* Voice button */}
          {sttSupported && (
            <div className="flex justify-center mb-4">
              <motion.button
                onClick={toggleVoiceInput}
                whileTap={{ scale: 0.95 }}
                className={`h-20 w-20 rounded-full flex items-center justify-center transition-all ${
                  isListening 
                    ? 'bg-red-500 text-white shadow-lg shadow-red-500/50 animate-pulse' 
                    : 'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40'
                }`}
              >
                {isListening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
              </motion.button>
            </div>
          )}
          
          {isListening && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-sm text-muted-foreground mb-4"
            >
              {transcript || 'Listening... Speak now'}
            </motion.p>
          )}

          {sttError && (
            <p className="text-center text-sm text-destructive mb-4">{sttError}</p>
          )}

          {/* Text input */}
          <div className="flex items-center gap-2">
            <Input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Or type your question here..."
              className="flex-1"
              disabled={isLoading || isListening}
            />
            <Button
              onClick={sendMessage}
              disabled={!inputText.trim() || isLoading}
              size="icon"
              className="h-10 w-10"
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VoiceAssistant;
