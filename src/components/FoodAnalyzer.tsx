import { useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Camera, Upload, Loader2, X } from 'lucide-react';
import { analyzeFoodImage, type NutritionData } from '@/lib/food-recognition';
import { useToast } from '@/hooks/use-toast';

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
    <Card className="glass-card">
      <CardContent className="p-6">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">Analyze Your Food</h2>
          <p className="text-muted-foreground">
            Upload or take a photo to get instant nutrition information
          </p>
        </div>

        {selectedImage ? (
          <div className="relative mb-4">
            <img 
              src={selectedImage} 
              alt="Selected food" 
              className="w-full h-64 object-cover rounded-lg"
            />
            <Button
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2"
              onClick={clearImage}
              disabled={isAnalyzing}
            >
              <X className="w-4 h-4" />
            </Button>
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                  <p className="text-white font-medium">Analyzing food...</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            className={`
              border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200
              ${dragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}
            `}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="max-w-sm mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="text-lg font-semibold mb-2">Drop your food photo here</h3>
              <p className="text-muted-foreground text-sm mb-6">
                or click to browse from your device
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                  className="hidden"
                  id="food-upload"
                />
                <label htmlFor="food-upload">
                  <Button variant="default" className="gradient-primary shadow-primary" asChild>
                    <span className="cursor-pointer">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Photo
                    </span>
                  </Button>
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
                  <Button variant="secondary" asChild>
                    <span className="cursor-pointer">
                      <Camera className="w-4 h-4 mr-2" />
                      Take Photo
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FoodAnalyzer;