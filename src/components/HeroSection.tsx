import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Scan, Globe, Leaf, Users } from "lucide-react";
import heroEarth from "@/assets/hero-earth.jpg";
import ScanPlantButton from "@/components/ScanPlantButton";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Earth Image */}
      <div className="absolute inset-0">
        <motion.img 
          src={heroEarth} 
          alt="Futuristic Earth with medicinal plants"
          className="w-full h-full object-cover opacity-60"
          animate={{ 
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            scale: { duration: 8, repeat: Infinity, ease: "easeInOut" }
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background/80" />
      </div>

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0.2, 1, 0.2],
              scale: [0.5, 1.2, 0.5],
              backgroundColor: [
                "hsl(var(--accent-glow))",
                "hsl(var(--accent))",
                "hsl(var(--primary-glow))",
                "hsl(var(--accent-glow))"
              ]
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: "easeInOut"
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          {/* Title */}
          <motion.h1 
            className="text-5xl md:text-7xl font-bold mb-6 text-glow"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Welcome to the{" "}
            <motion.span 
              className="text-accent text-glow"
              animate={{ 
                textShadow: [
                  "0 0 20px hsl(var(--accent-glow))",
                  "0 0 40px hsl(var(--accent-glow)), 0 0 60px hsl(var(--accent))",
                  "0 0 20px hsl(var(--accent-glow))"
                ]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              Herbiverse
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Discover. Scan. Heal. Enter the future of medicinal plant exploration
            <br />
            <span className="text-accent">Where ancient wisdom meets cutting-edge technology</span>
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            className="flex flex-wrap gap-4 justify-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <ScanPlantButton variant="hero" size="xl" className="group" />
            <Button variant="earth" size="xl" className="group">
              <Leaf className="w-5 h-5 group-hover:animate-pulse" />
              Explore 3D Garden
            </Button>
            <Button variant="scan" size="xl" className="group">
              <Globe className="w-5 h-5 group-hover:animate-earth-scan" />
              Scan the Earth
            </Button>
            <Button variant="scan" size="xl" className="group">
              <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Join Community
            </Button>
          </motion.div>

          {/* Quick Search */}
          <motion.div 
            className="max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search herbs by name, region, or ailment..."
                className="w-full px-6 py-4 rounded-full bg-card/30 backdrop-blur-sm border border-accent/30 text-foreground placeholder-muted-foreground focus:border-accent-glow focus:shadow-glow transition-all duration-300 outline-none"
              />
              <Button 
                size="icon" 
                variant="hero" 
                className="absolute right-2 top-2 rounded-full"
              >
                <Scan className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        >
          <motion.div 
            className="w-6 h-10 border-2 border-accent rounded-full flex justify-center"
            animate={{ borderColor: ["hsl(var(--accent))", "hsl(var(--accent-glow))", "hsl(var(--accent))"] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <motion.div 
              className="w-1 h-2 bg-accent-glow rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Earth Scan Animation Effect */}
      <motion.div 
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 4, repeat: Infinity, delay: 2 }}
      >
        <div className="absolute inset-0 border-4 border-accent-glow/30 rounded-full animate-earth-scan" 
             style={{ margin: "20%" }} />
      </motion.div>
    </section>
  );
};

export default HeroSection;