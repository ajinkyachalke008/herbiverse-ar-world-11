import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Leaf, Globe, Heart, Github, Twitter, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-card/50 backdrop-blur-sm border-t border-border mt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center space-x-2">
              <motion.div 
                className="w-10 h-10 rounded-full bg-gradient-glow flex items-center justify-center"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Leaf className="w-6 h-6 text-accent-foreground" />
              </motion.div>
              <span className="text-xl font-bold text-glow">Herbiverse</span>
            </div>
            <p className="text-muted-foreground">
              Bridging ancient herbal wisdom with modern technology for a healthier future.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="hover:text-accent">
                <Github className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-accent">
                <Twitter className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="hover:text-accent">
                <Mail className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>

          {/* Explore Section */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-accent">Explore</h3>
            <ul className="space-y-2">
              {["Plant Scanner", "Herb Database", "3D Garden", "Earth Scan", "Community Map"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Learn Section */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-accent">Learn</h3>
            <ul className="space-y-2">
              {["AYUSH Systems", "Plant Identification", "Medicinal Properties", "Preparation Methods", "Safety Guidelines"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Connect Section */}
          <motion.div 
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h3 className="text-lg font-semibold text-accent">Connect</h3>
            <ul className="space-y-2">
              {["Community Forum", "Expert Consultations", "Research Papers", "Newsletter", "Support"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* References & Resources Section */}
        <motion.div 
          className="mt-12 pt-8 border-t border-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold text-accent mb-4">References & Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              "Indian Medicinal Plants Database (FRLHT)",
              "OSADHI Database",
              "IMPPAT Database",
              "Medicinal Plant Database (Botanical Survey of India)",
              "Rig Veda (Medicinal Plants Section)",
              "Atharva Veda (Medicinal Plants Section)",
              "Yajur Veda (Medicinal Plants Section)",
              "Charaka Samhita",
              "Sushruta Samhita",
              "Padma Purana",
              "Vishnu Purana and Other Puranas",
              "E-Charak Knowledge Resources (Ministry of AYUSH)",
              "ENVIS Database (FRLHT Environmental Information System on Medicinal Plants)",
              "Central Council for Research in Ayurvedic Sciences (CCRAS) Resources"
            ].map((resource, index) => (
              <div key={index} className="text-sm text-muted-foreground flex items-start space-x-2">
                <span className="text-accent mt-0.5">•</span>
                <span>{resource}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Website Builder Information */}
        <motion.div 
          className="mt-12 pt-8 border-t border-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-semibold text-accent mb-4">Website Builder</h3>
          <div className="bg-card/30 backdrop-blur-sm rounded-lg p-6 border border-border">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Name</p>
                <p className="text-foreground font-medium">Ajinkya Arun Chalke</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">College</p>
                <p className="text-foreground font-medium">Government College of Engineering, Karad</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Contact</p>
                <p className="text-foreground font-medium">9270134411</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <a href="mailto:ajinkyachalke008@gmail.com" className="text-accent hover:underline font-medium">
                  ajinkyachalke008@gmail.com
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Section */}
        <motion.div 
          className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground text-sm mb-4 md:mb-0">
            © 2025 Herbiverse. Empowering natural healing through technology.
          </p>
          <div className="flex items-center space-x-6 text-sm">
            <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-muted-foreground hover:text-accent transition-colors">
              Cookie Policy
            </a>
          </div>
        </motion.div>

        {/* Environmental Message */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center space-x-2 text-sm text-accent">
            <Heart className="w-4 h-4" />
            <span>Made with care for our planet and its healing plants</span>
            <Globe className="w-4 h-4" />
          </div>
        </motion.div>

        {/* Futuristic Signature */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          viewport={{ once: true }}
        >
          <motion.div
            className="inline-block text-glow animate-pulse-glow"
            animate={{ 
              textShadow: [
                "0 0 10px hsl(var(--accent)), 0 0 20px hsl(var(--accent))",
                "0 0 20px hsl(var(--accent)), 0 0 30px hsl(var(--accent)), 0 0 40px hsl(var(--primary))",
                "0 0 10px hsl(var(--accent)), 0 0 20px hsl(var(--accent))"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-xl font-bold bg-gradient-glow bg-clip-text text-transparent">
              ✨ Made by Ajinkya ✨
            </span>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;