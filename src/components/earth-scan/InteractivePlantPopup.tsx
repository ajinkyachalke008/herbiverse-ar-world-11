import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Heart, 
  Globe, 
  MapPin, 
  Thermometer, 
  Shield, 
  Star,
  TrendingUp,
  Leaf,
  Clock,
  Camera,
  BookOpen,
  Share2,
  Download,
  X
} from 'lucide-react';

interface InteractivePlantPopupProps {
  plant: any;
  onClose: () => void;
  onSaveToCollection?: (plant: any) => void;
  onSharePlant?: (plant: any) => void;
}

const InteractivePlantPopup: React.FC<InteractivePlantPopupProps> = ({ 
  plant, 
  onClose,
  onSaveToCollection,
  onSharePlant 
}) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSaved, setIsSaved] = useState(false);

  const getConservationColor = (status: string) => {
    if (status.includes('Vulnerable') || status.includes('Threatened') || status.includes('high risk')) return 'destructive';
    if (status.includes('Stable') || status.includes('Abundant')) return 'secondary';
    return 'outline';
  };

  const getMedicinalScore = () => {
    return Math.min(plant.medicinalUses.length * 20, 100);
  };

  const handleSave = () => {
    setIsSaved(true);
    if (onSaveToCollection) {
      onSaveToCollection(plant);
    }
  };

  const handleShare = () => {
    if (onSharePlant) {
      onSharePlant(plant);
    }
  };

  return (
    <Html
      position={[0, 0, 0]}
      transform
      occlude={false}
      style={{ pointerEvents: 'auto' }}
    >
      <Card className="w-[480px] max-h-[600px] overflow-hidden bg-background/98 backdrop-blur-md border-2 border-primary/20 shadow-2xl animate-scale-in">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-primary mb-1">{plant.name}</h3>
              <p className="text-sm text-muted-foreground italic mb-2">{plant.scientific}</p>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{plant.distribution?.join(', ') || 'Global distribution'}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={handleSave}>
                <Heart className={`w-4 h-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
          
          {/* Status badges */}
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant={getConservationColor(plant.conservationStatus)}>
              <Shield className="w-3 h-3 mr-1" />
              {plant.conservationStatus}
            </Badge>
            <Badge variant="outline">
              <Thermometer className="w-3 h-3 mr-1" />
              {plant.climateZone}
            </Badge>
            <Badge variant={plant.rarity === 'Rare' ? 'destructive' : 'secondary'}>
              <Star className="w-3 h-3 mr-1" />
              {plant.rarity}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-none border-b">
              <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
              <TabsTrigger value="medicinal" className="text-xs">Medicine</TabsTrigger>
              <TabsTrigger value="cultural" className="text-xs">Culture</TabsTrigger>
              <TabsTrigger value="research" className="text-xs">Research</TabsTrigger>
            </TabsList>

            <div className="max-h-96 overflow-y-auto">
              <TabsContent value="overview" className="p-4 space-y-4 m-0">
                {/* Medicinal Potency Score */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold flex items-center">
                      <Heart className="w-4 h-4 mr-2 text-red-500" />
                      Medicinal Potency
                    </h4>
                    <span className="text-sm font-medium">{getMedicinalScore()}%</span>
                  </div>
                  <Progress value={getMedicinalScore()} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">
                    Based on {plant.medicinalUses?.length || 0} documented uses
                  </p>
                </div>

                <Separator />

                {/* Quick Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-primary/5 rounded-lg">
                    <div className="text-lg font-bold text-primary">
                      {plant.distribution?.length || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Regions</div>
                  </div>
                  <div className="text-center p-3 bg-secondary/5 rounded-lg">
                    <div className="text-lg font-bold text-secondary">
                      {Object.keys(plant.localNames || {}).length}
                    </div>
                    <div className="text-xs text-muted-foreground">Languages</div>
                  </div>
                </div>

                {/* Local Names Preview */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center">
                    <Globe className="w-4 h-4 mr-2 text-blue-500" />
                    Regional Names
                  </h4>
                  <div className="space-y-1">
                    {Object.entries(plant.localNames || {}).slice(0, 3).map(([lang, name]) => (
                      <div key={lang} className="flex justify-between items-center text-sm">
                        <span className="capitalize font-medium text-muted-foreground">{lang}:</span>
                        <span className="font-medium">{name as string}</span>
                      </div>
                    ))}
                    {Object.keys(plant.localNames || {}).length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{Object.keys(plant.localNames).length - 3} more names
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="medicinal" className="p-4 space-y-4 m-0">
                {/* Medicinal Uses */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Leaf className="w-4 h-4 mr-2 text-green-500" />
                    Traditional Uses
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {(plant.medicinalUses || []).map((use: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs justify-center py-1">
                        {use}
                      </Badge>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Treatment Categories */}
                <div>
                  <h4 className="font-semibold mb-3">Treatment Categories</h4>
                  <div className="space-y-2">
                    {(plant.treatmentCategories || []).map((category: string, index: number) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-sm capitalize">{category}</span>
                        <Badge variant="secondary" className="text-xs">Active</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Preparation Methods */}
                <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
                  <h5 className="font-medium text-sm mb-2">Common Preparations</h5>
                  <div className="text-xs space-y-1">
                    <p>• Tea/Decoction: Most common for internal use</p>
                    <p>• Topical paste: For skin applications</p>
                    <p>• Powder form: For mixing with other herbs</p>
                    <p>• Essential oil: For aromatherapy and massage</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="cultural" className="p-4 space-y-4 m-0">
                {/* Cultural Significance */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-purple-500" />
                    Cultural Heritage
                  </h4>
                  <p className="text-sm leading-relaxed">{plant.culturalSignificance}</p>
                </div>

                <Separator />

                {/* Economic Impact */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                    Economic Value
                  </h4>
                  <p className="text-sm leading-relaxed">{plant.economicValue}</p>
                </div>

                {/* Traditional Stories */}
                <div className="bg-amber-50 dark:bg-amber-950 p-3 rounded-lg">
                  <h5 className="font-medium text-sm mb-2">Traditional Knowledge</h5>
                  <p className="text-xs text-muted-foreground">
                    Passed down through generations of traditional healers and indigenous communities.
                    This knowledge represents thousands of years of human-plant relationships.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="research" className="p-4 space-y-4 m-0">
                {/* Scientific Research */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <BookOpen className="w-4 h-4 mr-2 text-blue-500" />
                    Modern Research
                  </h4>
                  <div className="space-y-3">
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-sm">Active Compounds</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        Research has identified multiple bioactive compounds responsible for therapeutic effects.
                      </p>
                    </div>
                    <div className="p-3 border rounded-lg">
                      <h5 className="font-medium text-sm">Clinical Studies</h5>
                      <p className="text-xs text-muted-foreground mt-1">
                        Ongoing studies validating traditional uses with modern scientific methods.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sustainability Info */}
                <div className="bg-green-50 dark:bg-green-950 p-3 rounded-lg">
                  <h5 className="font-medium text-sm mb-2">Sustainability Notes</h5>
                  <p className="text-xs text-muted-foreground">
                    Conservation efforts are crucial for maintaining wild populations while 
                    supporting sustainable cultivation practices.
                  </p>
                </div>

                {/* Research Links */}
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" className="flex-1">
                    <BookOpen className="w-3 h-3 mr-1" />
                    Studies
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1">
                    <Download className="w-3 h-3 mr-1" />
                    Data
                  </Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>

          {/* Action buttons */}
          <div className="flex space-x-2 p-4 border-t bg-muted/20">
            <Button size="sm" variant="outline" className="flex-1" onClick={handleSave}>
              <Heart className="w-3 h-3 mr-1" />
              {isSaved ? 'Saved' : 'Save Plant'}
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Camera className="w-3 h-3 mr-1" />
              Add Photo
            </Button>
            <Button size="sm" className="flex-1">
              <Globe className="w-3 h-3 mr-1" />
              Learn More
            </Button>
          </div>
        </CardContent>
      </Card>
    </Html>
  );
};

export default InteractivePlantPopup;