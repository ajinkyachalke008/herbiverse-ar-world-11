import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { HeartPulse, Plus, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Condition {
  id: string;
  condition_name: string;
  diagnosis_date: string | null;
  severity: string | null;
  is_managed: boolean;
  notes: string | null;
}

interface ChronicConditionsSectionProps {
  conditions: Condition[];
  onAdd: (condition: Omit<Condition, "id">) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
}

const COMMON_CONDITIONS = [
  "Diabetes Type 1",
  "Diabetes Type 2",
  "Hypertension",
  "Asthma",
  "Arthritis",
  "Heart Disease",
  "Thyroid Disorder",
  "Anxiety",
  "Depression",
  "COPD",
  "Kidney Disease",
  "Liver Disease",
  "Epilepsy",
  "Autoimmune Disease",
  "Other",
];

const ChronicConditionsSection = ({
  conditions,
  onAdd,
  onDelete,
  isLoading,
}: ChronicConditionsSectionProps) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    condition_name: "",
    custom_condition: "",
    diagnosis_date: "",
    severity: "moderate",
    is_managed: false,
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const conditionName =
      formData.condition_name === "Other"
        ? formData.custom_condition
        : formData.condition_name;

    if (!conditionName) return;

    await onAdd({
      condition_name: conditionName,
      diagnosis_date: formData.diagnosis_date || null,
      severity: formData.severity,
      is_managed: formData.is_managed,
      notes: formData.notes || null,
    });

    setFormData({
      condition_name: "",
      custom_condition: "",
      diagnosis_date: "",
      severity: "moderate",
      is_managed: false,
      notes: "",
    });
    setShowForm(false);
  };

  const getSeverityColor = (severity: string | null) => {
    switch (severity) {
      case "mild":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "moderate":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "severe":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      case "critical":
        return "bg-red-500/20 text-red-400 border-red-500/30";
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
              <HeartPulse className="h-5 w-5 text-accent" />
              Chronic Conditions
            </CardTitle>
            <CardDescription>
              Medical conditions that may affect herbal recommendations
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
                  <Label>Condition</Label>
                  <Select
                    value={formData.condition_name}
                    onValueChange={(value) =>
                      setFormData({ ...formData, condition_name: value })
                    }
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select condition" />
                    </SelectTrigger>
                    <SelectContent>
                      {COMMON_CONDITIONS.map((condition) => (
                        <SelectItem key={condition} value={condition}>
                          {condition}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {formData.condition_name === "Other" && (
                  <div className="space-y-2">
                    <Label>Specify Condition</Label>
                    <Input
                      placeholder="Enter condition name"
                      value={formData.custom_condition}
                      onChange={(e) =>
                        setFormData({ ...formData, custom_condition: e.target.value })
                      }
                      className="bg-input border-border"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Diagnosis Date</Label>
                  <Input
                    type="date"
                    value={formData.diagnosis_date}
                    onChange={(e) =>
                      setFormData({ ...formData, diagnosis_date: e.target.value })
                    }
                    className="bg-input border-border"
                  />
                </div>

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
                      <SelectItem value="critical">Critical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="managed"
                  checked={formData.is_managed}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_managed: checked })
                  }
                />
                <Label htmlFor="managed">Currently managed/controlled</Label>
              </div>

              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Textarea
                  placeholder="Any additional notes about this condition..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="bg-input border-border"
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isLoading || !formData.condition_name}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Add Condition
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

        {conditions.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No chronic conditions recorded
          </p>
        ) : (
          <div className="space-y-3">
            {conditions.map((condition) => (
              <motion.div
                key={condition.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground">
                      {condition.condition_name}
                    </span>
                    <Badge
                      variant="outline"
                      className={getSeverityColor(condition.severity)}
                    >
                      {condition.severity}
                    </Badge>
                    {condition.is_managed && (
                      <Badge variant="outline" className="bg-accent/20 text-accent border-accent/30">
                        Managed
                      </Badge>
                    )}
                  </div>
                  {condition.notes && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {condition.notes}
                    </p>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(condition.id)}
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

export default ChronicConditionsSection;
