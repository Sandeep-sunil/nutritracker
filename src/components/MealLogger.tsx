import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Clock, Trash2, Target, CalendarDays } from 'lucide-react';
import { type NutritionData } from '@/lib/food-recognition';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface MealEntry {
  id: string;
  timestamp: Date;
  data: NutritionData;
}

interface MealLoggerProps {
  latestAnalysis: NutritionData | null;
}

const MealLogger = ({ latestAnalysis }: MealLoggerProps) => {
  const [meals, setMeals] = useState<MealEntry[]>([]);

  const addMeal = () => {
    if (!latestAnalysis) return;

    const newMeal: MealEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      data: latestAnalysis
    };

    setMeals(prev => [newMeal, ...prev]);
  };

  const removeMeal = (id: string) => {
    setMeals(prev => prev.filter(meal => meal.id !== id));
  };

  const getDailyTotals = () => {
    const today = new Date().toDateString();
    const todayMeals = meals.filter(meal => 
      meal.timestamp.toDateString() === today
    );

    return todayMeals.reduce(
      (totals, meal) => ({
        calories: totals.calories + meal.data.nutrition.calories,
        protein: totals.protein + meal.data.nutrition.protein,
        carbs: totals.carbs + meal.data.nutrition.carbs,
        fats: totals.fats + meal.data.nutrition.fats,
        count: totals.count + 1
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0, count: 0 }
    );
  };

  const getMealTimeLabel = (date: Date) => {
    const hour = date.getHours();
    if (hour < 10) return 'Breakfast';
    if (hour < 14) return 'Lunch';
    if (hour < 18) return 'Snack';
    return 'Dinner';
  };

  const dailyTotals = getDailyTotals();

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Daily Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="glass-card overflow-hidden">
          <CardHeader className="pb-4">
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center gap-3">
                <motion.div 
                  className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Target className="w-6 h-6 text-primary" />
                </motion.div>
                <div>
                  <CardTitle className="text-xl">Today's Progress</CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center gap-1">
                    <CalendarDays className="w-4 h-4" />
                    {format(new Date(), 'EEEE, MMMM do')}
                  </p>
                </div>
              </div>
              {latestAnalysis && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button 
                    onClick={addMeal} 
                    size="sm"
                    className="gradient-primary shadow-primary px-4"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Log Meal
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </CardHeader>
          <CardContent className="pt-0">
            <AnimatePresence mode="wait">
              {dailyTotals.count > 0 ? (
                <motion.div
                  key="daily-stats"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="grid grid-cols-2 md:grid-cols-4 gap-4"
                >
                  {[
                    { label: 'Calories', value: dailyTotals.calories, unit: '', color: 'text-primary', emoji: '🔥' },
                    { label: 'Protein', value: dailyTotals.protein, unit: 'g', color: 'text-protein', emoji: '🥩' },
                    { label: 'Carbs', value: dailyTotals.carbs, unit: 'g', color: 'text-carbs', emoji: '🍞' },
                    { label: 'Fats', value: dailyTotals.fats, unit: 'g', color: 'text-fats', emoji: '🥑' }
                  ].map((stat, index) => (
                    <motion.div 
                      key={stat.label}
                      className="text-center p-4 rounded-xl bg-gradient-to-br from-muted/30 to-muted/10"
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="text-xs mb-1">{stat.emoji}</div>
                      <motion.div 
                        className={`text-2xl font-bold ${stat.color} mb-1`}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 2, repeat: Infinity, delay: index * 0.5 + 1 }}
                      >
                        {stat.value}{stat.unit}
                      </motion.div>
                      <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="text-center py-12"
                >
                  <motion.div 
                    className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/50 flex items-center justify-center"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Target className="w-8 h-8 text-muted-foreground" />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-2">No meals logged today</h3>
                  <p className="text-muted-foreground">Start by analyzing a food photo!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Meal History */}
      <AnimatePresence>
        {meals.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass-card overflow-hidden">
              <CardHeader className="pb-3">
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary" />
                    Meal History
                  </CardTitle>
                </motion.div>
              </CardHeader>
              <CardContent className="p-0">
                <motion.div className="space-y-0">
                  <AnimatePresence>
                    {meals.map((meal, index) => (
                      <motion.div
                        key={meal.id}
                        initial={{ opacity: 0, x: -20, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 20, scale: 0.95 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: index * 0.1,
                          type: "spring",
                          stiffness: 100
                        }}
                        layout
                      >
                        <motion.div 
                          className="p-6 hover:bg-secondary/30 transition-colors cursor-pointer relative overflow-hidden"
                          whileHover={{ backgroundColor: "hsl(var(--secondary) / 0.3)" }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <motion.div 
                                className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center"
                                whileHover={{ scale: 1.1, rotate: 10 }}
                                transition={{ type: "spring", stiffness: 300 }}
                              >
                                <span className="text-lg">🍽️</span>
                              </motion.div>
                              <div>
                                <motion.h4 
                                  className="font-semibold text-lg mb-1"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ delay: 0.2 }}
                                >
                                  {meal.data.food}
                                </motion.h4>
                                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                  <Badge variant="secondary" className="text-xs px-2 py-1">
                                    {getMealTimeLabel(meal.timestamp)}
                                  </Badge>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {format(meal.timestamp, 'h:mm a')}
                                  </span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                              <motion.div 
                                className="text-right text-sm"
                                initial={{ opacity: 0, x: 10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                              >
                                <div className="font-semibold text-lg text-primary mb-1">
                                  {meal.data.nutrition.calories} cal
                                </div>
                                <div className="text-muted-foreground text-xs">
                                  P: {meal.data.nutrition.protein}g • C: {meal.data.nutrition.carbs}g • F: {meal.data.nutrition.fats}g
                                </div>
                              </motion.div>
                              
                              <motion.div
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removeMeal(meal.id)}
                                  className="text-destructive hover:bg-destructive/10 w-10 h-10 p-0 rounded-xl"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </motion.div>
                            </div>
                          </div>
                        </motion.div>
                        {index < meals.length - 1 && (
                          <motion.div
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                            className="origin-left"
                          >
                            <Separator className="mx-6" />
                          </motion.div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MealLogger;