// Herbal Recipes Data - Tea blends, tinctures, remedies with preparation guides

export interface Recipe {
  id: string;
  name: string;
  category: 'tea' | 'tincture' | 'salve' | 'syrup' | 'powder' | 'oil';
  difficulty: 'easy' | 'medium' | 'advanced';
  prepTime: string;
  description: string;
  benefits: string[];
  ingredients: {
    name: string;
    amount: string;
    notes?: string;
  }[];
  instructions: string[];
  warnings: string[];
  storage: string;
  shelfLife: string;
  image: string;
  tags: string[];
}

export const herbalRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Immunity Boost Tea',
    category: 'tea',
    difficulty: 'easy',
    prepTime: '10 mins',
    description: 'A warming blend to support your immune system during cold season.',
    benefits: ['Boosts immunity', 'Soothes throat', 'Rich in antioxidants', 'Warming'],
    ingredients: [
      { name: 'Tulsi leaves', amount: '1 tbsp', notes: 'Fresh or dried' },
      { name: 'Ginger', amount: '1 inch piece', notes: 'Freshly grated' },
      { name: 'Turmeric powder', amount: '½ tsp' },
      { name: 'Black pepper', amount: '2-3 peppercorns', notes: 'Helps turmeric absorption' },
      { name: 'Honey', amount: 'To taste', notes: 'Add when slightly cooled' },
      { name: 'Water', amount: '2 cups' }
    ],
    instructions: [
      'Bring water to a boil in a small pot.',
      'Add grated ginger and let it simmer for 2-3 minutes.',
      'Add tulsi leaves, turmeric, and black pepper.',
      'Reduce heat and simmer for 5 minutes.',
      'Strain into a cup and let it cool slightly.',
      'Add honey when drinkable temperature is reached.',
      'Drink warm, 1-2 times daily during cold season.'
    ],
    warnings: [
      'Consult doctor if pregnant or nursing',
      'May interact with blood thinners',
      'Avoid if allergic to any ingredient'
    ],
    storage: 'Best consumed fresh. Can refrigerate for up to 24 hours.',
    shelfLife: '24 hours refrigerated',
    image: '/placeholder.svg',
    tags: ['immunity', 'cold', 'winter', 'warming']
  },
  {
    id: '2',
    name: 'Calming Sleep Blend',
    category: 'tea',
    difficulty: 'easy',
    prepTime: '8 mins',
    description: 'A gentle, relaxing tea to promote restful sleep.',
    benefits: ['Promotes relaxation', 'Improves sleep quality', 'Reduces anxiety', 'Gentle'],
    ingredients: [
      { name: 'Chamomile flowers', amount: '2 tsp', notes: 'Dried' },
      { name: 'Lavender buds', amount: '1 tsp', notes: 'Food-grade dried' },
      { name: 'Passionflower', amount: '1 tsp', notes: 'Optional' },
      { name: 'Honey', amount: 'To taste' },
      { name: 'Water', amount: '1½ cups' }
    ],
    instructions: [
      'Boil water and let it cool for 1 minute (to about 95°C).',
      'Place chamomile, lavender, and passionflower in a teapot or infuser.',
      'Pour hot water over the herbs.',
      'Cover and steep for 5-7 minutes.',
      'Strain and add honey if desired.',
      'Drink 30 minutes before bedtime.'
    ],
    warnings: [
      'May cause drowsiness - do not drive after consuming',
      'Not recommended during pregnancy',
      'May interact with sedative medications'
    ],
    storage: 'Prepare fresh each time for best results.',
    shelfLife: 'Consume immediately',
    image: '/placeholder.svg',
    tags: ['sleep', 'relaxation', 'anxiety', 'evening']
  },
  {
    id: '3',
    name: 'Digestive Ginger Syrup',
    category: 'syrup',
    difficulty: 'medium',
    prepTime: '45 mins',
    description: 'A soothing syrup for digestive comfort and nausea relief.',
    benefits: ['Aids digestion', 'Relieves nausea', 'Anti-inflammatory', 'Soothes stomach'],
    ingredients: [
      { name: 'Fresh ginger root', amount: '200g', notes: 'Peeled and sliced' },
      { name: 'Raw honey', amount: '1 cup' },
      { name: 'Lemon juice', amount: '2 tbsp', notes: 'Fresh' },
      { name: 'Water', amount: '2 cups' }
    ],
    instructions: [
      'Slice ginger into thin rounds.',
      'Combine ginger and water in a pot and bring to boil.',
      'Reduce heat and simmer for 30 minutes until reduced by half.',
      'Strain the ginger water into a clean pot.',
      'Let it cool to about 40°C (warm but not hot).',
      'Stir in honey until fully dissolved.',
      'Add lemon juice and mix well.',
      'Pour into a sterilized glass jar.'
    ],
    warnings: [
      'Keep honey below 45°C to preserve enzymes',
      'Not for children under 1 year (contains honey)',
      'Consult doctor if taking blood thinners'
    ],
    storage: 'Store in refrigerator in airtight glass container.',
    shelfLife: '2-3 months refrigerated',
    image: '/placeholder.svg',
    tags: ['digestion', 'nausea', 'stomach', 'syrup']
  },
  {
    id: '4',
    name: 'Healing Turmeric Golden Milk',
    category: 'tea',
    difficulty: 'easy',
    prepTime: '10 mins',
    description: 'Traditional anti-inflammatory drink for overall wellness.',
    benefits: ['Anti-inflammatory', 'Antioxidant-rich', 'Supports joints', 'Immune support'],
    ingredients: [
      { name: 'Milk (dairy or plant-based)', amount: '1 cup' },
      { name: 'Turmeric powder', amount: '1 tsp' },
      { name: 'Ginger powder', amount: '¼ tsp' },
      { name: 'Cinnamon', amount: '¼ tsp' },
      { name: 'Black pepper', amount: 'Pinch', notes: 'Enhances absorption' },
      { name: 'Coconut oil', amount: '1 tsp', notes: 'Optional' },
      { name: 'Honey or maple syrup', amount: 'To taste' }
    ],
    instructions: [
      'Warm milk in a small pot over medium heat.',
      'Add turmeric, ginger, cinnamon, and black pepper.',
      'Whisk well to combine all spices.',
      'Add coconut oil if using.',
      'Heat until steaming but not boiling.',
      'Remove from heat and let cool slightly.',
      'Add sweetener to taste.',
      'Drink warm, especially in the evening.'
    ],
    warnings: [
      'May stain clothing and surfaces',
      'Avoid if you have gallbladder issues',
      'May interact with blood thinners'
    ],
    storage: 'Best consumed fresh.',
    shelfLife: 'Consume immediately',
    image: '/placeholder.svg',
    tags: ['inflammation', 'joints', 'immunity', 'evening']
  },
  {
    id: '5',
    name: 'Ashwagandha Stress Relief Tincture',
    category: 'tincture',
    difficulty: 'advanced',
    prepTime: '4-6 weeks',
    description: 'A potent adaptogenic extract for stress and energy balance.',
    benefits: ['Reduces stress', 'Balances energy', 'Supports adrenals', 'Improves focus'],
    ingredients: [
      { name: 'Dried ashwagandha root', amount: '100g', notes: 'Cut or powdered' },
      { name: 'Vodka (40% alcohol)', amount: '500ml', notes: 'Food-grade' },
      { name: 'Glass jar with lid', amount: '1 quart' }
    ],
    instructions: [
      'Place ashwagandha root in a clean glass jar.',
      'Pour vodka over the herb, covering completely.',
      'Seal tightly and label with date.',
      'Store in a cool, dark place.',
      'Shake daily for the first week, then every few days.',
      'Let macerate for 4-6 weeks.',
      'Strain through cheesecloth into amber dropper bottles.',
      'Squeeze cloth to extract all liquid.',
      'Take 30-60 drops, 1-3 times daily in water.'
    ],
    warnings: [
      'Not for pregnant or nursing women',
      'May interact with thyroid medications',
      'Consult healthcare provider before use',
      'Contains alcohol'
    ],
    storage: 'Store in amber glass bottles away from light.',
    shelfLife: '3-5 years if stored properly',
    image: '/placeholder.svg',
    tags: ['stress', 'adaptogen', 'energy', 'focus']
  },
  {
    id: '6',
    name: 'Neem Healing Skin Oil',
    category: 'oil',
    difficulty: 'medium',
    prepTime: '2 hours',
    description: 'Antibacterial oil for skin conditions and minor wounds.',
    benefits: ['Antibacterial', 'Antifungal', 'Soothes skin', 'Promotes healing'],
    ingredients: [
      { name: 'Neem leaves', amount: '1 cup', notes: 'Fresh, washed' },
      { name: 'Coconut oil', amount: '1 cup' },
      { name: 'Vitamin E oil', amount: '1 tsp', notes: 'Optional, for preservation' }
    ],
    instructions: [
      'Wash and dry neem leaves thoroughly.',
      'Heat coconut oil in a double boiler.',
      'Add neem leaves to the warm oil.',
      'Keep on low heat for 1-2 hours, stirring occasionally.',
      'Do not let oil smoke or boil.',
      'Let cool and strain through fine mesh.',
      'Add vitamin E oil and stir well.',
      'Pour into dark glass container.'
    ],
    warnings: [
      'For external use only',
      'Patch test before applying to larger areas',
      'Avoid on open wounds initially',
      'Not for ingestion'
    ],
    storage: 'Store in cool, dark place.',
    shelfLife: '6 months to 1 year',
    image: '/placeholder.svg',
    tags: ['skin', 'healing', 'antibacterial', 'topical']
  },
  {
    id: '7',
    name: 'Brahmi Memory Powder',
    category: 'powder',
    difficulty: 'easy',
    prepTime: '5 mins',
    description: 'Traditional brain tonic for memory and cognitive function.',
    benefits: ['Enhances memory', 'Improves focus', 'Reduces mental fatigue', 'Calms mind'],
    ingredients: [
      { name: 'Brahmi powder', amount: '2 parts' },
      { name: 'Ashwagandha powder', amount: '1 part' },
      { name: 'Shankhpushpi powder', amount: '1 part', notes: 'Optional' },
      { name: 'Honey or ghee', amount: 'For mixing', notes: 'When consuming' }
    ],
    instructions: [
      'Measure out brahmi, ashwagandha, and shankhpushpi powders.',
      'Combine in a clean, dry jar.',
      'Shake or stir to mix evenly.',
      'To consume: Mix ½-1 tsp with honey or warm milk.',
      'Take once or twice daily, preferably morning.',
      'Continue for at least 3 months for best results.'
    ],
    warnings: [
      'Start with small doses',
      'Not during pregnancy',
      'May cause drowsiness initially',
      'Consult healthcare provider if on medications'
    ],
    storage: 'Store in airtight container away from moisture.',
    shelfLife: '1 year if kept dry',
    image: '/placeholder.svg',
    tags: ['memory', 'brain', 'focus', 'cognitive']
  },
  {
    id: '8',
    name: 'Soothing Throat Lozenges',
    category: 'syrup',
    difficulty: 'medium',
    prepTime: '30 mins',
    description: 'Homemade herbal lozenges for sore throat relief.',
    benefits: ['Soothes throat', 'Reduces cough', 'Antibacterial', 'Natural'],
    ingredients: [
      { name: 'Raw honey', amount: '1 cup' },
      { name: 'Fresh ginger juice', amount: '2 tbsp' },
      { name: 'Lemon juice', amount: '1 tbsp' },
      { name: 'Tulsi powder', amount: '1 tsp' },
      { name: 'Licorice powder', amount: '½ tsp', notes: 'Optional' }
    ],
    instructions: [
      'Combine honey and ginger juice in a heavy pot.',
      'Heat on medium, stirring constantly with candy thermometer.',
      'Cook until it reaches 150°C (hard crack stage).',
      'Remove from heat and quickly stir in lemon, tulsi, and licorice.',
      'Drop small spoonfuls onto parchment paper.',
      'Let cool completely until hardened.',
      'Wrap individually in wax paper.'
    ],
    warnings: [
      'Hot sugar can cause severe burns',
      'Not for children under 1 year',
      'Avoid licorice if you have high blood pressure',
      'Keep out of reach of small children (choking hazard)'
    ],
    storage: 'Store in airtight container at room temperature.',
    shelfLife: '2-3 months',
    image: '/placeholder.svg',
    tags: ['throat', 'cough', 'cold', 'lozenges']
  }
];

export function getRecipesByCategory(category: Recipe['category']): Recipe[] {
  return herbalRecipes.filter(recipe => recipe.category === category);
}

export function getRecipesByDifficulty(difficulty: Recipe['difficulty']): Recipe[] {
  return herbalRecipes.filter(recipe => recipe.difficulty === difficulty);
}

export function searchRecipes(query: string): Recipe[] {
  const lowerQuery = query.toLowerCase();
  return herbalRecipes.filter(recipe => 
    recipe.name.toLowerCase().includes(lowerQuery) ||
    recipe.description.toLowerCase().includes(lowerQuery) ||
    recipe.tags.some(tag => tag.includes(lowerQuery)) ||
    recipe.benefits.some(benefit => benefit.toLowerCase().includes(lowerQuery))
  );
}
