
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import QuestionCard from '@/components/game/QuestionCard';
import ResultSummary from '@/components/game/ResultSummary';
import { useGame } from '@/contexts/GameContext';
import { GameQuestion, GameResult } from '@/types/game';
import { calculateResult } from '@/utils/gameUtils';
import { Button } from '@/components/ui/button';
import { Home, AlertCircle } from 'lucide-react';
import { useVoice } from '@/hooks/use-voice';

const PlayGame = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { currentGame, setCurrentGame, addResult } = useGame();
  const { speak } = useVoice();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [gameStartTime, setGameStartTime] = useState(Date.now());
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  // Load the game
  useEffect(() => {
    if (gameId && (!currentGame || currentGame.id !== gameId)) {
      setCurrentGame(gameId);
    }
  }, [gameId, currentGame, setCurrentGame]);
  
  // Initialize questions
  useEffect(() => {
    if (currentGame && !gameCompleted) {
      // Clone questions to avoid modifying the original
      const gameQuestions = JSON.parse(JSON.stringify(currentGame.questions)) as GameQuestion[];
      console.log("Initial questions state:", gameQuestions);
      setQuestions(gameQuestions);
      setGameStartTime(Date.now());
      
      // Read intro message
      speak(`Starting ${currentGame.name}. This game has ${currentGame.questionCount} questions.`);
    }
  }, [currentGame, speak, gameCompleted]);
  
  // Handle answer selection
  const handleAnswerSelected = (questionId: string, answerIndex: number) => {
    console.log(`Answer selected: Question ID ${questionId}, Answer Index ${answerIndex}`);
    
    // Update the question with user's answer
    setQuestions(prev => {
      const updatedQuestions = prev.map(q => 
        q.id === questionId 
          ? { ...q, userAnswer: answerIndex, timeSpent: (Date.now() - gameStartTime) / 1000 } 
          : q
      );
      console.log("Questions after answer:", updatedQuestions);
      return updatedQuestions;
    });
    
    // Move to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
      } else {
        completeGame();
      }
    }, 1500);
  };
  
  // Handle time up
  const handleTimeUp = () => {
    // Update the current question to mark it as timed out
    setQuestions(prev => 
      prev.map((q, index) => 
        index === currentQuestionIndex 
          ? { ...q, timeSpent: (Date.now() - gameStartTime) / 1000 } 
          : q
      )
    );
    
    // Move to next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      completeGame();
    }
  };
  
  // Complete the game and calculate results
  const completeGame = () => {
    if (!currentGame) return;
    
    const totalTimeSpent = (Date.now() - gameStartTime) / 1000;
    console.log("Game completed with questions:", questions);
    
    const result = calculateResult(
      currentGame.id,
      questions,
      currentGame.difficulty,
      totalTimeSpent
    );
    
    console.log("Game result:", result);
    
    // Add result to the game
    addResult(currentGame.id, result);
    setGameResult(result);
    setGameCompleted(true);
  };
  
  // Play again
  const handlePlayAgain = () => {
    setCurrentQuestionIndex(0);
    setGameCompleted(false);
    setGameResult(null);
  };
  
  // Render based on game state
  if (!currentGame) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 bg-red-100 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Game Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The game you're looking for doesn't exist or has been deleted.
          </p>
          <Button asChild>
            <a href="/my-games">
              <Home className="h-4 w-4 mr-2" />
              Return to Game Library
            </a>
          </Button>
        </div>
      </PageLayout>
    );
  }
  
  if (gameCompleted && gameResult) {
    return (
      <PageLayout className="flex items-center justify-center">
        <ResultSummary result={gameResult} onPlayAgain={handlePlayAgain} />
      </PageLayout>
    );
  }
  
  if (questions.length === 0) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center py-16">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-12 bg-primary/20 rounded-full mb-4"></div>
            <div className="h-4 w-48 bg-primary/20 rounded mb-2"></div>
            <div className="h-4 w-36 bg-primary/20 rounded"></div>
          </div>
        </div>
      </PageLayout>
    );
  }
  
  return (
    <PageLayout className="flex items-center justify-center">
      {questions.length > 0 && currentQuestionIndex < questions.length && (
        <QuestionCard
          question={questions[currentQuestionIndex]}
          currentIndex={currentQuestionIndex}
          totalQuestions={questions.length}
          timeLimit={currentGame.timeLimit || null}
          onAnswer={handleAnswerSelected}
          onTimeUp={handleTimeUp}
        />
      )}
    </PageLayout>
  );
};

export default PlayGame;
