
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GameProvider } from "@/contexts/GameContext";

// Pages
import Index from "./pages/Index";
import MyGames from "./pages/MyGames";
import CreateGame from "./pages/CreateGame";
import EditGame from "./pages/EditGame";
import PlayGame from "./pages/PlayGame";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";

// Initialize the query client
const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <GameProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/my-games" element={<MyGames />} />
            <Route path="/create-game" element={<CreateGame />} />
            <Route path="/edit-game/:gameId" element={<EditGame />} />
            <Route path="/play-game/:gameId" element={<PlayGame />} />
            <Route path="/help" element={<Help />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </GameProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
