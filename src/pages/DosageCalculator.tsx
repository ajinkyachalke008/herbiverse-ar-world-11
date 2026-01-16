import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calculator, AlertTriangle, Shield, Pill, User, Scale } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { dosageDatabase, calculateDosage, type DosageRecommendation } from '@/data/dosageData';

const DosageCalculator = () => {
  const [selectedHerb, setSelectedHerb] = useState('');
  const [selectedForm, setSelectedForm] = useState('');
  const [age, setAge] = useState('30');
  const [weight, setWeight] = useState('70');
  const [isPregnant, setIsPregnant] = useState(false);
  const [isBreastfeeding, setIsBreastfeeding] = useState(false);
  const [result, setResult] = useState<DosageRecommendation | null>(null);

  const herb = dosageDatabase.find(h => h.herbId === selectedHerb);

  const calculate = () => {
    if (!selectedHerb || !selectedForm) return;
    const recommendation = calculateDosage({
      herbId: selectedHerb,
      form: selectedForm,
      age: parseInt(age) || 30,
      weight: parseInt(weight) || 70,
      isPregnant,
      isBreastfeeding,
      healthConditions: [],
      currentMedications: []
    });
    setResult(recommendation);
  };

  const safetyColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-glow mb-2">💊 Dosage Calculator</h1>
          <p className="text-muted-foreground">Smart guidance with personalized safety warnings</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="bg-card/50">
            <CardHeader><CardTitle className="flex items-center gap-2"><Calculator className="w-5 h-5 text-accent" />Calculate Dosage</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Select Herb</Label>
                <Select value={selectedHerb} onValueChange={v => { setSelectedHerb(v); setSelectedForm(''); setResult(null); }}>
                  <SelectTrigger><SelectValue placeholder="Choose an herb" /></SelectTrigger>
                  <SelectContent>{dosageDatabase.map(h => <SelectItem key={h.herbId} value={h.herbId}>{h.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>

              {herb && (
                <div>
                  <Label>Form</Label>
                  <Select value={selectedForm} onValueChange={setSelectedForm}>
                    <SelectTrigger><SelectValue placeholder="Select form" /></SelectTrigger>
                    <SelectContent>{herb.forms.map(f => <SelectItem key={f.type} value={f.type} className="capitalize">{f.type}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div><Label>Age</Label><Input type="number" value={age} onChange={e => setAge(e.target.value)} /></div>
                <div><Label>Weight (kg)</Label><Input type="number" value={weight} onChange={e => setWeight(e.target.value)} /></div>
              </div>

              <div className="flex gap-6">
                <div className="flex items-center gap-2"><Checkbox checked={isPregnant} onCheckedChange={c => setIsPregnant(!!c)} /><Label>Pregnant</Label></div>
                <div className="flex items-center gap-2"><Checkbox checked={isBreastfeeding} onCheckedChange={c => setIsBreastfeeding(!!c)} /><Label>Breastfeeding</Label></div>
              </div>

              <Button onClick={calculate} disabled={!selectedHerb || !selectedForm} className="w-full bg-gradient-glow">Calculate Dosage</Button>
            </CardContent>
          </Card>

          {result && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <Card className="bg-card/50">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2"><Shield className="w-5 h-5" />Recommendation</span>
                    <Badge className={safetyColor(result.safetyScore)}>Safety: {result.safetyScore}/10</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-4 bg-accent/10 rounded-lg">
                    <p className="text-3xl font-bold text-accent">{result.recommended.min} - {result.recommended.max} {result.recommended.unit}</p>
                    <p className="text-muted-foreground">{result.frequency}</p>
                    <p className="text-sm">{result.timing}</p>
                  </div>

                  {result.adjustments.length > 0 && (
                    <div className="space-y-1">{result.adjustments.map((a, i) => <p key={i} className="text-sm text-blue-400">💡 {a}</p>)}</div>
                  )}

                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 space-y-1">
                    {result.warnings.map((w, i) => <p key={i} className="text-sm">{w}</p>)}
                  </div>

                  <p className="text-xs text-muted-foreground text-center">⚠️ Always consult a healthcare provider before starting any herbal regimen</p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DosageCalculator;
