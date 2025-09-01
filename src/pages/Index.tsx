import { useState } from 'react';
import FoodAnalyzer from '@/components/FoodAnalyzer';
import NutritionDashboard from '@/components/NutritionDashboard';
import MealLogger from '@/components/MealLogger';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dumbbell, Camera, BookOpen, Sparkles } from 'lucide-react';
import { type NutritionData } from '@/lib/food-recognition';
import { motion, AnimatePresence } from 'framer-motion';

const Index = () => {
  const [latestAnalysis, setLatestAnalysis] = useState<NutritionData | null>(null);

  const handleAnalysisComplete = (data: NutritionData) => {
    setLatestAnalysis(data);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <motion.header 
        className="relative overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2 }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-20 sm:py-24">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.div 
              className="flex items-center justify-center gap-4 mb-8"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <motion.div 
                className="w-20 h-20 rounded-3xl gradient-primary shadow-primary flex items-center justify-center relative"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
                animate={{ 
                  boxShadow: [
                    "0 4px 14px 0 hsl(16 100% 66% / 0.25)",
                    "0 8px 28px 0 hsl(16 100% 66% / 0.35)",
                    "0 4px 14px 0 hsl(16 100% 66% / 0.25)"
                  ]
                }}
              >
                <Dumbbell className="w-10 h-10 text-white" />
                <motion.div
                  className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-yellow-400 flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <Sparkles className="w-3 h-3 text-white" />
                </motion.div>
              </motion.div>
              
              <motion.div 
                className="text-left"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
              >
                <motion.h1 
                  className="text-5xl sm:text-6xl font-bold gradient-text mb-2"
                  animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                  transition={{ duration: 8, repeat: Infinity }}
                >
                  NutriCapture
                </motion.h1>
                <motion.p 
                  className="text-xl text-muted-foreground font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  AI-Powered Food Analysis
                </motion.p>
              </motion.div>
            </motion.div>
            
            <motion.p 
              className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              Snap a photo of your food and instantly get detailed nutrition information 
              to fuel your fitness journey with precision and confidence
            </motion.p>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <motion.main 
        className="max-w-7xl mx-auto px-4 pb-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        <Tabs defaultValue="analyze" className="space-y-10">
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <TabsList className="glass-card p-1.5 bg-card/50 backdrop-blur-xl">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <TabsTrigger value="analyze" className="flex items-center gap-2 px-6 py-3">
                  <Camera className="w-4 h-4" />
                  Analyze
                </TabsTrigger>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <TabsTrigger value="dashboard" className="flex items-center gap-2 px-6 py-3">
                  <Dumbbell className="w-4 h-4" />
                  Dashboard
                </TabsTrigger>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <TabsTrigger value="log" className="flex items-center gap-2 px-6 py-3">
                  <BookOpen className="w-4 h-4" />
                  Meal Log
                </TabsTrigger>
              </motion.div>
            </TabsList>
          </motion.div>

          <AnimatePresence mode="wait">
            <TabsContent value="analyze" className="space-y-10">
              <motion.div 
                className="max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <FoodAnalyzer onAnalysisComplete={handleAnalysisComplete} />
              </motion.div>
              
              <AnimatePresence>
                {latestAnalysis && (
                  <motion.div 
                    className="max-w-4xl mx-auto"
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -30, scale: 0.95 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <motion.h2 
                      className="text-3xl font-bold mb-8 text-center gradient-text"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      ✨ Analysis Results
                    </motion.h2>
                    <NutritionDashboard data={latestAnalysis} />
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="dashboard" className="space-y-10">
              <motion.div 
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div 
                  className="text-center mb-10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-4xl font-bold mb-4 gradient-text">Nutrition Dashboard</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Track your daily macro goals and nutrition intake with precision analytics
                  </p>
                </motion.div>
                <NutritionDashboard data={latestAnalysis} />
              </motion.div>
            </TabsContent>

            <TabsContent value="log" className="space-y-10">
              <motion.div 
                className="max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div 
                  className="text-center mb-10"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-4xl font-bold mb-4 gradient-text">Meal Logger</h2>
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    Keep track of your daily meals and monitor your nutrition progress over time
                  </p>
                </motion.div>
                <MealLogger latestAnalysis={latestAnalysis} />
              </motion.div>
            </TabsContent>
          </AnimatePresence>
        </Tabs>
      </motion.main>

      {/* Footer */}
      <motion.footer 
        className="border-t border-border bg-card/30 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 py-10">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            <motion.div 
              className="flex items-center justify-center gap-3 mb-3"
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <Dumbbell className="w-6 h-6 text-primary" />
              </motion.div>
              <span className="font-bold text-lg gradient-text">NutriCapture</span>
            </motion.div>
            <p className="text-muted-foreground">
              AI-powered nutrition tracking for fitness enthusiasts • Built with ❤️ for your health journey
            </p>
          </motion.div>
        </div>
      </motion.footer>
    </div>
  );
};

export default Index;