
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Clock, Star, Settings } from 'lucide-react';
import { GameConfig, GameResult } from '@/types/game';
import { formatTime, getRelativeTime } from '@/utils/gameUtils';

interface GameCardProps {
  game: GameConfig;
  results?: GameResult[];
  onPlayClick?: () => void;
  onEditClick?: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ 
  game, 
  results = [], 
  onPlayClick,
  onEditClick
}) => {
  const { id, name, difficulty, questionCount, timeLimit, createdAt, thumbnailUrl } = game;
  
  // Get the most recent result
  const latestResult = results.length > 0 ? results[0] : null;
  
  // Calculate best score
  const bestScore = results.length > 0 
    ? Math.max(...results.map(r => (r.score / r.totalQuestions) * 100)) 
    : 0;
  
  // Format difficulty with proper capitalization
  const formattedDifficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  
  // Difficulty color
  const difficultyColor = 
    difficulty === 'easy' ? 'text-green-500' : 
    difficulty === 'medium' ? 'text-amber-500' : 
    'text-red-500';
  
  return (
    <Card className="memory-card overflow-hidden transition-all duration-300 hover:shadow-md animate-scale-in">
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={thumbnailUrl} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">
          <span className={difficultyColor}>{formattedDifficulty}</span>
        </div>
      </div>
      
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1 mb-2">{name}</h3>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>{getRelativeTime(createdAt)}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <span>{questionCount} questions</span>
          </div>
        </div>
        
        {latestResult && (
          <div className="mt-2 bg-accent/50 p-2 rounded-md">
            <div className="flex justify-between items-center text-xs">
              <span>Recent score: {Math.round((latestResult.score / latestResult.totalQuestions) * 100)}%</span>
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-amber-500 fill-amber-500" />
                <span>Best: {Math.round(bestScore)}%</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onEditClick}
          className="flex-1"
        >
          <Settings className="h-4 w-4 mr-2" />
          Edit
        </Button>
        
        <Button
          variant="default"
          size="sm"
          onClick={onPlayClick}
          className="flex-1 bg-primary animated-button-hover"
        >
          <Play className="h-4 w-4 mr-2" />
          Play
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GameCard;
