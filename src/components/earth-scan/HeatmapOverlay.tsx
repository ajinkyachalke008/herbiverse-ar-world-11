import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { enhancedPlantData } from './PlantMarkers';

interface HeatmapOverlayProps {
  heatmapEnabled: boolean;
  plantFilter: string;
  timeValue: number;
}

const HeatmapOverlay: React.FC<HeatmapOverlayProps> = ({
  heatmapEnabled,
  plantFilter,
  timeValue
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && heatmapEnabled) {
      // Subtle pulsing animation for the heatmap
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
      const material = meshRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = 0.4 * pulse;
    }
  });

  // Generate heatmap texture based on plant data
  const heatmapTexture = useMemo(() => {
    if (!heatmapEnabled) return null;
    
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Filter plants based on current filters
    const filteredPlants = enhancedPlantData.filter(plant => {
      if (plantFilter === "all") return true;
      if (plantFilter === "medicinal") return plant.plantType === "medicinal";
      if (plantFilter === "rare") return plant.rarity === "Rare";
      return plant.treatmentCategories.some(cat => cat.includes(plantFilter));
    });
    
    // Create heat spots for each plant
    filteredPlants.forEach(plant => {
      const [lng, lat] = plant.position;
      
      // Convert lat/lng to canvas coordinates
      const x = ((lng + 180) / 360) * canvas.width;
      const y = ((90 - lat) / 180) * canvas.height;
      
      // Calculate medicinal density
      const useCount = plant.medicinalUses.length;
      const distribution = plant.distribution.length;
      const culturalValue = plant.culturalSignificance.length > 50 ? 2 : 1;
      const density = useCount * distribution * culturalValue;
      
      // Determine color based on density
      let color;
      if (density > 20) {
        color = '#ff4444'; // High medicinal value - red
      } else if (density > 12) {
        color = '#ffaa44'; // Medium value - orange
      } else {
        color = '#44ff44'; // Low value - green
      }
      
      // Create gradient for heat spot
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 100);
      gradient.addColorStop(0, color + 'CC'); // More opaque center
      gradient.addColorStop(0.5, color + '66'); // Semi-transparent mid
      gradient.addColorStop(1, color + '00'); // Transparent edge
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 100, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add smaller intense center
      const centerGradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
      centerGradient.addColorStop(0, color + 'FF');
      centerGradient.addColorStop(1, color + '88');
      
      ctx.fillStyle = centerGradient;
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, 2 * Math.PI);
      ctx.fill();
    });
    
    // Add connecting flow lines between related plants
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 2;
    
    for (let i = 0; i < filteredPlants.length; i++) {
      for (let j = i + 1; j < filteredPlants.length; j++) {
        const plant1 = filteredPlants[i];
        const plant2 = filteredPlants[j];
        
        // Connect plants with similar medicinal uses
        const commonUses = plant1.medicinalUses.filter(use => 
          plant2.medicinalUses.includes(use)
        ).length;
        
        if (commonUses >= 2) {
          const [lng1, lat1] = plant1.position;
          const [lng2, lat2] = plant2.position;
          
          const x1 = ((lng1 + 180) / 360) * canvas.width;
          const y1 = ((90 - lat1) / 180) * canvas.height;
          const x2 = ((lng2 + 180) / 360) * canvas.width;
          const y2 = ((90 - lat2) / 180) * canvas.height;
          
          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.stroke();
        }
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return texture;
  }, [heatmapEnabled, plantFilter, timeValue]);

  if (!heatmapEnabled || !heatmapTexture) return null;

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2.005, 128, 64]} />
      <meshBasicMaterial
        map={heatmapTexture}
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

export default HeatmapOverlay;