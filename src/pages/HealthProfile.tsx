import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import HealthMetricsCard from "@/components/health-profile/HealthMetricsCard";
import BasicInfoForm from "@/components/health-profile/BasicInfoForm";
import ChronicConditionsSection from "@/components/health-profile/ChronicConditionsSection";
import AllergiesSection from "@/components/health-profile/AllergiesSection";
import MedicationsSection from "@/components/health-profile/MedicationsSection";
import LifestyleSection from "@/components/health-profile/LifestyleSection";
import { Shield, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const HealthProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [conditions, setConditions] = useState<any[]>([]);
  const [allergies, setAllergies] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }
    fetchAllData();
  }, [user, navigate]);

  const fetchAllData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [profileRes, conditionsRes, allergiesRes, medicationsRes] = await Promise.all([
        supabase.from("user_health_profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("user_chronic_conditions").select("*").eq("user_id", user.id),
        supabase.from("user_allergies").select("*").eq("user_id", user.id),
        supabase.from("user_medications").select("*").eq("user_id", user.id),
      ]);
      
      setProfile(profileRes.data);
      setConditions(conditionsRes.data || []);
      setAllergies(allergiesRes.data || []);
      setMedications(medicationsRes.data || []);
    } catch (error) {
      console.error("Error fetching health data:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async (data: any) => {
    if (!user) return;
    setSaving(true);
    try {
      if (profile) {
        await supabase.from("user_health_profiles").update(data).eq("user_id", user.id);
      } else {
        await supabase.from("user_health_profiles").insert({ ...data, user_id: user.id });
      }
      await fetchAllData();
      toast({ title: "Profile saved successfully" });
    } catch (error: any) {
      toast({ title: "Error saving profile", description: error.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const addCondition = async (condition: any) => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase.from("user_chronic_conditions").insert({ ...condition, user_id: user.id });
      await fetchAllData();
      toast({ title: "Condition added" });
    } finally {
      setSaving(false);
    }
  };

  const deleteCondition = async (id: string) => {
    await supabase.from("user_chronic_conditions").delete().eq("id", id);
    setConditions(conditions.filter((c) => c.id !== id));
  };

  const addAllergy = async (allergy: any) => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase.from("user_allergies").insert({ ...allergy, user_id: user.id });
      await fetchAllData();
      toast({ title: "Allergy added" });
    } finally {
      setSaving(false);
    }
  };

  const deleteAllergy = async (id: string) => {
    await supabase.from("user_allergies").delete().eq("id", id);
    setAllergies(allergies.filter((a) => a.id !== id));
  };

  const addMedication = async (medication: any) => {
    if (!user) return;
    setSaving(true);
    try {
      await supabase.from("user_medications").insert({ ...medication, user_id: user.id });
      await fetchAllData();
      toast({ title: "Medication added" });
    } finally {
      setSaving(false);
    }
  };

  const deleteMedication = async (id: string) => {
    await supabase.from("user_medications").delete().eq("id", id);
    setMedications(medications.filter((m) => m.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Button variant="ghost" onClick={() => navigate(-1)} className="mb-2">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back
              </Button>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <Shield className="h-8 w-8 text-accent" />
                Health Profile
              </h1>
              <p className="text-muted-foreground mt-1">Your health data is encrypted and private</p>
            </div>
          </div>

          <HealthMetricsCard
            heightCm={profile?.height_cm}
            weightKg={profile?.weight_kg}
            dateOfBirth={profile?.date_of_birth}
            biologicalSex={profile?.biological_sex}
          />
          <BasicInfoForm profile={profile} onSave={saveProfile} isSaving={saving} />
          <ChronicConditionsSection conditions={conditions} onAdd={addCondition} onDelete={deleteCondition} isLoading={saving} />
          <AllergiesSection allergies={allergies} onAdd={addAllergy} onDelete={deleteAllergy} isLoading={saving} />
          <MedicationsSection medications={medications} onAdd={addMedication} onDelete={deleteMedication} isLoading={saving} />
          <LifestyleSection profile={profile} onSave={saveProfile} isSaving={saving} />
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default HealthProfile;
