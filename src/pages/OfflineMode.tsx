import { motion } from 'framer-motion';
import { Download, Wifi, WifiOff, Database, Trash2, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';

const OfflineMode = () => {
  const { status, isDownloading, downloadProgress, downloadData, clearOfflineData } = useOfflineStorage();

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 pt-24 pb-16">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-4xl font-bold text-glow mb-2">📱 Offline Mode</h1>
          <p className="text-muted-foreground">Download plant data for use without internet</p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-6">
          <Card className={`${status.isOnline ? 'border-green-500/50' : 'border-yellow-500/50'}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {status.isOnline ? <Wifi className="w-5 h-5 text-green-500" /> : <WifiOff className="w-5 h-5 text-yellow-500" />}
                Connection Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className={status.isOnline ? 'text-green-400' : 'text-yellow-400'}>
                {status.isOnline ? '✓ Online - Ready to sync' : '⚠ Offline - Using cached data'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Database className="w-5 h-5 text-accent" />Offline Storage</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-card rounded-lg">
                  <p className="text-2xl font-bold text-accent">{status.plantsCount}</p>
                  <p className="text-sm text-muted-foreground">Plants</p>
                </div>
                <div className="p-3 bg-card rounded-lg">
                  <p className="text-2xl font-bold text-accent">{status.recipesCount}</p>
                  <p className="text-sm text-muted-foreground">Recipes</p>
                </div>
                <div className="p-3 bg-card rounded-lg">
                  <p className="text-2xl font-bold text-accent">{status.tipsCount}</p>
                  <p className="text-sm text-muted-foreground">Tips</p>
                </div>
              </div>

              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Storage used: {status.storageUsed}</span>
                <span>Last synced: {status.lastSynced?.toLocaleDateString() || 'Never'}</span>
              </div>

              {isDownloading && (
                <div className="space-y-2">
                  <Progress value={downloadProgress} className="h-2" />
                  <p className="text-sm text-center text-muted-foreground">Downloading... {downloadProgress}%</p>
                </div>
              )}

              <div className="flex gap-4">
                <Button onClick={downloadData} disabled={isDownloading} className="flex-1 bg-gradient-glow">
                  {status.lastSynced ? <><CheckCircle className="w-4 h-4 mr-2" />Update Data</> : <><Download className="w-4 h-4 mr-2" />Download Data</>}
                </Button>
                <Button variant="outline" onClick={clearOfflineData} disabled={isDownloading}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-accent/10 border-accent/30">
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">What's included offline?</h3>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ Seasonal plant calendar & harvest times</li>
                <li>✓ Herbal recipes & preparation guides</li>
                <li>✓ Dosage information & safety warnings</li>
                <li>✓ Daily wellness tips</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default OfflineMode;
