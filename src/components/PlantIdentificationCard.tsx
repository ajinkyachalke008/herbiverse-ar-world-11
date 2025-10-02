import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Leaf, 
  FlaskConical, 
  AlertTriangle, 
  MapPin, 
  Users, 
  TrendingUp,
  Shield,
  Droplets
} from "lucide-react";

interface PlantData {
  commonName: string;
  scientificName: string;
  family: string;
  confidence: 'high' | 'medium' | 'low';
  identification: string;
  medicinalUses: string[];
  activeCompounds: string[];
  preparation: string[];
  dosage: string;
  safetyWarnings: string[];
  habitat: string;
  culturalSignificance: string;
  conservationStatus: string;
}

interface PlantIdentificationCardProps {
  plantData: PlantData;
  imageUrl: string;
  onClose: () => void;
}

const PlantIdentificationCard: React.FC<PlantIdentificationCardProps> = ({ 
  plantData, 
  imageUrl,
  onClose 
}) => {
  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
      <CardHeader className="space-y-2 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Leaf className="w-6 h-6 text-primary" />
              {plantData.commonName}
            </CardTitle>
            <p className="text-sm text-muted-foreground italic mt-1">
              {plantData.scientificName}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Family: {plantData.family}
            </p>
          </div>
          <Badge className={`${getConfidenceColor(plantData.confidence)} text-white`}>
            {plantData.confidence.toUpperCase()} Confidence
          </Badge>
        </div>
      </CardHeader>

      <ScrollArea className="h-[calc(90vh-200px)]">
        <CardContent className="space-y-4">
          {/* Image */}
          <div className="rounded-lg overflow-hidden">
            <img 
              src={imageUrl} 
              alt={plantData.commonName}
              className="w-full h-48 object-cover"
            />
          </div>

          {/* Identification */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Identification
            </h3>
            <p className="text-sm text-muted-foreground">{plantData.identification}</p>
          </div>

          <Separator />

          {/* Safety Warnings */}
          {plantData.safetyWarnings.length > 0 && (
            <>
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="font-semibold mb-1">Safety Warnings:</div>
                  <ul className="list-disc list-inside space-y-1">
                    {plantData.safetyWarnings.map((warning, idx) => (
                      <li key={idx} className="text-sm">{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
              <Separator />
            </>
          )}

          {/* Medicinal Uses */}
          {plantData.medicinalUses.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <FlaskConical className="w-4 h-4" />
                Medicinal Uses
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {plantData.medicinalUses.map((use, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">{use}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Active Compounds */}
          {plantData.activeCompounds.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Active Compounds
              </h3>
              <div className="flex flex-wrap gap-2">
                {plantData.activeCompounds.map((compound, idx) => (
                  <Badge key={idx} variant="secondary">{compound}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Preparation Methods */}
          {plantData.preparation.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Droplets className="w-4 h-4" />
                Preparation Methods
              </h3>
              <ul className="list-disc list-inside space-y-1">
                {plantData.preparation.map((method, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">{method}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Dosage */}
          <div className="space-y-2">
            <h3 className="font-semibold">Traditional Dosage</h3>
            <p className="text-sm text-muted-foreground">{plantData.dosage}</p>
          </div>

          <Separator />

          {/* Habitat */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Habitat & Growing Conditions
            </h3>
            <p className="text-sm text-muted-foreground">{plantData.habitat}</p>
          </div>

          {/* Cultural Significance */}
          <div className="space-y-2">
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="w-4 h-4" />
              Cultural Significance
            </h3>
            <p className="text-sm text-muted-foreground">{plantData.culturalSignificance}</p>
          </div>

          {/* Conservation Status */}
          {plantData.conservationStatus !== "Unknown" && (
            <div className="space-y-2">
              <h3 className="font-semibold">Conservation Status</h3>
              <Badge variant="outline">{plantData.conservationStatus}</Badge>
            </div>
          )}

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              This information is for educational purposes only. Always consult with a qualified healthcare 
              professional or certified herbalist before using any medicinal plants.
            </AlertDescription>
          </Alert>
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default PlantIdentificationCard;
