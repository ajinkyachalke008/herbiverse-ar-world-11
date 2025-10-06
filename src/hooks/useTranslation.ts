import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type Language = 'en' | 'hi' | 'mr';

interface PlantData {
  commonName: string;
  scientificName: string;
  family: string;
  confidence: 'high' | 'medium' | 'low';
  identification: string;
  medicinalUses: string[];
  activeCompounds: string[];
  preparation: string[];
  dosage: string;
  safetyWarnings: string[];
  habitat: string;
  culturalSignificance: string;
  conservationStatus: string;
}

interface TranslationCache {
  data: PlantData;
  timestamp: number;
}

const CACHE_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 days
const MAX_CACHE_SIZE = 50;

export const useTranslation = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const { toast } = useToast();

  const getCacheKey = (scientificName: string, language: Language) => {
    return `plant_translation_${scientificName}_${language}`;
  };

  const getCachedTranslation = (scientificName: string, language: Language): PlantData | null => {
    if (language === 'en') return null; // No cache for English
    
    try {
      const cached = localStorage.getItem(getCacheKey(scientificName, language));
      if (!cached) return null;

      const parsedCache: TranslationCache = JSON.parse(cached);
      const isExpired = Date.now() - parsedCache.timestamp > CACHE_EXPIRY;

      if (isExpired) {
        localStorage.removeItem(getCacheKey(scientificName, language));
        return null;
      }

      return parsedCache.data;
    } catch {
      return null;
    }
  };

  const setCachedTranslation = (scientificName: string, language: Language, data: PlantData) => {
    try {
      // Simple LRU: Remove oldest if we're at capacity
      const allKeys = Object.keys(localStorage).filter(k => k.startsWith('plant_translation_'));
      if (allKeys.length >= MAX_CACHE_SIZE) {
        // Remove oldest entry
        const oldestKey = allKeys.reduce((oldest, key) => {
          const cached = JSON.parse(localStorage.getItem(key) || '{}') as TranslationCache;
          const oldestCached = JSON.parse(localStorage.getItem(oldest) || '{}') as TranslationCache;
          return (cached.timestamp || 0) < (oldestCached.timestamp || 0) ? key : oldest;
        });
        localStorage.removeItem(oldestKey);
      }

      const cacheData: TranslationCache = {
        data,
        timestamp: Date.now()
      };
      localStorage.setItem(getCacheKey(scientificName, language), JSON.stringify(cacheData));
    } catch (error) {
      console.warn('Failed to cache translation:', error);
    }
  };

  const translatePlantData = useCallback(async (
    plantData: PlantData,
    targetLanguage: Language
  ): Promise<PlantData> => {
    // Return original if English
    if (targetLanguage === 'en') {
      return plantData;
    }

    // Check cache first
    const cached = getCachedTranslation(plantData.scientificName, targetLanguage);
    if (cached) {
      return cached;
    }

    // Translate via edge function
    setIsTranslating(true);
    try {
      const { data, error } = await supabase.functions.invoke('translate-plant-info', {
        body: { plantData, targetLanguage }
      });

      if (error) throw error;
      if (!data?.translatedData) throw new Error('No translation data received');

      // Cache the result
      setCachedTranslation(plantData.scientificName, targetLanguage, data.translatedData);

      return data.translatedData;
    } catch (error: any) {
      console.error('Translation error:', error);
      
      let errorMessage = 'Translation failed. Showing English.';
      if (error?.message?.includes('429')) {
        errorMessage = 'Too many requests. Please try again later.';
      } else if (error?.message?.includes('402')) {
        errorMessage = 'Translation service unavailable.';
      }

      toast({
        title: 'Translation Error',
        description: errorMessage,
        variant: 'destructive',
      });

      return plantData; // Fallback to English
    } finally {
      setIsTranslating(false);
    }
  }, [toast]);

  return {
    translatePlantData,
    isTranslating,
  };
};
