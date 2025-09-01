import { useState } from 'react';
import FoodAnalyzer from '@/components/FoodAnalyzer';
import NutritionDashboard from '@/components/NutritionDashboard';
import MealLogger from '@/components/MealLogger';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dumbbell, Camera, BookOpen } from 'lucide-react';
import { type NutritionData } from '@/lib/food-recognition';

const Index = () => {
  const [latestAnalysis, setLatestAnalysis] = useState<NutritionData | null>(null);

  const handleAnalysisComplete = (data: NutritionData) => {
    setLatestAnalysis(data);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-xl gradient-primary shadow-primary flex items-center justify-center">
                <Dumbbell className="w-8 h-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-4xl sm:text-5xl font-bold gradient-text">
                  NutriCapture
                </h1>
                <p className="text-lg text-muted-foreground font-medium">
                  AI-Powered Food Analysis
                </p>
              </div>
            </div>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Snap a photo of your food and instantly get detailed nutrition information 
              to fuel your fitness journey
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <Tabs defaultValue="analyze" className="space-y-8">
          <div className="flex justify-center">
            <TabsList className="glass-card p-1">
              <TabsTrigger value="analyze" className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                Analyze
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="log" className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                Meal Log
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="analyze" className="space-y-8">
            <div className="max-w-2xl mx-auto">
              <FoodAnalyzer onAnalysisComplete={handleAnalysisComplete} />
            </div>
            {latestAnalysis && (
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-center">Analysis Results</h2>
                <NutritionDashboard data={latestAnalysis} />
              </div>
            )}
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Nutrition Dashboard</h2>
                <p className="text-muted-foreground">
                  Track your daily macro goals and nutrition intake
                </p>
              </div>
              <NutritionDashboard data={latestAnalysis} />
            </div>
          </TabsContent>

          <TabsContent value="log" className="space-y-8">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Meal Logger</h2>
                <p className="text-muted-foreground">
                  Keep track of your daily meals and nutrition progress
                </p>
              </div>
              <MealLogger latestAnalysis={latestAnalysis} />
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Dumbbell className="w-5 h-5 text-primary" />
              <span className="font-bold">NutriCapture</span>
            </div>
            <p className="text-sm text-muted-foreground">
              AI-powered nutrition tracking for fitness enthusiasts
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;