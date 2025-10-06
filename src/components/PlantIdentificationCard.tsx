import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Leaf, 
  FlaskConical, 
  AlertTriangle, 
  MapPin, 
  Users, 
  TrendingUp,
  Shield,
  Droplets
} from "lucide-react";
import { LanguageSwitcher } from './LanguageSwitcher';
import { useTranslation, type Language } from '@/hooks/useTranslation';

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

interface PlantIdentificationCardProps {
  plantData: PlantData;
  imageUrl: string;
  onClose: () => void;
}

const PlantIdentificationCard: React.FC<PlantIdentificationCardProps> = ({ 
  plantData, 
  imageUrl,
  onClose 
}) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [displayData, setDisplayData] = useState(plantData);
  const { translatePlantData, isTranslating } = useTranslation();

  useEffect(() => {
    const translate = async () => {
      const translated = await translatePlantData(plantData, currentLanguage);
      setDisplayData(translated);
    };
    translate();
  }, [currentLanguage, plantData, translatePlantData]);

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getConfidenceLabel = (confidence: string, lang: Language) => {
    const labels: Record<string, Record<Language, string>> = {
      high: { en: 'HIGH Confidence', hi: 'उच्च विश्वास', mr: 'उच्च विश्वास' },
      medium: { en: 'MEDIUM Confidence', hi: 'मध्यम विश्वास', mr: 'मध्यम विश्वास' },
      low: { en: 'LOW Confidence', hi: 'कम विश्वास', mr: 'कमी विश्वास' },
    };
    return labels[confidence]?.[lang] || `${confidence.toUpperCase()} Confidence`;
  };

  const sectionLabels: Record<string, Record<Language, string>> = {
    identification: { en: 'Identification', hi: 'पहचान', mr: 'ओळख' },
    safetyWarnings: { en: 'Safety Warnings:', hi: 'सुरक्षा चेतावनी:', mr: 'सुरक्षा इशारे:' },
    medicinalUses: { en: 'Medicinal Uses', hi: 'औषधीय उपयोग', mr: 'औषधी उपयोग' },
    activeCompounds: { en: 'Active Compounds', hi: 'सक्रिय यौगिक', mr: 'सक्रिय संयुगे' },
    preparation: { en: 'Preparation Methods', hi: 'तैयारी के तरीके', mr: 'तयारीच्या पद्धती' },
    dosage: { en: 'Traditional Dosage', hi: 'पारंपरिक खुराक', mr: 'पारंपारिक डोस' },
    habitat: { en: 'Habitat & Growing Conditions', hi: 'आवास और उगाने की स्थितियाँ', mr: 'निवासस्थान आणि वाढण्याच्या परिस्थिती' },
    cultural: { en: 'Cultural Significance', hi: 'सांस्कृतिक महत्व', mr: 'सांस्कृतिक महत्व' },
    conservation: { en: 'Conservation Status', hi: 'संरक्षण स्थिति', mr: 'संवर्धन स्थिती' },
    disclaimer: { 
      en: 'This information is for educational purposes only. Always consult with a qualified healthcare professional or certified herbalist before using any medicinal plants.',
      hi: 'यह जानकारी केवल शैक्षिक उद्देश्यों के लिए है। किसी भी औषधीय पौधे का उपयोग करने से पहले हमेशा योग्य स्वास्थ्य देखभाल पेशेवर या प्रमाणित हर्बलिस्ट से परामर्श करें।',
      mr: 'ही माहिती केवळ शैक्षणिक हेतूंसाठी आहे. कोणत्याही औषधी वनस्पतींचा वापर करण्यापूर्वी नेहमी पात्र आरोग्य सेवा व्यावसायिक किंवा प्रमाणित हर्बलिस्टचा सल्ला घ्या.'
    },
    family: { en: 'Family:', hi: 'परिवार:', mr: 'कुटुंब:' }
  };

  return (
    <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
      <CardHeader className="space-y-3 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Leaf className="w-6 h-6 text-primary" />
              <AnimatePresence mode="wait">
                <motion.span
                  key={`name-${currentLanguage}`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.2 }}
                >
                  {displayData.commonName}
                </motion.span>
              </AnimatePresence>
            </CardTitle>
            <p className="text-sm text-muted-foreground italic mt-1">
              {displayData.scientificName}
            </p>
            <AnimatePresence mode="wait">
              <motion.p
                key={`family-${currentLanguage}`}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="text-xs text-muted-foreground mt-1"
              >
                {sectionLabels.family[currentLanguage]} {displayData.family}
              </motion.p>
            </AnimatePresence>
          </div>
          <Badge className={`${getConfidenceColor(displayData.confidence)} text-white`}>
            {getConfidenceLabel(displayData.confidence, currentLanguage)}
          </Badge>
        </div>

        {/* Language Switcher */}
        <div className="flex justify-end">
          <LanguageSwitcher
            currentLanguage={currentLanguage}
            onLanguageChange={setCurrentLanguage}
            isTranslating={isTranslating}
          />
        </div>
      </CardHeader>

      <ScrollArea className="h-[calc(90vh-200px)]">
        <CardContent className="space-y-4">
          {/* Image */}
          <div className="rounded-lg overflow-hidden">
            <img 
              src={imageUrl} 
              alt={displayData.commonName}
              className="w-full h-48 object-cover"
            />
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${currentLanguage}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              {/* Identification */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {sectionLabels.identification[currentLanguage]}
                </h3>
                <p className="text-sm text-muted-foreground">{displayData.identification}</p>
              </div>

              <Separator />

              {/* Safety Warnings */}
              {displayData.safetyWarnings.length > 0 && (
                <>
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <div className="font-semibold mb-1">{sectionLabels.safetyWarnings[currentLanguage]}</div>
                      <ul className="list-disc list-inside space-y-1">
                        {displayData.safetyWarnings.map((warning, idx) => (
                          <li key={idx} className="text-sm">{warning}</li>
                        ))}
                      </ul>
                    </AlertDescription>
                  </Alert>
                  <Separator />
                </>
              )}

              {/* Medicinal Uses */}
              {displayData.medicinalUses.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <FlaskConical className="w-4 h-4" />
                    {sectionLabels.medicinalUses[currentLanguage]}
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {displayData.medicinalUses.map((use, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">{use}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Active Compounds */}
              {displayData.activeCompounds.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    {sectionLabels.activeCompounds[currentLanguage]}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {displayData.activeCompounds.map((compound, idx) => (
                      <Badge key={idx} variant="secondary">{compound}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Preparation Methods */}
              {displayData.preparation.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Droplets className="w-4 h-4" />
                    {sectionLabels.preparation[currentLanguage]}
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {displayData.preparation.map((method, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">{method}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Dosage */}
              <div className="space-y-2">
                <h3 className="font-semibold">{sectionLabels.dosage[currentLanguage]}</h3>
                <p className="text-sm text-muted-foreground">{displayData.dosage}</p>
              </div>

              <Separator />

              {/* Habitat */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {sectionLabels.habitat[currentLanguage]}
                </h3>
                <p className="text-sm text-muted-foreground">{displayData.habitat}</p>
              </div>

              {/* Cultural Significance */}
              <div className="space-y-2">
                <h3 className="font-semibold flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {sectionLabels.cultural[currentLanguage]}
                </h3>
                <p className="text-sm text-muted-foreground">{displayData.culturalSignificance}</p>
              </div>

              {/* Conservation Status */}
              {displayData.conservationStatus !== "Unknown" && (
                <div className="space-y-2">
                  <h3 className="font-semibold">{sectionLabels.conservation[currentLanguage]}</h3>
                  <Badge variant="outline">{displayData.conservationStatus}</Badge>
                </div>
              )}

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  {sectionLabels.disclaimer[currentLanguage]}
                </AlertDescription>
              </Alert>
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default PlantIdentificationCard;
