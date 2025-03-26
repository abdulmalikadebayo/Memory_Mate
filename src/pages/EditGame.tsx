
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { AlertCircle, Home } from 'lucide-react';

const EditGame = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { currentGame, setCurrentGame } = useGame();
  
  // Set current game based on ID
  useEffect(() => {
    if (gameId) {
      setCurrentGame(gameId);
    }
  }, [gameId, setCurrentGame]);
  
  if (!currentGame) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="p-4 bg-red-100 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Game Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The game you're trying to edit doesn't exist or has been deleted.
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
  
  return (
    <PageLayout>
      <div className="max-w-3xl mx-auto animate-fade-in space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">Edit Game: {currentGame.name}</h1>
            <p className="text-muted-foreground">Update your memory game settings</p>
          </div>
        </div>
        
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-amber-800">
          <p className="text-sm">
            Editing functionality is currently under development. Please check back soon!
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            variant="outline"
            onClick={() => navigate('/my-games')}
          >
            Back to Games
          </Button>
          <Button
            onClick={() => navigate(`/play-game/${currentGame.id}`)}
            className="animated-button-hover"
          >
            Play This Game
          </Button>
        </div>
      </div>
    </PageLayout>
  );
};

export default EditGame;
