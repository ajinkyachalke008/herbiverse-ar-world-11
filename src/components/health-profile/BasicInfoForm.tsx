import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { User, Save, Loader2 } from "lucide-react";

interface BasicInfoFormProps {
  profile: {
    date_of_birth: string | null;
    biological_sex: string | null;
    height_cm: number | null;
    weight_kg: number | null;
    activity_level: string | null;
    is_pregnant: boolean | null;
    is_breastfeeding: boolean | null;
  } | null;
  onSave: (data: any) => Promise<void>;
  isSaving: boolean;
}

const BasicInfoForm = ({ profile, onSave, isSaving }: BasicInfoFormProps) => {
  const [formData, setFormData] = useState({
    date_of_birth: profile?.date_of_birth || "",
    biological_sex: profile?.biological_sex || "",
    height_cm: profile?.height_cm?.toString() || "",
    weight_kg: profile?.weight_kg?.toString() || "",
    activity_level: profile?.activity_level || "moderately_active",
    is_pregnant: profile?.is_pregnant || false,
    is_breastfeeding: profile?.is_breastfeeding || false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({
      date_of_birth: formData.date_of_birth || null,
      biological_sex: formData.biological_sex || null,
      height_cm: formData.height_cm ? parseFloat(formData.height_cm) : null,
      weight_kg: formData.weight_kg ? parseFloat(formData.weight_kg) : null,
      activity_level: formData.activity_level,
      is_pregnant: formData.is_pregnant,
      is_breastfeeding: formData.is_breastfeeding,
    });
  };

  const activityLevels = [
    { value: "sedentary", label: "Sedentary (little or no exercise)" },
    { value: "lightly_active", label: "Lightly Active (1-3 days/week)" },
    { value: "moderately_active", label: "Moderately Active (3-5 days/week)" },
    { value: "very_active", label: "Very Active (6-7 days/week)" },
    { value: "extremely_active", label: "Extremely Active (athlete)" },
  ];

  const showPregnancyOptions = formData.biological_sex === "female";

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <User className="h-5 w-5 text-accent" />
          Basic Information
        </CardTitle>
        <CardDescription>
          Your core health data for personalized recommendations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <Input
                id="dob"
                type="date"
                value={formData.date_of_birth}
                onChange={(e) => setFormData({ ...formData, date_of_birth: e.target.value })}
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sex">Biological Sex</Label>
              <Select
                value={formData.biological_sex}
                onValueChange={(value) => setFormData({ ...formData, biological_sex: value })}
              >
                <SelectTrigger className="bg-input border-border">
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                  <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                type="number"
                step="0.1"
                min="50"
                max="300"
                placeholder="e.g., 170"
                value={formData.height_cm}
                onChange={(e) => setFormData({ ...formData, height_cm: e.target.value })}
                className="bg-input border-border"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="20"
                max="500"
                placeholder="e.g., 70"
                value={formData.weight_kg}
                onChange={(e) => setFormData({ ...formData, weight_kg: e.target.value })}
                className="bg-input border-border"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="activity">Activity Level</Label>
            <Select
              value={formData.activity_level}
              onValueChange={(value) => setFormData({ ...formData, activity_level: value })}
            >
              <SelectTrigger className="bg-input border-border">
                <SelectValue placeholder="Select activity level" />
              </SelectTrigger>
              <SelectContent>
                {activityLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showPregnancyOptions && (
            <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground">
                These help ensure safe herbal recommendations
              </p>
              <div className="flex items-center justify-between">
                <Label htmlFor="pregnant" className="cursor-pointer">
                  Currently Pregnant
                </Label>
                <Switch
                  id="pregnant"
                  checked={formData.is_pregnant}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_pregnant: checked })
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="breastfeeding" className="cursor-pointer">
                  Currently Breastfeeding
                </Label>
                <Switch
                  id="breastfeeding"
                  checked={formData.is_breastfeeding}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_breastfeeding: checked })
                  }
                />
              </div>
            </div>
          )}

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
            Save Basic Information
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BasicInfoForm;
