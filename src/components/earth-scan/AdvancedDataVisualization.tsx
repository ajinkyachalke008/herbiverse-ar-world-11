import React, { useMemo } from 'react';
import { Html } from '@react-three/drei';
import { enhancedPlantData } from './PlantMarkers';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  Leaf, 
  Heart,
  ShieldAlert,
  Zap
} from 'lucide-react';

interface AdvancedDataVisualizationProps {
  plantFilter: string;
  diseaseFilter: string;
  timeValue: number;
  heatmapEnabled: boolean;
}

const AdvancedDataVisualization: React.FC<AdvancedDataVisualizationProps> = ({
  plantFilter,
  diseaseFilter,
  timeValue,
  heatmapEnabled
}) => {
  // Advanced analytics calculations
  const analytics = useMemo(() => {
    const filteredPlants = enhancedPlantData.filter(plant => {
      if (plantFilter === "all") return true;
      if (plantFilter === "medicinal") return plant.plantType === "medicinal";
      if (plantFilter === "rare") return plant.rarity === "Rare";
      return plant.treatmentCategories.some(cat => cat.includes(plantFilter));
    });

    // Medicinal potency analysis
    const potencyScores = filteredPlants.map(plant => ({
      name: plant.name,
      score: (plant.medicinalUses.length * 20) + 
             (plant.distribution.length * 10) + 
             (plant.culturalSignificance.length > 50 ? 20 : 0)
    }));

    // Conservation risk assessment
    const conservationRisks = filteredPlants.map(plant => ({
      name: plant.name,
      risk: plant.rarity === 'Rare' ? 'High' : 
            plant.rarity === 'Moderate' ? 'Medium' : 'Low',
      score: plant.rarity === 'Rare' ? 80 : 
             plant.rarity === 'Moderate' ? 50 : 20
    }));

    // Geographic distribution analysis
    const regionDistribution = filteredPlants.reduce((acc, plant) => {
      plant.distribution.forEach(region => {
        acc[region] = (acc[region] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    // Treatment category analysis
    const treatmentAnalysis = filteredPlants.reduce((acc, plant) => {
      plant.treatmentCategories.forEach(category => {
        acc[category] = (acc[category] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    return {
      totalPlants: filteredPlants.length,
      averagePotency: potencyScores.reduce((sum, p) => sum + p.score, 0) / potencyScores.length,
      highRiskPlants: conservationRisks.filter(r => r.risk === 'High').length,
      topRegions: Object.entries(regionDistribution)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5),
      topTreatments: Object.entries(treatmentAnalysis)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5),
      potencyTrend: timeValue > 50 ? 'increasing' : 'stable',
      conservationTrend: timeValue > 75 ? 'declining' : 'stable'
    };
  }, [plantFilter, diseaseFilter, timeValue]);

  return (
    <Html
      position={[3, 2, 0]}
      transform
      occlude={false}
      style={{ pointerEvents: 'auto' }}
    >
      <Card className="w-80 bg-background/95 backdrop-blur-md border-primary/20 shadow-2xl">
        <CardContent className="p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-primary flex items-center">
              <TrendingUp className="w-4 h-4 mr-2" />
              Atlas Analytics
            </h3>
            <Badge variant="outline" className="text-xs">
              Real-time
            </Badge>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-primary/5 rounded-lg">
              <div className="text-2xl font-bold text-primary">{analytics.totalPlants}</div>
              <div className="text-xs text-muted-foreground">Active Herbs</div>
            </div>
            <div className="text-center p-3 bg-secondary/5 rounded-lg">
              <div className="text-2xl font-bold text-secondary">{analytics.averagePotency.toFixed(0)}</div>
              <div className="text-xs text-muted-foreground">Avg Potency</div>
            </div>
          </div>

          {/* Medicinal Potency Distribution */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium flex items-center">
                <Heart className="w-3 h-3 mr-1 text-red-500" />
                Medicinal Potency
              </span>
              <span className="text-xs text-muted-foreground">
                {analytics.potencyTrend === 'increasing' ? (
                  <TrendingUp className="w-3 h-3 text-green-500" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-orange-500" />
                )}
              </span>
            </div>
            <Progress value={analytics.averagePotency} className="h-2" />
          </div>

          {/* Conservation Risk Alert */}
          {analytics.highRiskPlants > 0 && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="w-4 h-4 text-destructive" />
                <span className="text-sm font-medium text-destructive">
                  Conservation Alert
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {analytics.highRiskPlants} species at high risk
              </p>
            </div>
          )}

          {/* Top Regions */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center">
              <Globe className="w-3 h-3 mr-1 text-blue-500" />
              Geographic Hotspots
            </h4>
            <div className="space-y-1">
              {analytics.topRegions.map(([region, count], index) => (
                <div key={region} className="flex justify-between items-center text-xs">
                  <span className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      index === 0 ? 'bg-yellow-500' :
                      index === 1 ? 'bg-gray-400' :
                      index === 2 ? 'bg-orange-600' : 'bg-blue-500'
                    }`} />
                    {region}
                  </span>
                  <Badge variant="outline" className="text-[10px] px-1">
                    {count}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Treatment Categories */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center">
              <Leaf className="w-3 h-3 mr-1 text-green-500" />
              Treatment Focus
            </h4>
            <div className="grid grid-cols-2 gap-1">
              {analytics.topTreatments.map(([treatment, count]) => (
                <div key={treatment} className="text-xs p-2 bg-muted/50 rounded">
                  <div className="font-medium capitalize">{treatment}</div>
                  <div className="text-muted-foreground">{count} herbs</div>
                </div>
              ))}
            </div>
          </div>

          {/* Timeline Impact */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium flex items-center">
              <Zap className="w-3 h-3 mr-1 text-purple-500" />
              Timeline Impact
            </h4>
            <div className="text-xs space-y-1">
              {timeValue < 25 && (
                <p className="text-muted-foreground">
                  🏛️ Ancient wisdom era - Traditional knowledge foundations
                </p>
              )}
              {timeValue >= 25 && timeValue < 50 && (
                <p className="text-muted-foreground">
                  🛤️ Trade route expansion - Knowledge cross-pollination
                </p>
              )}
              {timeValue >= 50 && timeValue < 75 && (
                <p className="text-muted-foreground">
                  🔬 Scientific documentation - Modern research validation
                </p>
              )}
              {timeValue >= 75 && (
                <p className="text-muted-foreground">
                  🌡️ Climate impact era - Conservation becomes critical
                </p>
              )}
            </div>
          </div>

          {/* Heatmap Legend */}
          {heatmapEnabled && (
            <div className="space-y-2 border-t pt-2">
              <h4 className="text-sm font-medium">Density Mapping</h4>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <div className="w-3 h-3 bg-[#ff4444] rounded mr-2" />
                    High Density
                  </span>
                  <span className="text-muted-foreground">15+ compounds</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <div className="w-3 h-3 bg-[#ffaa44] rounded mr-2" />
                    Medium Density
                  </span>
                  <span className="text-muted-foreground">8-14 compounds</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center">
                    <div className="w-3 h-3 bg-[#44ff44] rounded mr-2" />
                    Lower Density
                  </span>
                  <span className="text-muted-foreground">3-7 compounds</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Html>
  );
};

export default AdvancedDataVisualization;