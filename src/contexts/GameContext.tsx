
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { FullGame, GameConfig, GameQuestion, GameResult } from '@/types/game';
import { toast } from 'sonner';

interface GameContextType {
  games: FullGame[];
  currentGame: FullGame | null;
  loading: boolean;
  error: string | null;
  addGame: (game: FullGame) => void;
  updateGame: (gameId: string, updatedGame: Partial<FullGame>) => void;
  deleteGame: (gameId: string) => void;
  setCurrentGame: (gameId: string | null) => void;
  addResult: (gameId: string, result: GameResult) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [games, setGames] = useLocalStorage<FullGame[]>('memoryMate-games', []);
  const [currentGame, setCurrentGameState] = useState<FullGame | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Add a new game
  const addGame = (game: FullGame) => {
    try {
      setGames([...games, game]);
      toast.success("Game created successfully!");
    } catch (err) {
      setError("Failed to add game. Please try again.");
      toast.error("Failed to create game");
      console.error(err);
    }
  };

  // Update an existing game
  const updateGame = (gameId: string, updatedGame: Partial<FullGame>) => {
    try {
      const updatedGames = games.map(game => 
        game.id === gameId ? { ...game, ...updatedGame } : game
      );
      setGames(updatedGames);
      
      // Update current game if it's being edited
      if (currentGame && currentGame.id === gameId) {
        setCurrentGameState({ ...currentGame, ...updatedGame });
      }
      
      toast.success("Game updated successfully!");
    } catch (err) {
      setError("Failed to update game. Please try again.");
      toast.error("Failed to update game");
      console.error(err);
    }
  };

  // Delete a game
  const deleteGame = (gameId: string) => {
    try {
      const updatedGames = games.filter(game => game.id !== gameId);
      setGames(updatedGames);
      
      // Clear current game if it's being deleted
      if (currentGame && currentGame.id === gameId) {
        setCurrentGameState(null);
      }
      
      toast.success("Game deleted successfully!");
    } catch (err) {
      setError("Failed to delete game. Please try again.");
      toast.error("Failed to delete game");
      console.error(err);
    }
  };

  // Set the current active game
  const setCurrentGame = (gameId: string | null) => {
    if (!gameId) {
      setCurrentGameState(null);
      return;
    }
    
    const game = games.find(g => g.id === gameId) || null;
    setCurrentGameState(game);
    
    if (!game) {
      setError("Game not found");
      toast.error("Game not found");
    }
  };

  // Add a result to a game
  const addResult = (gameId: string, result: GameResult) => {
    try {
      const updatedGames = games.map(game => {
        if (game.id === gameId) {
          return {
            ...game,
            results: [result, ...game.results]
          };
        }
        return game;
      });
      
      setGames(updatedGames);
      
      // Update current game if it's being played
      if (currentGame && currentGame.id === gameId) {
        setCurrentGameState({
          ...currentGame,
          results: [result, ...currentGame.results]
        });
      }
    } catch (err) {
      setError("Failed to save game result. Please try again.");
      toast.error("Failed to save game result");
      console.error(err);
    }
  };

  const value = {
    games,
    currentGame,
    loading,
    error,
    addGame,
    updateGame,
    deleteGame,
    setCurrentGame,
    addResult
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
