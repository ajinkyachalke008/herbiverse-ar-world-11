import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Sun, Snowflake, Leaf, Cloud, Droplets, Thermometer, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { seasonalPlants, getCurrentSeason, getPlantsInSeason, getPlantsToHarvestThisMonth, monthNames, type PlantSeason } from '@/data/seasonalCalendarData';

const SeasonalCalendar = () => {
  const currentSeason = getCurrentSeason();
  const [selectedSeason, setSelectedSeason] = useState<'spring' | 'summer' | 'fall' | 'winter'>(currentSeason);
  const harvestThisMonth = getPlantsToHarvestThisMonth();
  const currentMonth = new Date().getMonth();

  const seasonIcons = {
    spring: <Leaf className="w-5 h-5" />,
    summer: <Sun className="w-5 h-5" />,
    fall: <Cloud className="w-5 h-5" />,
    winter: <Snowflake className="w-5 h-5" />
  };

  const PlantCard = ({ plant }: { plant: PlantSeason }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="bg-card/50 border-border hover:border-accent/50 transition-all">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between">
            {plant.name}
            <Badge variant="outline" className="text-xs">{plant.category}</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground italic">{plant.scientificName}</p>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-accent" />
            <span>Harvest: {plant.harvestMonths.map(m => monthNames[m - 1].slice(0, 3)).join(', ')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sun className="w-4 h-4 text-yellow-500" />
            <span className="capitalize">{plant.growingConditions.sunlight.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Droplets className="w-4 h-4 text-blue-400" />
            <span className="capitalize">{plant.growingConditions.water} water</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Thermometer className="w-4 h-4 text-red-400" />
            <span>{plant.growingConditions.temperature}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <MapPin className="w-4 h-4 text-accent" />
            <span className="text-xs">{plant.region.slice(0, 2).join(', ')}</span>
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {plant.medicinalParts.map(part => (
              <Badge key={part} className="bg-accent/20 text-accent text-xs">{part}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-glow mb-2">🌿 Seasonal Calendar</h1>
          <p className="text-muted-foreground">Discover when to plant, grow, and harvest medicinal herbs</p>
        </motion.div>

        {harvestThisMonth.length > 0 && (
          <Card className="bg-gradient-to-r from-accent/20 to-primary/20 border-accent/30 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                Ready to Harvest in {monthNames[currentMonth]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {harvestThisMonth.map(plant => (
                  <Badge key={plant.id} className="bg-accent text-accent-foreground">{plant.name}</Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs value={selectedSeason} onValueChange={(v) => setSelectedSeason(v as any)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            {(['spring', 'summer', 'fall', 'winter'] as const).map(season => (
              <TabsTrigger key={season} value={season} className="flex items-center gap-2 capitalize">
                {seasonIcons[season]} {season}
                {season === currentSeason && <span className="text-xs">(now)</span>}
              </TabsTrigger>
            ))}
          </TabsList>

          {(['spring', 'summer', 'fall', 'winter'] as const).map(season => (
            <TabsContent key={season} value={season}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {getPlantsInSeason(season).map(plant => (
                  <PlantCard key={plant.id} plant={plant} />
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </main>
      <Footer />
    </div>
  );
};

export default SeasonalCalendar;
