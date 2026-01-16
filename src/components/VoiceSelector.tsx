import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, ChevronDown, Volume2 } from 'lucide-react';
import { ELEVENLABS_VOICES } from '@/hooks/useElevenLabsTTS';

export interface VoiceOption {
  id: string;
  name: string;
  description: string;
  voiceId: string;
}

export const VOICE_OPTIONS: VoiceOption[] = [
  { id: 'george', name: 'George', description: 'British, warm', voiceId: ELEVENLABS_VOICES.george },
  { id: 'sarah', name: 'Sarah', description: 'American, friendly', voiceId: ELEVENLABS_VOICES.sarah },
  { id: 'charlie', name: 'Charlie', description: 'Australian', voiceId: ELEVENLABS_VOICES.charlie },
  { id: 'matilda', name: 'Matilda', description: 'American, warm', voiceId: ELEVENLABS_VOICES.matilda },
  { id: 'brian', name: 'Brian', description: 'American, deep', voiceId: ELEVENLABS_VOICES.brian },
  { id: 'lily', name: 'Lily', description: 'British, gentle', voiceId: ELEVENLABS_VOICES.lily },
];

interface VoiceSelectorProps {
  selectedVoiceId: string;
  onVoiceChange: (voiceId: string) => void;
  disabled?: boolean;
}

const VoiceSelector: React.FC<VoiceSelectorProps> = ({
  selectedVoiceId,
  onVoiceChange,
  disabled = false,
}) => {
  const selectedVoice = VOICE_OPTIONS.find(v => v.voiceId === selectedVoiceId) || VOICE_OPTIONS[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          className="h-8 gap-1.5 text-muted-foreground hover:text-foreground"
        >
          <Volume2 className="h-3.5 w-3.5" />
          <span className="text-xs">{selectedVoice.name}</span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        {VOICE_OPTIONS.map((voice) => (
          <DropdownMenuItem
            key={voice.id}
            onClick={() => onVoiceChange(voice.voiceId)}
            className="flex items-center justify-between cursor-pointer"
          >
            <div>
              <span className="font-medium">{voice.name}</span>
              <span className="text-xs text-muted-foreground ml-2">{voice.description}</span>
            </div>
            {voice.voiceId === selectedVoiceId && (
              <Check className="h-4 w-4 text-primary" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default VoiceSelector;
