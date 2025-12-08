import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Leaf, Save, Loader2, X, Target, Moon, Wine, Cigarette } from "lucide-react";
import { motion } from "framer-motion";

interface LifestyleSectionProps {
  profile: {
    dietary_preference: string[] | null;
    smoking_status: string | null;
    alcohol_consumption: string | null;
    sleep_hours_avg: number | null;
    health_goals: string[] | null;
    family_history: string[] | null;
  } | null;
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
}

const DIETARY_OPTIONS = [
  "Vegetarian",
  "Vegan",
  "Pescatarian",
  "Low-Carb",
  "Keto",
  "Paleo",
  "Mediterranean",
  "Halal",
  "Kosher",
  "Gluten-Free",
  "Dairy-Free",
  "No Restrictions",
];

const HEALTH_GOALS = [
  "Weight Loss",
  "Weight Gain",
  "Build Muscle",
  "Improve Sleep",
  "Reduce Stress",
  "Boost Energy",
  "Better Digestion",
  "Manage Condition",
  "Improve Immunity",
  "Heart Health",
  "Mental Clarity",
  "Skin Health",
];

const FAMILY_HISTORY_OPTIONS = [
  "Heart Disease",
  "Diabetes",
  "Cancer",
  "Hypertension",
  "Stroke",
  "Mental Health Conditions",
  "Autoimmune Disease",
  "Alzheimer's/Dementia",
  "Thyroid Disorders",
  "None Known",
];

const LifestyleSection = ({ profile, onSave, isSaving }: LifestyleSectionProps) => {
  const [formData, setFormData] = useState({
    dietary_preference: profile?.dietary_preference || [],
    smoking_status: profile?.smoking_status || "never",
    alcohol_consumption: profile?.alcohol_consumption || "none",
    sleep_hours_avg: profile?.sleep_hours_avg || 7,
    health_goals: profile?.health_goals || [],
    family_history: profile?.family_history || [],
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        dietary_preference: profile.dietary_preference || [],
        smoking_status: profile.smoking_status || "never",
        alcohol_consumption: profile.alcohol_consumption || "none",
        sleep_hours_avg: profile.sleep_hours_avg || 7,
        health_goals: profile.health_goals || [],
        family_history: profile.family_history || [],
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(formData);
  };

  const toggleArrayItem = (
    field: "dietary_preference" | "health_goals" | "family_history",
    item: string
  ) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      const exists = current.includes(item);
      return {
        ...prev,
        [field]: exists
          ? current.filter((i) => i !== item)
          : [...current, item],
      };
    });
  };

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Leaf className="h-5 w-5 text-accent" />
          Lifestyle & Goals
        </CardTitle>
        <CardDescription>
          Your lifestyle choices help personalize recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dietary Preferences */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Leaf className="h-4 w-4 text-accent" />
              Dietary Preferences
            </Label>
            <div className="flex flex-wrap gap-2">
              {DIETARY_OPTIONS.map((option) => (
                <Badge
                  key={option}
                  variant={formData.dietary_preference?.includes(option) ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    formData.dietary_preference?.includes(option)
                      ? "bg-accent text-accent-foreground hover:bg-accent/90"
                      : "hover:bg-accent/20"
                  }`}
                  onClick={() => toggleArrayItem("dietary_preference", option)}
                >
                  {option}
                  {formData.dietary_preference?.includes(option) && (
                    <X className="h-3 w-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Sleep */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Moon className="h-4 w-4 text-accent" />
              Average Sleep Hours: {formData.sleep_hours_avg}h
            </Label>
            <Slider
              value={[formData.sleep_hours_avg]}
              onValueChange={([value]) =>
                setFormData({ ...formData, sleep_hours_avg: value })
              }
              min={3}
              max={12}
              step={0.5}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>3h</span>
              <span className="text-accent">Recommended: 7-9h</span>
              <span>12h</span>
            </div>
          </div>

          {/* Smoking & Alcohol */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Cigarette className="h-4 w-4 text-accent" />
                Smoking Status
              </Label>
              <Select
                value={formData.smoking_status}
                onValueChange={(value) =>
                  setFormData({ ...formData, smoking_status: value })
                }
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never smoked</SelectItem>
                  <SelectItem value="former">Former smoker</SelectItem>
                  <SelectItem value="occasional">Occasional</SelectItem>
                  <SelectItem value="regular">Regular smoker</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Wine className="h-4 w-4 text-accent" />
                Alcohol Consumption
              </Label>
              <Select
                value={formData.alcohol_consumption}
                onValueChange={(value) =>
                  setFormData({ ...formData, alcohol_consumption: value })
                }
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="occasional">Occasional (1-2/month)</SelectItem>
                  <SelectItem value="moderate">Moderate (1-2/week)</SelectItem>
                  <SelectItem value="regular">Regular (daily)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Health Goals */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <Target className="h-4 w-4 text-accent" />
              Health Goals
            </Label>
            <div className="flex flex-wrap gap-2">
              {HEALTH_GOALS.map((goal) => (
                <Badge
                  key={goal}
                  variant={formData.health_goals?.includes(goal) ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    formData.health_goals?.includes(goal)
                      ? "bg-accent text-accent-foreground hover:bg-accent/90"
                      : "hover:bg-accent/20"
                  }`}
                  onClick={() => toggleArrayItem("health_goals", goal)}
                >
                  {goal}
                  {formData.health_goals?.includes(goal) && (
                    <X className="h-3 w-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Family History */}
          <div className="space-y-3">
            <Label>Family Medical History</Label>
            <div className="flex flex-wrap gap-2">
              {FAMILY_HISTORY_OPTIONS.map((condition) => (
                <Badge
                  key={condition}
                  variant={formData.family_history?.includes(condition) ? "default" : "outline"}
                  className={`cursor-pointer transition-all ${
                    formData.family_history?.includes(condition)
                      ? "bg-secondary text-secondary-foreground hover:bg-secondary/90"
                      : "hover:bg-secondary/20"
                  }`}
                  onClick={() => toggleArrayItem("family_history", condition)}
                >
                  {condition}
                  {formData.family_history?.includes(condition) && (
                    <X className="h-3 w-3 ml-1" />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSaving}
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Lifestyle Information
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LifestyleSection;
