
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { GameResult } from '@/types/game';
import { getEncouragementMessage, formatTime } from '@/utils/gameUtils';
import { useVoice } from '@/hooks/use-voice';
import confetti from 'canvas-confetti';
import { Trophy, Home, RotateCcw, Clock, CheckCircle, XCircle } from 'lucide-react';

interface ResultSummaryProps {
  result: GameResult;
  onPlayAgain: () => void;
}

const ResultSummary: React.FC<ResultSummaryProps> = ({ result, onPlayAgain }) => {
  const navigate = useNavigate();
  const { speak } = useVoice();
  
  const { score, totalQuestions, timeSpent, difficulty } = result;
  const percentage = Math.round((score / totalQuestions) * 100);
  const encouragementMessage = getEncouragementMessage(score, totalQuestions);
  
  // Trigger confetti effect for good scores
  useEffect(() => {
    if (percentage >= 70) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [percentage]);
  
  // Read the result using voice
  useEffect(() => {
    const message = `You've completed the game! Your score is ${score} out of ${totalQuestions}, which is ${percentage} percent. ${encouragementMessage}`;
    speak(message);
  }, [speak, score, totalQuestions, percentage, encouragementMessage]);
  
  // Format difficulty
  const formattedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  
  // Style based on score
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-amber-600';
    return 'text-red-600';
  };
  
  // Progress color based on score
  const getProgressColor = () => {
    if (percentage >= 80) return 'bg-green-600';
    if (percentage >= 60) return 'bg-blue-600';
    if (percentage >= 40) return 'bg-amber-600';
    return 'bg-red-600';
  };
  
  return (
    <Card className="memory-card max-w-lg w-full mx-auto animate-scale-in">
      <CardContent className="p-6 text-center">
        <div className="mb-8 flex justify-center">
          <div className="p-4 bg-primary/10 rounded-full">
            <Trophy className="h-12 w-12 text-amber-500" />
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-2">Game Completed!</h2>
        <p className="text-muted-foreground mb-6">{encouragementMessage}</p>
        
        <div className="space-y-6">
          {/* Score */}
          <div className="space-y-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Your Score</span>
              <span className={`text-sm font-bold ${getScoreColor()}`}>
                {score}/{totalQuestions} ({percentage}%)
              </span>
            </div>
            <Progress 
              value={percentage} 
              className={`h-2 ${getProgressColor()}`} 
            />
          </div>
          
          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-accent/50 p-4 rounded-lg text-center">
              <Clock className="h-5 w-5 mx-auto mb-1 text-blue-500" />
              <div className="text-xs text-muted-foreground">Time Spent</div>
              <div className="font-medium">{formatTime(timeSpent)}</div>
            </div>
            
            <div className="bg-accent/50 p-4 rounded-lg text-center">
              <div className="flex justify-center space-x-1 mb-1">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <XCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="text-xs text-muted-foreground">Correct/Incorrect</div>
              <div className="font-medium">{score}/{totalQuestions - score}</div>
            </div>
          </div>
          
          {/* Difficulty */}
          <div className="text-center text-sm">
            <span className="text-muted-foreground">Difficulty: </span>
            <span className="font-medium">{formattedDifficulty}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="p-6 pt-0 flex flex-col sm:flex-row gap-3">
        <Button
          variant="outline"
          onClick={() => navigate('/my-games')}
          className="flex-1"
        >
          <Home className="h-4 w-4 mr-2" />
          Game Library
        </Button>
        
        <Button
          variant="default"
          onClick={onPlayAgain}
          className="flex-1 animated-button-hover"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Play Again
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResultSummary;
