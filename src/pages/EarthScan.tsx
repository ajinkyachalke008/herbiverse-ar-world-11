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
import CommunityContributions from "@/components/earth-scan/CommunityContributions";
import { 
  User, 
  Plus, 
  Zap, 
  Leaf,
  Award,
  Layers,
  Search,
  Filter,
  Globe2
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
  const [communitySightings, setCommunitySightings] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [detectedPlants, setDetectedPlants] = useState(25);

  const handleAddSighting = (sighting: any) => {
    setCommunitySightings(prev => [...prev, sighting]);
    setDetectedPlants(prev => prev + 1);
    toast({
      title: "Sighting Added! 🌿",
      description: "Your contribution has been submitted for verification.",
      duration: 3000,
    });
  };

  const handleXPGain = (xp: number) => {
    setUserXP(prev => {
      const newXP = prev + xp;
      const newLevel = Math.floor(newXP / 500) + 1;
      if (newLevel > userLevel) {
        setUserLevel(newLevel);
        toast({
          title: `Level Up! 🎉`,
          description: `Welcome to Level ${newLevel}! You're becoming a true plant explorer.`,
          duration: 4000,
        });
      }
      return newXP;
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
        {/* Header Controls - Living Herbal Atlas */}
        <div className="absolute top-4 left-4 right-4 z-40 flex justify-between items-center">
          <div className="flex items-center space-x-4 bg-background/95 backdrop-blur-md rounded-2xl px-6 py-3 border border-primary/30 shadow-xl">
            <div className="flex items-center space-x-2">
              <Globe2 className="w-5 h-5 text-primary animate-pulse" />
              <span className="font-bold text-primary">Living Herbal Atlas</span>
              <Badge variant="secondary" className="text-xs">v2.0</Badge>
            </div>
            
            <div className="h-4 w-px bg-border" />
            
            {/* Enhanced Search */}
            <div className="relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-3 h-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search herbs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-7 pr-3 py-1 h-8 w-32 text-xs bg-background/50 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            
            {/* Layer Toggle */}
            <Tabs value={activeLayer} onValueChange={setActiveLayer} className="w-36">
              <TabsList className="grid w-full grid-cols-2 h-8">
                <TabsTrigger value="plants" className="text-xs">
                  <Leaf className="w-3 h-3 mr-1" />
                  Herbs
                </TabsTrigger>
                <TabsTrigger value="climate" className="text-xs">
                  <Globe2 className="w-3 h-3 mr-1" />
                  Climate
                </TabsTrigger>
              </TabsList>
            </Tabs>
            
            {/* Plant Type Filter */}
            <Select value={plantFilter} onValueChange={setPlantFilter}>
              <SelectTrigger className="w-36 h-8">
                <SelectValue placeholder="Plant Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="medicinal">Medicinal</SelectItem>
                <SelectItem value="aromatic">Aromatic</SelectItem>
                <SelectItem value="rare">Endangered</SelectItem>
                <SelectItem value="common">Common</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Treatment Filter */}
            <Select value={diseaseFilter} onValueChange={setDiseaseFilter}>
              <SelectTrigger className="w-36 h-8">
                <SelectValue placeholder="Treatment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Treatments</SelectItem>
                <SelectItem value="fever">Fever Relief</SelectItem>
                <SelectItem value="skin">Skin Care</SelectItem>
                <SelectItem value="digestive">Digestive</SelectItem>
                <SelectItem value="respiratory">Respiratory</SelectItem>
                <SelectItem value="immunity">Immunity</SelectItem>
                <SelectItem value="stress">Stress Relief</SelectItem>
              </SelectContent>
            </Select>
            
            {/* Heatmap Toggle */}
            <Button
              variant={heatmapEnabled ? "default" : "outline"}
              size="sm"
              onClick={toggleHeatmap}
              className="h-8 px-3"
            >
              <Layers className="w-3 h-3 mr-1" />
              Density Map
            </Button>
          </div>
          
          {/* Enhanced User Stats & Progress */}
          <div className="flex items-center space-x-4 bg-background/95 backdrop-blur-md rounded-2xl px-6 py-3 border border-primary/30 shadow-xl">
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Award className="w-5 h-5 text-yellow-500" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full text-[8px] text-white flex items-center justify-center font-bold">
                  {userLevel}
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium">Explorer Level</span>
                <span className="text-xs text-muted-foreground">Rank {userLevel}</span>
              </div>
            </div>
            
            <div className="h-6 w-px bg-border" />
            
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-blue-500" />
              <div className="flex flex-col">
                <span className="text-xs font-medium">{userXP.toLocaleString()} XP</span>
                <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${((userXP % 500) / 500) * 100}%` }}
                  />
                </div>
              </div>
            </div>
            
            <div className="h-6 w-px bg-border" />
            
            <div className="flex items-center space-x-2">
              <Leaf className="w-4 h-4 text-green-500" />
              <div className="flex flex-col">
                <span className="text-xs font-medium">{detectedPlants}</span>
                <span className="text-xs text-muted-foreground">Plants Found</span>
              </div>
            </div>
            
            <Button size="sm" className="h-8">
              <User className="w-4 h-4 mr-1" />
              Explorer Profile
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
              diseaseFilter={diseaseFilter}
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
        
        {/* Bottom Controls - Enhanced Community Features */}
        <div className="absolute bottom-4 left-4 right-4 z-40">
          <div className="flex justify-between items-end">
            {/* Community Contributions */}
            <CommunityContributions
              onAddSighting={handleAddSighting}
              userXP={userXP}
              userLevel={userLevel}
              onXPGain={handleXPGain}
            />
            
            {/* Enhanced Timeline Controls */}
            <TimelineControls
              timeValue={timeValue}
              onTimeChange={setTimeValue}
              isPlaying={isTimelinePlaying}
              onPlayPause={handleTimelinePause}
              onReset={handleTimelineReset}
            />
            
            {/* Enhanced Stats Display */}
            <div className="bg-background/95 backdrop-blur-md rounded-lg px-4 py-3 border border-primary/20 shadow-lg">
              <div className="text-sm space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="font-medium">Atlas Scanning</span>
                  </div>
                  <Badge variant="outline" className="text-xs">Live</Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  <div>{detectedPlants} herbs mapped</div>
                  <div>{communitySightings.length} contributions</div>
                  <div>{heatmapEnabled ? 'Medicinal density' : 'Conservation status'}</div>
                  <div>25 countries covered</div>
                </div>
                {searchQuery && (
                  <div className="text-xs text-primary border-t pt-2">
                    Filtering: "{searchQuery}"
                  </div>
                )}
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
        
        {/* Enhanced Legend */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 z-40 bg-background/95 backdrop-blur-md rounded-lg p-4 border border-primary/20 shadow-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Filter className="w-4 h-4 text-primary" />
            <h4 className="font-semibold text-sm">
              {heatmapEnabled ? 'Medicinal Density Map' : 'Conservation Status'}
            </h4>
          </div>
          <div className="space-y-3 text-xs">
            {heatmapEnabled ? (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#ff4444] rounded-full shadow-sm"></div>
                      <span>High Value</span>
                    </div>
                    <Badge variant="destructive" className="text-[10px] px-1">Hot</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#ffaa44] rounded-full shadow-sm"></div>
                      <span>Medium Value</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] px-1">Warm</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#44ff44] rounded-full shadow-sm"></div>
                      <span>Lower Value</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] px-1">Cool</Badge>
                  </div>
                </div>
                <div className="pt-2 border-t text-[10px] text-muted-foreground">
                  Based on medicinal uses, cultural significance, and distribution
                </div>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#4ecdc4] rounded-full shadow-sm"></div>
                      <span>Common/Abundant</span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] px-1">Safe</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#ffe66d] rounded-full shadow-sm"></div>
                      <span>Moderate Risk</span>
                    </div>
                    <Badge variant="outline" className="text-[10px] px-1">Watch</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-[#ff6b6b] rounded-full shadow-sm"></div>
                      <span>Rare/Endangered</span>
                    </div>
                    <Badge variant="destructive" className="text-[10px] px-1">Alert</Badge>
                  </div>
                </div>
                <div className="pt-2 border-t text-[10px] text-muted-foreground">
                  Conservation status based on habitat and cultivation data
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