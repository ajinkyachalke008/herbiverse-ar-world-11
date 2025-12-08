import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Pill, Plus, Trash2, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Medication {
  id: string;
  medication_name: string;
  dosage: string | null;
  frequency: string | null;
  medication_type: string | null;
  prescribing_physician: string | null;
  start_date: string | null;
  is_active: boolean;
  purpose: string | null;
  notes: string | null;
}

interface MedicationsSectionProps {
  medications: Medication[];
  onAdd: (medication: Omit<Medication, "id">) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
}

const MedicationsSection = ({ medications, onAdd, onDelete, isLoading }: MedicationsSectionProps) => {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    medication_name: "",
    dosage: "",
    frequency: "",
    medication_type: "prescription",
    prescribing_physician: "",
    start_date: "",
    is_active: true,
    purpose: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.medication_name) return;

    await onAdd({
      medication_name: formData.medication_name,
      dosage: formData.dosage || null,
      frequency: formData.frequency || null,
      medication_type: formData.medication_type,
      prescribing_physician: formData.prescribing_physician || null,
      start_date: formData.start_date || null,
      is_active: formData.is_active,
      purpose: formData.purpose || null,
      notes: formData.notes || null,
    });

    setFormData({
      medication_name: "",
      dosage: "",
      frequency: "",
      medication_type: "prescription",
      prescribing_physician: "",
      start_date: "",
      is_active: true,
      purpose: "",
      notes: "",
    });
    setShowForm(false);
  };

  const getTypeColor = (type: string | null) => {
    switch (type) {
      case "prescription":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "otc":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "supplement":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "vitamin":
        return "bg-orange-500/20 text-orange-400 border-orange-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const frequencies = [
    "Once daily",
    "Twice daily",
    "Three times daily",
    "Four times daily",
    "Every 4 hours",
    "Every 6 hours",
    "Every 8 hours",
    "Every 12 hours",
    "As needed",
    "Weekly",
    "Monthly",
    "Other",
  ];

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <Pill className="h-5 w-5 text-accent" />
              Medications & Supplements
            </CardTitle>
            <CardDescription>
              Track medications to prevent harmful interactions
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
                  <Label>Medication Name *</Label>
                  <Input
                    placeholder="e.g., Metformin, Vitamin D3"
                    value={formData.medication_name}
                    onChange={(e) =>
                      setFormData({ ...formData, medication_name: e.target.value })
                    }
                    className="bg-input border-border"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select
                    value={formData.medication_type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, medication_type: value })
                    }
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="prescription">Prescription</SelectItem>
                      <SelectItem value="otc">Over-the-Counter</SelectItem>
                      <SelectItem value="supplement">Supplement</SelectItem>
                      <SelectItem value="vitamin">Vitamin</SelectItem>
                      <SelectItem value="herbal">Herbal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Dosage</Label>
                  <Input
                    placeholder="e.g., 500mg, 1000 IU"
                    value={formData.dosage}
                    onChange={(e) =>
                      setFormData({ ...formData, dosage: e.target.value })
                    }
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Frequency</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) =>
                      setFormData({ ...formData, frequency: value })
                    }
                  >
                    <SelectTrigger className="bg-input border-border">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {frequencies.map((freq) => (
                        <SelectItem key={freq} value={freq}>
                          {freq}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Purpose</Label>
                  <Input
                    placeholder="What is this medication for?"
                    value={formData.purpose}
                    onChange={(e) =>
                      setFormData({ ...formData, purpose: e.target.value })
                    }
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Prescribing Physician</Label>
                  <Input
                    placeholder="Doctor's name (optional)"
                    value={formData.prescribing_physician}
                    onChange={(e) =>
                      setFormData({ ...formData, prescribing_physician: e.target.value })
                    }
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) =>
                      setFormData({ ...formData, start_date: e.target.value })
                    }
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_active: checked })
                  }
                />
                <Label htmlFor="active">Currently taking</Label>
              </div>

              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Textarea
                  placeholder="Any additional notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="bg-input border-border"
                  rows={2}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isLoading || !formData.medication_name}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4 mr-2" />
                  )}
                  Add Medication
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

        {medications.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No medications recorded
          </p>
        ) : (
          <div className="space-y-3">
            {medications.map((med) => (
              <motion.div
                key={med.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-foreground">
                      {med.medication_name}
                    </span>
                    {med.dosage && (
                      <span className="text-sm text-muted-foreground">
                        {med.dosage}
                      </span>
                    )}
                    <Badge variant="outline" className={getTypeColor(med.medication_type)}>
                      {med.medication_type}
                    </Badge>
                    {!med.is_active && (
                      <Badge variant="outline" className="bg-muted text-muted-foreground">
                        Inactive
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1 flex flex-wrap gap-2">
                    {med.frequency && <span>{med.frequency}</span>}
                    {med.purpose && <span>• {med.purpose}</span>}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(med.id)}
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

export default MedicationsSection;
