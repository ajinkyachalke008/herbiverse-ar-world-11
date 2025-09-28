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
            className="relative px-6 py-2 bg-gradient-to-br from-primary via-primary-glow to-accent text-primary-foreground rounded-full font-semibold text-sm shadow-lg hover:shadow-[0_0_20px_hsl(var(--primary-glow)/0.4)] transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-accent/50 focus:ring-offset-1 overflow-hidden border-0"
          >
              {/* Magical glow effect */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-glow via-accent to-primary opacity-80" />
              <div className="absolute inset-[-3px] rounded-full bg-gradient-to-r from-accent via-primary-glow to-accent opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-500 animate-pulse" />
              <div className="absolute inset-[-6px] rounded-full bg-gradient-to-r from-primary-glow/50 via-accent/50 to-primary-glow/50 opacity-0 group-hover:opacity-75 blur-lg transition-opacity duration-700 animate-pulse" />
              
              {/* Button content */}
              <div className="relative z-10 flex items-center justify-center gap-3">
                {showSuccess ? (
                  <>
                    <Leaf className="w-6 h-6 animate-bounce text-accent-foreground" />
                    <span className="text-accent-foreground">Success!</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-6 h-6" />
                    <span>Join Herbiverse</span>
                  </>
                )}
              </div>
              
              {/* Inner glow */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-accent/20 to-primary-glow/20 group-hover:from-accent/30 group-hover:to-primary-glow/30 transition-all duration-300" />
              
              {/* Floating particles effect */}
              <div className="absolute inset-0 rounded-full overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-accent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      left: `${20 + i * 12}%`,
                      top: `${25 + (i % 2) * 50}%`,
                      animation: `float 3s infinite ${i * 0.5}s ease-in-out`
                    }}
                  />
                ))}
              </div>
            </Button>
            
            {/* Success confetti effect */}
            {showSuccess && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 rounded-full animate-bounce"
                    style={{
                      backgroundColor: `hsl(${140 + i * 20} 70% 50%)`,
                      left: `${10 + i * 8}%`,
                      top: `${10 + (i % 3) * 30}%`,
                      animationDelay: `${i * 0.1}s`,
                      animationDuration: "1s"
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