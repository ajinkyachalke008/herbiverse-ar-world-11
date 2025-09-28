import React, { useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface SatelliteScanEffectProps {
  selectedPlant: any;
  isActive: boolean;
}

const SatelliteScanEffect: React.FC<SatelliteScanEffectProps> = ({ 
  selectedPlant, 
  isActive 
}) => {
  const scanGroup = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Mesh>(null);
  const ringsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!isActive || !scanGroup.current) return;
    
    const time = state.clock.elapsedTime;
    
    // Rotate the entire scan system
    scanGroup.current.rotation.y = time * 0.5;
    
    // Pulse the scanning beam
    if (beamRef.current) {
      const pulseIntensity = 0.3 + 0.7 * Math.sin(time * 3);
      const material = beamRef.current.material as THREE.MeshBasicMaterial;
      material.opacity = pulseIntensity;
      beamRef.current.scale.setScalar(0.8 + 0.4 * Math.sin(time * 2));
    }
    
    // Animate expanding rings
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, index) => {
        if (ring instanceof THREE.Mesh) {
          const offset = index * 0.5;
          const expansion = (time * 2 + offset) % 4;
          const scale = 1 + expansion * 0.3;
          const opacity = Math.max(0, 1 - expansion / 4);
          
          ring.scale.setScalar(scale);
          const material = ring.material as THREE.MeshBasicMaterial;
          material.opacity = opacity * 0.6;
        }
      });
    }
  });

  const createScanningBeam = () => {
    const beamGeometry = new THREE.ConeGeometry(0.1, 4, 32);
    const beamMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color: { value: new THREE.Color(0x00ff88) },
        opacity: { value: 0.4 }
      },
      vertexShader: `
        varying vec3 vPosition;
        void main() {
          vPosition = position;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        uniform float opacity;
        varying vec3 vPosition;
        void main() {
          float distance = length(vPosition.xy);
          float alpha = (1.0 - distance) * opacity;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });
    
    return new THREE.Mesh(beamGeometry, beamMaterial);
  };

  if (!isActive || !selectedPlant) return null;

  return (
    <group ref={scanGroup}>
      {/* Satellite scanning beam from above */}
      <mesh 
        ref={beamRef}
        position={[0, 5, 0]} 
        rotation={[Math.PI, 0, 0]}
      >
        <coneGeometry args={[0.15, 4, 32]} />
        <meshBasicMaterial 
          color="#00ff88"
          transparent
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      
      {/* Expanding scan rings */}
      <group ref={ringsRef}>
        {[0, 1, 2, 3].map((index) => (
          <mesh 
            key={`scan-ring-${index}`}
            rotation={[Math.PI / 2, 0, 0]}
            position={[0, 0.01, 0]}
          >
            <ringGeometry args={[2.1 + index * 0.1, 2.2 + index * 0.1, 64]} />
            <meshBasicMaterial
              color="#00ffaa"
              transparent
              opacity={0.6}
              side={THREE.DoubleSide}
              blending={THREE.AdditiveBlending}
            />
          </mesh>
        ))}
      </group>
      
      {/* Cross-hair targeting system */}
      <group position={[0, 2.5, 0]}>
        <mesh rotation={[0, 0, 0]}>
          <cylinderGeometry args={[0.002, 0.002, 0.3, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.002, 0.002, 0.3, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
        </mesh>
        
        {/* Targeting corners */}
        {[0, 1, 2, 3].map((corner) => (
          <mesh 
            key={`corner-${corner}`}
            position={[
              Math.cos(corner * Math.PI / 2) * 0.2,
              0,
              Math.sin(corner * Math.PI / 2) * 0.2
            ]}
            rotation={[0, corner * Math.PI / 2, 0]}
          >
            <boxGeometry args={[0.05, 0.005, 0.005]} />
            <meshBasicMaterial color="#00ffff" transparent opacity={0.9} />
          </mesh>
        ))}
      </group>
      
      {/* Data streams/scan lines */}
      {[0, 1, 2, 3, 4].map((stream) => (
        <mesh 
          key={`data-stream-${stream}`}
          position={[
            Math.cos(stream * Math.PI * 2 / 5) * 1.5,
            1 + Math.sin(stream * 0.8) * 0.5,
            Math.sin(stream * Math.PI * 2 / 5) * 1.5
          ]}
          rotation={[Math.PI / 2, 0, stream * Math.PI / 5]}
        >
          <planeGeometry args={[0.02, 0.8]} />
          <meshBasicMaterial
            color="#44ffff"
            transparent
            opacity={0.6}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      ))}
      
      {/* Holographic grid overlay */}
      <group position={[0, 0.05, 0]}>
        {[-1, 0, 1].map((x) =>
          [-1, 0, 1].map((z) => (
            <mesh 
              key={`grid-${x}-${z}`}
              position={[x * 0.8, 0, z * 0.8]}
              rotation={[Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[0.05, 0.08, 16]} />
              <meshBasicMaterial
                color="#00aaff"
                transparent
                opacity={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
          ))
        )}
      </group>
    </group>
  );
};

export default SatelliteScanEffect;