import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Globe, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface PlantScan {
  id: string;
  plant_image_url: string;
  common_name: string | null;
  scientific_name: string | null;
  is_favorite: boolean;
  is_public: boolean;
  created_at: string;
}

export default function MyScans() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [scans, setScans] = useState<PlantScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }

    fetchScans();
  }, [user, navigate]);

  const fetchScans = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('plant_scans')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error loading scans",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setScans(data || []);
    }
    setLoading(false);
  };

  const toggleFavorite = async (scanId: string, currentValue: boolean) => {
    const { error } = await supabase
      .from('plant_scans')
      .update({ is_favorite: !currentValue })
      .eq('id', scanId);

    if (error) {
      toast({
        title: "Error updating favorite",
        description: error.message,
        variant: "destructive",
      });
    } else {
      fetchScans();
    }
  };

  const togglePublic = async (scanId: string, currentValue: boolean) => {
    const { error } = await supabase
      .from('plant_scans')
      .update({ is_public: !currentValue })
      .eq('id', scanId);

    if (error) {
      toast({
        title: "Error updating visibility",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: currentValue ? "Scan made private" : "Scan made public",
        description: currentValue ? "Your scan is now private" : "Your scan is now visible to everyone",
      });
      fetchScans();
    }
  };

  const deleteScan = async (scanId: string) => {
    const { error } = await supabase
      .from('plant_scans')
      .delete()
      .eq('id', scanId);

    if (error) {
      toast({
        title: "Error deleting scan",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Scan deleted",
        description: "Your scan has been removed",
      });
      fetchScans();
    }
    setDeleteId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">My Plant Scans</h1>
          <p className="text-muted-foreground">
            {scans.length} {scans.length === 1 ? 'scan' : 'scans'} in your collection
          </p>
        </motion.div>

        {scans.length === 0 ? (
          <Card className="p-12 text-center">
            <CardContent>
              <p className="text-muted-foreground mb-4">
                You haven't scanned any plants yet
              </p>
              <Button onClick={() => navigate('/')}>Start Scanning</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scans.map((scan, index) => (
              <motion.div
                key={scan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48">
                    <img
                      src={scan.plant_image_url}
                      alt={scan.common_name || 'Plant scan'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <Button
                        size="icon"
                        variant={scan.is_favorite ? "default" : "secondary"}
                        className="h-8 w-8"
                        onClick={() => toggleFavorite(scan.id, scan.is_favorite)}
                      >
                        <Heart className={`h-4 w-4 ${scan.is_favorite ? 'fill-current' : ''}`} />
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-1">
                      {scan.common_name || 'Unknown Plant'}
                    </h3>
                    {scan.scientific_name && (
                      <p className="text-sm text-muted-foreground italic mb-3">
                        {scan.scientific_name}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <Badge variant={scan.is_public ? "default" : "secondary"}>
                        {scan.is_public ? <Globe className="h-3 w-3 mr-1" /> : <Eye className="h-3 w-3 mr-1" />}
                        {scan.is_public ? 'Public' : 'Private'}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => togglePublic(scan.id, scan.is_public)}
                        >
                          {scan.is_public ? 'Make Private' : 'Make Public'}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setDeleteId(scan.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
      <Footer />

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Scan</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this scan? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteId && deleteScan(deleteId)}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
