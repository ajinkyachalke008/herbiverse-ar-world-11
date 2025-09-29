import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import * as THREE from 'three';

interface DetailedPlantGrowthProps {
  plant: any;
  isSelected: boolean;
  timeValue: number;
  onGrowthComplete?: () => void;
}

const DetailedPlantGrowth: React.FC<DetailedPlantGrowthProps> = ({
  plant,
  isSelected,
  timeValue,
  onGrowthComplete
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const stemRef = useRef<THREE.Mesh>(null);
  const leavesRef = useRef<THREE.Group>(null);
  const rootsRef = useRef<THREE.Group>(null);
  const flowersRef = useRef<THREE.Group>(null);
  
  const growthProgress = useRef(0);
  const animationSpeed = useRef(0.02);

  useFrame((state, delta) => {
    if (!groupRef.current) return;

    // Growth animation based on timeline
    const targetGrowth = Math.min(timeValue / 100, 1);
    growthProgress.current = THREE.MathUtils.lerp(growthProgress.current, targetGrowth, delta * 2);

    // Animate stem growth
    if (stemRef.current) {
      stemRef.current.scale.y = growthProgress.current;
      stemRef.current.position.y = (growthProgress.current * 0.1) / 2;
    }

    // Animate leaves appearing in stages
    if (leavesRef.current) {
      leavesRef.current.children.forEach((leaf, index) => {
        const leafAppearTime = (index + 1) * 0.2;
        const leafScale = Math.max(0, Math.min(1, (growthProgress.current - leafAppearTime) * 5));
        leaf.scale.setScalar(leafScale);
        
        // Add slight wind animation
        const windOffset = Math.sin(state.clock.elapsedTime * 2 + index) * 0.1;
        leaf.rotation.z = windOffset * leafScale;
      });
    }

    // Root system development
    if (rootsRef.current && isSelected) {
      rootsRef.current.children.forEach((root, index) => {
        const rootGrowth = Math.max(0, Math.min(1, (growthProgress.current - 0.1) * 2));
        root.scale.y = rootGrowth;
        root.position.y = -(rootGrowth * 0.05) / 2;
      });
    }

    // Flowering stage for mature plants
    if (flowersRef.current && growthProgress.current > 0.8) {
      const flowerScale = Math.max(0, (growthProgress.current - 0.8) * 5);
      flowersRef.current.scale.setScalar(flowerScale);
      
      // Gentle flower swaying
      const sway = Math.sin(state.clock.elapsedTime * 1.5) * 0.05;
      flowersRef.current.rotation.z = sway;
    }

    // Growth complete callback
    if (growthProgress.current >= 0.99 && onGrowthComplete) {
      onGrowthComplete();
    }
  });

  // Plant-specific characteristics
  const getPlantCharacteristics = () => {
    switch (plant.name) {
      case 'Neem':
        return {
          stemColor: '#8B4513',
          leafColor: '#228B22',
          flowerColor: '#FFFFFF',
          maxHeight: 0.15,
          leafCount: 8,
          hasFlowers: true
        };
      case 'Tulsi':
        return {
          stemColor: '#6B8E23',
          leafColor: '#32CD32',
          flowerColor: '#DDA0DD',
          maxHeight: 0.12,
          leafCount: 6,
          hasFlowers: true
        };
      case 'Aloe Vera':
        return {
          stemColor: '#8FBC8F',
          leafColor: '#9ACD32',
          flowerColor: '#FF6347',
          maxHeight: 0.1,
          leafCount: 12,
          hasFlowers: false
        };
      case 'Ginseng':
        return {
          stemColor: '#A0522D',
          leafColor: '#2E8B57',
          flowerColor: '#FFD700',
          maxHeight: 0.08,
          leafCount: 5,
          hasFlowers: true
        };
      default:
        return {
          stemColor: '#8B4513',
          leafColor: '#228B22',
          flowerColor: '#FFB6C1',
          maxHeight: 0.1,
          leafCount: 6,
          hasFlowers: true
        };
    }
  };

  const characteristics = getPlantCharacteristics();

  return (
    <group ref={groupRef} position={[0, 0.05, 0]}>
      {/* Main stem with realistic texture */}
      <mesh ref={stemRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.003, 0.008, characteristics.maxHeight, 8]} />
        <meshLambertMaterial color={characteristics.stemColor} />
      </mesh>

      {/* Detailed leaf system */}
      <group ref={leavesRef}>
        {Array.from({ length: characteristics.leafCount }, (_, i) => {
          const angle = (i / characteristics.leafCount) * Math.PI * 2;
          const height = (i / characteristics.leafCount) * characteristics.maxHeight;
          const size = plant.name === 'Aloe Vera' ? [0.02, 0.08] : [0.04, 0.025];
          
          return (
            <mesh
              key={`leaf-${i}`}
              position={[
                Math.cos(angle) * 0.03,
                height,
                Math.sin(angle) * 0.03
              ]}
              rotation={[0, angle, Math.PI / 6]}
            >
              <planeGeometry args={[size[0], size[1]]} />
              <meshLambertMaterial 
                color={characteristics.leafColor}
                transparent
                opacity={0.9}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        })}
      </group>

      {/* Root system (visible when selected) */}
      {isSelected && (
        <group ref={rootsRef} position={[0, -0.02, 0]}>
          {Array.from({ length: 5 }, (_, i) => {
            const angle = (i / 5) * Math.PI * 2;
            return (
              <mesh
                key={`root-${i}`}
                position={[
                  Math.cos(angle) * 0.02,
                  0,
                  Math.sin(angle) * 0.02
                ]}
                rotation={[Math.PI / 4, angle, 0]}
              >
                <cylinderGeometry args={[0.001, 0.002, 0.05, 4]} />
                <meshLambertMaterial 
                  color="#654321"
                  transparent
                  opacity={0.7}
                />
              </mesh>
            );
          })}
        </group>
      )}

      {/* Flowering stage */}
      {characteristics.hasFlowers && (
        <group ref={flowersRef} position={[0, characteristics.maxHeight * 0.8, 0]}>
          {Array.from({ length: 3 }, (_, i) => (
            <Sphere
              key={`flower-${i}`}
              args={[0.008, 8, 8]}
              position={[
                (i - 1) * 0.02,
                i * 0.01,
                0
              ]}
            >
              <meshLambertMaterial 
                color={characteristics.flowerColor}
                transparent
                opacity={0.8}
              />
            </Sphere>
          ))}
        </group>
      )}

      {/* Medicinal essence particles for high-value plants */}
      {plant.medicinalUses.length > 3 && (
        <group>
          {Array.from({ length: 6 }, (_, i) => (
            <Sphere
              key={`essence-${i}`}
              args={[0.002, 6, 6]}
              position={[
                Math.cos(i * Math.PI / 3) * 0.05,
                characteristics.maxHeight + Math.sin(i * Math.PI / 3) * 0.03,
                Math.sin(i * Math.PI / 3) * 0.05
              ]}
            >
              <meshBasicMaterial 
                color="#90EE90"
                transparent
                opacity={0.6}
              />
            </Sphere>
          ))}
        </group>
      )}

      {/* Growth stage indicator */}
      <group position={[0, characteristics.maxHeight + 0.03, 0]}>
        <Sphere args={[0.01, 8, 8]}>
          <meshBasicMaterial 
            color={growthProgress.current > 0.5 ? "#00FF00" : "#FFFF00"}
            transparent
            opacity={0.8}
          />
        </Sphere>
      </group>
    </group>
  );
};

export default DetailedPlantGrowth;