
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { useGame } from '@/contexts/GameContext';
import GameCard from '@/components/game/GameCard';
import EmptyState from '@/components/game/EmptyState';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useVoice } from '@/hooks/use-voice';
import { PlusCircle, Search, BookOpen } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const MyGames = () => {
  const navigate = useNavigate();
  const { games, setCurrentGame, deleteGame } = useGame();
  const { speak } = useVoice();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredGames, setFilteredGames] = useState(games);
  const [gameToDelete, setGameToDelete] = useState<string | null>(null);
  
  // Read the page instructions
  useEffect(() => {
    speak("Your game library. Select a game to play or create a new one.");
  }, [speak]);
  
  // Filter games based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredGames(games);
      return;
    }
    
    const filtered = games.filter(game => 
      game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      game.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    setFilteredGames(filtered);
  }, [searchTerm, games]);
  
  const handlePlayGame = (gameId: string) => {
    setCurrentGame(gameId);
    navigate(`/play-game/${gameId}`);
  };
  
  const handleEditGame = (gameId: string) => {
    setCurrentGame(gameId);
    navigate(`/edit-game/${gameId}`);
  };
  
  const confirmDeleteGame = (gameId: string) => {
    setGameToDelete(gameId);
  };
  
  const handleDeleteGame = () => {
    if (gameToDelete) {
      deleteGame(gameToDelete);
      setGameToDelete(null);
    }
  };
  
  return (
    <PageLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold">My Memory Games</h1>
            <p className="text-muted-foreground">
              Browse and play your personalized memory games
            </p>
          </div>
          
          <Button asChild className="animated-button-hover">
            <a href="/create-game">
              <PlusCircle className="h-4 w-4 mr-2" />
              Create New Game
            </a>
          </Button>
        </div>
        
        {games.length > 0 && (
          <div className="flex items-center border rounded-md pl-3 max-w-md">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search games by name or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
        )}
        
        {games.length === 0 ? (
          <EmptyState
            title="No Games Yet"
            description="Create your first memory game by uploading photos and customizing settings."
            buttonText="Create Your First Game"
            buttonLink="/create-game"
            icon={<BookOpen className="h-12 w-12 text-muted-foreground/50" />}
          />
        ) : filteredGames.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium mb-2">No matching games found</h3>
            <p className="text-muted-foreground mb-4">
              Try a different search term or create a new game.
            </p>
            <Button variant="outline" onClick={() => setSearchTerm('')}>
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                results={game.results}
                onPlayClick={() => handlePlayGame(game.id)}
                onEditClick={() => handleEditGame(game.id)}
              />
            ))}
          </div>
        )}
        
        {/* Delete Game Dialog */}
        <AlertDialog open={!!gameToDelete} onOpenChange={(open) => !open && setGameToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this memory game and all of its results.
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteGame} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </PageLayout>
  );
};

export default MyGames;
