import React, { useRef, useMemo } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import PlantMarkers from './PlantMarkers';
import ConstellationLines from './ConstellationLines';
import SatelliteScanEffect from './SatelliteScanEffect';
import HeatmapOverlay from './HeatmapOverlay';

interface EnhancedEarthProps {
  selectedPlant: any;
  onPlantClick: (plant: any) => void;
  timeValue: number;
  activeLayer: string;
  plantFilter: string;
  diseaseFilter: string;
  heatmapEnabled: boolean;
}

const EnhancedEarth: React.FC<EnhancedEarthProps> = ({
  selectedPlant,
  onPlantClick,
  timeValue,
  activeLayer,
  plantFilter,
  diseaseFilter,
  heatmapEnabled
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const atmosphereRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const nightLightsRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001; // Slower, more realistic rotation
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += 0.0008; // Independent cloud movement
    }
    if (atmosphereRef.current) {
      // Subtle atmosphere pulsing
      const scale = 1 + Math.sin(state.clock.elapsedTime * 0.5) * 0.003;
      atmosphereRef.current.scale.setScalar(scale);
    }
  });

  // Create realistic HD Earth material with NASA Blue Marble style
  const earthMaterial = useMemo(() => {
    // Create high-resolution canvas texture for Earth
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Deep ocean background with gradient
    const oceanGradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    oceanGradient.addColorStop(0, '#001f3f'); // Dark blue at poles
    oceanGradient.addColorStop(0.5, '#004080'); // Medium blue at equator
    oceanGradient.addColorStop(1, '#001f3f'); // Dark blue at poles
    ctx.fillStyle = oceanGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add realistic landmasses with detailed shapes
    ctx.fillStyle = '#2d5016'; // Dark forest green
    
    // North America (more detailed)
    ctx.beginPath();
    ctx.moveTo(120, 200);
    ctx.bezierCurveTo(200, 150, 280, 180, 320, 220);
    ctx.bezierCurveTo(350, 280, 320, 320, 280, 350);
    ctx.bezierCurveTo(200, 380, 120, 350, 100, 280);
    ctx.closePath();
    ctx.fill();
    
    // Greenland
    ctx.beginPath();
    ctx.ellipse(380, 120, 30, 50, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // South America (more realistic shape)
    ctx.beginPath();
    ctx.moveTo(220, 450);
    ctx.bezierCurveTo(280, 420, 300, 480, 290, 560);
    ctx.bezierCurveTo(270, 640, 240, 680, 200, 720);
    ctx.bezierCurveTo(180, 680, 160, 620, 170, 560);
    ctx.bezierCurveTo(180, 480, 200, 450, 220, 450);
    ctx.closePath();
    ctx.fill();
    
    // Europe (detailed)
    ctx.beginPath();
    ctx.moveTo(500, 180);
    ctx.bezierCurveTo(520, 160, 550, 170, 580, 190);
    ctx.bezierCurveTo(600, 220, 580, 250, 550, 260);
    ctx.bezierCurveTo(520, 250, 500, 220, 500, 180);
    ctx.closePath();
    ctx.fill();
    
    // Asia (large landmass)
    ctx.beginPath();
    ctx.moveTo(580, 140);
    ctx.bezierCurveTo(700, 120, 850, 150, 950, 200);
    ctx.bezierCurveTo(1000, 250, 980, 320, 920, 360);
    ctx.bezierCurveTo(850, 380, 750, 370, 650, 340);
    ctx.bezierCurveTo(600, 300, 580, 240, 580, 180);
    ctx.closePath();
    ctx.fill();
    
    // Africa (distinctive shape)
    ctx.beginPath();
    ctx.moveTo(480, 280);
    ctx.bezierCurveTo(520, 260, 560, 280, 580, 320);
    ctx.bezierCurveTo(590, 400, 570, 480, 540, 560);
    ctx.bezierCurveTo(500, 600, 460, 580, 440, 540);
    ctx.bezierCurveTo(430, 460, 440, 380, 460, 320);
    ctx.bezierCurveTo(470, 300, 480, 280, 480, 280);
    ctx.closePath();
    ctx.fill();
    
    // Australia
    ctx.beginPath();
    ctx.ellipse(850, 600, 80, 40, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    // Add mountain ranges and terrain details
    ctx.fillStyle = '#1a3d0a'; // Darker green for mountains
    
    // Himalayas
    for (let i = 0; i < 20; i++) {
      const x = 600 + i * 15;
      const y = 200 + Math.sin(i * 0.5) * 10;
      ctx.beginPath();
      ctx.arc(x, y, 3 + Math.random() * 2, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // Andes Mountains
    for (let i = 0; i < 30; i++) {
      const x = 200 + Math.sin(i * 0.3) * 20;
      const y = 450 + i * 8;
      ctx.beginPath();
      ctx.arc(x, y, 2 + Math.random() * 1, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    // Add country boundaries (subtle lines)
    ctx.strokeStyle = '#4a5568';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.3;
    
    // Some major country boundaries
    ctx.beginPath();
    ctx.moveTo(300, 200);
    ctx.lineTo(300, 350);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo(500, 150);
    ctx.lineTo(600, 180);
    ctx.stroke();
    
    ctx.globalAlpha = 1;
    
    // Add ice caps
    ctx.fillStyle = '#e2e8f0'; // Light gray for ice
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, 50, 200, 30, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    ctx.beginPath();
    ctx.ellipse(canvas.width / 2, canvas.height - 50, 150, 25, 0, 0, 2 * Math.PI);
    ctx.fill();
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return new THREE.MeshPhongMaterial({
      map: texture,
      color: 0xffffff,
      shininess: 60,
      specular: 0x444444,
      emissive: 0x112211,
      emissiveIntensity: 0.15,
      transparent: false,
    });
  }, []);

  // Night lights material for city lights effect
  const nightLightsMaterial = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;
    
    // Black background
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Add city lights in major urban areas
    const cities = [
      { x: 200, y: 250, size: 3 }, // New York
      { x: 180, y: 280, size: 2 }, // Los Angeles
      { x: 520, y: 200, size: 2 }, // London
      { x: 580, y: 220, size: 2 }, // Paris
      { x: 650, y: 200, size: 3 }, // Moscow
      { x: 800, y: 280, size: 4 }, // Tokyo
      { x: 750, y: 320, size: 3 }, // Beijing
      { x: 780, y: 380, size: 2 }, // Delhi
      { x: 850, y: 450, size: 2 }, // Jakarta
      { x: 880, y: 600, size: 2 }, // Sydney
      { x: 500, y: 400, size: 2 }, // Cairo
      { x: 520, y: 500, size: 2 }, // Lagos
      { x: 240, y: 500, size: 2 }, // São Paulo
    ];
    
    ctx.fillStyle = '#ffeb3b';
    ctx.globalAlpha = 0.8;
    
    cities.forEach(city => {
      // Main city light
      ctx.beginPath();
      ctx.arc(city.x, city.y, city.size, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add surrounding smaller lights
      for (let i = 0; i < 10; i++) {
        const angle = (i / 10) * Math.PI * 2;
        const distance = 10 + Math.random() * 20;
        const x = city.x + Math.cos(angle) * distance;
        const y = city.y + Math.sin(angle) * distance;
        ctx.beginPath();
        ctx.arc(x, y, 0.5 + Math.random() * 1, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
  }, []);

  // Enhanced cloud material
  const cloudMaterial = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    
    // Transparent background
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Create realistic cloud patterns
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    
    // Generate cloud clusters
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = 20 + Math.random() * 40;
      
      ctx.globalAlpha = 0.1 + Math.random() * 0.3;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
      
      // Add smaller cloud details
      for (let j = 0; j < 5; j++) {
        const offsetX = (Math.random() - 0.5) * size;
        const offsetY = (Math.random() - 0.5) * size;
        ctx.beginPath();
        ctx.arc(x + offsetX, y + offsetY, size * 0.3, 0, 2 * Math.PI);
        ctx.fill();
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity: 0.15,
      alphaTest: 0.01,
    });
  }, []);

  // Enhanced atmosphere material
  const atmosphereMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color: { value: new THREE.Color(0x4a90e2) },
      },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec3 color;
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.8 - dot(vNormal, vec3(0, 0, 1.0)), 2.0);
          float pulse = 0.8 + 0.2 * sin(time * 2.0);
          gl_FragColor = vec4(color, intensity * pulse * 0.5);
        }
      `,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
    });
  }, []);

  useFrame((state) => {
    if (atmosphereMaterial.uniforms) {
      atmosphereMaterial.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    <group>
      {/* Main Earth Sphere with realistic HD materials */}
      <Sphere ref={meshRef} args={[2, 256, 128]}>
        <primitive object={earthMaterial} attach="material" />
      </Sphere>
      
      {/* Night side city lights */}
      <Sphere ref={nightLightsRef} args={[2.001, 256, 128]}>
        <primitive object={nightLightsMaterial} attach="material" />
      </Sphere>
      
      {/* Realistic cloud layer */}
      <Sphere ref={cloudsRef} args={[2.01, 128, 64]}>
        <primitive object={cloudMaterial} attach="material" />
      </Sphere>
      
      {/* Enhanced Atmosphere with soft blue glow */}
      <Sphere ref={atmosphereRef} args={[2.12, 64, 64]}>
        <primitive object={atmosphereMaterial} attach="material" />
      </Sphere>
      
      {/* Outer atmospheric glow */}
      <Sphere args={[2.25, 32, 32]}>
        <meshBasicMaterial
          color="#4a90e2"
          transparent
          opacity={0.03}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Plant Markers with enhanced animations */}
      <PlantMarkers
        selectedPlant={selectedPlant}
        onPlantClick={onPlantClick}
        timeValue={timeValue}
        plantFilter={plantFilter}
        heatmapEnabled={heatmapEnabled}
      />
      
      {/* Constellation Lines */}
      <ConstellationLines
        activeLayer={activeLayer}
        timeValue={timeValue}
      />
      
      {/* Advanced Heatmap Overlay */}
      <HeatmapOverlay
        heatmapEnabled={heatmapEnabled}
        plantFilter={plantFilter}
        timeValue={timeValue}
      />
      
      {/* Enhanced Satellite Scanning Effect */}
      <SatelliteScanEffect
        selectedPlant={selectedPlant}
        isActive={!!selectedPlant}
      />
    </group>
  );
};

export default EnhancedEarth;