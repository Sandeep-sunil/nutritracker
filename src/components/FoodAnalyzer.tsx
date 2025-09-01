import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Loader2, X, Image as ImageIcon } from 'lucide-react';
import { analyzeFoodImage, type NutritionData } from '@/lib/food-recognition';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

interface FoodAnalyzerProps {
  onAnalysisComplete?: (data: NutritionData) => void;
}

const FoodAnalyzer = ({ onAnalysisComplete }: FoodAnalyzerProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const { toast } = useToast();

  const handleFileSelect = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Invalid file type',
        description: 'Please select an image file',
        variant: 'destructive',
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 10MB',
        variant: 'destructive',
      });
      return;
    }

    // Show preview
    const imageUrl = URL.createObjectURL(file);
    setSelectedImage(imageUrl);
    setIsAnalyzing(true);

    try {
      console.log('Starting food analysis...');
      const result = await analyzeFoodImage(file);
      console.log('Analysis result:', result);
      
      onAnalysisComplete?.(result);
      
      toast({
        title: 'Analysis complete!',
        description: `Detected ${result.food} with ${Math.round(result.confidence * 100)}% confidence`,
      });
    } catch (error) {
      console.error('Food analysis error:', error);
      toast({
        title: 'Analysis failed',
        description: 'Could not analyze the image. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsAnalyzing(false);
    }
  }, [onAnalysisComplete, toast]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files[0]) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
  }, []);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const clearImage = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
      setSelectedImage(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card overflow-hidden">
        <CardContent className="p-8">
          <motion.div 
            className="text-center mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-3 gradient-text">Analyze Your Food</h2>
            <p className="text-muted-foreground text-lg">
              Upload or take a photo to get instant nutrition information
            </p>
          </motion.div>

          <AnimatePresence mode="wait">
            {selectedImage ? (
              <motion.div
                key="image-preview"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative mb-4"
              >
                <div className="relative overflow-hidden rounded-2xl">
                  <img 
                    src={selectedImage} 
                    alt="Selected food" 
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                  onClick={clearImage}
                  disabled={isAnalyzing}
                >
                  <X className="w-5 h-5" />
                </motion.button>
                
                <AnimatePresence>
                  {isAnalyzing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                    >
                      <motion.div 
                        className="text-center bg-black/40 backdrop-blur-md rounded-2xl p-8 border border-white/10"
                        initial={{ scale: 0.8, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="w-12 h-12 mx-auto mb-4"
                        >
                          <Loader2 className="w-12 h-12 text-primary" />
                        </motion.div>
                        <h3 className="text-white font-semibold text-lg mb-2">Analyzing Food...</h3>
                        <p className="text-white/80 text-sm">Our AI is identifying nutrients</p>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <motion.div
                key="upload-area"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  className={`
                    relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 overflow-hidden
                    ${dragActive 
                      ? 'border-primary bg-primary/10 scale-[1.02]' 
                      : 'border-border hover:border-primary/50 hover:bg-primary/5'
                    }
                  `}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  whileHover={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  {/* Background pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/20" />
                  </div>
                  
                  <div className="relative max-w-md mx-auto">
                    <motion.div 
                      className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-primary/20 flex items-center justify-center relative"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    >
                      <motion.div
                        animate={dragActive ? { scale: [1, 1.2, 1] } : {}}
                        transition={{ duration: 0.6, repeat: dragActive ? Infinity : 0 }}
                      >
                        <ImageIcon className="w-10 h-10 text-primary" />
                      </motion.div>
                      
                      {/* Floating icons animation */}
                      <motion.div
                        className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary/30 flex items-center justify-center"
                        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                        transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      >
                        <Camera className="w-3 h-3 text-primary" />
                      </motion.div>
                    </motion.div>
                    
                    <motion.h3 
                      className="text-2xl font-semibold mb-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {dragActive ? 'Drop it here!' : 'Drop your food photo here'}
                    </motion.h3>
                    
                    <motion.p 
                      className="text-muted-foreground text-base mb-8"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      or click to browse from your device
                    </motion.p>
                    
                    <motion.div 
                      className="flex flex-col sm:flex-row gap-4 justify-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileInputChange}
                        className="hidden"
                        id="food-upload"
                      />
                      <label htmlFor="food-upload">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="default" className="gradient-primary shadow-primary px-6 py-3" asChild>
                            <span className="cursor-pointer">
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Photo
                            </span>
                          </Button>
                        </motion.div>
                      </label>
                      
                      <input
                        type="file"
                        accept="image/*"
                        capture="environment"
                        onChange={handleFileInputChange}
                        className="hidden"
                        id="food-camera"
                      />
                      <label htmlFor="food-camera">
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <Button variant="secondary" className="px-6 py-3" asChild>
                            <span className="cursor-pointer">
                              <Camera className="w-4 h-4 mr-2" />
                              Take Photo
                            </span>
                          </Button>
                        </motion.div>
                      </label>
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FoodAnalyzer;