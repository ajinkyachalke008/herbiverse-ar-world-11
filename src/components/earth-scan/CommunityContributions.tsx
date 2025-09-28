import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Camera, MapPin, Upload, User, Award } from 'lucide-react';
import { enhancedPlantData } from './PlantMarkers';

interface CommunityContributionsProps {
  onAddSighting: (sighting: any) => void;
  userXP: number;
  userLevel: number;
  onXPGain: (xp: number) => void;
}

const CommunityContributions: React.FC<CommunityContributionsProps> = ({
  onAddSighting,
  userXP,
  userLevel,
  onXPGain
}) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    plantName: '',
    location: '',
    notes: '',
    photo: null as File | null,
    confidence: 'medium'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.plantName || !formData.location) {
      toast({
        title: "Incomplete Submission",
        description: "Please fill in plant name and location.",
        variant: "destructive"
      });
      return;
    }

    // Create new sighting
    const newSighting = {
      id: Date.now(),
      plantName: formData.plantName,
      location: formData.location,
      notes: formData.notes,
      confidence: formData.confidence,
      contributor: `Explorer_${userLevel}`,
      timestamp: new Date().toISOString(),
      status: 'pending', // pending, verified, rejected
      xpReward: formData.confidence === 'high' ? 50 : formData.confidence === 'medium' ? 30 : 20
    };

    onAddSighting(newSighting);
    
    // Award XP
    onXPGain(newSighting.xpReward);
    
    toast({
      title: "Sighting Submitted! 🌿",
      description: `+${newSighting.xpReward} XP earned! Your contribution helps build the Living Herbal Atlas.`,
      duration: 4000,
    });

    // Reset form
    setFormData({
      plantName: '',
      location: '',
      notes: '',
      photo: null,
      confidence: 'medium'
    });
    
    setIsOpen(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  const getConfidenceBadge = (confidence: string) => {
    switch (confidence) {
      case 'high':
        return <Badge variant="default" className="bg-green-500">High Confidence (+50 XP)</Badge>;
      case 'medium':
        return <Badge variant="secondary">Medium Confidence (+30 XP)</Badge>;
      case 'low':
        return <Badge variant="outline">Low Confidence (+20 XP)</Badge>;
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
          <MapPin className="w-4 h-4 mr-2" />
          Add Plant Sighting
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Camera className="w-5 h-5 text-primary" />
            <span>Contribute to the Living Herbal Atlas</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex items-center space-x-4 p-4 bg-muted rounded-lg mb-4">
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Explorer Level {userLevel}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">{userXP} XP</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="plantName">Plant Name</Label>
            <Select value={formData.plantName} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, plantName: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Select or search for a plant" />
              </SelectTrigger>
              <SelectContent>
                {enhancedPlantData.map((plant) => (
                  <SelectItem key={plant.id} value={plant.name}>
                    {plant.name} ({plant.scientific})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              placeholder="City, Country or GPS coordinates"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="confidence">Identification Confidence</Label>
            <Select value={formData.confidence} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, confidence: value }))
            }>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High - I'm certain this is correct</SelectItem>
                <SelectItem value="medium">Medium - I'm fairly confident</SelectItem>
                <SelectItem value="low">Low - I'm not sure, need verification</SelectItem>
              </SelectContent>
            </Select>
            <div className="mt-1">
              {getConfidenceBadge(formData.confidence)}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="photo">Photo (Optional)</Label>
            <div className="flex items-center space-x-2">
              <Input
                id="photo"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="flex-1"
              />
              <Upload className="w-4 h-4 text-muted-foreground" />
            </div>
            {formData.photo && (
              <p className="text-sm text-muted-foreground">
                Selected: {formData.photo.name}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Describe the habitat, growing conditions, or any special observations..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>
          
          <div className="bg-blue-50 dark:bg-blue-950 p-3 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Community Guidelines:</strong> Your contributions help researchers and communities 
              worldwide. Photos and locations will be verified by our expert botanists before being 
              added to the public atlas.
            </p>
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Submit Sighting
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CommunityContributions;