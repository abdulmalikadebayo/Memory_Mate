
export interface GameQuestion {
  id: string;
  imageUrl: string;
  question: string;
  options: string[];
  correctAnswer: number;
  userAnswer?: number;
  timeSpent?: number;
}

export interface GameConfig {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  questionCount: number;
  timeLimit: number | null;
  topics: string[];
  createdAt: number;
  thumbnailUrl: string;
}

export interface GameResult {
  id: string;
  gameId: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface FullGame extends GameConfig {
  questions: GameQuestion[];
  results: GameResult[];
}
