import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Mic, MicOff, Loader2, AlertTriangle, Leaf, Shield, FlaskConical, Clock, ChevronDown, ChevronUp, Sparkles, Heart, Activity, Brain, Wind, Droplets } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface PlantRecommendation {
  plant_name: string;
  scientific_name: string;
  hindi_name?: string;
  relevance_score: number;
  traditional_uses: string;
  evidence_level: string;
  preparation: string[];
  dosage: {
    adult: string;
    duration: string;
  };
  safety: {
    warnings: string[];
    contraindications: string[];
    interactions: string[];
  };
  ayurvedic_properties?: {
    rasa: string;
    virya: string;
    dosha_effect: string;
  };
}

interface SymptomAnalysis {
  parsed_symptoms: {
    primary: string[];
    secondary: string[];
    body_systems: string[];
    severity_assessment: string;
    urgency_note: string | null;
  };
  recommendations: PlantRecommendation[];
  lifestyle_tips: string[];
  disclaimer: string;
}

const QUICK_SYMPTOMS = [
  { label: "Headache", icon: Brain, color: "from-purple-500 to-indigo-600" },
  { label: "Cold & Cough", icon: Wind, color: "from-blue-500 to-cyan-600" },
  { label: "Digestive Issues", icon: Activity, color: "from-green-500 to-emerald-600" },
  { label: "Stress & Anxiety", icon: Heart, color: "from-pink-500 to-rose-600" },
  { label: "Sleep Problems", icon: Sparkles, color: "from-indigo-500 to-purple-600" },
  { label: "Skin Issues", icon: Droplets, color: "from-amber-500 to-orange-600" },
];

const SymptomChecker = () => {
  const [symptoms, setSymptoms] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [results, setResults] = useState<SymptomAnalysis | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const { toast } = useToast();
  const { user } = useAuth();

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice not supported",
        description: "Your browser doesn't support voice input. Please type your symptoms.",
        variant: "destructive",
      });
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSymptoms(prev => prev + (prev ? " " : "") + transcript);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
      toast({
        title: "Voice input error",
        description: "Could not recognize speech. Please try again.",
        variant: "destructive",
      });
    };

    recognition.start();
  };

  const handleQuickSymptom = (symptom: string) => {
    setSymptoms(prev => {
      if (prev.toLowerCase().includes(symptom.toLowerCase())) return prev;
      return prev + (prev ? ", " : "") + symptom;
    });
  };

  const analyzeSymptoms = async () => {
    if (!symptoms.trim()) {
      toast({
        title: "Please describe your symptoms",
        description: "Enter your symptoms to get personalized recommendations.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('symptom-checker', {
        body: { symptoms }
      });

      if (error) throw error;

      if (!data.success) {
        throw new Error(data.error || "Failed to analyze symptoms");
      }

      setResults(data.data);

      // Save query if user is logged in
      if (user) {
        await supabase.from('symptom_queries').insert({
          user_id: user.id,
          raw_query: symptoms,
          parsed_symptoms: data.data.parsed_symptoms,
          recommendations: data.data.recommendations,
        });
      }

      toast({
        title: "Analysis Complete",
        description: `Found ${data.data.recommendations?.length || 0} herbal recommendations for you.`,
      });

    } catch (error: any) {
      console.error("Symptom analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: error.message || "Could not analyze symptoms. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleCard = (index: number) => {
    setExpandedCards(prev => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const getEvidenceBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "clinically supported": return "bg-green-500/20 text-green-300 border-green-500/30";
      case "emerging research": return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "traditional": return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      default: return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-amber-400";
    return "text-orange-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5">
      <Navigation />
      
      <main className="container mx-auto px-4 pt-24 pb-16">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary">AI-Powered Herbal Advisor</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Symptom Checker
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Describe your symptoms and get personalized herbal recommendations with safety information and traditional wisdom
          </p>
        </motion.div>

        {/* Input Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="max-w-3xl mx-auto mb-8"
        >
          <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
            <CardContent className="p-6">
              {/* Quick Symptom Chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {QUICK_SYMPTOMS.map((symptom, index) => (
                  <motion.button
                    key={symptom.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleQuickSymptom(symptom.label)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${symptom.color} text-white text-sm font-medium hover:opacity-90 transition-opacity`}
                  >
                    <symptom.icon className="w-3.5 h-3.5" />
                    {symptom.label}
                  </motion.button>
                ))}
              </div>

              {/* Symptom Input */}
              <div className="relative">
                <Textarea
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe your symptoms in detail... (e.g., 'I have trouble sleeping, mild anxiety, and occasional headaches for the past week')"
                  className="min-h-[120px] pr-12 bg-background/50 border-primary/20 focus:border-primary/40 resize-none"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className={`absolute right-2 top-2 ${isListening ? 'text-red-400 animate-pulse' : 'text-muted-foreground'}`}
                  onClick={handleVoiceInput}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
              </div>

              {/* Action Button */}
              <Button
                onClick={analyzeSymptoms}
                disabled={isLoading || !symptoms.trim()}
                className="w-full mt-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-6"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5 mr-2" />
                    Get Herbal Recommendations
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {results && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              {/* Urgency Warning */}
              {results.parsed_symptoms.urgency_note && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3"
                >
                  <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-300">Medical Attention Recommended</h3>
                    <p className="text-red-200/80">{results.parsed_symptoms.urgency_note}</p>
                  </div>
                </motion.div>
              )}

              {/* Parsed Symptoms Summary */}
              <Card className="mb-6 bg-card/50 backdrop-blur-sm border-primary/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="w-5 h-5 text-primary" />
                    Symptom Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {results.parsed_symptoms.primary.map((symptom, i) => (
                      <Badge key={i} variant="secondary" className="bg-primary/20 text-primary-foreground">
                        {symptom}
                      </Badge>
                    ))}
                    {results.parsed_symptoms.secondary.map((symptom, i) => (
                      <Badge key={i} variant="outline" className="border-muted-foreground/30">
                        {symptom}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                    <span>Body Systems:</span>
                    {results.parsed_symptoms.body_systems.map((system, i) => (
                      <span key={i} className="capitalize">{system}{i < results.parsed_symptoms.body_systems.length - 1 ? ',' : ''}</span>
                    ))}
                    <span className="mx-2">•</span>
                    <span>Severity: <span className="capitalize text-foreground">{results.parsed_symptoms.severity_assessment}</span></span>
                  </div>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Leaf className="w-6 h-6 text-green-400" />
                Recommended Herbs
              </h2>

              <div className="space-y-4">
                {results.recommendations.map((plant, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-card/50 backdrop-blur-sm border-primary/20 overflow-hidden hover:border-primary/40 transition-colors">
                      <CardHeader 
                        className="cursor-pointer"
                        onClick={() => toggleCard(index)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <CardTitle className="text-xl">{plant.plant_name}</CardTitle>
                              <span className={`text-lg font-bold ${getRelevanceColor(plant.relevance_score)}`}>
                                {plant.relevance_score}%
                              </span>
                            </div>
                            <p className="text-sm text-muted-foreground italic">
                              {plant.scientific_name}
                              {plant.hindi_name && <span className="ml-2">• {plant.hindi_name}</span>}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-3">
                              <Badge className={getEvidenceBadgeColor(plant.evidence_level)}>
                                <FlaskConical className="w-3 h-3 mr-1" />
                                {plant.evidence_level}
                              </Badge>
                              {plant.preparation.slice(0, 2).map((prep, i) => (
                                <Badge key={i} variant="outline" className="border-muted-foreground/30">
                                  {prep}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          <Button variant="ghost" size="icon">
                            {expandedCards.has(index) ? (
                              <ChevronUp className="w-5 h-5" />
                            ) : (
                              <ChevronDown className="w-5 h-5" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>

                      <AnimatePresence>
                        {expandedCards.has(index) && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <CardContent className="pt-0 space-y-4">
                              {/* Traditional Uses */}
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <Leaf className="w-4 h-4 text-green-400" />
                                  Traditional Uses
                                </h4>
                                <p className="text-muted-foreground">{plant.traditional_uses}</p>
                              </div>

                              {/* Dosage */}
                              <div>
                                <h4 className="font-semibold mb-2 flex items-center gap-2">
                                  <Clock className="w-4 h-4 text-blue-400" />
                                  Dosage Guidelines
                                </h4>
                                <p className="text-muted-foreground">{plant.dosage.adult}</p>
                                <p className="text-sm text-muted-foreground mt-1">Duration: {plant.dosage.duration}</p>
                              </div>

                              {/* Ayurvedic Properties */}
                              {plant.ayurvedic_properties && (
                                <div>
                                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                    Ayurvedic Properties
                                  </h4>
                                  <div className="grid grid-cols-3 gap-2 text-sm">
                                    <div className="bg-background/50 p-2 rounded">
                                      <span className="text-muted-foreground">Rasa:</span>
                                      <span className="ml-2">{plant.ayurvedic_properties.rasa}</span>
                                    </div>
                                    <div className="bg-background/50 p-2 rounded">
                                      <span className="text-muted-foreground">Virya:</span>
                                      <span className="ml-2">{plant.ayurvedic_properties.virya}</span>
                                    </div>
                                    <div className="bg-background/50 p-2 rounded col-span-3 md:col-span-1">
                                      <span className="text-muted-foreground">Dosha:</span>
                                      <span className="ml-2">{plant.ayurvedic_properties.dosha_effect}</span>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {/* Safety Warnings */}
                              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                                <h4 className="font-semibold mb-2 flex items-center gap-2 text-amber-300">
                                  <Shield className="w-4 h-4" />
                                  Safety Information
                                </h4>
                                {plant.safety.warnings.length > 0 && (
                                  <div className="mb-2">
                                    <span className="text-sm font-medium text-amber-200">Warnings: </span>
                                    <span className="text-sm text-amber-100/80">{plant.safety.warnings.join(", ")}</span>
                                  </div>
                                )}
                                {plant.safety.contraindications.length > 0 && (
                                  <div className="mb-2">
                                    <span className="text-sm font-medium text-amber-200">Avoid if: </span>
                                    <span className="text-sm text-amber-100/80">{plant.safety.contraindications.join(", ")}</span>
                                  </div>
                                )}
                                {plant.safety.interactions.length > 0 && (
                                  <div>
                                    <span className="text-sm font-medium text-amber-200">Drug Interactions: </span>
                                    <span className="text-sm text-amber-100/80">{plant.safety.interactions.join(", ")}</span>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Lifestyle Tips */}
              {results.lifestyle_tips && results.lifestyle_tips.length > 0 && (
                <Card className="mt-6 bg-card/50 backdrop-blur-sm border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Heart className="w-5 h-5 text-pink-400" />
                      Lifestyle Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {results.lifestyle_tips.map((tip, i) => (
                        <li key={i} className="flex items-start gap-2 text-muted-foreground">
                          <span className="text-primary mt-1">•</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Disclaimer */}
              <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-muted-foreground/20">
                <p className="text-sm text-muted-foreground text-center">
                  <AlertTriangle className="w-4 h-4 inline-block mr-1 text-amber-400" />
                  {results.disclaimer}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default SymptomChecker;
