import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { enhancedPlantData } from './PlantMarkers';

interface ConstellationLinesProps {
  activeLayer: string;
  timeValue: number;
}

const ConstellationLines: React.FC<ConstellationLinesProps> = ({
  activeLayer,
  timeValue
}) => {
  const linesRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.rotation.y += 0.002;
      
      // Animate line opacity based on time
      linesRef.current.children.forEach((child, index) => {
        if (child instanceof THREE.Line) {
          const material = child.material as THREE.LineBasicMaterial;
          material.opacity = 0.3 + Math.sin(state.clock.elapsedTime + index) * 0.2;
        }
      });
    }
  });

  // Convert lat/lng to 3D position
  const latLngToVector3 = (lat: number, lng: number, radius: number = 2.03) => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lng + 180) * (Math.PI / 180);
    
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    
    return new THREE.Vector3(x, y, z);
  };

  // Create constellation connections based on plant relationships
  const createConstellationLines = useMemo(() => {
    const lines: JSX.Element[] = [];
    
    // Group plants by similar properties
    const plantGroups: { [key: string]: typeof enhancedPlantData } = {
      fever: enhancedPlantData.filter(plant => 
        plant.treatmentCategories.includes('fever')
      ),
      digestive: enhancedPlantData.filter(plant => 
        plant.treatmentCategories.includes('digestive')
      ),
      skin: enhancedPlantData.filter(plant => 
        plant.treatmentCategories.includes('skin') || plant.treatmentCategories.includes('wounds')
      ),
      respiratory: enhancedPlantData.filter(plant =>
        plant.treatmentCategories.includes('respiratory')
      )
    };

    Object.entries(plantGroups).forEach(([category, plants], groupIndex) => {
      if (plants.length < 2) return;
      
      // Create connections between plants in the same category
      for (let i = 0; i < plants.length; i++) {
        for (let j = i + 1; j < plants.length; j++) {
          const plant1 = plants[i];
          const plant2 = plants[j];
          
          const pos1 = latLngToVector3(plant1.position[1], plant1.position[0]);
          const pos2 = latLngToVector3(plant2.position[1], plant2.position[0]);
          
          // Create curved line between points
          const curve = new THREE.QuadraticBezierCurve3(
            pos1,
            new THREE.Vector3(
              (pos1.x + pos2.x) / 2 + Math.random() * 0.5,
              (pos1.y + pos2.y) / 2 + Math.random() * 0.5,
              (pos1.z + pos2.z) / 2 + Math.random() * 0.5
            ),
            pos2
          );
          
          const points = curve.getPoints(20);
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          
          // Color based on category
          const colors: { [key: string]: string } = {
            fever: '#ff6b6b',
            digestive: '#4ecdc4',
            skin: '#ffe66d',
            respiratory: '#95e1d3'
          };
          
          lines.push(
            <Line
              key={`${plant1.id}-${plant2.id}-${category}`}
              points={points}
              color={colors[category] || '#ffffff'}
              lineWidth={2}
              transparent
              opacity={activeLayer === 'plants' ? 0.4 : 0.1}
            />
          );
        }
      }
    });

    return lines;
  }, [activeLayer]);

  // Don't show constellation lines unless in plants mode
  if (activeLayer !== 'plants') {
    return null;
  }

  return (
    <group ref={linesRef}>
      {createConstellationLines}
      
      {/* Orbital rings for visual enhancement */}
      {[2.5, 2.7, 2.9].map((radius, index) => (
        <mesh key={index} rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius, radius + 0.005, 64]} />
          <meshBasicMaterial
            color="#ffffff"
            transparent
            opacity={0.1 - index * 0.02}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
};

export default ConstellationLines;