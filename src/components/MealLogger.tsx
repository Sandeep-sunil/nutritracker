import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Clock, Trash2, Target } from 'lucide-react';
import { type NutritionData } from '@/lib/food-recognition';
import { format } from 'date-fns';

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
    <div className="space-y-4">
      {/* Daily Summary */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg">Today's Progress</CardTitle>
            </div>
            {latestAnalysis && (
              <Button 
                onClick={addMeal} 
                size="sm"
                className="gradient-primary shadow-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Log Meal
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {dailyTotals.count > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{dailyTotals.calories}</div>
                <div className="text-xs text-muted-foreground">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-protein">{dailyTotals.protein}g</div>
                <div className="text-xs text-muted-foreground">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-carbs">{dailyTotals.carbs}g</div>
                <div className="text-xs text-muted-foreground">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-fats">{dailyTotals.fats}g</div>
                <div className="text-xs text-muted-foreground">Fats</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-muted flex items-center justify-center">
                <Target className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No meals logged today</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Meal History */}
      {meals.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Meal History</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-0">
              {meals.map((meal, index) => (
                <div key={meal.id}>
                  <div className="p-4 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                          <Clock className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-semibold">{meal.data.food}</div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="secondary" className="text-xs">
                              {getMealTimeLabel(meal.timestamp)}
                            </Badge>
                            <span>{format(meal.timestamp, 'h:mm a')}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right text-sm">
                          <div className="font-semibold">{meal.data.nutrition.calories} cal</div>
                          <div className="text-muted-foreground">
                            P:{meal.data.nutrition.protein}g C:{meal.data.nutrition.carbs}g F:{meal.data.nutrition.fats}g
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeMeal(meal.id)}
                          className="text-destructive hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  {index < meals.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default MealLogger;