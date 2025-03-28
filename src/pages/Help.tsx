
import React from 'react';
import PageLayout from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Camera, Gamepad2, Clock, Award, FileQuestion, Dumbbell } from 'lucide-react';
import { useVoice } from '@/hooks/use-voice';

const HelpPage = () => {
  const { speak } = useVoice();
  
  React.useEffect(() => {
    speak("Welcome to the help page. Here you can learn how to use Memory Lane Games.");
  }, [speak]);
  
  return (
    <PageLayout>
      <div className="animate-fade-in space-y-8 max-w-4xl mx-auto">
        <div className="text-center space-y-3 mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">How to Use Memory Lane Games</h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Memory Lane Games helps exercise your memory with personalized AI-generated questions about your own photos.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-primary" />
                Step 1: Upload Photos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Start by uploading personal photos. These can be family photos, travel memories, or any images that have meaning for you. You can drag and drop them or use the file browser.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <FileQuestion className="h-5 w-5 text-primary" />
                Step 2: Add Topics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Add relevant topics to guide the AI question generation. For example, if you upload family photos, you might add "Family" or "Vacation" as topics.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Dumbbell className="h-5 w-5 text-primary" />
                Step 3: Choose Difficulty
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Select a difficulty level (Easy, Medium, Hard) based on your comfort level. This affects the complexity of the questions generated.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Step 4: Set Time Limit (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                You can set a time limit for each question to add a challenge, or leave this off for a more relaxed experience.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Step 5: Create Your Game
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Click "Create Memory Game" to generate your personalized game. Our AI will analyze your photos and create relevant questions based on your settings.
              </CardDescription>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Gamepad2 className="h-5 w-5 text-primary" />
                Step 6: Play and Practice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Play your created game by answering the multiple-choice questions. Each question will display one of your photos along with related questions.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
        
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              Track Your Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-base">
              After each game, you'll see your results including your score and completion time. All your games are saved in "My Games" where you can replay them anytime to continue strengthening your memory.
            </CardDescription>
          </CardContent>
        </Card>
        
        <div className="p-4 bg-muted rounded-lg mt-8">
          <p className="text-center text-sm">
            Remember to use a variety of photos and topics to create diverse memory games that exercise different aspects of your memory and cognition.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default HelpPage;
