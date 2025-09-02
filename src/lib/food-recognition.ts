import { pipeline, env } from '@huggingface/transformers';

// Configure transformers for browser use
env.allowLocalModels = false;
env.useBrowserCache = true;

export interface NutritionData {
  food: string;
  confidence: number;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
  };
}

// Mock nutrition database for demo purposes
const nutritionDB: Record<string, { calories: number; protein: number; carbs: number; fats: number }> = {
  "banana": { calories: 89, protein: 1.1, carbs: 23, fats: 0.3 },
  "apple": { calories: 52, protein: 0.3, carbs: 14, fats: 0.2 },
  "orange": { calories: 47, protein: 0.9, carbs: 12, fats: 0.1 },
  "pizza": { calories: 266, protein: 11, carbs: 33, fats: 10 },
  "burger": { calories: 354, protein: 16, carbs: 35, fats: 18 },
  "salad": { calories: 33, protein: 3, carbs: 6, fats: 0.3 },
  "chicken": { calories: 165, protein: 31, carbs: 0, fats: 3.6 },
  "bread": { calories: 265, protein: 9, carbs: 49, fats: 3.2 },
  "rice": { calories: 130, protein: 2.7, carbs: 28, fats: 0.3 },
  "pasta": { calories: 131, protein: 5, carbs: 25, fats: 1.1 },
  "sandwich": { calories: 200, protein: 8, carbs: 30, fats: 6 },
  "egg": { calories: 155, protein: 13, carbs: 1.1, fats: 11 },
  "default": { calories: 150, protein: 5, carbs: 20, fats: 5 }
};

let classifier: any = null;

export const initializeFoodRecognition = async () => {
  if (!classifier) {
    console.log('Initializing food recognition model...');
    classifier = await pipeline(
      'image-classification',
      'google/vit-base-patch16-224',
      { device: 'webgpu' }
    );
    console.log('Food recognition model loaded');
  }
  return classifier;
};

export const analyzeFoodImage = async (imageFile: File): Promise<NutritionData> => {
  try {
    console.log('Analyzing food image...');
    
    // Initialize classifier if not already done
    await initializeFoodRecognition();
    
    // Convert file to URL for the classifier
    const imageUrl = URL.createObjectURL(imageFile);
    
    // Run classification
    const results = await classifier(imageUrl);
    console.log('Classification results:', results);
    
    // Clean up the URL
    URL.revokeObjectURL(imageUrl);
    
    if (!results || results.length === 0) {
      throw new Error('No classification results');
    }
    
    // Get the top result
    const topResult = results[0];
    const foodName = extractFoodName(topResult.label.toLowerCase());
    
    // Get nutrition data
    const nutrition = nutritionDB[foodName] || nutritionDB.default;
    
    return {
      food: capitalize(foodName),
      confidence: topResult.score,
      nutrition
    };
  } catch (error) {
    console.error('Error analyzing food image:', error);
    
    // Return default values on error
    return {
      food: 'Unknown Food',
      confidence: 0.9,
      nutrition: nutritionDB.default
    };
  }
};

// Extract food name from classification label
const extractFoodName = (label: string): string => {
  // Common food keywords to look for
  const foodKeywords = Object.keys(nutritionDB);
  
  // Find the best match
  for (const keyword of foodKeywords) {
    if (label.includes(keyword)) {
      return keyword;
    }
  }
  
  // Return the first word as food name if no match found
  return label.split(' ')[0] || 'default';
};

// Capitalize first letter
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};