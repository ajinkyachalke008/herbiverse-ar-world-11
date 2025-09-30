import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Scan, Globe, Gamepad2, Map, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import ScanPlantButton from "@/components/ScanPlantButton";
import plantIdentificationImage from "@/assets/features/plant-identification.jpg";
import earthScannerImage from "@/assets/features/earth-scanner.jpg";
import herbalQuestImage from "@/assets/features/herbal-quest.jpg";
import communityMappingImage from "@/assets/features/community-mapping.jpg";

const features = [
  {
    icon: Scan,
    title: "AI Plant Identification",
    description: "Upload or scan any plant with your camera for instant identification and medicinal properties",
    action: "Try Scanner",
    gradient: "from-blue-500 to-cyan-500",
    delay: 0,
    image: plantIdentificationImage,
  },
  {
    icon: Globe,
    title: "Earth Scan Mode",
    description: "Explore global distribution of medicinal plants with interactive satellite mapping",
    action: "Scan Earth",
    gradient: "from-green-500 to-emerald-500",
    delay: 0.1,
    image: earthScannerImage,
  },
  {
    icon: Gamepad2,
    title: "Herbal Quest Challenges",
    description: "Learn through interactive quizzes, plant hunts, and earn badges as you master herbal knowledge",
    action: "Start Quest",
    gradient: "from-purple-500 to-pink-500",
    delay: 0.2,
    image: herbalQuestImage,
  },
  {
    icon: Map,
    title: "Community Mapping",
    description: "Contribute to our crowdsourced database by tagging plant sightings in your area",
    action: "Add Location",
    gradient: "from-orange-500 to-red-500",
    delay: 0.3,
    image: communityMappingImage,
  },
];

const InteractiveFeatures = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-30">
        {Array.from({ length: 10 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-32 h-32 border border-accent/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-glow">
            Immersive Plant Exploration
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the future of botanical learning with cutting-edge technology
            that brings ancient wisdom to life
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: feature.delay }}
                viewport={{ once: true }}
              >
                <Card variant="glow" className="h-full group cursor-pointer overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <motion.img
                      src={feature.image}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      whileHover={{ scale: 1.1 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    <motion.div 
                      className={`absolute top-4 right-4 w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <IconComponent className="w-6 h-6 text-white" />
                    </motion.div>
                  </div>
                  <CardHeader>
                    <CardTitle className="text-2xl group-hover:text-glow transition-colors">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col">
                    <p className="text-muted-foreground mb-6 flex-1">
                      {feature.description}
                    </p>
                    {feature.title === "Herbal Quest Challenges" ? (
                      <Link to="/herbal-quest">
                        <Button 
                          variant="outline" 
                          className="w-full group-hover:border-accent-glow group-hover:bg-accent/10 group-hover:shadow-glow transition-all duration-300"
                        >
                          {feature.action}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    ) : feature.title === "Earth Scan Mode" ? (
                      <Link to="/earth-scan">
                        <Button 
                          variant="outline" 
                          className="w-full group-hover:border-accent-glow group-hover:bg-accent/10 group-hover:shadow-glow transition-all duration-300"
                        >
                          {feature.action}
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    ) : (
                      <Button 
                        variant="outline" 
                        className="w-full group-hover:border-accent-glow group-hover:bg-accent/10 group-hover:shadow-glow transition-all duration-300"
                      >
                        {feature.action}
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Interactive Demo Section */}
        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <Card variant="hero" className="max-w-2xl mx-auto p-8">
            <motion.div 
              className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-glow flex items-center justify-center"
              animate={{ 
                boxShadow: [
                  "0 0 20px hsl(var(--accent-glow) / 0.3)",
                  "0 0 40px hsl(var(--accent-glow) / 0.6)",
                  "0 0 20px hsl(var(--accent-glow) / 0.3)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Scan className="w-12 h-12 text-accent-foreground" />
            </motion.div>
            <h3 className="text-2xl font-bold mb-4 text-glow">Ready to Begin Your Journey?</h3>
            <p className="text-muted-foreground mb-6">
              Start exploring the Herbiverse with our interactive plant scanner.
              Simply point your camera at any plant to discover its healing properties.
            </p>
            <ScanPlantButton variant="hero" size="xl" className="group" />
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default InteractiveFeatures;