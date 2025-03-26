
import { GameQuestion, GameConfig, FullGame, GameResult } from "@/types/game";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Generate questions using OpenAI via our edge function
export const generateQuestions = async (
  images: string[],
  topics: string[],
  difficulty: 'easy' | 'medium' | 'hard',
  questionCount: number
): Promise<GameQuestion[]> => {
  try {
    console.log(`Requesting ${questionCount} questions with ${images.length} images`);
    
    if (images.length === 0) {
      throw new Error("Please upload at least one image to generate questions.");
    }
    
    // Call our Supabase Edge Function
    const { data, error } = await supabase.functions.invoke('generate-questions', {
      body: { images, topics, difficulty, questionCount }
    });

    if (error) {
      console.error('Error calling generate-questions function:', error);
      throw new Error(`Failed to generate questions: ${error.message}`);
    }

    if (!data || !data.questions || data.questions.length === 0) {
      console.error('No questions were generated', data);
      throw new Error('No questions were generated. Please try again.');
    }

    console.log(`Generated ${data.questions.length} questions successfully`);
    return data.questions;
  } catch (error) {
    console.error('Error in generateQuestions:', error);
    toast.error(error instanceof Error ? error.message : 'Failed to generate questions');
    
    // Fallback to local question generation if the edge function fails
    console.log('Falling back to local question generation');
    return fallbackGenerateQuestions(images, topics, difficulty, questionCount);
  }
};

// Fallback function for generating questions locally if the API fails
const fallbackGenerateQuestions = (
  images: string[],
  topics: string[],
  difficulty: 'easy' | 'medium' | 'hard',
  questionCount: number
): Promise<GameQuestion[]> => {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      const questions: GameQuestion[] = [];
      
      // Generate questions based on the number requested, cycling through available images
      for (let i = 0; i < questionCount; i++) {
        // Select an image (cycling through available ones if we need more questions than images)
        const imageIndex = i % images.length;
        const selectedImage = images[imageIndex];
        
        // Create different questions for the same image if needed
        const questionNumber = Math.floor(i / images.length) + 1;
        
        // Create questions based on difficulty
        const difficultyFactor = difficulty === 'easy' ? 'simple' : 
                               difficulty === 'medium' ? 'moderate' :
                               'challenging';
        
        const topicText = topics.length > 0 ? 
          `about ${topics[Math.floor(Math.random() * topics.length)]}` : '';
        
        // Fallback to locally generated content
        const question: GameQuestion = {
          id: `q-${i}-${Date.now()}`,
          imageUrl: selectedImage,
          question: `What's happening in this ${difficultyFactor} memory ${topicText}? (Question ${questionNumber})`,
          options: [
            `Option A for question ${i+1}`,
            `Option B for question ${i+1}`,
            `Option C for question ${i+1}`,
            `Option D for question ${i+1}`
          ],
          correctAnswer: Math.floor(Math.random() * 4) // Random correct answer
        };
        
        questions.push(question);
      }
      
      console.log(`Fallback: Generated ${questions.length} questions`);
      resolve(questions);
    }, 1500); // Simulate processing delay
  });
};

// Create a new game
export const createGame = (
  name: string,
  difficulty: 'easy' | 'medium' | 'hard',
  questionCount: number,
  timeLimit: number | null,
  topics: string[],
  thumbnailUrl: string,
  questions: GameQuestion[]
): FullGame => {
  const gameId = `game-${Date.now()}`;
  console.log(`Creating game ${gameId} with ${questions.length} questions`);
  
  return {
    id: gameId,
    name,
    difficulty,
    questionCount,
    timeLimit,
    topics,
    createdAt: Date.now(),
    thumbnailUrl,
    questions,
    results: []
  };
};

// Calculate game result
export const calculateResult = (
  gameId: string,
  questions: GameQuestion[],
  difficulty: 'easy' | 'medium' | 'hard',
  totalTimeSpent: number
): GameResult => {
  console.log("Calculating results for questions:", questions);
  
  const answeredQuestions = questions.filter(q => q.userAnswer !== undefined);
  const correctAnswers = answeredQuestions.filter(q => q.userAnswer === q.correctAnswer);
  
  console.log("Answered questions:", answeredQuestions.length);
  console.log("Correct answers:", correctAnswers.length);
  
  return {
    id: `result-${Date.now()}`,
    gameId,
    score: correctAnswers.length,
    totalQuestions: questions.length,
    timeSpent: totalTimeSpent,
    completedAt: Date.now(),
    difficulty
  };
};

// Get encouragement message based on score percentage
export const getEncouragementMessage = (score: number, total: number): string => {
  const percentage = (score / total) * 100;
  
  if (percentage >= 90) {
    return "Outstanding! Your memory is exceptional!";
  } else if (percentage >= 75) {
    return "Great job! You have excellent recall!";
  } else if (percentage >= 60) {
    return "Well done! You're making good progress!";
  } else if (percentage >= 40) {
    return "Good effort! Keep practicing to improve!";
  } else {
    return "Thanks for playing! Each session helps strengthen your memory!";
  }
};

// Format time in seconds to mm:ss format
export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

// Get relative time (e.g., "2 days ago")
export const getRelativeTime = (timestamp: number): string => {
  const now = Date.now();
  const diffInSeconds = Math.floor((now - timestamp) / 1000);
  
  if (diffInSeconds < 60) {
    return `${diffInSeconds} second${diffInSeconds !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes !== 1 ? 's' : ''} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
  }
  
  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks !== 1 ? 's' : ''} ago`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} month${diffInMonths !== 1 ? 's' : ''} ago`;
};
