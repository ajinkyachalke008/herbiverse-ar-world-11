import { useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Clock, ChefHat, AlertTriangle, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { herbalRecipes, type Recipe } from '@/data/herbalRecipesData';

const HerbalRecipes = () => {
  const [search, setSearch] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const filteredRecipes = herbalRecipes.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.tags.some(t => t.includes(search.toLowerCase()))
  );

  const difficultyColor = { easy: 'bg-green-500/20 text-green-400', medium: 'bg-yellow-500/20 text-yellow-400', advanced: 'bg-red-500/20 text-red-400' };
  const categoryIcon = { tea: '🍵', tincture: '💧', salve: '🧴', syrup: '🍯', powder: '🌿', oil: '✨' };

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-glow mb-2">🍵 Herbal Recipes</h1>
          <p className="text-muted-foreground">Traditional remedies with step-by-step preparation guides</p>
        </motion.div>

        <div className="relative max-w-md mx-auto mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search recipes..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecipes.map(recipe => (
            <motion.div key={recipe.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
              <Card className="bg-card/50 border-border hover:border-accent/50 transition-all cursor-pointer h-full" onClick={() => setSelectedRecipe(recipe)}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{categoryIcon[recipe.category]} {recipe.name}</CardTitle>
                    <Badge className={difficultyColor[recipe.difficulty]}>{recipe.difficulty}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{recipe.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" />{recipe.prepTime}</span>
                    <Badge variant="outline" className="capitalize">{recipe.category}</Badge>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {recipe.benefits.slice(0, 3).map(b => <Badge key={b} variant="secondary" className="text-xs">{b}</Badge>)}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Dialog open={!!selectedRecipe} onOpenChange={() => setSelectedRecipe(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedRecipe && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-2xl">{categoryIcon[selectedRecipe.category]} {selectedRecipe.name}</DialogTitle>
                  <p className="text-muted-foreground">{selectedRecipe.description}</p>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2"><ChefHat className="w-4 h-4" />Ingredients</h4>
                    <ul className="space-y-1">{selectedRecipe.ingredients.map((ing, i) => <li key={i} className="text-sm">• {ing.amount} {ing.name} {ing.notes && <span className="text-muted-foreground">({ing.notes})</span>}</li>)}</ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2"><BookOpen className="w-4 h-4" />Instructions</h4>
                    <ol className="space-y-2">{selectedRecipe.instructions.map((step, i) => <li key={i} className="text-sm"><span className="font-semibold text-accent">{i + 1}.</span> {step}</li>)}</ol>
                  </div>
                  <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3">
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-destructive"><AlertTriangle className="w-4 h-4" />Warnings</h4>
                    <ul className="space-y-1">{selectedRecipe.warnings.map((w, i) => <li key={i} className="text-sm text-destructive/80">• {w}</li>)}</ul>
                  </div>
                  <p className="text-sm text-muted-foreground">📦 Storage: {selectedRecipe.storage} | ⏳ Shelf Life: {selectedRecipe.shelfLife}</p>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
};

export default HerbalRecipes;
