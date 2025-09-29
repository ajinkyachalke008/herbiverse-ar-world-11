import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { 
  Clock, 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward,
  Rewind,
  Calendar,
  BookOpen,
  Leaf,
  Globe
} from 'lucide-react';

interface EnhancedTimelineProps {
  timeValue: number[];
  onTimeChange: (value: number[]) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
}

const EnhancedTimeline: React.FC<EnhancedTimelineProps> = ({
  timeValue,
  onTimeChange,
  isPlaying,
  onPlayPause,
  onReset
}) => {
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showDetails, setShowDetails] = useState(false);

  // Auto-play timeline
  useEffect(() => {
    if (!isPlaying) return;
    
    const interval = setInterval(() => {
      onTimeChange([Math.min(100, timeValue[0] + playbackSpeed)]);
    }, 200 / playbackSpeed);
    
    return () => clearInterval(interval);
  }, [isPlaying, timeValue, playbackSpeed, onTimeChange]);

  const getTimeLabel = (value: number) => {
    if (value < 25) return "Ancient Era";
    if (value < 50) return "Historical Period";
    if (value < 75) return "Modern Era";
    return "Future Predictions";
  };

  const getTimeRange = (value: number) => {
    if (value < 25) return "Before 1000 CE";
    if (value < 50) return "1000-1800 CE";
    if (value < 75) return "1800-2000 CE";
    return "2000+ CE";
  };

  const getTimeDescription = (value: number) => {
    if (value < 25) return "Traditional medicine origins and ancient wisdom";
    if (value < 50) return "Trade route expansion and knowledge exchange";
    if (value < 75) return "Scientific documentation and botanical research";
    return "Climate change impact and conservation efforts";
  };

  const getHistoricalEvents = (value: number) => {
    if (value < 25) return [
      "3000 BCE: First recorded use of medicinal plants",
      "2700 BCE: Chinese herbal medicine documented",
      "1500 BCE: Ayurvedic traditions established",
      "500 BCE: Hippocrates advocates plant medicine"
    ];
    if (value < 50) return [
      "1000 CE: Islamic Golden Age advances botany",
      "1400 CE: Renaissance herbalism flourishes",
      "1600 CE: Colonial trade spreads plant knowledge",
      "1750 CE: Linnaeus classifies medicinal plants"
    ];
    if (value < 75) return [
      "1800 CE: Modern pharmacology begins",
      "1850 CE: Active compounds first isolated",
      "1900 CE: Pharmaceutical industry emerges",
      "1950 CE: Antibiotic era transforms medicine"
    ];
    return [
      "2000 CE: Genomic studies of medicinal plants",
      "2010 CE: Traditional knowledge digitized",
      "2020 CE: AI-assisted drug discovery",
      "2030 CE: Personalized plant medicine"
    ];
  };

  const getCurrentPhaseIcon = (value: number) => {
    if (value < 25) return <BookOpen className="w-4 h-4" />;
    if (value < 50) return <Globe className="w-4 h-4" />;
    if (value < 75) return <Leaf className="w-4 h-4" />;
    return <Calendar className="w-4 h-4" />;
  };

  return (
    <Card className="w-full max-w-3xl bg-background/95 backdrop-blur-md border-2 border-primary/20 shadow-xl">
      <CardContent className="p-6 space-y-6">
        {/* Enhanced Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {getCurrentPhaseIcon(timeValue[0])}
            </div>
            <div>
              <h3 className="font-bold text-primary">Herbal Knowledge Timeline</h3>
              <p className="text-sm text-muted-foreground">
                Explore 5000+ years of plant medicine evolution
              </p>
            </div>
          </div>
          
          {/* Playback Controls */}
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTimeChange([Math.max(0, timeValue[0] - 10)])}
              className="h-8 w-8 p-0"
            >
              <Rewind className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onPlayPause}
              className="h-8 w-8 p-0"
            >
              {isPlaying ? (
                <Pause className="w-3 h-3" />
              ) : (
                <Play className="w-3 h-3" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTimeChange([Math.min(100, timeValue[0] + 10)])}
              className="h-8 w-8 p-0"
            >
              <FastForward className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Current Period Display */}
        <div className="text-center space-y-2 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
          <div className="flex items-center justify-center space-x-2">
            <Badge variant="outline" className="bg-background/50">
              {getTimeRange(timeValue[0])}
            </Badge>
            <Progress value={timeValue[0]} className="flex-1 max-w-32 h-2" />
            <Badge variant="secondary">
              {timeValue[0].toFixed(0)}%
            </Badge>
          </div>
          <h4 className="text-xl font-bold text-primary">{getTimeLabel(timeValue[0])}</h4>
          <p className="text-sm text-muted-foreground">{getTimeDescription(timeValue[0])}</p>
        </div>

        {/* Enhanced Timeline Slider */}
        <div className="space-y-4">
          <Slider
            value={timeValue}
            onValueChange={onTimeChange}
            max={100}
            step={1}
            className="w-full"
          />
          
          {/* Enhanced Timeline Markers */}
          <div className="relative">
            <div className="flex justify-between items-end px-1">
              {[
                { label: "Ancient", value: 0, icon: "🏛️" },
                { label: "Historical", value: 25, icon: "🛤️" },
                { label: "Modern", value: 50, icon: "🔬" },
                { label: "Future", value: 75, icon: "🌡️" }
              ].map(({ label, value, icon }) => (
                <div 
                  key={label} 
                  className={`text-center cursor-pointer transition-all ${
                    Math.abs(timeValue[0] - value) < 12.5 ? 'scale-110 text-primary' : 'text-muted-foreground'
                  }`}
                  onClick={() => onTimeChange([value + 12.5])}
                >
                  <div className="text-lg mb-1">{icon}</div>
                  <div className={`w-2 h-2 rounded-full mx-auto mb-1 transition-all ${
                    Math.abs(timeValue[0] - value) < 12.5 ? 'bg-primary scale-125' : 'bg-muted-foreground/50'
                  }`}></div>
                  <span className="text-xs font-medium">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Playback Speed Control */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-muted-foreground">Speed:</span>
            {[0.5, 1, 2, 4].map(speed => (
              <Button
                key={speed}
                variant={playbackSpeed === speed ? "default" : "outline"}
                size="sm"
                className="h-6 px-2 text-xs"
                onClick={() => setPlaybackSpeed(speed)}
              >
                {speed}x
              </Button>
            ))}
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="text-xs"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </Button>
        </div>

        {/* Historical Context Panel */}
        {showDetails && (
          <div className="border-t pt-4 space-y-3">
            <h5 className="font-semibold text-sm flex items-center">
              <Calendar className="w-4 h-4 mr-2" />
              Key Historical Events
            </h5>
            <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
              {getHistoricalEvents(timeValue[0]).map((event, index) => (
                <div key={index} className="text-xs p-2 bg-muted/30 rounded border-l-2 border-primary/50">
                  {event}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Effects Indicator */}
        <div className="flex items-center justify-center space-x-6 text-xs">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full transition-all ${
              timeValue[0] < 50 ? 'bg-yellow-500 animate-pulse shadow-lg' : 'bg-muted-foreground/30'
            }`}></div>
            <span className="text-muted-foreground">Historical Data Active</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full transition-all ${
              timeValue[0] >= 75 ? 'bg-blue-500 animate-pulse shadow-lg' : 'bg-muted-foreground/30'
            }`}></div>
            <span className="text-muted-foreground">AI Predictions Mode</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full transition-all ${
              isPlaying ? 'bg-green-500 animate-pulse shadow-lg' : 'bg-muted-foreground/30'
            }`}></div>
            <span className="text-muted-foreground">Time-lapse {isPlaying ? 'Active' : 'Paused'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedTimeline;