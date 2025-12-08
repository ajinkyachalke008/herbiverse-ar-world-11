import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Heart, Scale, Ruler } from "lucide-react";
import { motion } from "framer-motion";

interface HealthMetricsCardProps {
  heightCm: number | null;
  weightKg: number | null;
  dateOfBirth: string | null;
  biologicalSex: string | null;
}

const HealthMetricsCard = ({ heightCm, weightKg, dateOfBirth, biologicalSex }: HealthMetricsCardProps) => {
  // Calculate age from date of birth
  const calculateAge = (dob: string | null): number | null => {
    if (!dob) return null;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Calculate BMI
  const calculateBMI = (height: number | null, weight: number | null): number | null => {
    if (!height || !weight) return null;
    const heightM = height / 100;
    return weight / (heightM * heightM);
  };

  // Get BMI category
  const getBMICategory = (bmi: number | null): { label: string; color: string } => {
    if (!bmi) return { label: "Unknown", color: "text-muted-foreground" };
    if (bmi < 18.5) return { label: "Underweight", color: "text-yellow-400" };
    if (bmi < 25) return { label: "Normal", color: "text-accent" };
    if (bmi < 30) return { label: "Overweight", color: "text-orange-400" };
    return { label: "Obese", color: "text-destructive" };
  };

  // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor equation
  const calculateBMR = (
    height: number | null,
    weight: number | null,
    age: number | null,
    sex: string | null
  ): number | null => {
    if (!height || !weight || !age) return null;
    const base = 10 * weight + 6.25 * height - 5 * age;
    if (sex === "male") return base + 5;
    if (sex === "female") return base - 161;
    return base - 78; // Average for other/prefer not to say
  };

  const age = calculateAge(dateOfBirth);
  const bmi = calculateBMI(heightCm, weightKg);
  const bmiCategory = getBMICategory(bmi);
  const bmr = calculateBMR(heightCm, weightKg, age, biologicalSex);

  const metrics = [
    {
      icon: Ruler,
      label: "Height",
      value: heightCm ? `${heightCm} cm` : "Not set",
      subValue: heightCm ? `${(heightCm / 2.54).toFixed(1)} in` : null,
    },
    {
      icon: Scale,
      label: "Weight",
      value: weightKg ? `${weightKg} kg` : "Not set",
      subValue: weightKg ? `${(weightKg * 2.205).toFixed(1)} lbs` : null,
    },
    {
      icon: Activity,
      label: "BMI",
      value: bmi ? bmi.toFixed(1) : "N/A",
      subValue: bmiCategory.label,
      subValueColor: bmiCategory.color,
    },
    {
      icon: Heart,
      label: "BMR",
      value: bmr ? `${Math.round(bmr)} cal` : "N/A",
      subValue: bmr ? "per day" : null,
    },
  ];

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Activity className="h-5 w-5 text-accent" />
          Health Metrics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-muted/50 rounded-lg p-4 text-center"
            >
              <metric.icon className="h-6 w-6 text-accent mx-auto mb-2" />
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                {metric.label}
              </p>
              <p className="text-xl font-bold text-foreground">{metric.value}</p>
              {metric.subValue && (
                <p className={`text-xs mt-1 ${metric.subValueColor || "text-muted-foreground"}`}>
                  {metric.subValue}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthMetricsCard;
