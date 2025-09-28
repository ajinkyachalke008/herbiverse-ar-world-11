import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf, Sparkles, Eye, ChevronRight } from "lucide-react";
import type { EmblaOptionsType } from "embla-carousel";
import Autoplay from "embla-carousel-autoplay";
import LoginButton from "./LoginButton";
import turmericImage from "@/assets/herbs/turmeric.jpg";
import ashwagandhaImage from "@/assets/herbs/ashwagandha.jpg";
import neemImage from "@/assets/herbs/neem.jpg";
import ginsengImage from "@/assets/herbs/ginseng.jpg";

interface Herb {
  title: string;
  latinName: string;
  slug: string;
  shortUse: string;
  detailedDescription: string;
  tags: string[];
  imageUrl: string;
  altText: string;
  benefits: string[];
  dosage: string;
  precautions: string;
}

const herbsData: Herb[] = [
  {
    title: "Turmeric",
    latinName: "Curcuma longa",
    slug: "turmeric",
    shortUse: "Heals inflammation, boosts immunity, joint health",
    detailedDescription: "A golden treasure from ancient Ayurveda, turmeric contains powerful curcumin compounds that provide potent anti-inflammatory and antioxidant properties. Used for centuries to heal wounds, boost immunity, and support overall wellness.",
    tags: ["Anti-inflammatory", "Immunity", "Joint Health"],
    imageUrl: turmericImage,
    altText: "Golden turmeric root and powder",
    benefits: ["Reduces inflammation", "Boosts immune system", "Supports joint health", "Powerful antioxidant"],
    dosage: "500-1000mg daily with meals",
    precautions: "Avoid with blood thinners. Consult doctor if pregnant."
  },
  {
    title: "Ashwagandha",
    latinName: "Withania somnifera",
    slug: "ashwagandha",
    shortUse: "Reduces stress, boosts energy, enhances vitality",
    detailedDescription: "Known as the 'Indian Winter Cherry', Ashwagandha is a powerful adaptogenic herb that helps the body manage stress while boosting energy levels and enhancing overall vitality. Perfect for modern life's challenges.",
    tags: ["Adaptogen", "Stress Relief", "Energy"],
    imageUrl: ashwagandhaImage,
    altText: "Ashwagandha roots and powder",
    benefits: ["Reduces cortisol levels", "Improves energy", "Enhances sleep quality", "Supports cognitive function"],
    dosage: "300-600mg daily, preferably evening",
    precautions: "Not recommended during pregnancy. May interact with thyroid medications."
  },
  {
    title: "Neem",
    latinName: "Azadirachta indica",
    slug: "neem",
    shortUse: "Purifies blood, heals skin, natural detoxifier",
    detailedDescription: "The 'Village Pharmacy' of India, Neem is renowned for its powerful antimicrobial and purifying properties. This sacred tree provides natural solutions for skin health, blood purification, and detoxification.",
    tags: ["Antimicrobial", "Skin Health", "Detox"],
    imageUrl: neemImage,
    altText: "Fresh neem leaves",
    benefits: ["Purifies blood", "Treats skin conditions", "Natural antimicrobial", "Supports oral health"],
    dosage: "2-4 leaves daily or 500mg capsules",
    precautions: "Avoid during pregnancy and breastfeeding. Monitor blood sugar levels."
  },
  {
    title: "Ginseng",
    latinName: "Panax ginseng",
    slug: "ginseng",
    shortUse: "Enhances cognition, boosts vitality, improves focus",
    detailedDescription: "The 'King of Herbs' in Traditional Chinese Medicine, Ginseng is prized for its ability to enhance mental clarity, boost physical vitality, and support overall longevity. A true elixir of life.",
    tags: ["Cognitive", "Vitality", "Focus"],
    imageUrl: ginsengImage,
    altText: "Ginseng root",
    benefits: ["Enhances mental clarity", "Boosts physical energy", "Improves focus", "Supports longevity"],
    dosage: "200-400mg daily, morning preferred",
    precautions: "May cause insomnia if taken late. Avoid with caffeine sensitivity."
  },
  {
    title: "Brahmi",
    latinName: "Bacopa monnieri",
    slug: "brahmi",
    shortUse: "Brain tonic, memory booster, cognitive enhancer",
    detailedDescription: "Sacred to Lord Brahma, this aquatic herb is renowned for enhancing memory, concentration, and overall cognitive function. A powerful brain tonic used in Ayurveda for thousands of years.",
    tags: ["Brain Tonic", "Memory", "Cognitive"],
    imageUrl: neemImage, // Placeholder
    altText: "Brahmi leaves",
    benefits: ["Improves memory", "Enhances concentration", "Reduces anxiety", "Supports learning"],
    dosage: "300-600mg daily with meals",
    precautions: "May cause drowsiness initially. Start with lower doses."
  },
  {
    title: "Aloe Vera",
    latinName: "Aloe barbadensis",
    slug: "aloe-vera",
    shortUse: "Heals burns, soothes skin, digestive support",
    detailedDescription: "The 'Plant of Immortality' as called by ancient Egyptians, Aloe Vera provides cooling relief for burns, skin irritations, and digestive issues. A versatile healing companion for every home.",
    tags: ["Healing", "Skin Care", "Digestive"],
    imageUrl: ginsengImage, // Placeholder
    altText: "Aloe vera plant",
    benefits: ["Heals burns and wounds", "Soothes skin irritation", "Supports digestive health", "Natural moisturizer"],
    dosage: "Apply topically or 50-100ml juice daily",
    precautions: "Test on small skin area first. Avoid if allergic to latex."
  }
];

const FloatingParticles = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-accent/30 rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: Math.random() * 0.5 + 0.5,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: [0.5, 1, 0.5],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`leaf-${i}`}
          className="absolute text-accent/20"
          initial={{
            x: Math.random() * window.innerWidth,
            y: -50,
            rotate: 0,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 50,
            rotate: 360,
          }}
          transition={{
            duration: Math.random() * 8 + 12,
            repeat: Infinity,
            ease: "linear",
            delay: Math.random() * 5,
          }}
        >
          <Leaf className="w-3 h-3" />
        </motion.div>
      ))}
    </div>
  );
};

const HerbCard = ({ herb, onCardClick }: { herb: Herb; onCardClick: (herb: Herb) => void }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="group relative h-full cursor-pointer"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ 
        scale: 1.06, 
        y: -12,
        rotateX: 8,
        rotateY: isHovered ? 8 : -8,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
      onClick={() => onCardClick(herb)}
    >
      <Card className="h-full bg-background/10 backdrop-blur-md border border-accent/20 rounded-2xl overflow-hidden hover:border-accent-glow hover:shadow-2xl hover:shadow-accent/25 transition-all duration-500">
        {/* Sheen Effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent -translate-x-full"
          animate={isHovered ? { x: "200%" } : { x: "-100%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
        
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={herb.imageUrl}
            alt={herb.altText}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
          
          {/* Floating Icon */}
          <motion.div 
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-accent/20 backdrop-blur-sm flex items-center justify-center"
            whileHover={{ scale: 1.2, rotate: 180 }}
            transition={{ duration: 0.4 }}
          >
            <Sparkles className="w-5 h-5 text-accent" />
          </motion.div>
        </div>

        <CardContent className="p-5 space-y-4">
          {/* Header */}
          <div className="text-center space-y-1">
            <h3 className="text-lg font-bold text-foreground group-hover:text-accent transition-colors">
              {herb.title}
            </h3>
            <p className="text-sm text-muted-foreground italic">
              {herb.latinName}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 justify-center">
            {herb.tags.slice(0, 2).map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs bg-accent/10 text-accent border-accent/30 hover:bg-accent/20 transition-colors"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Short Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {herb.shortUse}
          </p>

          {/* Extra Info on Hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="space-y-2"
              >
                <div className="text-xs text-accent font-medium">
                  Key Benefits:
                </div>
                <div className="text-xs text-muted-foreground">
                  {herb.benefits.slice(0, 2).join(" • ")}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTA Button */}
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="sm" 
              variant="outline"
              className="w-full bg-accent/10 border-accent/30 text-accent hover:bg-accent/20 hover:border-accent"
            >
              <Eye className="w-3 h-3 mr-2" />
              Read More
              <ChevronRight className="w-3 h-3 ml-2" />
            </Button>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const HerbModal = ({ herb, isOpen, onClose }: { herb: Herb | null; isOpen: boolean; onClose: () => void }) => {
  if (!herb) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-background/95 backdrop-blur-md border-accent/30">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-accent mb-4">
            {herb.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Image */}
          <div className="relative h-64 rounded-lg overflow-hidden">
            <img
              src={herb.imageUrl}
              alt={herb.altText}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/50 to-transparent" />
          </div>

          {/* Latin Name */}
          <p className="text-lg italic text-muted-foreground text-center">
            {herb.latinName}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 justify-center">
            {herb.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-accent/20 text-accent border-accent/30"
              >
                {tag}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-accent">About</h4>
            <p className="text-muted-foreground leading-relaxed">
              {herb.detailedDescription}
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-accent">Key Benefits</h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {herb.benefits.map((benefit, index) => (
                <li key={index} className="flex items-center text-sm text-muted-foreground">
                  <Sparkles className="w-3 h-3 text-accent mr-2 flex-shrink-0" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          {/* Dosage & Precautions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-accent">Dosage</h4>
              <p className="text-sm text-muted-foreground">{herb.dosage}</p>
            </div>
            <div className="space-y-2">
              <h4 className="text-lg font-semibold text-accent">Precautions</h4>
              <p className="text-sm text-muted-foreground">{herb.precautions}</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const HerbSlider3D = () => {
  const [selectedHerb, setSelectedHerb] = useState<Herb | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const options: EmblaOptionsType = {
    align: "center",
    loop: true,
    dragFree: true,
    containScroll: "trimSnaps",
  };

  const autoplayPlugin = Autoplay({
    delay: 3500,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });

  const handleCardClick = useCallback((herb: Herb) => {
    setSelectedHerb(herb);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedHerb(null);
  }, []);

  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Login Button */}
      <div className="absolute top-8 right-8 z-20">
        <LoginButton />
      </div>

      {/* Floating Particles Background */}
      <FloatingParticles />
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />

      <div className="container mx-auto relative z-10">
        {/* Header */}
        <motion.div 
          className="text-center mb-16 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-flex items-center gap-2 text-accent mb-4"
            whileHover={{ scale: 1.05 }}
          >
            <Leaf className="w-6 h-6" />
            <span className="text-sm font-medium tracking-wider uppercase">Ancient Wisdom</span>
            <Leaf className="w-6 h-6" />
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-glow">
            Featured Healing Plants
          </h2>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Explore our curated collection of powerful medicinal herbs from ancient traditions, 
            where nature's pharmacy meets modern wellness
          </p>
        </motion.div>

        {/* 3D Infinity Slider */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <Carousel
            opts={options}
            plugins={[autoplayPlugin]}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {herbsData.map((herb, index) => (
                <CarouselItem 
                  key={herb.slug} 
                  className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="h-[420px]"
                  >
                    <HerbCard herb={herb} onCardClick={handleCardClick} />
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Navigation Buttons */}
            <CarouselPrevious className="hidden lg:flex -left-16 bg-background/20 backdrop-blur-sm border-accent/30 hover:bg-accent/20 hover:border-accent text-accent" />
            <CarouselNext className="hidden lg:flex -right-16 bg-background/20 backdrop-blur-sm border-accent/30 hover:bg-accent/20 hover:border-accent text-accent" />
          </Carousel>
        </motion.div>

        {/* Bottom Call to Action */}
        <motion.div 
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <p className="text-lg text-muted-foreground mb-6">
            Discover thousands more plants in our comprehensive database
          </p>
          <motion.div 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              size="lg"
              className="bg-accent/10 border-accent/30 text-accent hover:bg-accent/20 hover:border-accent hover:shadow-glow"
            >
              <Leaf className="w-5 h-5 mr-2" />
              View Full Database
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </div>

      {/* Herb Details Modal */}
      <HerbModal 
        herb={selectedHerb}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </section>
  );
};

export default HerbSlider3D;