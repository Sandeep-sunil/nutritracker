import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Flame, Dumbbell, Wheat, Droplets, TrendingUp, Award } from 'lucide-react';
import { type NutritionData } from '@/lib/food-recognition';
import { motion, AnimatePresence } from 'framer-motion';

interface NutritionDashboardProps {
  data: NutritionData | null;
  dailyGoals?: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

const NutritionDashboard = ({ 
  data, 
  dailyGoals = { calories: 2000, protein: 150, carbs: 200, fats: 65 } 
}: NutritionDashboardProps) => {
  if (!data) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass-card">
          <CardContent className="p-8">
            <motion.div 
              className="text-center py-16"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <motion.div 
                className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-muted/50 flex items-center justify-center"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Flame className="w-10 h-10 text-muted-foreground" />
              </motion.div>
              <h3 className="text-2xl font-semibold mb-3">No Analysis Yet</h3>
              <p className="text-muted-foreground text-lg max-w-md mx-auto">
                Upload a food photo to see detailed nutrition information and macro breakdown
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return { color: 'text-green-400', bg: 'bg-green-400/20', border: 'border-green-400/30' };
    if (confidence >= 0.7) return { color: 'text-yellow-400', bg: 'bg-yellow-400/20', border: 'border-yellow-400/30' };
    return { color: 'text-red-400', bg: 'bg-red-400/20', border: 'border-red-400/30' };
  };

  const confidenceStyle = getConfidenceColor(data.confidence);

  const macroData = [
    {
      name: 'Calories',
      value: data.nutrition.calories,
      goal: dailyGoals.calories,
      unit: 'cal',
      color: 'text-primary',
      bgColor: 'bg-primary/20',
      gradient: 'from-primary/20 to-primary/5',
      icon: Flame,
      emoji: '🔥'
    },
    {
      name: 'Protein',
      value: data.nutrition.protein,
      goal: dailyGoals.protein,
      unit: 'g',
      color: 'text-protein',
      bgColor: 'bg-protein/20',
      gradient: 'from-protein/20 to-protein/5',
      icon: Dumbbell,
      emoji: '🥩'
    },
    {
      name: 'Carbs',
      value: data.nutrition.carbs,
      goal: dailyGoals.carbs,
      unit: 'g',
      color: 'text-carbs',
      bgColor: 'bg-carbs/20',
      gradient: 'from-carbs/20 to-carbs/5',
      icon: Wheat,
      emoji: '🍞'
    },
    {
      name: 'Fats',
      value: data.nutrition.fats,
      goal: dailyGoals.fats,
      unit: 'g',
      color: 'text-fats',
      bgColor: 'bg-fats/20',
      gradient: 'from-fats/20 to-fats/5',
      icon: Droplets,
      emoji: '🥑'
    }
  ];

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Food Detection Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <Card className="glass-card overflow-hidden">
          <CardHeader className="pb-4">
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-4">
                <motion.div 
                  className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <span className="text-2xl">🍽️</span>
                </motion.div>
                <div>
                  <CardTitle className="text-2xl mb-1">{data.food}</CardTitle>
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={`${confidenceStyle.bg} ${confidenceStyle.border} ${confidenceStyle.color} border`}
                    >
                      <Award className="w-3 h-3 mr-1" />
                      {Math.round(data.confidence * 100)}% confidence
                    </Badge>
                    <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              
              <motion.div 
                className="text-right"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, type: "spring" }}
              >
                <motion.div 
                  className="text-4xl font-bold text-primary mb-1"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                >
                  {data.nutrition.calories}
                </motion.div>
                <div className="text-sm text-muted-foreground">total calories</div>
              </motion.div>
            </motion.div>
          </CardHeader>
        </Card>
      </motion.div>

      {/* Macro Breakdown */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, staggerChildren: 0.1 }}
      >
        {macroData.map((macro, index) => {
          const percentage = Math.min((macro.value / macro.goal) * 100, 100);
          const Icon = macro.icon;
          
          return (
            <motion.div
              key={macro.name}
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ 
                delay: 0.3 + index * 0.1, 
                duration: 0.5,
                type: "spring",
                stiffness: 100 
              }}
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.2 }
              }}
            >
              <Card className="glass-card overflow-hidden h-full">
                <CardContent className="p-6">
                  {/* Gradient background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${macro.gradient} opacity-50`} />
                  
                  <div className="relative">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <motion.div 
                          className={`w-14 h-14 rounded-2xl ${macro.bgColor} flex items-center justify-center relative`}
                          whileHover={{ scale: 1.1, rotate: 10 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <span className="text-xl">{macro.emoji}</span>
                          <motion.div
                            className="absolute inset-0 rounded-2xl"
                            animate={{
                              boxShadow: [
                                `0 0 0 0 hsl(var(--${macro.name.toLowerCase()}) / 0.4)`,
                                `0 0 0 10px hsl(var(--${macro.name.toLowerCase()}) / 0)`,
                              ]
                            }}
                            transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                          />
                        </motion.div>
                        
                        <div>
                          <motion.h4 
                            className="font-semibold text-lg mb-1"
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                          >
                            {macro.name}
                          </motion.h4>
                          <motion.p 
                            className="text-sm text-muted-foreground"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 + index * 0.1 }}
                          >
                            {macro.value}{macro.unit} of {macro.goal}{macro.unit}
                          </motion.p>
                        </div>
                      </div>
                      
                      <motion.div 
                        className="text-right"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + index * 0.1 }}
                      >
                        <motion.div 
                          className={`text-2xl font-bold ${macro.color} mb-1`}
                          animate={percentage > 80 ? { scale: [1, 1.05, 1] } : {}}
                          transition={{ duration: 1.5, repeat: percentage > 80 ? Infinity : 0, delay: 2 }}
                        >
                          {macro.value}{macro.unit}
                        </motion.div>
                        <Badge variant="secondary" className="text-xs">
                          {percentage.toFixed(0)}% of goal
                        </Badge>
                      </motion.div>
                    </div>
                    
                    <motion.div
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: 0.7 + index * 0.1, duration: 0.8 }}
                      className="origin-left"
                    >
                      <Progress 
                        value={percentage} 
                        className="h-3 bg-muted/30"
                      />
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
};

export default NutritionDashboard;