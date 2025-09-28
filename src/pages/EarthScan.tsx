import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import EnhancedEarth from "@/components/earth-scan/EnhancedEarth";
import EnhancedPlantInfoCard from "@/components/earth-scan/EnhancedPlantInfoCard";
import TimelineControls from "@/components/earth-scan/TimelineControls";
import { 
  User, 
  Plus, 
  Zap, 
  Leaf,
  Award,
  Layers
} from 'lucide-react';

const EarthScan = () => {
  const { toast } = useToast();
  const [selectedPlant, setSelectedPlant] = useState<any>(null);
  const [timeValue, setTimeValue] = useState([50]); // Present = 50
  const [activeLayer, setActiveLayer] = useState("plants");
  const [plantFilter, setPlantFilter] = useState("all");
  const [diseaseFilter, setDiseaseFilter] = useState("all");
  const [userXP, setUserXP] = useState(1250);
  const [userLevel, setUserLevel] = useState(3);
  const [isTimelinePlaying, setIsTimelinePlaying] = useState(false);
  const [heatmapEnabled, setHeatmapEnabled] = useState(false);

  const handleAddSighting = () => {
    toast({
      title: "Community Feature",
      description: "Connect to Supabase to enable community contributions, user authentication, and file storage for plant photos.",
      duration: 4000,
    });
  };

  const handleTimelinePause = () => {
    setIsTimelinePlaying(!isTimelinePlaying);
  };

  const handleTimelineReset = () => {
    setTimeValue([50]);
    setIsTimelinePlaying(false);
  };

  const toggleHeatmap = () => {
    setHeatmapEnabled(!heatmapEnabled);
    toast({
      title: heatmapEnabled ? "Heatmap Disabled" : "Heatmap Enabled",
      description: heatmapEnabled ? "Showing rarity-based coloring" : "Showing medicinal density heatmap",
      duration: 2000,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-primary/5">
      <Navigation />
      
      {/* Main Earth Scan Interface */}
      <main className="relative">
        {/* Header Controls */}
        <div className="absolute top-4 left-4 right-4 z-40 flex justify-between items-center">
          <div className="flex items-center space-x-4 bg-background/90 backdrop-blur-sm rounded-full px-6 py-3 border border-primary/20">
            <div className="flex items-center space-x-2">
              <Leaf className="w-5 h-5 text-primary" />
              <span className="font-bold text-primary">Herbiverse Earth Scan</span>
            </div>
            
            <div className="h-4 w-px bg-border" />
            
            {/* Filters */}
            <Tabs value={activeLayer} onValueChange={setActiveLayer} className="w-32">
              <TabsList className="grid w-full grid-cols-2 h-8">
                <TabsTrigger value="plants" className="text-xs">Plants</TabsTrigger>
                <TabsTrigger value="climate" className="text-xs">Climate</TabsTrigger>
              </TabsList>
            </Tabs>
            
            <Select value={plantFilter} onValueChange={setPlantFilter}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue placeholder="Plant Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="medicinal">Medicinal</SelectItem>
                <SelectItem value="aromatic">Aromatic</SelectItem>
                <SelectItem value="rare">Rare Species</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={diseaseFilter} onValueChange={setDiseaseFilter}>
              <SelectTrigger className="w-32 h-8">
                <SelectValue placeholder="Treatment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Treatments</SelectItem>
                <SelectItem value="fever">Fever</SelectItem>
                <SelectItem value="wounds">Wounds</SelectItem>
                <SelectItem value="digestive">Digestive</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant={heatmapEnabled ? "default" : "outline"}
              size="sm"
              onClick={toggleHeatmap}
              className="h-8 px-3"
            >
              <Layers className="w-3 h-3 mr-1" />
              Heatmap
            </Button>
          </div>
          
          {/* User Stats */}
          <div className="flex items-center space-x-4 bg-background/90 backdrop-blur-sm rounded-full px-6 py-3 border border-primary/20">
            <div className="flex items-center space-x-2">
              <Award className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Level {userLevel}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <span className="text-sm font-medium">{userXP} XP</span>
            </div>
            <Button size="sm" className="h-8">
              <User className="w-4 h-4 mr-1" />
              Profile
            </Button>
          </div>
        </div>
        
        {/* 3D Globe Container with enhanced lighting */}
        <div className="h-screen relative overflow-hidden">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            {/* Enhanced lighting setup for realistic Earth visibility */}
            <ambientLight intensity={0.2} color="#404040" />
            <directionalLight 
              position={[10, 10, 5]} 
              intensity={1.5} 
              color="#ffffff"
              castShadow
            />
            <directionalLight 
              position={[-5, -5, -5]} 
              intensity={0.4} 
              color="#4a90e2" 
            />
            <pointLight 
              position={[0, 0, 8]} 
              intensity={1.0} 
              color="#ffffff"
              distance={20}
              decay={2}
            />
            {/* Rim lighting for atmosphere */}
            <pointLight 
              position={[5, 0, 0]} 
              intensity={0.3} 
              color="#87ceeb"
              distance={15}
            />
            <pointLight 
              position={[-5, 0, 0]} 
              intensity={0.3} 
              color="#87ceeb"
              distance={15}
            />
            
            <EnhancedEarth 
              selectedPlant={selectedPlant} 
              onPlantClick={setSelectedPlant}
              timeValue={timeValue[0]}
              activeLayer={activeLayer}
              plantFilter={plantFilter}
              heatmapEnabled={heatmapEnabled}
            />
            
            <OrbitControls 
              enableZoom={true}
              enablePan={true}
              enableRotate={true}
              zoomSpeed={0.6}
              panSpeed={0.5}
              rotateSpeed={0.4}
              minDistance={3}
              maxDistance={10}
            />
          </Canvas>
          
          {/* Scanning Effect Overlay */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-primary/5 to-transparent animate-pulse" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-2 border-primary/30 rounded-full animate-ping" />
          </div>
        </div>
        
        {/* Bottom Controls */}
        <div className="absolute bottom-4 left-4 right-4 z-40">
          <div className="flex justify-between items-end">
            {/* Add Sighting Button */}
            <Button 
              onClick={handleAddSighting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Plant Sighting
            </Button>
            
            {/* Enhanced Timeline Controls */}
            <TimelineControls
              timeValue={timeValue}
              onTimeChange={setTimeValue}
              isPlaying={isTimelinePlaying}
              onPlayPause={handleTimelinePause}
              onReset={handleTimelineReset}
            />
            
            {/* Stats Display */}
            <div className="bg-background/90 backdrop-blur-sm rounded-lg px-4 py-3 border border-primary/20">
              <div className="text-sm space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span>Scanning Active</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  5 plants detected • {heatmapEnabled ? 'Density mode' : 'Rarity mode'}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Enhanced Plant Info Popup */}
        {selectedPlant && (
          <EnhancedPlantInfoCard 
            plant={selectedPlant} 
            onClose={() => setSelectedPlant(null)} 
          />
        )}
        
        {/* Legend */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40 bg-background/90 backdrop-blur-sm rounded-lg p-4 border border-primary/20">
          <h4 className="font-semibold mb-3 text-sm">
            {heatmapEnabled ? 'Medicinal Density' : 'Plant Rarity'}
          </h4>
          <div className="space-y-2 text-xs">
            {heatmapEnabled ? (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#ff4444] rounded-full"></div>
                  <span>High Medicinal Value</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#ffaa44] rounded-full"></div>
                  <span>Medium Value</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#44ff44] rounded-full"></div>
                  <span>Low Value</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#4ecdc4] rounded-full"></div>
                  <span>Common</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#ffe66d] rounded-full"></div>
                  <span>Moderate</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-[#ff6b6b] rounded-full"></div>
                  <span>Rare</span>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default EarthScan;