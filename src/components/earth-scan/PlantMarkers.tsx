import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, Html } from '@react-three/drei';
import * as THREE from 'three';

// Enhanced plant data with more detailed information
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
    name: "Aloe Vera",
    scientific: "Aloe barbadensis",
    position: [24.4539, 54.3773], // UAE
    medicinalUses: ["Burns", "Skin Healing", "Digestion", "Anti-inflammatory"],
    localNames: { 
      hindi: "घृतकुमारी (Ghritkumari)", 
      sanskrit: "कुमारी (Kumari)",
      arabic: "صبار (Sabbar)"
    },
    climateZone: "Arid & Semi-Arid",
    conservationStatus: "Threatened by over-harvesting in some areas",
    rarity: "Moderate",
    culturalSignificance: "Ancient Egyptian 'plant of immortality'",
    economicValue: "Global cosmetics and health industry worth billions",
    distribution: ["Africa", "India", "Middle East", "Southern US"],
    plantType: "medicinal",
    treatmentCategories: ["wounds", "digestive", "skin"]
  },
  {
    id: 3,
    name: "Turmeric",
    scientific: "Curcuma longa",
    position: [77.5946, 12.9716], // India
    medicinalUses: ["Anti-inflammatory", "Immunity", "Wound Healing", "Digestive Health"],
    localNames: { 
      hindi: "हल्दी (Haldi)", 
      tamil: "மஞ்சள் (Manjal)",
      bengali: "হলুদ (Holud)"
    },
    climateZone: "Tropical, Humid",
    conservationStatus: "Safe, high cultivation demand",
    rarity: "Common",
    culturalSignificance: "Sacred in Hindu rituals, used in weddings and ceremonies",
    economicValue: "Major export crop, pharmaceutical industry applications",
    distribution: ["India", "Indonesia", "Africa", "Central America"],
    plantType: "medicinal",
    treatmentCategories: ["fever", "wounds", "digestive"]
  },
  {
    id: 4,
    name: "Tulsi",
    scientific: "Ocimum tenuiflorum",
    position: [88.3639, 22.5726], // Bangladesh
    medicinalUses: ["Respiratory Health", "Immunity", "Stress Relief", "Fever"],
    localNames: { 
      hindi: "तुलसी (Tulsi)", 
      sanskrit: "सुरसा (Surasa)",
      bengali: "তুলসী (Tulsi)"
    },
    climateZone: "Tropical",
    conservationStatus: "Stable",
    rarity: "Common",
    culturalSignificance: "Sacred plant in Hinduism, worshipped daily",
    economicValue: "Ayurvedic medicine and herbal tea industry",
    distribution: ["India", "Southeast Asia", "Australia"],
    plantType: "medicinal",
    treatmentCategories: ["fever", "respiratory"]
  },
  {
    id: 5,
    name: "Ginseng",
    scientific: "Panax ginseng",
    position: [127.7669, 35.9078], // South Korea
    medicinalUses: ["Energy Boost", "Cognitive Enhancement", "Immune Support"],
    localNames: { 
      korean: "인삼 (Insam)", 
      chinese: "人参 (Rénshēn)",
      japanese: "朝鮮人参 (Chōsen-ninjin)"
    },
    climateZone: "Temperate",
    conservationStatus: "Vulnerable",
    rarity: "Rare",
    culturalSignificance: "Symbol of longevity in Asian cultures",
    economicValue: "High-value medicinal crop, premium pricing",
    distribution: ["Korea", "China", "Russia"],
    plantType: "medicinal",
    treatmentCategories: ["energy", "cognitive"]
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

  // Enhanced plant color system
  const getPlantColor = (plant: any) => {
    if (heatmapEnabled) {
      // Enhanced heatmap: Green = abundant, Yellow = medium, Red = scarce
      const useCount = plant.medicinalUses.length;
      const distribution = plant.distribution.length;
      const density = useCount * distribution;
      
      if (density > 15) return '#00ff44'; // Abundant - green
      if (density > 10) return '#ffff00'; // Medium - yellow  
      return '#ff4444'; // Scarce - red
    }
    
    // Rarity-based coloring with more vibrant colors
    switch (plant.rarity) {
      case 'Rare': return '#ff3366';      // Bright red for rare
      case 'Moderate': return '#ffaa00';  // Orange for moderate
      default: return '#00ffaa';          // Cyan for common
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
            
            {/* Enhanced sprout animation with realistic growth */}
            <group position={[0, 0.15, 0]}>
              {/* Stem */}
              <mesh position={[0, 0.05, 0]}>
                <cylinderGeometry args={[0.005, 0.008, 0.1, 8]} />
                <meshBasicMaterial color="#228B22" />
              </mesh>
              
              {/* Main leaves - animated */}
              <mesh position={[0.025, 0.08, 0]} rotation={[0, 0, Math.PI / 6]}>
                <planeGeometry args={[0.04, 0.02]} />
                <meshBasicMaterial color="#32CD32" transparent opacity={0.9} />
              </mesh>
              <mesh position={[-0.025, 0.08, 0]} rotation={[0, 0, -Math.PI / 6]}>
                <planeGeometry args={[0.04, 0.02]} />
                <meshBasicMaterial color="#32CD32" transparent opacity={0.9} />
              </mesh>
              
              {/* Small growing buds */}
              <Sphere args={[0.015, 8, 8]} position={[0, 0.1, 0]}>
                <meshBasicMaterial color="#ADFF2F" />
              </Sphere>
              
              {/* Tiny emerging leaves at top */}
              <mesh position={[0.01, 0.11, 0]} rotation={[0, 0, Math.PI / 8]}>
                <planeGeometry args={[0.02, 0.008]} />
                <meshBasicMaterial color="#90EE90" transparent opacity={0.7} />
              </mesh>
              <mesh position={[-0.01, 0.11, 0]} rotation={[0, 0, -Math.PI / 8]}>
                <planeGeometry args={[0.02, 0.008]} />
                <meshBasicMaterial color="#90EE90" transparent opacity={0.7} />
              </mesh>
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