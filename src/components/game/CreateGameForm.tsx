
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { X, Plus, Upload, Image as ImageIcon } from 'lucide-react';
import { useImageUpload } from '@/hooks/use-image-upload';
import { useVoice } from '@/hooks/use-voice';
import { useGame } from '@/contexts/GameContext';
import { generateQuestions, createGame } from '@/utils/gameUtils';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const CreateGameForm: React.FC = () => {
  const navigate = useNavigate();
  const { addGame } = useGame();
  const { speak } = useVoice();
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [questionCount, setQuestionCount] = useState(5);
  const [enableTimeLimit, setEnableTimeLimit] = useState(false);
  const [timeLimit, setTimeLimit] = useState(30);
  const [topic, setTopic] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const {
    images,
    uploading,
    error: uploadError,
    handleImageUpload,
    handleImageDrop,
    handleDragOver,
    removeImage
  } = useImageUpload(20);
  
  // Read the page instructions
  useEffect(() => {
    speak("Create a new memory game. Upload photos, add topics, and customize game settings.");
  }, [speak]);

  const addTopic = () => {
    if (!topic.trim()) return;
    
    if (!topics.includes(topic.trim())) {
      setTopics([...topics, topic.trim()]);
    }
    
    setTopic('');
  };
  
  const removeTopic = (index: number) => {
    setTopics(topics.filter((_, i) => i !== index));
  };

  const handleSliderChange = (values: number[]) => {
    if (values.length > 0) {
      setQuestionCount(values[0]);
    }
  };
  
  const validateForm = () => {
    setError(null);
    
    if (!name.trim()) {
      setError("Please enter a game name");
      return false;
    }
    
    if (images.length === 0) {
      setError("Please upload at least one photo");
      return false;
    }
    
    return true;
  };
  
  const handleCreateGame = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsCreating(true);
      
      // Generate questions based on images
      const questions = await generateQuestions(
        images,
        topics,
        difficulty,
        questionCount
      );
      
      if (!questions || questions.length === 0) {
        throw new Error("Failed to generate questions. Please try again.");
      }
      
      console.log("Generated questions:", questions);
      
      // Create the game
      const newGame = createGame(
        name,
        difficulty,
        questionCount,
        enableTimeLimit ? timeLimit : null,
        topics,
        images[0], // Use first image as thumbnail
        questions
      );
      
      // Add game to context
      addGame(newGame);
      
      // Navigate to games library
      toast.success("Game created successfully!");
      navigate('/my-games');
      
    } catch (err) {
      console.error("Error creating game:", err);
      setError(err instanceof Error ? err.message : "Failed to create game. Please try again.");
      toast.error("Failed to create game. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold mb-2">Create New Memory Game</h2>
          <p className="text-muted-foreground">
            Upload photos, add topics, and customize your memory game settings.
          </p>
        </div>
        
        {/* Game Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Game Name</Label>
          <Input
            id="name"
            placeholder="Enter a name for your game"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        {/* Photo Upload */}
        <div className="space-y-4">
          <Label>Upload Photos</Label>
          
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center ${
              uploading ? 'bg-muted/50 border-primary/30' : 'border-border hover:border-primary/50'
            } transition-colors duration-300`}
            onDrop={handleImageDrop}
            onDragOver={handleDragOver}
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">Drag photos here or click to upload</p>
                <p className="text-xs text-muted-foreground">
                  Supports JPG, PNG, GIF • Up to 5MB each
                </p>
              </div>
              <Button variant="secondary" size="sm" asChild>
                <label className="cursor-pointer">
                  <span>Select Photos</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="sr-only"
                    onChange={handleImageUpload}
                    disabled={uploading}
                  />
                </label>
              </Button>
            </div>
          </div>
          
          {uploadError && (
            <Alert variant="destructive" className="animate-fade-in">
              <AlertDescription>{uploadError}</AlertDescription>
            </Alert>
          )}
          
          {/* Image Gallery */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mt-4">
              {images.map((image, index) => (
                <div key={index} className="relative group rounded-md overflow-hidden aspect-square">
                  <img
                    src={image}
                    alt={`Uploaded ${index}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Topics */}
        <div className="space-y-4">
          <Label>Game Topics (Optional)</Label>
          <div className="flex gap-2 max-w-md">
            <Input
              placeholder="Add topics to guide question generation"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTopic()}
            />
            <Button
              variant="outline"
              onClick={addTopic}
              disabled={!topic.trim()}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </div>
          
          {topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {topics.map((t, index) => (
                <Badge key={index} variant="secondary" className="pl-2 pr-1 py-1 flex items-center">
                  {t}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeTopic(index)}
                    className="h-4 w-4 ml-1"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        {/* Difficulty */}
        <div className="space-y-3">
          <Label>Difficulty Level</Label>
          <RadioGroup
            defaultValue="easy"
            value={difficulty}
            onValueChange={(value) => setDifficulty(value as 'easy' | 'medium' | 'hard')}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="easy" id="easy" />
              <Label htmlFor="easy" className="cursor-pointer">
                Easy
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium" className="cursor-pointer">
                Medium
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="hard" id="hard" />
              <Label htmlFor="hard" className="cursor-pointer">
                Hard
              </Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Question Count */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Number of Questions</Label>
            <span className="text-sm font-medium">{questionCount}</span>
          </div>
          <Slider
            value={[questionCount]}
            min={1}
            max={20}
            step={1}
            onValueChange={handleSliderChange}
            className="max-w-md"
            disabled={images.length === 0}
          />
          <div className="flex justify-between text-xs text-muted-foreground max-w-md">
            <span>1</span>
            <span>20</span>
          </div>
          
          {images.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Select how many questions you want for your memory game.
            </p>
          )}
        </div>
        
        {/* Time Limit */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="time-limit"
              checked={enableTimeLimit}
              onCheckedChange={setEnableTimeLimit}
            />
            <Label htmlFor="time-limit">Enable Time Limit</Label>
          </div>
          
          {enableTimeLimit && (
            <div className="pl-6 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between">
                <Label>Seconds per Question</Label>
                <span className="text-sm font-medium">{timeLimit} seconds</span>
              </div>
              <Slider
                value={[timeLimit]}
                min={10}
                max={60}
                step={5}
                onValueChange={(values) => setTimeLimit(values[0])}
                className="max-w-md"
              />
              <div className="flex justify-between text-xs text-muted-foreground max-w-md">
                <span>10s</span>
                <span>60s</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Error Display */}
        {error && (
          <Alert variant="destructive" className="animate-fade-in">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* Create Button */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateGame}
            disabled={isCreating || images.length === 0 || !name.trim()}
            className="animated-button-hover"
          >
            {isCreating ? "Creating Game..." : "Create Memory Game"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateGameForm;
