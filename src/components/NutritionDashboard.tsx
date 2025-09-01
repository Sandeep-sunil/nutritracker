import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Flame, Dumbbell, Wheat, Droplets } from 'lucide-react';
import { type NutritionData } from '@/lib/food-recognition';

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
      <Card className="glass-card">
        <CardContent className="p-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
              <Flame className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Analysis Yet</h3>
            <p className="text-muted-foreground">
              Upload a food photo to see detailed nutrition information
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const macroData = [
    {
      name: 'Calories',
      value: data.nutrition.calories,
      goal: dailyGoals.calories,
      unit: 'cal',
      color: 'text-primary',
      bgColor: 'bg-primary/20',
      icon: Flame
    },
    {
      name: 'Protein',
      value: data.nutrition.protein,
      goal: dailyGoals.protein,
      unit: 'g',
      color: 'text-protein',
      bgColor: 'bg-protein/20',
      icon: Dumbbell
    },
    {
      name: 'Carbs',
      value: data.nutrition.carbs,
      goal: dailyGoals.carbs,
      unit: 'g',
      color: 'text-carbs',
      bgColor: 'bg-carbs/20',
      icon: Wheat
    },
    {
      name: 'Fats',
      value: data.nutrition.fats,
      goal: dailyGoals.fats,
      unit: 'g',
      color: 'text-fats',
      bgColor: 'bg-fats/20',
      icon: Droplets
    }
  ];

  return (
    <div className="space-y-4">
      {/* Food Detection Header */}
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">{data.food}</CardTitle>
              <p className="text-sm text-muted-foreground">
                Detected with {Math.round(data.confidence * 100)}% confidence
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {data.nutrition.calories}
              </div>
              <div className="text-xs text-muted-foreground">calories</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Macro Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {macroData.map((macro) => {
          const percentage = Math.min((macro.value / macro.goal) * 100, 100);
          const Icon = macro.icon;
          
          return (
            <Card key={macro.name} className="glass-card">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${macro.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-5 h-5 ${macro.color}`} />
                    </div>
                    <div>
                      <div className="font-semibold">{macro.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {macro.value}{macro.unit} / {macro.goal}{macro.unit}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-bold ${macro.color}`}>
                      {macro.value}{macro.unit}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {percentage.toFixed(0)}%
                    </div>
                  </div>
                </div>
                
                <Progress 
                  value={percentage} 
                  className="h-2"
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default NutritionDashboard;