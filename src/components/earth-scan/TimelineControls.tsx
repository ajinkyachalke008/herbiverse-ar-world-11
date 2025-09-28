import React from 'react';
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Clock, Play, Pause, RotateCcw } from 'lucide-react';

interface TimelineControlsProps {
  timeValue: number[];
  onTimeChange: (value: number[]) => void;
  isPlaying: boolean;
  onPlayPause: () => void;
  onReset: () => void;
}

const TimelineControls: React.FC<TimelineControlsProps> = ({
  timeValue,
  onTimeChange,
  isPlaying,
  onPlayPause,
  onReset
}) => {
  const getTimeLabel = (value: number) => {
    if (value < 25) return "Ancient Times (Before 1000 CE)";
    if (value < 50) return "Historical Era (1000-1800 CE)";
    if (value < 75) return "Modern Era (1800-2000 CE)";
    return "Future Predictions (2000+ CE)";
  };

  const getTimeDescription = (value: number) => {
    if (value < 25) return "Traditional medicine origins";
    if (value < 50) return "Trade route expansion";
    if (value < 75) return "Scientific documentation";
    return "Climate change impact";
  };

  return (
    <div className="flex-1 max-w-lg mx-8 bg-background/90 backdrop-blur-sm rounded-2xl px-6 py-4 border border-primary/20">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Timeline Navigator</span>
          </div>
          
          {/* Control buttons */}
          <div className="flex items-center space-x-2">
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
              onClick={onReset}
              className="h-8 w-8 p-0"
            >
              <RotateCcw className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Current period info */}
        <div className="text-center space-y-1">
          <h4 className="font-semibold text-primary">{getTimeLabel(timeValue[0])}</h4>
          <p className="text-xs text-muted-foreground">{getTimeDescription(timeValue[0])}</p>
        </div>

        {/* Timeline slider */}
        <div className="space-y-3">
          <Slider
            value={timeValue}
            onValueChange={onTimeChange}
            max={100}
            step={1}
            className="w-full"
          />
          
          {/* Timeline markers */}
          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <div className="text-center">
              <div className="w-1 h-1 bg-muted-foreground/50 rounded-full mx-auto mb-1"></div>
              <span>Ancient</span>
            </div>
            <div className="text-center">
              <div className="w-1 h-1 bg-muted-foreground/50 rounded-full mx-auto mb-1"></div>
              <span>Historical</span>
            </div>
            <div className="text-center">
              <div className="w-1 h-1 bg-muted-foreground/50 rounded-full mx-auto mb-1"></div>
              <span>Modern</span>
            </div>
            <div className="text-center">
              <div className="w-1 h-1 bg-muted-foreground/50 rounded-full mx-auto mb-1"></div>
              <span>Future</span>
            </div>
          </div>
        </div>

        {/* Effects indicator */}
        <div className="flex items-center justify-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              timeValue[0] < 50 ? 'bg-yellow-500 animate-pulse' : 'bg-muted-foreground/30'
            }`}></div>
            <span className="text-muted-foreground">Historical Data</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${
              timeValue[0] >= 75 ? 'bg-blue-500 animate-pulse' : 'bg-muted-foreground/30'
            }`}></div>
            <span className="text-muted-foreground">AI Predictions</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimelineControls;