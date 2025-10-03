import React, { useState } from "react";
import { LogIn, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import LoginModal from "./LoginModal";

const LoginButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLoginSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setIsModalOpen(false);
    }, 2000);
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative group">
          <Button
            onClick={() => setIsModalOpen(true)}
            className="relative px-8 py-3 bg-gradient-to-br from-primary via-primary-glow to-accent text-primary-foreground rounded-full font-bold text-base shadow-[0_0_30px_hsl(var(--primary-glow)/0.6)] hover:shadow-[0_0_50px_hsl(var(--primary-glow)/0.8)] transition-all duration-300 hover:scale-110 focus:ring-4 focus:ring-accent/60 focus:ring-offset-2 overflow-visible border-2 border-accent/30"
          >
              {/* Magical glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-glow via-accent to-primary opacity-90 animate-pulse" />
              <div className="absolute inset-[-4px] rounded-full bg-gradient-to-r from-accent via-primary-glow to-accent opacity-60 group-hover:opacity-100 blur-lg transition-opacity duration-500 animate-pulse" />
              <div className="absolute inset-[-8px] rounded-full bg-gradient-to-r from-primary-glow/60 via-accent/60 to-primary-glow/60 opacity-40 group-hover:opacity-90 blur-xl transition-opacity duration-700 animate-pulse" />
              
              {/* Button content */}
              <div className="relative z-10 flex items-center justify-center gap-3">
                {showSuccess ? (
                  <>
                    <Leaf className="w-7 h-7 animate-bounce text-accent-foreground drop-shadow-[0_0_10px_hsl(var(--accent))]" />
                    <span className="text-accent-foreground font-extrabold text-lg drop-shadow-[0_0_15px_hsl(var(--accent))]">Success!</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-7 h-7 drop-shadow-[0_0_8px_hsl(var(--primary-foreground))]" />
                    <span className="drop-shadow-[0_0_8px_hsl(var(--primary-foreground))]">Join Herbiverse</span>
                  </>
                )}
              </div>
              
              {/* Inner glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/30 to-primary-glow/30 group-hover:from-accent/50 group-hover:to-primary-glow/50 transition-all duration-300" />
              
              {/* Floating particles effect */}
              <div className="absolute inset-0 rounded-full overflow-visible pointer-events-none">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-float shadow-[0_0_8px_hsl(var(--accent))]"
                    style={{
                      left: `${15 + i * 12}%`,
                      top: `${20 + (i % 2) * 60}%`,
                      animationDelay: `${i * 0.3}s`
                    }}
                  />
                ))}
              </div>
            </Button>
            
            {/* Success confetti effect */}
            {showSuccess && (
              <div className="absolute inset-0 pointer-events-none overflow-visible z-50">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-3 h-3 rounded-full animate-bounce shadow-[0_0_10px_currentColor]"
                    style={{
                      backgroundColor: `hsl(${140 + i * 15} 80% 60%)`,
                      left: `${-10 + i * 6}%`,
                      top: `${-20 + (i % 4) * 35}%`,
                      animationDelay: `${i * 0.05}s`,
                      animationDuration: "1.2s",
                      transform: `scale(${1 + Math.random() * 0.5})`
                    }}
                  />
                ))}
              </div>
            )}
      </div>
    </TooltipTrigger>
    <TooltipContent side="bottom" className="bg-card border border-border">
      <p>Login / Create account</p>
    </TooltipContent>
    
    <LoginModal 
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      onSuccess={handleLoginSuccess}
    />
  </Tooltip>
  );
};

export default LoginButton;