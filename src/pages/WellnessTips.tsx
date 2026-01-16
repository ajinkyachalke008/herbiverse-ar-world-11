import { motion } from 'framer-motion';
import { Lightbulb, Leaf, Heart, Moon, Brain, Sparkles } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { wellnessTips, getCurrentSeason, getDailyTip, getTipsForSeason, type WellnessTip } from '@/data/wellnessTipsData';

const WellnessTips = () => {
  const currentSeason = getCurrentSeason();
  const dailyTip = getDailyTip();
  const seasonTips = getTipsForSeason(currentSeason);

  const categoryIcons: Record<string, React.ReactNode> = {
    immunity: <Heart className="w-5 h-5" />,
    digestion: <Sparkles className="w-5 h-5" />,
    sleep: <Moon className="w-5 h-5" />,
    stress: <Brain className="w-5 h-5" />,
    energy: <Lightbulb className="w-5 h-5" />,
    skin: <Sparkles className="w-5 h-5" />,
    general: <Leaf className="w-5 h-5" />
  };

  const TipCard = ({ tip, featured = false }: { tip: WellnessTip; featured?: boolean }) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <Card className={`${featured ? 'bg-gradient-to-br from-accent/20 to-primary/20 border-accent/50' : 'bg-card/50'} h-full`}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <span className="text-2xl">{tip.icon}</span>
              {tip.title}
            </CardTitle>
            <Badge variant={tip.priority === 'high' ? 'default' : 'secondary'} className={tip.priority === 'high' ? 'bg-accent' : ''}>
              {tip.priority}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-muted-foreground">{tip.description}</p>
          <div className="bg-accent/10 p-3 rounded-lg">
            <p className="text-sm font-medium text-accent">💡 {tip.actionable}</p>
          </div>
          <div className="flex flex-wrap gap-1">
            {tip.herbs.map(herb => <Badge key={herb} variant="outline" className="text-xs">{herb}</Badge>)}
          </div>
          <Badge variant="secondary" className="capitalize">{tip.category}</Badge>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-glow mb-2">🌟 Daily Wellness Tips</h1>
          <p className="text-muted-foreground">Personalized herbal wisdom for {currentSeason}</p>
        </motion.div>

        <div className="max-w-2xl mx-auto mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-accent" />Today's Tip
          </h2>
          <TipCard tip={dailyTip} featured />
        </div>

        <h2 className="text-xl font-semibold mb-4 capitalize">More {currentSeason} Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {seasonTips.filter(t => t.id !== dailyTip.id).map(tip => <TipCard key={tip.id} tip={tip} />)}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WellnessTips;
