import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Leaf, Heart, Brain, Shield } from "lucide-react";
import medicinalPlants from "@/assets/medicinal-plants.jpg";
import turmericImage from "@/assets/herbs/turmeric.jpg";
import ashwagandhaImage from "@/assets/herbs/ashwagandha.jpg";
import neemImage from "@/assets/herbs/neem.jpg";
import ginsengImage from "@/assets/herbs/ginseng.jpg";

const herbs = [
  {
    name: "Turmeric",
    scientificName: "Curcuma longa",
    system: "Ayurveda",
    properties: "Anti-inflammatory, Antioxidant",
    uses: "Joint health, Immunity",
    icon: Heart,
    color: "from-yellow-500 to-orange-500",
    image: turmericImage,
  },
  {
    name: "Ashwagandha",
    scientificName: "Withania somnifera", 
    system: "Ayurveda",
    properties: "Adaptogenic, Nervine",
    uses: "Stress relief, Energy",
    icon: Brain,
    color: "from-green-500 to-emerald-500",
    image: ashwagandhaImage,
  },
  {
    name: "Neem",
    scientificName: "Azadirachta indica",
    system: "Ayurveda",
    properties: "Antimicrobial, Purifying",
    uses: "Skin health, Detox",
    icon: Shield,
    color: "from-emerald-600 to-green-600",
    image: neemImage,
  },
  {
    name: "Ginseng",
    scientificName: "Panax ginseng",
    system: "Traditional Chinese",
    properties: "Energizing, Tonic",
    uses: "Vitality, Cognition",
    icon: Leaf,
    color: "from-red-500 to-pink-500",
    image: ginsengImage,
  },
];

const FeaturedHerbs = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-glow">
            Featured Healing Plants
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collection of powerful medicinal herbs from ancient traditions
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div 
          className="mb-16 rounded-2xl overflow-hidden shadow-glow"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
        >
          <img 
            src={medicinalPlants} 
            alt="Collection of medicinal plants"
            className="w-full h-64 md:h-96 object-cover"
          />
        </motion.div>

        {/* Herbs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {herbs.map((herb, index) => {
            const IconComponent = herb.icon;
            return (
              <motion.div
                key={herb.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card variant="plant" className="h-full group overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      src={herb.image}
                      alt={`${herb.name} - ${herb.scientificName}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      whileHover={{ scale: 1.1 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    <motion.div 
                      className={`absolute top-4 right-4 w-12 h-12 rounded-full bg-gradient-to-br ${herb.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl group-hover:text-glow transition-colors">
                      {herb.name}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground italic">
                      {herb.scientificName}
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-center">
                      <Badge 
                        variant="secondary" 
                        className="bg-accent/20 text-accent-foreground border-accent/30 hover:bg-accent/30 transition-colors"
                      >
                        {herb.system}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-accent">Properties:</p>
                        <p className="text-sm text-foreground">{herb.properties}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-accent">Traditional Uses:</p>
                        <p className="text-sm text-foreground">{herb.uses}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-muted-foreground mb-6">
            Discover thousands more plants in our comprehensive database
          </p>
          <motion.div 
            className="inline-block"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge 
              variant="outline" 
              className="px-6 py-2 text-base cursor-pointer border-accent-glow/50 hover:border-accent-glow hover:shadow-glow transition-all duration-300"
            >
              <Leaf className="w-4 h-4 mr-2" />
              View Full Database →
            </Badge>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedHerbs;