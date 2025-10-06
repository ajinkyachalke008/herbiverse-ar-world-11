import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Loader2 } from 'lucide-react';
import type { Language } from '@/hooks/useTranslation';

interface LanguageSwitcherProps {
  currentLanguage: Language;
  onLanguageChange: (lang: Language) => void;
  isTranslating?: boolean;
}

const languages = [
  { code: 'en' as Language, label: 'English', flag: '🌐' },
  { code: 'hi' as Language, label: 'हिंदी', flag: '🇮🇳' },
  { code: 'mr' as Language, label: 'मराठी', flag: '🚩' },
];

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLanguage,
  onLanguageChange,
  isTranslating = false,
}) => {
  return (
    <ToggleGroup
      type="single"
      value={currentLanguage}
      onValueChange={(value) => value && onLanguageChange(value as Language)}
      className="justify-end gap-1.5"
    >
      {languages.map((lang) => (
        <ToggleGroupItem
          key={lang.code}
          value={lang.code}
          disabled={isTranslating}
          className="
            relative
            px-2.5 py-1.5
            text-xs sm:text-sm
            font-medium
            border-2
            rounded-lg
            transition-all
            duration-300
            ease-in-out
            
            /* Default state */
            border-primary/30
            bg-transparent
            text-foreground
            shadow-sm
            
            /* Hover state */
            hover:scale-105
            hover:border-primary/60
            hover:shadow-[0_0_15px_hsl(var(--primary)/0.3)]
            
            /* Active/Selected state */
            data-[state=on]:bg-primary/10
            data-[state=on]:border-primary
            data-[state=on]:text-primary
            data-[state=on]:shadow-[0_0_10px_hsl(var(--primary)/0.5)]
            data-[state=on]:font-semibold
            
            /* Disabled state */
            disabled:opacity-50
            disabled:cursor-not-allowed
            disabled:hover:scale-100
            disabled:hover:border-primary/30
            disabled:hover:shadow-sm
          "
        >
          <span className="flex items-center gap-1.5">
            <span className="text-sm sm:text-base">{lang.flag}</span>
            <span className="hidden sm:inline">{lang.label}</span>
            <span className="inline sm:hidden">
              {lang.code.toUpperCase()}
            </span>
            {isTranslating && currentLanguage === lang.code && (
              <Loader2 className="w-3 h-3 animate-spin ml-0.5" />
            )}
          </span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
};
