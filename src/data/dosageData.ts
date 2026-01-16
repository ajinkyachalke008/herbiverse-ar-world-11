// Dosage Calculator Data - Smart guidance with safety warnings

export interface DosageInfo {
  herbId: string;
  name: string;
  forms: {
    type: 'powder' | 'tincture' | 'tea' | 'capsule' | 'fresh' | 'dried';
    standardDose: {
      adult: { min: number; max: number; unit: string };
      child: { min: number; max: number; unit: string; minAge: number };
      elderly: { min: number; max: number; unit: string };
    };
    frequency: string;
    timing: string;
    notes: string;
  }[];
  contraindications: string[];
  drugInteractions: string[];
  pregnancySafe: boolean;
  breastfeedingSafe: boolean;
  maxDuration: string;
  warningLevel: 'low' | 'moderate' | 'high';
}

export const dosageDatabase: DosageInfo[] = [
  {
    herbId: 'ashwagandha',
    name: 'Ashwagandha',
    forms: [
      {
        type: 'powder',
        standardDose: {
          adult: { min: 300, max: 600, unit: 'mg' },
          child: { min: 100, max: 200, unit: 'mg', minAge: 12 },
          elderly: { min: 200, max: 400, unit: 'mg' }
        },
        frequency: '1-2 times daily',
        timing: 'With meals or before bed',
        notes: 'Start with lower dose and increase gradually'
      },
      {
        type: 'tincture',
        standardDose: {
          adult: { min: 2, max: 4, unit: 'ml' },
          child: { min: 0.5, max: 1, unit: 'ml', minAge: 12 },
          elderly: { min: 1, max: 2, unit: 'ml' }
        },
        frequency: '2-3 times daily',
        timing: 'Diluted in water',
        notes: 'Can be added to warm milk or water'
      }
    ],
    contraindications: [
      'Autoimmune conditions (may stimulate immune system)',
      'Thyroid disorders (may affect thyroid hormones)',
      'Scheduled surgery (stop 2 weeks before)'
    ],
    drugInteractions: [
      'Thyroid medications (levothyroxine)',
      'Immunosuppressants',
      'Sedatives and anti-anxiety medications',
      'Blood pressure medications'
    ],
    pregnancySafe: false,
    breastfeedingSafe: false,
    maxDuration: '3 months, then take a 2-week break',
    warningLevel: 'moderate'
  },
  {
    herbId: 'tulsi',
    name: 'Tulsi (Holy Basil)',
    forms: [
      {
        type: 'tea',
        standardDose: {
          adult: { min: 1, max: 2, unit: 'cups' },
          child: { min: 0.5, max: 1, unit: 'cup', minAge: 6 },
          elderly: { min: 1, max: 2, unit: 'cups' }
        },
        frequency: '2-3 times daily',
        timing: 'Between meals',
        notes: 'Use 1-2 tsp dried leaves per cup'
      },
      {
        type: 'fresh',
        standardDose: {
          adult: { min: 5, max: 10, unit: 'leaves' },
          child: { min: 2, max: 4, unit: 'leaves', minAge: 6 },
          elderly: { min: 4, max: 8, unit: 'leaves' }
        },
        frequency: 'Daily',
        timing: 'Morning, on empty stomach',
        notes: 'Chew fresh leaves or add to food'
      }
    ],
    contraindications: [
      'Blood clotting disorders',
      '2 weeks before surgery',
      'Trying to conceive'
    ],
    drugInteractions: [
      'Blood thinners (warfarin, aspirin)',
      'Anti-diabetic medications',
      'Blood pressure medications'
    ],
    pregnancySafe: false,
    breastfeedingSafe: true,
    maxDuration: 'Safe for long-term use with occasional breaks',
    warningLevel: 'low'
  },
  {
    herbId: 'turmeric',
    name: 'Turmeric',
    forms: [
      {
        type: 'powder',
        standardDose: {
          adult: { min: 500, max: 2000, unit: 'mg' },
          child: { min: 250, max: 500, unit: 'mg', minAge: 6 },
          elderly: { min: 500, max: 1000, unit: 'mg' }
        },
        frequency: '1-3 times daily',
        timing: 'With meals containing fat',
        notes: 'Always take with black pepper for absorption'
      },
      {
        type: 'fresh',
        standardDose: {
          adult: { min: 1.5, max: 3, unit: 'grams' },
          child: { min: 0.5, max: 1, unit: 'gram', minAge: 6 },
          elderly: { min: 1, max: 2, unit: 'grams' }
        },
        frequency: 'Daily',
        timing: 'With food',
        notes: 'Fresh root can be grated or juiced'
      }
    ],
    contraindications: [
      'Gallbladder disease or gallstones',
      'Bleeding disorders',
      'Iron deficiency (may reduce absorption)'
    ],
    drugInteractions: [
      'Blood thinners',
      'Diabetes medications',
      'Antacids',
      'Chemotherapy drugs'
    ],
    pregnancySafe: true,
    breastfeedingSafe: true,
    maxDuration: 'Safe for long-term culinary use',
    warningLevel: 'low'
  },
  {
    herbId: 'brahmi',
    name: 'Brahmi',
    forms: [
      {
        type: 'powder',
        standardDose: {
          adult: { min: 300, max: 450, unit: 'mg' },
          child: { min: 100, max: 200, unit: 'mg', minAge: 8 },
          elderly: { min: 200, max: 300, unit: 'mg' }
        },
        frequency: '1-2 times daily',
        timing: 'Morning and evening',
        notes: 'Best taken with ghee or warm milk'
      },
      {
        type: 'tea',
        standardDose: {
          adult: { min: 1, max: 2, unit: 'cups' },
          child: { min: 0.5, max: 1, unit: 'cup', minAge: 8 },
          elderly: { min: 1, max: 1.5, unit: 'cups' }
        },
        frequency: '1-2 times daily',
        timing: 'Morning preferred',
        notes: 'Use 1 tsp dried herb per cup'
      }
    ],
    contraindications: [
      'Slow heart rate (bradycardia)',
      'Gastrointestinal obstruction',
      'Lung conditions with excess secretion'
    ],
    drugInteractions: [
      'Thyroid medications',
      'Sedatives',
      'Anticholinergic drugs',
      'Calcium channel blockers'
    ],
    pregnancySafe: false,
    breastfeedingSafe: false,
    maxDuration: '12 weeks, then evaluate',
    warningLevel: 'moderate'
  },
  {
    herbId: 'neem',
    name: 'Neem',
    forms: [
      {
        type: 'capsule',
        standardDose: {
          adult: { min: 200, max: 400, unit: 'mg' },
          child: { min: 0, max: 0, unit: 'mg', minAge: 18 },
          elderly: { min: 100, max: 200, unit: 'mg' }
        },
        frequency: '1-2 times daily',
        timing: 'With meals',
        notes: 'Not recommended for children internally'
      },
      {
        type: 'tea',
        standardDose: {
          adult: { min: 0.5, max: 1, unit: 'cup' },
          child: { min: 0, max: 0, unit: 'cup', minAge: 18 },
          elderly: { min: 0.25, max: 0.5, unit: 'cup' }
        },
        frequency: 'Once daily',
        timing: 'Morning on empty stomach',
        notes: 'Very bitter taste, can add honey'
      }
    ],
    contraindications: [
      'Infants and children (internal use)',
      'Trying to conceive (both partners)',
      'Autoimmune conditions',
      'Organ transplant recipients'
    ],
    drugInteractions: [
      'Diabetes medications (may lower blood sugar)',
      'Immunosuppressants',
      'Lithium',
      'Antidiabetic drugs'
    ],
    pregnancySafe: false,
    breastfeedingSafe: false,
    maxDuration: '2 weeks maximum for internal use',
    warningLevel: 'high'
  },
  {
    herbId: 'ginger',
    name: 'Ginger',
    forms: [
      {
        type: 'fresh',
        standardDose: {
          adult: { min: 2, max: 4, unit: 'grams' },
          child: { min: 0.5, max: 1, unit: 'gram', minAge: 2 },
          elderly: { min: 1, max: 3, unit: 'grams' }
        },
        frequency: 'Up to 3 times daily',
        timing: 'With or without food',
        notes: 'Can grate into food or make tea'
      },
      {
        type: 'tea',
        standardDose: {
          adult: { min: 2, max: 4, unit: 'cups' },
          child: { min: 0.5, max: 1, unit: 'cup', minAge: 2 },
          elderly: { min: 1, max: 3, unit: 'cups' }
        },
        frequency: 'Throughout the day',
        timing: 'Any time, especially for nausea',
        notes: 'Use 1 inch fresh ginger per cup'
      }
    ],
    contraindications: [
      'Bleeding disorders',
      'Heart conditions',
      'Gallstones'
    ],
    drugInteractions: [
      'Blood thinners',
      'High blood pressure medications',
      'Diabetes medications'
    ],
    pregnancySafe: true,
    breastfeedingSafe: true,
    maxDuration: 'Safe for regular use',
    warningLevel: 'low'
  }
];

export interface DosageCalculatorInput {
  herbId: string;
  form: string;
  age: number;
  weight: number; // in kg
  isPregnant: boolean;
  isBreastfeeding: boolean;
  healthConditions: string[];
  currentMedications: string[];
}

export interface DosageRecommendation {
  recommended: { min: number; max: number; unit: string };
  frequency: string;
  timing: string;
  warnings: string[];
  adjustments: string[];
  safetyScore: number; // 1-10
}

export function calculateDosage(input: DosageCalculatorInput): DosageRecommendation | null {
  const herb = dosageDatabase.find(h => h.herbId === input.herbId);
  if (!herb) return null;

  const form = herb.forms.find(f => f.type === input.form);
  if (!form) return null;

  const warnings: string[] = [];
  const adjustments: string[] = [];
  let safetyScore = 10;

  // Determine age group
  let ageGroup: 'child' | 'adult' | 'elderly' = 'adult';
  if (input.age < 18) ageGroup = 'child';
  else if (input.age >= 65) ageGroup = 'elderly';

  const baseDose = form.standardDose[ageGroup];

  // Check pregnancy
  if (input.isPregnant && !herb.pregnancySafe) {
    warnings.push('⚠️ NOT RECOMMENDED during pregnancy');
    safetyScore -= 5;
  }

  // Check breastfeeding
  if (input.isBreastfeeding && !herb.breastfeedingSafe) {
    warnings.push('⚠️ NOT RECOMMENDED while breastfeeding');
    safetyScore -= 4;
  }

  // Check age for children
  if (ageGroup === 'child' && input.age < form.standardDose.child.minAge) {
    warnings.push(`⚠️ Not recommended for children under ${form.standardDose.child.minAge} years`);
    safetyScore -= 5;
  }

  // Weight adjustments
  if (input.weight < 50 && ageGroup === 'adult') {
    adjustments.push('Lower body weight: consider starting with minimum dose');
    safetyScore -= 1;
  } else if (input.weight > 90) {
    adjustments.push('Higher body weight: may use upper range of dosage');
  }

  // Check drug interactions
  const matchingInteractions = herb.drugInteractions.filter(interaction => 
    input.currentMedications.some(med => 
      interaction.toLowerCase().includes(med.toLowerCase()) ||
      med.toLowerCase().includes(interaction.toLowerCase().split(' ')[0])
    )
  );

  if (matchingInteractions.length > 0) {
    warnings.push(`⚠️ Potential interactions with: ${matchingInteractions.join(', ')}`);
    safetyScore -= matchingInteractions.length * 2;
  }

  // Check contraindications
  const matchingContraindications = herb.contraindications.filter(contra =>
    input.healthConditions.some(condition =>
      contra.toLowerCase().includes(condition.toLowerCase()) ||
      condition.toLowerCase().includes(contra.toLowerCase().split(' ')[0])
    )
  );

  if (matchingContraindications.length > 0) {
    warnings.push(`🚫 Contraindicated for: ${matchingContraindications.join(', ')}`);
    safetyScore -= matchingContraindications.length * 3;
  }

  // Add general warnings based on warning level
  if (herb.warningLevel === 'high') {
    warnings.push('⚠️ This herb requires careful monitoring. Consult a healthcare provider.');
    safetyScore -= 2;
  }

  warnings.push(`📅 Maximum duration: ${herb.maxDuration}`);

  return {
    recommended: baseDose,
    frequency: form.frequency,
    timing: form.timing,
    warnings,
    adjustments,
    safetyScore: Math.max(1, safetyScore)
  };
}

export function getHerbById(herbId: string): DosageInfo | undefined {
  return dosageDatabase.find(h => h.herbId === herbId);
}
