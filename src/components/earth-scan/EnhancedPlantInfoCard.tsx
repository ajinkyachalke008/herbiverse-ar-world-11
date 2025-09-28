import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
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
  Clock
} from 'lucide-react';

interface EnhancedPlantInfoCardProps {
  plant: any;
  onClose: () => void;
}

const EnhancedPlantInfoCard: React.FC<EnhancedPlantInfoCardProps> = ({ plant, onClose }) => {
  const getConservationColor = (status: string) => {
    if (status.includes('Vulnerable') || status.includes('Threatened')) return 'destructive';
    if (status.includes('Stable') || status.includes('Abundant')) return 'secondary';
    return 'outline';
  };

  const getMedicinalScore = () => {
    return Math.min(plant.medicinalUses.length * 20, 100);
  };

  return (
    <Card className="absolute top-4 right-4 w-96 z-50 bg-background/95 backdrop-blur-md border-2 border-primary/20 shadow-2xl animate-scale-in">
      <CardContent className="p-0">
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 rounded-t-lg">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-primary mb-1">{plant.name}</h3>
              <p className="text-sm text-muted-foreground italic mb-2">{plant.scientific}</p>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{plant.distribution.join(', ')}</span>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} className="shrink-0">
              ×
            </Button>
          </div>
          
          {/* Status badges */}
          <div className="flex flex-wrap gap-2 mb-4">
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
        </div>

        <div className="px-6 pb-6 space-y-6">
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
          </div>

          <Separator />

          {/* Medicinal Uses */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <Leaf className="w-4 h-4 mr-2 text-green-500" />
              Traditional Uses
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {plant.medicinalUses.map((use: string, index: number) => (
                <Badge key={index} variant="outline" className="text-xs justify-center py-1">
                  {use}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Local Names */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <Globe className="w-4 h-4 mr-2 text-blue-500" />
              Regional Names
            </h4>
            <div className="space-y-2">
              {Object.entries(plant.localNames).map(([lang, name]) => (
                <div key={lang} className="flex justify-between items-center text-sm">
                  <span className="capitalize font-medium text-muted-foreground">{lang}:</span>
                  <span className="font-medium">{name as string}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Cultural & Economic Info */}
          <div className="space-y-3">
            <div>
              <h5 className="font-medium text-sm text-muted-foreground mb-1 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                Cultural Significance
              </h5>
              <p className="text-sm leading-relaxed">{plant.culturalSignificance}</p>
            </div>
            
            <div>
              <h5 className="font-medium text-sm text-muted-foreground mb-1 flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                Economic Impact
              </h5>
              <p className="text-sm leading-relaxed">{plant.economicValue}</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-2 pt-2">
            <Button size="sm" variant="outline" className="flex-1">
              <Heart className="w-3 h-3 mr-1" />
              Save Plant
            </Button>
            <Button size="sm" variant="outline" className="flex-1">
              <Globe className="w-3 h-3 mr-1" />
              Learn More
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedPlantInfoCard;