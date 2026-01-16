// Seasonal Calendar Data - Plant availability, harvest times, growing conditions

export interface PlantSeason {
  id: string;
  name: string;
  scientificName: string;
  image: string;
  seasons: {
    spring: boolean;
    summer: boolean;
    fall: boolean;
    winter: boolean;
  };
  harvestMonths: number[]; // 1-12
  growingConditions: {
    sunlight: 'full-sun' | 'partial-shade' | 'full-shade';
    water: 'low' | 'moderate' | 'high';
    soil: string;
    temperature: string;
  };
  region: string[];
  medicinalParts: string[];
  category: 'herb' | 'flower' | 'root' | 'bark' | 'leaf';
}

export const seasonalPlants: PlantSeason[] = [
  {
    id: '1',
    name: 'Tulsi (Holy Basil)',
    scientificName: 'Ocimum tenuiflorum',
    image: '/placeholder.svg',
    seasons: { spring: true, summer: true, fall: true, winter: false },
    harvestMonths: [4, 5, 6, 7, 8, 9, 10],
    growingConditions: {
      sunlight: 'full-sun',
      water: 'moderate',
      soil: 'Well-drained, fertile soil',
      temperature: '20-35°C'
    },
    region: ['India', 'Southeast Asia', 'Tropical regions'],
    medicinalParts: ['Leaves', 'Seeds', 'Flowers'],
    category: 'herb'
  },
  {
    id: '2',
    name: 'Ashwagandha',
    scientificName: 'Withania somnifera',
    image: '/placeholder.svg',
    seasons: { spring: false, summer: false, fall: true, winter: true },
    harvestMonths: [10, 11, 12, 1, 2],
    growingConditions: {
      sunlight: 'full-sun',
      water: 'low',
      soil: 'Sandy, well-drained soil',
      temperature: '15-30°C'
    },
    region: ['India', 'Middle East', 'Africa'],
    medicinalParts: ['Roots', 'Leaves'],
    category: 'root'
  },
  {
    id: '3',
    name: 'Chamomile',
    scientificName: 'Matricaria chamomilla',
    image: '/placeholder.svg',
    seasons: { spring: true, summer: true, fall: false, winter: false },
    harvestMonths: [5, 6, 7, 8],
    growingConditions: {
      sunlight: 'full-sun',
      water: 'moderate',
      soil: 'Light, sandy soil',
      temperature: '15-25°C'
    },
    region: ['Europe', 'North America', 'Australia'],
    medicinalParts: ['Flowers'],
    category: 'flower'
  },
  {
    id: '4',
    name: 'Turmeric',
    scientificName: 'Curcuma longa',
    image: '/placeholder.svg',
    seasons: { spring: true, summer: true, fall: true, winter: false },
    harvestMonths: [10, 11, 12, 1],
    growingConditions: {
      sunlight: 'partial-shade',
      water: 'high',
      soil: 'Rich, loamy soil',
      temperature: '20-35°C'
    },
    region: ['India', 'Southeast Asia', 'Tropical regions'],
    medicinalParts: ['Rhizome'],
    category: 'root'
  },
  {
    id: '5',
    name: 'Lavender',
    scientificName: 'Lavandula angustifolia',
    image: '/placeholder.svg',
    seasons: { spring: true, summer: true, fall: false, winter: false },
    harvestMonths: [6, 7, 8],
    growingConditions: {
      sunlight: 'full-sun',
      water: 'low',
      soil: 'Well-drained, alkaline soil',
      temperature: '15-25°C'
    },
    region: ['Mediterranean', 'Europe', 'North America'],
    medicinalParts: ['Flowers', 'Leaves'],
    category: 'flower'
  },
  {
    id: '6',
    name: 'Ginger',
    scientificName: 'Zingiber officinale',
    image: '/placeholder.svg',
    seasons: { spring: true, summer: true, fall: true, winter: false },
    harvestMonths: [10, 11, 12],
    growingConditions: {
      sunlight: 'partial-shade',
      water: 'high',
      soil: 'Rich, moist soil',
      temperature: '22-30°C'
    },
    region: ['India', 'China', 'Southeast Asia', 'Caribbean'],
    medicinalParts: ['Rhizome'],
    category: 'root'
  },
  {
    id: '7',
    name: 'Neem',
    scientificName: 'Azadirachta indica',
    image: '/placeholder.svg',
    seasons: { spring: true, summer: true, fall: true, winter: true },
    harvestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    growingConditions: {
      sunlight: 'full-sun',
      water: 'low',
      soil: 'Any well-drained soil',
      temperature: '20-40°C'
    },
    region: ['India', 'Southeast Asia', 'Africa'],
    medicinalParts: ['Leaves', 'Bark', 'Seeds', 'Oil'],
    category: 'leaf'
  },
  {
    id: '8',
    name: 'Peppermint',
    scientificName: 'Mentha × piperita',
    image: '/placeholder.svg',
    seasons: { spring: true, summer: true, fall: true, winter: false },
    harvestMonths: [5, 6, 7, 8, 9],
    growingConditions: {
      sunlight: 'partial-shade',
      water: 'high',
      soil: 'Rich, moist soil',
      temperature: '15-25°C'
    },
    region: ['Europe', 'North America', 'Temperate regions'],
    medicinalParts: ['Leaves', 'Stems'],
    category: 'herb'
  },
  {
    id: '9',
    name: 'Echinacea',
    scientificName: 'Echinacea purpurea',
    image: '/placeholder.svg',
    seasons: { spring: true, summer: true, fall: true, winter: false },
    harvestMonths: [7, 8, 9, 10],
    growingConditions: {
      sunlight: 'full-sun',
      water: 'moderate',
      soil: 'Well-drained, fertile soil',
      temperature: '10-25°C'
    },
    region: ['North America', 'Europe'],
    medicinalParts: ['Roots', 'Flowers', 'Leaves'],
    category: 'flower'
  },
  {
    id: '10',
    name: 'Brahmi',
    scientificName: 'Bacopa monnieri',
    image: '/placeholder.svg',
    seasons: { spring: true, summer: true, fall: true, winter: false },
    harvestMonths: [6, 7, 8, 9, 10],
    growingConditions: {
      sunlight: 'partial-shade',
      water: 'high',
      soil: 'Moist, marshy soil',
      temperature: '20-35°C'
    },
    region: ['India', 'Southeast Asia', 'Wetlands'],
    medicinalParts: ['Whole plant', 'Leaves'],
    category: 'herb'
  },
  {
    id: '11',
    name: 'Aloe Vera',
    scientificName: 'Aloe barbadensis',
    image: '/placeholder.svg',
    seasons: { spring: true, summer: true, fall: true, winter: true },
    harvestMonths: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    growingConditions: {
      sunlight: 'full-sun',
      water: 'low',
      soil: 'Sandy, well-drained soil',
      temperature: '15-35°C'
    },
    region: ['Africa', 'Arabia', 'Worldwide (cultivated)'],
    medicinalParts: ['Leaves', 'Gel', 'Latex'],
    category: 'leaf'
  },
  {
    id: '12',
    name: 'Shatavari',
    scientificName: 'Asparagus racemosus',
    image: '/placeholder.svg',
    seasons: { spring: false, summer: false, fall: true, winter: true },
    harvestMonths: [11, 12, 1, 2, 3],
    growingConditions: {
      sunlight: 'partial-shade',
      water: 'moderate',
      soil: 'Rich, loamy soil',
      temperature: '15-30°C'
    },
    region: ['India', 'Sri Lanka', 'Southeast Asia'],
    medicinalParts: ['Roots'],
    category: 'root'
  }
];

export const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const seasonInfo = {
  spring: { months: [3, 4, 5], color: 'hsl(140 70% 45%)', icon: '🌱' },
  summer: { months: [6, 7, 8], color: 'hsl(45 90% 50%)', icon: '☀️' },
  fall: { months: [9, 10, 11], color: 'hsl(25 80% 50%)', icon: '🍂' },
  winter: { months: [12, 1, 2], color: 'hsl(200 60% 60%)', icon: '❄️' }
};

export function getCurrentSeason(): 'spring' | 'summer' | 'fall' | 'winter' {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'fall';
  return 'winter';
}

export function getPlantsInSeason(season: 'spring' | 'summer' | 'fall' | 'winter'): PlantSeason[] {
  return seasonalPlants.filter(plant => plant.seasons[season]);
}

export function getPlantsToHarvestThisMonth(): PlantSeason[] {
  const currentMonth = new Date().getMonth() + 1;
  return seasonalPlants.filter(plant => plant.harvestMonths.includes(currentMonth));
}
