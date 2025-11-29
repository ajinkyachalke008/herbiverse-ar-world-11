import React, { useState, useRef, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Scan, 
  Camera, 
  Image as ImageIcon, 
  FileImage, 
  X, 
  RefreshCw, 
  Check,
  AlertCircle,
  Info,
  Save,
  Share2
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PlantIdentificationCard from "./PlantIdentificationCard";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ScanPlantButtonProps {
  variant?: "hero" | "default" | "outline";
  size?: "sm" | "default" | "lg" | "xl";
  className?: string;
}

const ScanPlantButton: React.FC<ScanPlantButtonProps> = ({ 
  variant = "hero", 
  size = "xl", 
  className = "" 
}) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showPermissionHelper, setShowPermissionHelper] = useState(false);
  const [isCameraLoading, setIsCameraLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<'en' | 'mr'>('en');
  const [plantData, setPlantData] = useState<any>(null);
  const [showResults, setShowResults] = useState(false);
  const [savedScanId, setSavedScanId] = useState<string | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [shareTitle, setShareTitle] = useState('');
  const [shareDescription, setShareDescription] = useState('');
  const [shareLocation, setShareLocation] = useState('');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Detect mobile device
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

  // Bilingual text
  const text = {
    en: {
      scanPlant: "Scan a Plant",
      camera: "Camera — Take Photo",
      gallery: "Gallery — Choose Photo", 
      files: "Files — Browse",
      cancel: "Cancel",
      permissionHelper: "We need access to your camera to take a photo. We won't store it without your permission.",
      allow: "Allow Camera",
      denied: "Camera access denied. To use camera, allow camera permission in your browser settings.",
      noCamera: "Camera not available. Please use Gallery or Files instead.",
      processing: "Processing image...",
      captured: "Image captured! Detection coming soon 🌱",
      retake: "Retake / Choose Another",
      useImage: "Use This Image",
      fileName: "Selected File",
      unsupportedFile: "Please select an image file (JPG, PNG, WEBP)",
      cameraError: "Camera error. Please try again or use Gallery/Files."
    },
    mr: {
      scanPlant: "वनस्पती स्कॅन करा",
      camera: "कॅमेरा — फोटो घ्या",
      gallery: "गॅलरी — फोटो निवडा",
      files: "फाइल्स — ब्राउझ करा", 
      cancel: "रद्द करा",
      permissionHelper: "कॅमेरा वापरण्यास आम्हाला परवानगी हवी आहे — फोटो घेण्यासाठी. तुमची प्रतिना आम्ही परवानगीशिवाय जपणार नाही.",
      allow: "कॅमेरा अनुमती द्या",
      denied: "कॅमेरा प्रवेश नाकारला. कॅमेरा वापरण्यासाठी, आपल्या ब्राउझर सेटिंग्जमध्ये कॅमेरा परवानगी द्या.",
      noCamera: "कॅमेरा उपलब्ध नाही. कृपया गॅलरी किंवा फाइल्स वापरा.",
      processing: "प्रतिमा प्रक्रिया करत आहे...",
      captured: "फोटो घेतला! ओळख सुविधा लवकर येत आहे 🌱",
      retake: "पुन्हा घ्या / दुसरी निवडा",
      useImage: "ही प्रतिमा वापरा",
      fileName: "निवडलेली फाइल",
      unsupportedFile: "कृपया प्रतिमा फाइल निवडा (JPG, PNG, WEBP)",
      cameraError: "कॅमेरा त्रुटी. कृपया पुन्हा प्रयत्न करा किंवा गॅलरी/फाइल्स वापरा."
    }
  };

  const resetState = useCallback(() => {
    setShowActionSheet(false);
    setShowCamera(false);
    setShowPermissionHelper(false);
    setCapturedImage(null);
    setImageFile(null);
    setIsProcessing(false);
    setError(null);
    setPlantData(null);
    setShowResults(false);
    
    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  const handleScanClick = () => {
    setIsOpen(true);
    setShowActionSheet(true);
  };

  const handleClose = () => {
    resetState();
    setIsOpen(false);
  };

  const handleCameraOption = async () => {
    setShowActionSheet(false);
    setError(null);
    
    // On mobile, use native camera input for instant access
    if (isMobile) {
      console.log('📱 Mobile detected - using native camera input');
      nativeCameraInputRef.current?.click();
    } else {
      // On desktop, use web camera API
      await handleAllowCamera();
    }
  };

  const handleAllowCamera = async () => {
    setShowPermissionHelper(false);
    setIsCameraLoading(true);
    setError(null);
    
    console.log('🎥 Attempting camera access...');
    
    try {
      // Check if camera is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error('❌ Camera API not supported');
        throw new Error('Camera not supported');
      }

      console.log('✅ Camera API supported, requesting stream...');
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        } 
      });
      
      console.log('✅ Camera stream obtained:', stream);
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
        console.log('✅ Camera view activated');
      }
    } catch (err: any) {
      console.error('❌ Camera access error:', err.name, err.message);
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError(text[language].denied);
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setError(text[language].noCamera);
      } else {
        setError(text[language].cameraError);
      }
      setShowActionSheet(true);
    } finally {
      setIsCameraLoading(false);
    }
  };

  const capturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas.getContext('2d');
    
    if (!context) return;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8);
    setCapturedImage(imageDataUrl);
    setShowCamera(false);
    
    // Stop camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    toast({
      title: "📸 Photo Captured!",
      description: text[language].captured,
      duration: 3000,
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>, isGallery = false) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError(text[language].unsupportedFile);
      toast({
        title: "❌ Invalid File Type",
        description: text[language].unsupportedFile,
        variant: "destructive",
        duration: 4000,
      });
      return;
    }
    
    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      const errorMsg = language === 'en' 
        ? 'Image too large. Please select an image smaller than 10MB.' 
        : 'प्रतिमा खूप मोठी आहे. कृपया 10MB पेक्षा लहान प्रतिमा निवडा.';
      setError(errorMsg);
      toast({
        title: "❌ File Too Large",
        description: errorMsg,
        variant: "destructive",
        duration: 4000,
      });
      return;
    }
    
    setError(null);
    setImageFile(file);
    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setCapturedImage(e.target?.result as string);
      setShowActionSheet(false);
      setIsProcessing(false);
      
      toast({
        title: isGallery ? "🖼️ Image Selected from Gallery" : "📁 File Selected",
        description: text[language].captured,
        duration: 3000,
      });
    };
    reader.onerror = () => {
      setError(language === 'en' ? 'Failed to read image file' : 'प्रतिमा फाइल वाचता आली नाही');
      setIsProcessing(false);
    };
    reader.readAsDataURL(file);
  };

  const handleGalleryOption = () => {
    galleryInputRef.current?.click();
  };

  const handleFilesOption = () => {
    fileInputRef.current?.click();
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setImageFile(null);
    setShowActionSheet(true);
  };

  const handleUseImage = async () => {
    if (!capturedImage) return;
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // First upload image to storage if user is logged in
      let imageUrl = capturedImage;
      
      if (user && imageFile) {
        const fileExt = imageFile.name.split('.').pop();
        const fileName = `${user.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('plant-images')
          .upload(fileName, imageFile);
        
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('plant-images')
            .getPublicUrl(fileName);
          imageUrl = publicUrl;
        }
      }

      // Call edge function with authentication
      const { data, error: functionError } = await supabase.functions.invoke('identify-plant', {
        body: { image: capturedImage }
      });

      if (functionError) {
        throw new Error(functionError.message || 'Failed to identify plant');
      }

      if (!data || !data.success) {
        throw new Error(data?.error || 'Failed to identify plant');
      }

      const identifiedPlant = data.data;
      
      // Save to database if user is logged in
      if (user) {
        const { data: scanData, error: dbError } = await supabase
          .from('plant_scans')
          .insert({
            user_id: user.id,
            plant_image_url: imageUrl,
            common_name: identifiedPlant.commonName,
            scientific_name: identifiedPlant.scientificName,
            family: identifiedPlant.family,
            confidence: identifiedPlant.confidence,
            identification: identifiedPlant.identification,
            medicinal_uses: identifiedPlant.medicinalUses,
            active_compounds: identifiedPlant.activeCompounds,
            preparation: identifiedPlant.preparation,
            dosage: identifiedPlant.dosage,
            safety_warnings: identifiedPlant.safetyWarnings,
            habitat: identifiedPlant.habitat,
            cultural_significance: identifiedPlant.culturalSignificance,
            conservation_status: identifiedPlant.conservationStatus,
          })
          .select()
          .single();
        
        if (!dbError && scanData) {
          setSavedScanId(scanData.id);
        }
      }
      
      // Show results card
      setPlantData(identifiedPlant);
      setShowResults(true);
      
      toast({
        title: `🌿 ${identifiedPlant.commonName}`,
        description: `${identifiedPlant.scientificName} - Confidence: ${identifiedPlant.confidence}`,
        duration: 5000,
      });
    } catch (err) {
      console.error('Plant identification error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to identify plant';
      setError(errorMessage);
      
      toast({
        title: "❌ Identification Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveToFavorites = async () => {
    if (!savedScanId || !user) return;

    const { error } = await supabase
      .from('plant_scans')
      .update({ is_favorite: true })
      .eq('id', savedScanId);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Saved to Favorites!",
        description: "Added to your favorite plants collection",
      });
    }
  };

  const handleShareToCommunity = () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to share discoveries",
        variant: "destructive",
      });
      return;
    }
    setShareTitle(plantData?.commonName || '');
    setShowShareDialog(true);
  };

  const submitShareToCommunity = async () => {
    if (!user || !savedScanId || !capturedImage) return;

    try {
      const { error } = await supabase
        .from('community_discoveries')
        .insert({
          user_id: user.id,
          scan_id: savedScanId,
          title: shareTitle,
          description: shareDescription,
          location: shareLocation,
          image_url: capturedImage,
          plant_name: plantData?.commonName,
        });

      if (error) throw error;

      // Make scan public
      await supabase
        .from('plant_scans')
        .update({ is_public: true })
        .eq('id', savedScanId);

      toast({
        title: "Shared to Community!",
        description: "Your discovery is now visible to everyone",
      });

      setShowShareDialog(false);
      setShareTitle('');
      setShareDescription('');
      setShareLocation('');
    } catch (err) {
      toast({
        title: "Sharing Failed",
        description: err instanceof Error ? err.message : "Failed to share",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Button 
        variant={variant} 
        size={size} 
        className={`group ${className}`}
        onClick={handleScanClick}
      >
        <Scan className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
        {text[language].scanPlant}
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md mx-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="flex items-center">
                <Scan className="w-5 h-5 mr-2 text-primary" />
                {text[language].scanPlant}
              </span>
              <div className="flex items-center space-x-2">
                <Badge 
                  variant={language === 'en' ? 'default' : 'outline'} 
                  className="cursor-pointer text-xs"
                  onClick={() => setLanguage('en')}
                >
                  EN
                </Badge>
                <Badge 
                  variant={language === 'mr' ? 'default' : 'outline'} 
                  className="cursor-pointer text-xs"
                  onClick={() => setLanguage('mr')}
                >
                  मर
                </Badge>
              </div>
            </DialogTitle>
          </DialogHeader>

          <AnimatePresence mode="wait">
            {/* Camera Loading State */}
            {isCameraLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4 py-8 text-center"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="inline-block"
                >
                  <Camera className="w-12 h-12 text-primary" />
                </motion.div>
                <p className="text-muted-foreground">
                  {language === 'en' ? 'Opening camera...' : 'कॅमेरा उघडत आहे...'}
                </p>
              </motion.div>
            )}

            {/* Action Sheet */}
            {showActionSheet && !isCameraLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-14 text-left"
                  onClick={handleCameraOption}
                >
                  <Camera className="w-5 h-5 mr-3 text-blue-500" />
                  <span>{text[language].camera}</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-14 text-left"
                  onClick={handleGalleryOption}
                >
                  <ImageIcon className="w-5 h-5 mr-3 text-green-500" />
                  <span>{text[language].gallery}</span>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start h-14 text-left"
                  onClick={handleFilesOption}
                >
                  <FileImage className="w-5 h-5 mr-3 text-purple-500" />
                  <span>{text[language].files}</span>
                </Button>
                
                <Button 
                  variant="ghost" 
                  className="w-full"
                  onClick={handleClose}
                >
                  {text[language].cancel}
                </Button>
              </motion.div>
            )}

            {/* Permission Helper */}
            {showPermissionHelper && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    {text[language].permissionHelper}
                  </AlertDescription>
                </Alert>
                
                <div className="flex space-x-3">
                  <Button 
                    className="flex-1"
                    onClick={handleAllowCamera}
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {text[language].allow}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setShowPermissionHelper(false)}
                  >
                    {text[language].cancel}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Camera View */}
            {showCamera && !isCameraLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="space-y-4"
              >
                <div className="relative rounded-lg overflow-hidden bg-black">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-64 object-cover"
                  />
                  <div className="absolute inset-0 border-2 border-dashed border-white/50 m-4 rounded-lg pointer-events-none" />
                </div>
                
                <div className="flex justify-center space-x-3">
                  <Button 
                    size="lg"
                    onClick={capturePhoto}
                    className="rounded-full w-16 h-16"
                  >
                    <Camera className="w-6 h-6" />
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowCamera(false);
                      setShowActionSheet(true);
                    }}
                  >
                    {text[language].cancel}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Image Preview */}
            {capturedImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="relative">
                  {/* Neon Green Glow Preview */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="relative rounded-2xl overflow-hidden border-2 border-green-400 ring-4 ring-green-500/50"
                  >
                    {/* Animated pulse glow */}
                    <motion.div
                      animate={{ 
                        boxShadow: [
                          '0 0 20px rgba(34,197,94,0.6)',
                          '0 0 30px rgba(34,197,94,0.8)',
                          '0 0 20px rgba(34,197,94,0.6)'
                        ]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute inset-0 pointer-events-none rounded-2xl"
                      style={{ boxShadow: '0 0 20px rgba(34,197,94,0.6)' }}
                    />
                    
                    <img 
                      src={capturedImage} 
                      alt="Captured plant" 
                      className="w-full h-64 object-cover"
                    />
                    
                    {/* Success Caption Overlay */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-green-500/90 to-green-600/90 backdrop-blur-sm py-3 px-4 rounded-b-2xl"
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Check className="w-5 h-5 text-white" />
                        <p className="text-white font-medium text-center text-sm">
                          Photo captured successfully! Ready to scan 🌱
                        </p>
                      </div>
                    </motion.div>
                    
                    {imageFile && (
                      <Badge className="absolute top-2 left-2 bg-green-500/90 text-white border-green-400">
                        {text[language].fileName}: {imageFile.name}
                      </Badge>
                    )}
                  </motion.div>
                </div>

                {isProcessing ? (
                  <div className="text-center py-4">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="inline-block"
                    >
                      <RefreshCw className="w-8 h-8 text-primary" />
                    </motion.div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {text[language].processing}
                    </p>
                  </div>
                ) : (
                  <>
                    <Alert>
                      <Check className="h-4 w-4" />
                      <AlertDescription>
                        {text[language].captured}
                      </AlertDescription>
                    </Alert>

                    <div className="flex space-x-3">
                      <Button 
                        variant="outline" 
                        className="flex-1"
                        onClick={handleRetake}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        {text[language].retake}
                      </Button>
                      <Button 
                        className="flex-1"
                        onClick={handleUseImage}
                      >
                        <Check className="w-4 h-4 mr-2" />
                        {text[language].useImage}
                      </Button>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* Error State */}
            {error && !isCameraLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                
                <div className="flex space-x-3">
                  <Button 
                    variant="default" 
                    className="flex-1"
                    onClick={() => {
                      setError(null);
                      handleCameraOption();
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {language === 'en' ? 'Try Camera Again' : 'पुन्हा प्रयत्न करा'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setError(null);
                      setShowActionSheet(true);
                    }}
                  >
                    {text[language].cancel}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Results Display */}
            {showResults && plantData && capturedImage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <PlantIdentificationCard
                  plantData={plantData}
                  imageUrl={capturedImage}
                  onClose={handleClose}
                />
                
                {user && savedScanId && (
                  <div className="flex gap-2">
                    <Button onClick={handleSaveToFavorites} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Save to Favorites
                    </Button>
                    <Button onClick={handleShareToCommunity} variant="outline" className="flex-1">
                      <Share2 className="w-4 h-4 mr-2" />
                      Share
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Hidden File Inputs */}
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic"
            className="hidden"
            onChange={(e) => handleFileSelect(e, true)}
          />
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/heic"
            className="hidden"
            onChange={(e) => handleFileSelect(e, false)}
          />
          
          {/* Gallery input */}
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleFileSelect(e, true)}
          />
          
          {/* Native camera input for instant mobile camera access */}
          <input
            ref={nativeCameraInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handleFileSelect(e, false)}
          />
          
          <canvas ref={canvasRef} className="hidden" />
        </DialogContent>
      </Dialog>

      {/* Share to Community Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Share to Community</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={shareTitle} onChange={(e) => setShareTitle(e.target.value)} />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea value={shareDescription} onChange={(e) => setShareDescription(e.target.value)} />
            </div>
            <div>
              <Label>Location</Label>
              <Input value={shareLocation} onChange={(e) => setShareLocation(e.target.value)} placeholder="City, State" />
            </div>
            <Button onClick={submitShareToCommunity} className="w-full">Share Discovery</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScanPlantButton;