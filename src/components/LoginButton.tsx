import { LogIn, Leaf, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LoginButton = () => {
  const navigate = useNavigate();
  const { user, profile, signOut } = useAuth();

  const handleLogin = () => {
    navigate('/auth');
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  // If user is logged in, show profile dropdown
  if (user) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10 border-2 border-primary/30">
              <AvatarImage src={profile?.avatar_url || undefined} alt={profile?.full_name || 'User'} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {profile?.full_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center justify-start gap-2 p-2">
            <div className="flex flex-col space-y-1 leading-none">
              {profile?.full_name && (
                <p className="font-medium">{profile.full_name}</p>
              )}
              {profile?.username && (
                <p className="text-sm text-muted-foreground">@{profile.username}</p>
              )}
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/my-scans')}>
            My Scans
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigate('/community')}>
            Community
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout} className="text-destructive">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  // If user is not logged in, show login button
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative group">
          <Button
            onClick={handleLogin}
            className="relative px-8 py-3 bg-gradient-to-br from-primary via-primary-glow to-accent text-primary-foreground rounded-full font-bold text-base shadow-[0_0_30px_hsl(var(--primary-glow)/0.6)] hover:shadow-[0_0_50px_hsl(var(--primary-glow)/0.8)] transition-all duration-300 hover:scale-110 focus:ring-4 focus:ring-accent/60 focus:ring-offset-2 overflow-visible border-2 border-accent/30"
          >
            {/* Magical glow effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary-glow via-accent to-primary opacity-90 animate-pulse" />
            <div className="absolute inset-[-4px] rounded-full bg-gradient-to-r from-accent via-primary-glow to-accent opacity-60 group-hover:opacity-100 blur-lg transition-opacity duration-500 animate-pulse" />
            <div className="absolute inset-[-8px] rounded-full bg-gradient-to-r from-primary-glow/60 via-accent/60 to-primary-glow/60 opacity-40 group-hover:opacity-90 blur-xl transition-opacity duration-700 animate-pulse" />
            
            {/* Button content */}
            <div className="relative z-10 flex items-center justify-center gap-3">
              <LogIn className="w-7 h-7 drop-shadow-[0_0_8px_hsl(var(--primary-foreground))]" />
              <span className="drop-shadow-[0_0_8px_hsl(var(--primary-foreground))]">Join Herbiverse</span>
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
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="bg-card border border-border">
        <p>Login / Create account</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default LoginButton;
