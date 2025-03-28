
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { useVoice } from '@/hooks/use-voice';
import { PlusCircle, BookOpen, BrainCircuit, Heart } from 'lucide-react';

const Index = () => {
  const { speak } = useVoice();
  
  useEffect(() => {
    speak("Welcome to Memory Lane Games. An AI-powered memory game to support cognitive wellbeing.");
  }, [speak]);
  
  return (
    <PageLayout>
      <div className="flex flex-col items-center animate-fade-in">
        {/* Hero Section */}
        <section className="text-center max-w-3xl mx-auto py-12 px-4">
          <div className="inline-flex items-center bg-primary/10 px-3 py-1 rounded-full text-primary text-sm font-medium mb-4">
            <BrainCircuit className="h-4 w-4 mr-2" />
            <span>AI-Powered Memory Games</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Strengthen Your Memories with Personalized Games
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Create custom memory games using your own photos. Engage with memories that matter while supporting cognitive wellbeing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="animated-button-hover">
              <Link to="/create-game">
                <PlusCircle className="h-5 w-5 mr-2" />
                Create New Game
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg">
              <Link to="/my-games">
                <BookOpen className="h-5 w-5 mr-2" />
                My Game Library
              </Link>
            </Button>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="w-full py-16 bg-accent/30 rounded-3xl my-8">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-12 text-center">
              How Memory Lane Games Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="glass-card p-6 rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary text-lg font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Upload Your Photos</h3>
                <p className="text-muted-foreground">
                  Add personal photos that contain meaningful memories, people, or places.
                </p>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary text-lg font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Customize Settings</h3>
                <p className="text-muted-foreground">
                  Choose difficulty levels, add helpful topics, and set time limits to match abilities.
                </p>
              </div>
              
              <div className="glass-card p-6 rounded-xl">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-primary text-lg font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Play & Improve</h3>
                <p className="text-muted-foreground">
                  Enjoy personalized questions about your memories and track progress over time.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Supporting Cognitive Wellbeing
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Memory Lane Games is designed to provide gentle cognitive stimulation through familiar memories.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 border rounded-xl hover:shadow-md transition-shadow text-center">
              <div className="p-3 bg-orange-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <Heart className="h-6 w-6 text-orange-500" />
              </div>
              <h3 className="font-semibold mb-2">Personalized Experience</h3>
              <p className="text-sm text-muted-foreground">
                Games tailored to individual memories and experiences
              </p>
            </div>
            
            <div className="p-6 border rounded-xl hover:shadow-md transition-shadow text-center">
              <div className="p-3 bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <BrainCircuit className="h-6 w-6 text-blue-500" />
              </div>
              <h3 className="font-semibold mb-2">Cognitive Engagement</h3>
              <p className="text-sm text-muted-foreground">
                Stimulates memory recall through familiar contexts
              </p>
            </div>
            
            <div className="p-6 border rounded-xl hover:shadow-md transition-shadow text-center">
              <div className="p-3 bg-green-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
                  <path d="M14 9a2 2 0 0 1-2 2H6l-4 4V4c0-1.1.9-2 2-2h8a2 2 0 0 1 2 2v5Z" />
                  <path d="M18 9h2a2 2 0 0 1 2 2v11l-4-4h-6a2 2 0 0 1-2-2v-1" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Accessible Design</h3>
              <p className="text-sm text-muted-foreground">
                Voice-enhanced interface with clear, intuitive controls
              </p>
            </div>
            
            <div className="p-6 border rounded-xl hover:shadow-md transition-shadow text-center">
              <div className="p-3 bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
                  <path d="M2 12h20" />
                  <path d="M12 2v20" />
                  <path d="m4.93 4.93 14.14 14.14" />
                  <path d="m19.07 4.93-14.14 14.14" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2">Progress Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Monitor memory engagement and improvements over time
              </p>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="w-full py-16 my-8 glass-card rounded-3xl">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Memory Journey?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Create your first memory game today and begin a personalized cognitive wellness experience.
            </p>
            
            <Button asChild size="lg" className="animated-button-hover">
              <Link to="/create-game">
                <PlusCircle className="h-5 w-5 mr-2" />
                Create Your First Game
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </PageLayout>
  );
};

export default Index;
