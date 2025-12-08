import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Plus, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Allergy {
  id: string;
  allergy_name: string;
  allergy_type: string;
  severity: string;
  reaction_description: string | null;
  diagnosed_by_doctor: boolean;
}

interface AllergiesSectionProps {
  allergies: Allergy[];
  onAdd: (allergy: Omit<Allergy, "id">) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
}

const COMMON_ALLERGIES = {
  food: ["Peanuts", "Tree Nuts", "Milk/Dairy", "Eggs", "Wheat/Gluten", "Soy", "Fish", "Shellfish", "Sesame", "Other"],
  environmental: ["Pollen", "Dust Mites", "Mold", "Pet Dander", "Insect Stings", "Latex", "Other"],
  medication: ["Penicillin", "Sulfa Drugs", "Aspirin/NSAIDs", "Opioids", "Anesthetics", "Contrast Dye", "Other"],
};

const AllergiesSection = ({ allergies, onAdd, onDelete, isLoading }: AllergiesSectionProps) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    allergy_type: "food" as keyof typeof COMMON_ALLERGIES,
    allergy_name: "",
    custom_allergy: "",
    severity: "moderate",
    reaction_description: "",
    diagnosed_by_doctor: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allergyName =
      formData.allergy_name === "Other"
        ? formData.custom_allergy
        : formData.allergy_name;

    if (!allergyName) return;

    await onAdd({
      allergy_name: allergyName,
      allergy_type: formData.allergy_type,
      severity: formData.severity,
      reaction_description: formData.reaction_description || null,
      diagnosed_by_doctor: formData.diagnosed_by_doctor,
    });

    setFormData({
      allergy_type: "food",
      allergy_name: "",
      custom_allergy: "",
      severity: "moderate",
      reaction_description: "",
      diagnosed_by_doctor: false,
    });
    setShowForm(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "moderate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "severe":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "life_threatening":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "food":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "environmental":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "medication":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <AlertTriangle className="h-5 w-5 text-accent" />
              Allergies
            </CardTitle>
            <CardDescription>
              Document allergies to avoid unsafe recommendations
            </CardDescription>
          </div>
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              variant="outline"
              size="sm"
              className="border-accent/50 text-accent hover:bg-accent/10"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <AnimatePresence>
          {showForm && (
            <motion.form
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={handleSubmit}
              className="space-y-4 p-4 bg-muted/30 rounded-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Allergy Type</Label>
                  <Select
                    value={formData.allergy_type}
                    onValueChange={(value: keyof typeof COMMON_ALLERGIES) =>
                      setFormData({ ...formData, allergy_type: value, allergy_name: "" })
                    }
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="environmental">Environmental</SelectItem>
                      <SelectItem value="medication">Medication</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Allergen</Label>
                  <Select
                    value={formData.allergy_name}
                    onValueChange={(value) =>
                      setFormData({ ...formData, allergy_name: value })
                    }
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select allergen" />
                    </SelectTrigger>
                    <SelectContent>
                      {(COMMON_ALLERGIES[formData.allergy_type as keyof typeof COMMON_ALLERGIES] || ["Other"]).map((allergy) => (
                        <SelectItem key={allergy} value={allergy}>
                          {allergy}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.allergy_name === "Other" && (
                  <div className="space-y-2">
                    <Label>Specify Allergen</Label>
                    <Input
                      placeholder="Enter allergen name"
                      value={formData.custom_allergy}
                      onChange={(e) =>
                        setFormData({ ...formData, custom_allergy: e.target.value })
                      }
                      className="bg-input border-border"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Severity</Label>
                  <Select
                    value={formData.severity}
                    onValueChange={(value) =>
                      setFormData({ ...formData, severity: value })
                    }
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mild">Mild</SelectItem>
                      <SelectItem value="moderate">Moderate</SelectItem>
                      <SelectItem value="severe">Severe</SelectItem>
                      <SelectItem value="life_threatening">Life-threatening</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Reaction Description (optional)</Label>
                <Textarea
                  placeholder="Describe your typical reaction..."
                  value={formData.reaction_description}
                  onChange={(e) =>
                    setFormData({ ...formData, reaction_description: e.target.value })
                  }
                  className="bg-input border-border"
                  rows={2}
                />
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="diagnosed"
                  checked={formData.diagnosed_by_doctor}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, diagnosed_by_doctor: checked })
                  }
                />
                <Label htmlFor="diagnosed">Diagnosed by a doctor</Label>
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isLoading || !formData.allergy_name}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Add Allergy
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>

        {allergies.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No allergies recorded
          </p>
        ) : (
          <div className="space-y-3">
            {allergies.map((allergy) => (
              <motion.div
                key={allergy.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground">
                      {allergy.allergy_name}
                    </span>
                    <Badge variant="outline" className={getTypeColor(allergy.allergy_type)}>
                      {allergy.allergy_type}
                    </Badge>
                    <Badge variant="outline" className={getSeverityColor(allergy.severity)}>
                      {allergy.severity.replace("_", " ")}
                    </Badge>
                    {allergy.diagnosed_by_doctor && (
                      <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">
                        Doctor Verified
                      </Badge>
                    )}
                  </div>
                  {allergy.reaction_description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {allergy.reaction_description}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(allergy.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AllergiesSection;
