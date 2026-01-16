// Daily Wellness Tips Data - Personalized tips based on season & health goals

export interface WellnessTip {
  id: string;
  title: string;
  description: string;
  category: 'immunity' | 'digestion' | 'sleep' | 'stress' | 'energy' | 'skin' | 'general';
  season: 'spring' | 'summer' | 'fall' | 'winter' | 'all';
  herbs: string[];
  actionable: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

export const wellnessTips: WellnessTip[] = [
  // Winter Tips
  {
    id: 'w1',
    title: 'Boost Winter Immunity',
    description: 'Cold weather weakens immunity. Support your body with warming herbs rich in antioxidants.',
    category: 'immunity',
    season: 'winter',
    herbs: ['Tulsi', 'Ginger', 'Turmeric'],
    actionable: 'Start your day with a cup of tulsi-ginger tea to strengthen your immune system.',
    icon: '🛡️',
    priority: 'high'
  },
  {
    id: 'w2',
    title: 'Winter Skin Care',
    description: 'Dry winter air can damage your skin. Nourish it from inside and out.',
    category: 'skin',
    season: 'winter',
    herbs: ['Aloe Vera', 'Coconut Oil', 'Ghee'],
    actionable: 'Apply aloe vera gel mixed with coconut oil before bed for deep hydration.',
    icon: '✨',
    priority: 'medium'
  },
  {
    id: 'w3',
    title: 'Stay Energized in Winter',
    description: 'Shorter days can make you feel sluggish. Adaptogenic herbs help maintain energy.',
    category: 'energy',
    season: 'winter',
    herbs: ['Ashwagandha', 'Shilajit', 'Brahmi'],
    actionable: 'Take ashwagandha with warm milk in the evening to balance energy and improve sleep.',
    icon: '⚡',
    priority: 'medium'
  },
  
  // Spring Tips
  {
    id: 's1',
    title: 'Spring Detox Time',
    description: 'Spring is ideal for cleansing. Support your liver and digestion with bitter herbs.',
    category: 'digestion',
    season: 'spring',
    herbs: ['Neem', 'Triphala', 'Dandelion'],
    actionable: 'Take triphala before bed for gentle overnight cleansing.',
    icon: '🌱',
    priority: 'high'
  },
  {
    id: 's2',
    title: 'Seasonal Allergy Defense',
    description: 'Spring allergies got you down? Natural antihistamines can help.',
    category: 'immunity',
    season: 'spring',
    herbs: ['Tulsi', 'Turmeric', 'Nettle'],
    actionable: 'Drink nettle tea 2-3 times daily to reduce allergy symptoms naturally.',
    icon: '🌸',
    priority: 'high'
  },
  
  // Summer Tips
  {
    id: 'su1',
    title: 'Stay Cool & Hydrated',
    description: 'Beat the summer heat with cooling herbs that prevent overheating.',
    category: 'general',
    season: 'summer',
    herbs: ['Mint', 'Aloe Vera', 'Coriander'],
    actionable: 'Add fresh mint and cucumber to your water for a refreshing, cooling drink.',
    icon: '❄️',
    priority: 'high'
  },
  {
    id: 'su2',
    title: 'Summer Skin Protection',
    description: 'Protect your skin from sun damage with antioxidant-rich herbs.',
    category: 'skin',
    season: 'summer',
    herbs: ['Aloe Vera', 'Sandalwood', 'Turmeric'],
    actionable: 'Apply fresh aloe vera gel after sun exposure to soothe and heal skin.',
    icon: '☀️',
    priority: 'high'
  },
  {
    id: 'su3',
    title: 'Digestive Summer Care',
    description: 'Summer heat can weaken digestion. Keep your digestive fire balanced.',
    category: 'digestion',
    season: 'summer',
    herbs: ['Fennel', 'Cumin', 'Coriander'],
    actionable: 'Drink CCF tea (cumin-coriander-fennel) after meals to aid digestion.',
    icon: '🔥',
    priority: 'medium'
  },
  
  // Fall Tips
  {
    id: 'f1',
    title: 'Prepare for Cold Season',
    description: 'Fall is the time to strengthen immunity before winter arrives.',
    category: 'immunity',
    season: 'fall',
    herbs: ['Chyawanprash', 'Amla', 'Ashwagandha'],
    actionable: 'Start taking chyawanprash daily to build immunity for the coming winter.',
    icon: '🍂',
    priority: 'high'
  },
  {
    id: 'f2',
    title: 'Grounding Energy',
    description: 'Fall brings change and restlessness. Ground your energy with warming herbs.',
    category: 'stress',
    season: 'fall',
    herbs: ['Ashwagandha', 'Cinnamon', 'Ginger'],
    actionable: 'Practice evening self-massage with warm sesame oil for calming and grounding.',
    icon: '🧘',
    priority: 'medium'
  },
  
  // All Season Tips
  {
    id: 'a1',
    title: 'Better Sleep Tonight',
    description: 'Quality sleep is the foundation of health. Support it naturally.',
    category: 'sleep',
    season: 'all',
    herbs: ['Chamomile', 'Ashwagandha', 'Lavender'],
    actionable: 'Drink chamomile tea 30 minutes before bed and avoid screens for deeper sleep.',
    icon: '🌙',
    priority: 'high'
  },
  {
    id: 'a2',
    title: 'Daily Stress Relief',
    description: 'Chronic stress harms every system. Build resilience with adaptogens.',
    category: 'stress',
    season: 'all',
    herbs: ['Ashwagandha', 'Brahmi', 'Tulsi'],
    actionable: 'Take 5 deep breaths and sip tulsi tea whenever you feel stressed.',
    icon: '😌',
    priority: 'high'
  },
  {
    id: 'a3',
    title: 'Digestive Wellness',
    description: 'Good digestion means better nutrient absorption and energy.',
    category: 'digestion',
    season: 'all',
    herbs: ['Ginger', 'Triphala', 'Fennel'],
    actionable: 'Chew a small piece of fresh ginger before meals to ignite digestive fire.',
    icon: '🍵',
    priority: 'medium'
  },
  {
    id: 'a4',
    title: 'Mental Clarity',
    description: 'Support brain health and focus with traditional nootropic herbs.',
    category: 'energy',
    season: 'all',
    herbs: ['Brahmi', 'Gotu Kola', 'Shankhpushpi'],
    actionable: 'Take brahmi in the morning with warm water for enhanced mental clarity.',
    icon: '🧠',
    priority: 'medium'
  },
  {
    id: 'a5',
    title: 'Natural Energy Boost',
    description: 'Skip the caffeine crash. Get sustained energy from adaptogenic herbs.',
    category: 'energy',
    season: 'all',
    herbs: ['Ashwagandha', 'Ginseng', 'Maca'],
    actionable: 'Replace your afternoon coffee with green tea and ashwagandha for lasting energy.',
    icon: '💪',
    priority: 'medium'
  }
];

export function getCurrentSeason(): 'spring' | 'summer' | 'fall' | 'winter' {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'fall';
  return 'winter';
}

export function getTipsForSeason(season: 'spring' | 'summer' | 'fall' | 'winter'): WellnessTip[] {
  return wellnessTips.filter(tip => tip.season === season || tip.season === 'all');
}

export function getTipsByCategory(category: WellnessTip['category']): WellnessTip[] {
  return wellnessTips.filter(tip => tip.category === category);
}

export function getDailyTip(): WellnessTip {
  const season = getCurrentSeason();
  const seasonalTips = getTipsForSeason(season);
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  return seasonalTips[dayOfYear % seasonalTips.length];
}

export function getPersonalizedTips(healthGoals: string[]): WellnessTip[] {
  const season = getCurrentSeason();
  const categoryMap: Record<string, WellnessTip['category']> = {
    'immunity': 'immunity',
    'immune': 'immunity',
    'digestion': 'digestion',
    'gut': 'digestion',
    'sleep': 'sleep',
    'insomnia': 'sleep',
    'stress': 'stress',
    'anxiety': 'stress',
    'energy': 'energy',
    'fatigue': 'energy',
    'skin': 'skin',
    'beauty': 'skin'
  };

  const relevantCategories = healthGoals
    .flatMap(goal => Object.entries(categoryMap)
      .filter(([key]) => goal.toLowerCase().includes(key))
      .map(([, category]) => category)
    );

  if (relevantCategories.length === 0) {
    return getTipsForSeason(season).slice(0, 3);
  }

  return wellnessTips
    .filter(tip => 
      relevantCategories.includes(tip.category) && 
      (tip.season === season || tip.season === 'all')
    )
    .sort((a, b) => {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    })
    .slice(0, 5);
}
