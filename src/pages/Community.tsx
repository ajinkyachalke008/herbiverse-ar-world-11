import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Discovery {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  image_url: string;
  plant_name: string | null;
  likes_count: number;
  comments_count: number;
  created_at: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
    full_name: string | null;
  };
}

interface Comment {
  id: string;
  comment: string;
  created_at: string;
  profiles: {
    username: string | null;
    avatar_url: string | null;
  };
}

export default function Community() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [discoveries, setDiscoveries] = useState<Discovery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiscovery, setSelectedDiscovery] = useState<Discovery | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [userLikes, setUserLikes] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchDiscoveries();
    if (user) {
      fetchUserLikes();
    }

    // Subscribe to realtime updates
    const likesChannel = supabase
      .channel('discovery_likes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'discovery_likes',
        },
        () => {
          fetchDiscoveries();
          if (user) fetchUserLikes();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(likesChannel);
    };
  }, [user]);

  const fetchDiscoveries = async () => {
    const { data, error } = await supabase
      .from('community_discoveries')
      .select(`
        *,
        profiles (
          username,
          avatar_url,
          full_name
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Error loading discoveries",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setDiscoveries(data || []);
    }
    setLoading(false);
  };

  const fetchUserLikes = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('discovery_likes')
      .select('discovery_id')
      .eq('user_id', user.id);

    if (data) {
      setUserLikes(new Set(data.map(like => like.discovery_id)));
    }
  };

  const toggleLike = async (discoveryId: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to like discoveries",
        variant: "destructive",
      });
      return;
    }

    const isLiked = userLikes.has(discoveryId);

    if (isLiked) {
      await supabase
        .from('discovery_likes')
        .delete()
        .eq('discovery_id', discoveryId)
        .eq('user_id', user.id);
    } else {
      await supabase
        .from('discovery_likes')
        .insert({ discovery_id: discoveryId, user_id: user.id });
    }
  };

  const openDiscovery = async (discovery: Discovery) => {
    setSelectedDiscovery(discovery);
    
    const { data } = await supabase
      .from('discovery_comments')
      .select(`
        *,
        profiles (
          username,
          avatar_url
        )
      `)
      .eq('discovery_id', discovery.id)
      .order('created_at', { ascending: true });

    setComments(data || []);
  };

  const addComment = async () => {
    if (!user || !selectedDiscovery || !newComment.trim()) return;

    const { error } = await supabase
      .from('discovery_comments')
      .insert({
        discovery_id: selectedDiscovery.id,
        user_id: user.id,
        comment: newComment.trim(),
      });

    if (error) {
      toast({
        title: "Error adding comment",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setNewComment('');
      openDiscovery(selectedDiscovery);
      fetchDiscoveries();
    }
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
          <h1 className="text-4xl font-bold mb-2">Community Discoveries</h1>
          <p className="text-muted-foreground">
            Explore plant discoveries shared by the community
          </p>
        </motion.div>

        {discoveries.length === 0 ? (
          <Card className="p-12 text-center">
            <CardContent>
              <p className="text-muted-foreground">
                No discoveries yet. Be the first to share!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {discoveries.map((discovery, index) => (
              <motion.div
                key={discovery.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => openDiscovery(discovery)}
                >
                  <div className="relative h-48">
                    <img
                      src={discovery.image_url}
                      alt={discovery.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{discovery.title}</h3>
                    {discovery.plant_name && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {discovery.plant_name}
                      </p>
                    )}

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={discovery.profiles.avatar_url || ''} />
                          <AvatarFallback className="text-xs">
                            {(discovery.profiles.username || 'U')[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-muted-foreground">
                          @{discovery.profiles.username || 'anonymous'}
                        </span>
                      </div>
                    </div>

                    {discovery.location && (
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4 mr-1" />
                        {discovery.location}
                      </div>
                    )}

                    <div className="flex items-center space-x-4 text-sm">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 h-auto"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleLike(discovery.id);
                        }}
                      >
                        <Heart
                          className={`h-4 w-4 mr-1 ${
                            userLikes.has(discovery.id) ? 'fill-current text-red-500' : ''
                          }`}
                        />
                        {discovery.likes_count}
                      </Button>
                      <div className="flex items-center text-muted-foreground">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        {discovery.comments_count}
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

      <Dialog open={!!selectedDiscovery} onOpenChange={() => setSelectedDiscovery(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{selectedDiscovery?.title}</DialogTitle>
          </DialogHeader>
          {selectedDiscovery && (
            <div className="space-y-4">
              <img
                src={selectedDiscovery.image_url}
                alt={selectedDiscovery.title}
                className="w-full h-64 object-cover rounded-lg"
              />
              
              {selectedDiscovery.description && (
                <p className="text-muted-foreground">{selectedDiscovery.description}</p>
              )}

              <div className="flex items-center space-x-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleLike(selectedDiscovery.id)}
                >
                  <Heart
                    className={`h-4 w-4 mr-2 ${
                      userLikes.has(selectedDiscovery.id) ? 'fill-current text-red-500' : ''
                    }`}
                  />
                  {selectedDiscovery.likes_count} Likes
                </Button>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-semibold mb-4">Comments ({comments.length})</h4>
                <ScrollArea className="h-48 mb-4">
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="flex space-x-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={comment.profiles.avatar_url || ''} />
                          <AvatarFallback>
                            {(comment.profiles.username || 'U')[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm font-semibold">
                            @{comment.profiles.username || 'anonymous'}
                          </p>
                          <p className="text-sm text-muted-foreground">{comment.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {user && (
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addComment()}
                    />
                    <Button onClick={addComment}>Post</Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
