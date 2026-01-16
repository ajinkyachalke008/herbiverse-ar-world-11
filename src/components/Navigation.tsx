import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Leaf, Menu, X, User, Camera, Heart, LogOut, Stethoscope, Shield, Mic } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: "Scan Plant", href: "/" },
    { name: "Symptom Checker", href: "/symptom-checker" },
    { name: "Recipes", href: "/herbal-recipes" },
    { name: "Calendar", href: "/seasonal-calendar" },
    { name: "Dosage", href: "/dosage-calculator" },
    { name: "Tips", href: "/wellness-tips" },
  ];

  return (
    <motion.nav 
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-2 cursor-pointer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div 
              className="w-10 h-10 rounded-full bg-gradient-glow flex items-center justify-center"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Leaf className="w-6 h-6 text-accent-foreground" />
            </motion.div>
            <span className="text-xl font-bold text-glow">Herbiverse</span>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-accent transition-colors duration-300 relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {item.name}
                <motion.div 
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-glow scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                />
              </motion.a>
            ))}
          </div>

          {/* User Menu / Login Button */}
          <motion.div 
            className="hidden md:block"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={profile?.avatar_url || ''} />
                      <AvatarFallback>
                        {(profile?.username || profile?.full_name || 'U')[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium">
                        {profile?.full_name || profile?.username || 'User'}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        @{profile?.username || 'anonymous'}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/my-scans')}>
                    <Camera className="mr-2 h-4 w-4" />
                    My Scans
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/community')}>
                    <Heart className="mr-2 h-4 w-4" />
                    Community
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/health-profile')}>
                    <Shield className="mr-2 h-4 w-4" />
                    Health Profile
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate('/auth')} className="bg-gradient-glow">
                Sign In
              </Button>
            )}
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg hover:bg-accent/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {isOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <motion.div 
          className="md:hidden overflow-hidden"
          initial={false}
          animate={{ height: isOpen ? "auto" : 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="py-4 space-y-4 border-t border-border">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="block text-foreground hover:text-accent transition-colors duration-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </motion.a>
            ))}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
              transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
            >
              {user ? (
                <div className="space-y-2">
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate('/profile');
                      setIsOpen(false);
                    }}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      navigate('/my-scans');
                      setIsOpen(false);
                    }}
                  >
                    <Camera className="mr-2 h-4 w-4" />
                    My Scans
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-destructive hover:text-destructive"
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button onClick={() => navigate('/auth')} className="w-full bg-gradient-glow">
                  Sign In
                </Button>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.nav>
  );
};

export default Navigation;