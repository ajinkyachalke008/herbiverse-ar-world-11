import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

// Enhanced plant data with complete 25 herbs dataset
const enhancedPlantData = [
  {
    id: 1,
    name: "Neem",
    scientific: "Azadirachta indica",
    position: [77.5946, 12.9716], // India
    medicinalUses: ["Fever", "Skin Infections", "Dental Care", "Antibacterial"],
    localNames: { 
      hindi: "नीम (Neem)", 
      english: "Margosa", 
      marathi: "कडूनिंब (Kadunimb)",
      tamil: "வேம்பு (Vembu)"
    },
    climateZone: "Tropical & Subtropical",
    conservationStatus: "Abundant",
    rarity: "Common",
    culturalSignificance: "Known as the 'Village Pharmacy' tree in India",
    economicValue: "Multi-billion dollar industry in pesticides and cosmetics",
    distribution: ["India", "Africa", "Southeast Asia"],
    plantType: "medicinal",
    treatmentCategories: ["fever", "skin", "dental"]
  },
  {
    id: 2,
    name: "Tulsi",
    scientific: "Ocimum tenuiflorum",
    position: [85.324, 27.7172], // Nepal
    medicinalUses: ["Cold relief", "Fever", "Immunity booster", "Respiratory"],
    localNames: { 
      hindi: "तुलसी (Tulsi)", 
      sanskrit: "सुरसा (Surasa)",
      nepali: "तुलसी (Tulsi)"
    },
    climateZone: "Tropical",
    conservationStatus: "Abundant",
    rarity: "Common",
    culturalSignificance: "Sacred plant in Hinduism, worshipped daily",
    economicValue: "Ayurvedic medicine and herbal tea industry",
    distribution: ["Nepal", "India", "Southeast Asia"],
    plantType: "medicinal",
    treatmentCategories: ["fever", "respiratory", "immunity"]
  },
  {
    id: 3,
    name: "Aloe Vera",
    scientific: "Aloe barbadensis",
    position: [36.8219, -1.2921], // Kenya
    medicinalUses: ["Skin care", "Wound healing", "Digestive aid", "Burns"],
    localNames: { 
      hindi: "घृतकुमारी (Ghritkumari)", 
      swahili: "Mti wa dawa",
      english: "True Aloe"
    },
    climateZone: "Arid & Semi-Arid",
    conservationStatus: "Widely cultivated",
    rarity: "Common",
    culturalSignificance: "Ancient Egyptian 'plant of immortality'",
    economicValue: "Global cosmetics and health industry worth billions",
    distribution: ["Kenya", "Africa", "Middle East", "Southern US"],
    plantType: "medicinal",
    treatmentCategories: ["skin", "wounds", "digestive"]
  },
  {
    id: 4,
    name: "Turmeric",
    scientific: "Curcuma longa",
    position: [78.9629, 20.5937], // India
    medicinalUses: ["Anti-inflammatory", "Skin health", "Digestion", "Immunity"],
    localNames: { 
      hindi: "हल्दी (Haldi)", 
      tamil: "மஞ்சள் (Manjal)",
      bengali: "হলুদ (Holud)"
    },
    climateZone: "Tropical, Humid",
    conservationStatus: "Abundant",
    rarity: "Common",
    culturalSignificance: "Sacred in Hindu rituals, used in weddings and ceremonies",
    economicValue: "Major export crop, pharmaceutical industry applications",
    distribution: ["India", "Indonesia", "Africa", "Central America"],
    plantType: "medicinal",
    treatmentCategories: ["fever", "skin", "digestive"]
  },
  {
    id: 5,
    name: "Ashwagandha",
    scientific: "Withania somnifera",
    position: [77.4126, 23.2599], // India
    medicinalUses: ["Stress relief", "Energy booster", "Immunity", "Sleep aid"],
    localNames: { 
      hindi: "अश्वगंधा (Ashwagandha)", 
      sanskrit: "वराह कर्णी (Varaha Karni)",
      english: "Winter Cherry"
    },
    climateZone: "Dry tropical",
    conservationStatus: "Cultivated",
    rarity: "Moderate",
    culturalSignificance: "Rasayana (rejuvenative) in Ayurveda",
    economicValue: "Growing global supplement market",
    distribution: ["India", "Middle East", "North Africa"],
    plantType: "medicinal",
    treatmentCategories: ["stress", "energy", "immunity"]
  },
  {
    id: 6,
    name: "Ginger",
    scientific: "Zingiber officinale",
    position: [108.9398, 34.3416], // China
    medicinalUses: ["Cold relief", "Nausea", "Digestion", "Anti-inflammatory"],
    localNames: { 
      chinese: "生姜 (Shēngjiāng)", 
      hindi: "अदरक (Adrak)",
      english: "Common Ginger"
    },
    climateZone: "Tropical & Subtropical",
    conservationStatus: "Abundant",
    rarity: "Common",
    culturalSignificance: "Essential in Traditional Chinese Medicine",
    economicValue: "Major global spice and medicine trade",
    distribution: ["China", "India", "Southeast Asia", "Jamaica"],
    plantType: "medicinal",
    treatmentCategories: ["digestive", "respiratory", "nausea"]
  },
  {
    id: 7,
    name: "Garlic",
    scientific: "Allium sativum",
    position: [116.4074, 39.9042], // China
    medicinalUses: ["Heart health", "Cold", "Antimicrobial", "Blood pressure"],
    localNames: { 
      chinese: "大蒜 (Dàsuàn)", 
      hindi: "लहसुन (Lahasun)",
      english: "Common Garlic"
    },
    climateZone: "Temperate",
    conservationStatus: "Widely cultivated",
    rarity: "Common",
    culturalSignificance: "Used in ancient Egyptian pyramid building",
    economicValue: "Essential culinary and medicinal crop worldwide",
    distribution: ["China", "India", "Egypt", "Mediterranean"],
    plantType: "medicinal",
    treatmentCategories: ["heart", "immunity", "respiratory"]
  },
  {
    id: 8,
    name: "Cinnamon",
    scientific: "Cinnamomum verum",
    position: [80.7718, 7.8731], // Sri Lanka
    medicinalUses: ["Blood sugar control", "Antioxidant", "Digestive", "Anti-inflammatory"],
    localNames: { 
      sinhala: "කුරුඳු (Kurundu)", 
      tamil: "கருவாப்பட்டை (Karuvappattai)",
      english: "True Cinnamon"
    },
    climateZone: "Tropical",
    conservationStatus: "Cultivated",
    rarity: "Moderate",
    culturalSignificance: "More valuable than gold in ancient times",
    economicValue: "Premium spice with medicinal applications",
    distribution: ["Sri Lanka", "Southern India", "Madagascar"],
    plantType: "medicinal",
    treatmentCategories: ["diabetes", "digestive", "heart"]
  },
  {
    id: 9,
    name: "Peppermint",
    scientific: "Mentha piperita",
    position: [10.4515, 51.1657], // Germany
    medicinalUses: ["Headache relief", "Digestive aid", "Respiratory", "Cooling"],
    localNames: { 
      german: "Pfefferminze", 
      english: "Peppermint",
      latin: "Mentha piperita"
    },
    climateZone: "Temperate",
    conservationStatus: "Abundant",
    rarity: "Common",
    culturalSignificance: "Symbol of hospitality in Middle Eastern cultures",
    economicValue: "Essential oil industry and pharmaceutical applications",
    distribution: ["Germany", "UK", "USA", "Middle East"],
    plantType: "medicinal",
    treatmentCategories: ["digestive", "respiratory", "headache"]
  },
  {
    id: 10,
    name: "Chamomile",
    scientific: "Matricaria chamomilla",
    position: [2.3522, 48.8566], // France
    medicinalUses: ["Sleep aid", "Anxiety relief", "Digestive", "Skin soothing"],
    localNames: { 
      french: "Camomille", 
      german: "Echte Kamille",
      english: "German Chamomile"
    },
    climateZone: "Temperate",
    conservationStatus: "Abundant",
    rarity: "Common",
    culturalSignificance: "Sacred to ancient Egyptians, dedicated to sun god",
    economicValue: "Popular herbal tea and cosmetic ingredient",
    distribution: ["France", "Germany", "Eastern Europe", "North America"],
    plantType: "medicinal",
    treatmentCategories: ["sleep", "anxiety", "digestive"]
  },
  {
    id: 11,
    name: "Eucalyptus",
    scientific: "Eucalyptus globulus",
    position: [133.7751, -25.2744], // Australia
    medicinalUses: ["Cold relief", "Respiratory aid", "Antiseptic", "Wound healing"],
    localNames: { 
      english: "Tasmanian Blue Gum", 
      aboriginal: "Stringybark",
      scientific: "Blue Gum"
    },
    climateZone: "Mediterranean & Subtropical",
    conservationStatus: "Abundant",
    rarity: "Common",
    culturalSignificance: "Sacred to Aboriginal Australians, symbol of healing",
    economicValue: "Essential oil industry and pharmaceutical sector",
    distribution: ["Australia", "California", "Brazil", "Portugal"],
    plantType: "medicinal",
    treatmentCategories: ["respiratory", "antiseptic", "wounds"]
  },
  {
    id: 12,
    name: "Ginseng",
    scientific: "Panax ginseng",
    position: [126.978, 37.5665], // South Korea
    medicinalUses: ["Energy booster", "Stress relief", "Cognitive enhancement", "Immunity"],
    localNames: { 
      korean: "인삼 (Insam)", 
      chinese: "人参 (Rénshēn)",
      japanese: "朝鮮人参 (Chōsen-ninjin)"
    },
    climateZone: "Temperate",
    conservationStatus: "Endangered in wild",
    rarity: "Rare",
    culturalSignificance: "Symbol of longevity in Asian cultures",
    economicValue: "High-value medicinal crop, premium pricing",
    distribution: ["Korea", "China", "Russia"],
    plantType: "medicinal",
    treatmentCategories: ["energy", "cognitive", "immunity"]
  },
  {
    id: 13,
    name: "Baobab",
    scientific: "Adansonia digitata",
    position: [35.5296, -18.6657], // Mozambique
    medicinalUses: ["Vitamin C source", "Digestive health", "Immunity", "Skin care"],
    localNames: { 
      portuguese: "Embondeiro", 
      swahili: "Mbuyu",
      english: "Tree of Life"
    },
    climateZone: "Arid Savanna",
    conservationStatus: "Abundant",
    rarity: "Common",
    culturalSignificance: "Sacred tree in African folklore, meeting place",
    economicValue: "Superfruit industry and traditional medicine",
    distribution: ["Mozambique", "Madagascar", "Australia", "West Africa"],
    plantType: "medicinal",
    treatmentCategories: ["immunity", "digestive", "skin"]
  },
  {
    id: 14,
    name: "Licorice",
    scientific: "Glycyrrhiza glabra",
    position: [51.389, 35.6892], // Iran
    medicinalUses: ["Sore throat", "Digestive aid", "Cough relief", "Anti-inflammatory"],
    localNames: { 
      persian: "شیرین‌بیان (Shirinbayan)", 
      arabic: "عرق السوس (Irq al-sus)",
      hindi: "मुलेठी (Mulethi)"
    },
    climateZone: "Mediterranean & Temperate",
    conservationStatus: "Widely used",
    rarity: "Moderate",
    culturalSignificance: "Used in ancient Egyptian and Chinese medicine",
    economicValue: "Confectionery and pharmaceutical industries",
    distribution: ["Iran", "Turkey", "Spain", "China"],
    plantType: "medicinal",
    treatmentCategories: ["respiratory", "digestive", "throat"]
  },
  {
    id: 15,
    name: "Clove",
    scientific: "Syzygium aromaticum",
    position: [113.9213, -0.7893], // Indonesia
    medicinalUses: ["Toothache relief", "Antiseptic", "Digestive", "Pain relief"],
    localNames: { 
      indonesian: "Cengkeh", 
      arabic: "قرنفل (Qaranful)",
      hindi: "लौंग (Laung)"
    },
    climateZone: "Tropical",
    conservationStatus: "Cultivated",
    rarity: "Moderate",
    culturalSignificance: "Spice wars fought over clove trade routes",
    economicValue: "Essential oil and dental care industries",
    distribution: ["Indonesia", "Madagascar", "Tanzania", "Sri Lanka"],
    plantType: "medicinal",
    treatmentCategories: ["dental", "pain", "digestive"]
  },
  {
    id: 16,
    name: "Fenugreek",
    scientific: "Trigonella foenum-graecum",
    position: [53.8478, 23.4241], // UAE / Middle East
    medicinalUses: ["Diabetes control", "Milk production", "Digestive", "Hair health"],
    localNames: { 
      hindi: "मेथी (Methi)", 
      arabic: "حلبة (Hulba)",
      english: "Greek Hay"
    },
    climateZone: "Arid & Semi-arid",
    conservationStatus: "Abundant",
    rarity: "Common",
    culturalSignificance: "Used in ancient Egyptian embalming",
    economicValue: "Spice trade and women's health supplements",
    distribution: ["Middle East", "India", "Mediterranean", "North Africa"],
    plantType: "medicinal",
    treatmentCategories: ["diabetes", "digestive", "women's health"]
  },
  {
    id: 17,
    name: "Amla",
    scientific: "Phyllanthus emblica",
    position: [78.6569, 22.9734], // India
    medicinalUses: ["Vitamin C", "Hair health", "Immunity booster", "Digestive"],
    localNames: { 
      hindi: "आंवला (Amla)", 
      sanskrit: "आमलकी (Amalaki)",
      english: "Indian Gooseberry"
    },
    climateZone: "Tropical & Subtropical",
    conservationStatus: "Abundant",
    rarity: "Common",
    culturalSignificance: "One of three fruits in Triphala, sacred in Hinduism",
    economicValue: "Ayurvedic medicine and hair care industry",
    distribution: ["India", "Nepal", "Sri Lanka", "Myanmar"],
    plantType: "medicinal",
    treatmentCategories: ["immunity", "hair", "digestive"]
  },
  {
    id: 18,
    name: "Sage",
    scientific: "Salvia officinalis",
    position: [12.5674, 41.8719], // Italy
    medicinalUses: ["Memory support", "Throat health", "Digestive", "Antioxidant"],
    localNames: { 
      italian: "Salvia", 
      latin: "Salvia officinalis",
      english: "Garden Sage"
    },
    climateZone: "Mediterranean",
    conservationStatus: "Abundant",
    rarity: "Common",
    culturalSignificance: "Symbol of wisdom in Roman culture",
    economicValue: "Culinary herb and cognitive supplement industry",
    distribution: ["Italy", "Greece", "Spain", "Balkans"],
    plantType: "medicinal",
    treatmentCategories: ["cognitive", "respiratory", "digestive"]
  },
  {
    id: 19,
    name: "Thyme",
    scientific: "Thymus vulgaris",
    position: [23.7275, 37.9838], // Greece
    medicinalUses: ["Cough relief", "Antimicrobial", "Respiratory", "Digestive"],
    localNames: { 
      greek: "Θυμάρι (Thymari)", 
      latin: "Thymus vulgaris",
      english: "Garden Thyme"
    },
    climateZone: "Mediterranean",
    conservationStatus: "Abundant",
    rarity: "Common",
    culturalSignificance: "Symbol of courage in ancient Greece",
    economicValue: "Essential oil and food preservation industries",
    distribution: ["Greece", "Turkey", "Spain", "France"],
    plantType: "medicinal",
    treatmentCategories: ["respiratory", "antimicrobial", "digestive"]
  },
  {
    id: 20,
    name: "Rosemary",
    scientific: "Salvia rosmarinus",
    position: [-3.7492, 40.4637], // Spain
    medicinalUses: ["Memory aid", "Hair growth", "Circulation", "Antioxidant"],
    localNames: { 
      spanish: "Romero", 
      latin: "Rosmarinus officinalis",
      english: "Rosemary"
    },
    climateZone: "Mediterranean",
    conservationStatus: "Abundant",
    rarity: "Common",
    culturalSignificance: "Symbol of remembrance and fidelity",
    economicValue: "Cosmetics and cognitive health industries",
    distribution: ["Spain", "France", "Italy", "Greece"],
    plantType: "medicinal",
    treatmentCategories: ["cognitive", "hair", "circulation"]
  },
  {
    id: 21,
    name: "Lavender",
    scientific: "Lavandula angustifolia",
    position: [5.4474, 43.5297], // France
    medicinalUses: ["Stress relief", "Sleep aid", "Skin care", "Headache relief"],
    localNames: { 
      french: "Lavande", 
      english: "English Lavender",
      latin: "Lavandula angustifolia"
    },
    climateZone: "Mediterranean",
    conservationStatus: "Widely cultivated",
    rarity: "Common",
    culturalSignificance: "Symbol of purity and devotion",
    economicValue: "Essential oil and aromatherapy industries",
    distribution: ["France", "Bulgaria", "England", "Australia"],
    plantType: "medicinal",
    treatmentCategories: ["stress", "sleep", "skin"]
  },
  {
    id: 22,
    name: "Hibiscus",
    scientific: "Hibiscus rosa-sinensis",
    position: [8.6753, 9.082], // Nigeria
    medicinalUses: ["Blood pressure control", "Cooling drink", "Antioxidant", "Hair care"],
    localNames: { 
      yoruba: "Zobo", 
      hausa: "Zoborodo",
      english: "Roselle"
    },
    climateZone: "Tropical",
    conservationStatus: "Abundant",
    rarity: "Common",
    culturalSignificance: "National flower of Malaysia, symbol of beauty",
    economicValue: "Herbal tea and natural cosmetics industries",
    distribution: ["Nigeria", "Sudan", "Egypt", "Thailand"],
    plantType: "medicinal",
    treatmentCategories: ["heart", "cooling", "hair"]
  },
  {
    id: 23,
    name: "Shatavari",
    scientific: "Asparagus racemosus",
    position: [75.7139, 19.7515], // India
    medicinalUses: ["Women's health", "Immunity", "Digestive", "Hormonal balance"],
    localNames: { 
      hindi: "शतावरी (Shatavari)", 
      sanskrit: "शतावरी (Shatavari)",
      english: "Wild Asparagus"
    },
    climateZone: "Tropical & Subtropical",
    conservationStatus: "Cultivated",
    rarity: "Moderate",
    culturalSignificance: "Queen of herbs in Ayurveda for women's health",
    economicValue: "Women's health supplement industry",
    distribution: ["India", "Sri Lanka", "Nepal", "Africa"],
    plantType: "medicinal",
    treatmentCategories: ["women's health", "immunity", "hormonal"]
  },
  {
    id: 24,
    name: "Brahmi",
    scientific: "Bacopa monnieri",
    position: [85.324, 27.7172], // Nepal
    medicinalUses: ["Memory enhancer", "Stress relief", "Cognitive function", "Anxiety"],
    localNames: { 
      hindi: "ब्राह्मी (Brahmi)", 
      sanskrit: "ब्रह्मी (Brahmi)",
      english: "Water Hyssop"
    },
    climateZone: "Tropical wetlands",
    conservationStatus: "Abundant",
    rarity: "Common",
    culturalSignificance: "Sacred to Lord Brahma, enhances spiritual practice",
    economicValue: "Nootropic and cognitive enhancement market",
    distribution: ["Nepal", "India", "Southeast Asia", "Southern US"],
    plantType: "medicinal",
    treatmentCategories: ["cognitive", "stress", "memory"]
  },
  {
    id: 25,
    name: "Holy Basil",
    scientific: "Ocimum sanctum",
    position: [77.1025, 28.7041], // India (Delhi region)
    medicinalUses: ["Immunity", "Stress relief", "Respiratory", "Fever"],
    localNames: { 
      hindi: "तुलसी (Tulsi)", 
      sanskrit: "तुलसी (Tulsi)",
      english: "Sacred Basil"
    },
    climateZone: "Tropical",
    conservationStatus: "Abundant",
    rarity: "Common",
    culturalSignificance: "Most sacred plant in Hinduism, grown in every courtyard",
    economicValue: "Ayurvedic medicine and spiritual wellness industry",
    distribution: ["India", "Southeast Asia", "Australia"],
    plantType: "medicinal",
    treatmentCategories: ["immunity", "stress", "respiratory"]
  }
];

interface PlantMarkersProps {
  selectedPlant: any;
  onPlantClick: (plant: any) => void;
  timeValue: number;
  plantFilter: string;
  heatmapEnabled: boolean;
}

const PlantMarkers: React.FC<PlantMarkersProps> = ({
  selectedPlant,
  onPlantClick,
  timeValue,
  plantFilter,
  heatmapEnabled
}) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Slower rotation that syncs with Earth
      groupRef.current.rotation.y += 0.001;
    }
  });

  // Convert lat/lng to 3D position on sphere
  const latLngToVector3 = (lat: number, lng: number, radius: number = 2.02) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    
    return new THREE.Vector3(x, y, z);
  };

  // Filter plants based on current filters and timeline
  const filteredPlants = useMemo(() => {
    return enhancedPlantData.filter(plant => {
      if (plantFilter === "all") return true;
      if (plantFilter === "medicinal") return plant.plantType === "medicinal";
      if (plantFilter === "rare") return plant.rarity === "Rare";
      if (plantFilter === "fever") return plant.treatmentCategories.includes("fever");
      if (plantFilter === "skin") return plant.treatmentCategories.includes("skin");
      return true;
    });
  }, [plantFilter]);

  // Enhanced plant color system with Living Atlas theming
  const getPlantColor = (plant: any) => {
    if (heatmapEnabled) {
      // Medicinal Density Heatmap: high medicinal value = red, medium = orange, low = green
      const useCount = plant.medicinalUses.length;
      const distribution = plant.distribution.length;
      const culturalValue = plant.culturalSignificance.length > 50 ? 2 : 1;
      const density = useCount * distribution * culturalValue;
      
      if (density > 20) return '#ff4444'; // High medicinal value - red
      if (density > 12) return '#ffaa44'; // Medium value - orange
      return '#44ff44'; // Low value - green
    }
    
    // Rarity-based coloring for conservation awareness
    switch (plant.rarity) {
      case 'Rare': return '#ff6b6b';      // Red for endangered/rare
      case 'Moderate': return '#ffe66d';  // Yellow for moderate
      default: return '#4ecdc4';          // Teal for common/abundant
    }
  };

  return (
    <group ref={groupRef}>
      {filteredPlants.map((plant) => {
        const position = latLngToVector3(plant.position[1], plant.position[0]);
        const color = getPlantColor(plant);
        const isSelected = selectedPlant?.id === plant.id;
        
        return (
          <group key={plant.id} position={position}>
            {/* Enhanced main glowing pin with pulse effect */}
            <Sphere 
              args={[isSelected ? 0.09 : 0.06, 32, 32]} 
              onClick={() => onPlantClick(plant)}
            >
              <meshBasicMaterial 
                color={color}
                transparent
                opacity={0.95}
              />
            </Sphere>
            
            {/* Inner glow core */}
            <Sphere args={[isSelected ? 0.12 : 0.08, 16, 16]}>
              <meshBasicMaterial 
                color={color}
                transparent
                opacity={0.3}
              />
            </Sphere>
            
            {/* Animated pulsing rings */}
            {[1, 2, 3].map((ring, i) => (
              <mesh key={`ring-${i}`} rotation={[Math.PI / 2, 0, 0]}>
                <ringGeometry args={[0.08 + i * 0.04, 0.12 + i * 0.04, 32]} />
                <meshBasicMaterial 
                  color={color}
                  transparent
                  opacity={isSelected ? 0.5 - i * 0.1 : 0.2 - i * 0.05}
                  side={THREE.DoubleSide}
                />
              </mesh>
            ))}
            
            {/* Enhanced growth animation with realistic plant development */}
            <group position={[0, 0.15, 0]} scale={isSelected ? [1.2, 1.2, 1.2] : [1, 1, 1]}>
              {/* Growing stem with texture variation */}
              <mesh position={[0, 0.05, 0]}>
                <cylinderGeometry args={[0.005, 0.008, 0.1, 8]} />
                <meshBasicMaterial color="#228B22" />
              </mesh>
              
              {/* Realistic leaf growth stages */}
              {/* Young leaves - smaller and lighter */}
              <mesh position={[0.02, 0.06, 0]} rotation={[0, 0, Math.PI / 8]} scale={[0.8, 0.8, 1]}>
                <planeGeometry args={[0.03, 0.015]} />
                <meshBasicMaterial color="#90EE90" transparent opacity={0.8} />
              </mesh>
              <mesh position={[-0.02, 0.06, 0]} rotation={[0, 0, -Math.PI / 8]} scale={[0.8, 0.8, 1]}>
                <planeGeometry args={[0.03, 0.015]} />
                <meshBasicMaterial color="#90EE90" transparent opacity={0.8} />
              </mesh>
              
              {/* Mature leaves - larger and darker */}
              <mesh position={[0.035, 0.09, 0]} rotation={[0, 0, Math.PI / 5]}>
                <planeGeometry args={[0.05, 0.025]} />
                <meshBasicMaterial color="#32CD32" transparent opacity={0.9} />
              </mesh>
              <mesh position={[-0.035, 0.09, 0]} rotation={[0, 0, -Math.PI / 5]}>
                <planeGeometry args={[0.05, 0.025]} />
                <meshBasicMaterial color="#32CD32" transparent opacity={0.9} />
              </mesh>
              
              {/* Growth tip - actively growing */}
              <Sphere args={[0.012, 8, 8]} position={[0, 0.12, 0]}>
                <meshBasicMaterial color="#ADFF2F" transparent opacity={0.9} />
              </Sphere>
              
              {/* New leaf buds emerging */}
              <mesh position={[0.015, 0.115, 0]} rotation={[0, 0, Math.PI / 12]} scale={[0.6, 0.6, 1]}>
                <planeGeometry args={[0.02, 0.008]} />
                <meshBasicMaterial color="#98FB98" transparent opacity={0.7} />
              </mesh>
              <mesh position={[-0.015, 0.115, 0]} rotation={[0, 0, -Math.PI / 12]} scale={[0.6, 0.6, 1]}>
                <planeGeometry args={[0.02, 0.008]} />
                <meshBasicMaterial color="#98FB98" transparent opacity={0.7} />
              </mesh>
              
              {/* Root system indication (very subtle) */}
              {isSelected && (
                <group position={[0, -0.05, 0]}>
                  {[0, 1, 2].map(i => (
                    <mesh key={`root-${i}`} position={[
                      Math.cos(i * Math.PI / 1.5) * 0.02,
                      -0.02,
                      Math.sin(i * Math.PI / 1.5) * 0.02
                    ]} rotation={[Math.PI / 6, 0, i * Math.PI / 3]}>
                      <cylinderGeometry args={[0.002, 0.001, 0.03, 4]} />
                      <meshBasicMaterial color="#8B4513" transparent opacity={0.5} />
                    </mesh>
                  ))}
                </group>
              )}
              
              {/* Herb-specific features */}
              {plant.name === 'Lavender' && (
                <Sphere args={[0.008, 6, 6]} position={[0, 0.13, 0]}>
                  <meshBasicMaterial color="#9370DB" transparent opacity={0.8} />
                </Sphere>
              )}
              {plant.name === 'Tulsi' && (
                <Sphere args={[0.006, 6, 6]} position={[0, 0.13, 0]}>
                  <meshBasicMaterial color="#DDA0DD" transparent opacity={0.8} />
                </Sphere>
              )}
            </group>
            
            {/* Enhanced scanning effect when selected */}
            {isSelected && (
              <group>
                {/* Multiple expanding scan rings */}
                {[0.2, 0.35, 0.5, 0.65].map((radius, i) => (
                  <mesh key={`scan-${i}`} rotation={[Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[radius, radius + 0.015, 64]} />
                    <meshBasicMaterial 
                      color="#00ff88"
                      transparent
                      opacity={0.6 - i * 0.12}
                      side={THREE.DoubleSide}
                    />
                  </mesh>
                ))}
                
                {/* Vertical scan beam */}
                <mesh position={[0, 1, 0]} rotation={[0, 0, 0]}>
                  <cylinderGeometry args={[0.005, 0.02, 2, 16]} />
                  <meshBasicMaterial 
                    color="#00ff88"
                    transparent
                    opacity={0.4}
                  />
                </mesh>
              </group>
            )}
            
            {/* Enhanced vertical glow beam with gradient effect */}
            <mesh position={[0, 0.6, 0]} rotation={[0, 0, 0]}>
              <cylinderGeometry args={[0.008, 0.025, 1.2, 12]} />
              <meshBasicMaterial 
                color={color}
                transparent
                opacity={isSelected ? 0.6 : 0.3}
              />
            </mesh>
            
            {/* Floating particles around high-value plants */}
            {plant.rarity === 'Rare' && (
              <group>
                {[0, 1, 2, 3].map(i => (
                  <Sphere 
                    key={`particle-${i}`}
                    args={[0.003, 8, 8]} 
                    position={[
                      Math.cos(i * Math.PI / 2) * 0.2,
                      0.1 + Math.sin(i * Math.PI / 2) * 0.1,
                      Math.sin(i * Math.PI / 2) * 0.2
                    ]}
                  >
                    <meshBasicMaterial 
                      color="#ffd700"
                      transparent
                      opacity={0.8}
                    />
                  </Sphere>
                ))}
              </group>
            )}
          </group>
        );
      })}
    </group>
  );
};

export { enhancedPlantData };
export default PlantMarkers;