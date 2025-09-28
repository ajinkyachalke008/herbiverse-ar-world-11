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