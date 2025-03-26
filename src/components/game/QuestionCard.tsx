
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GameQuestion } from '@/types/game';
import { useVoice } from '@/hooks/use-voice';
import { Progress } from '@/components/ui/progress';
import { Clock, ChevronRight, CheckCircle, XCircle } from 'lucide-react';
import { formatTime } from '@/utils/gameUtils';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { motion } from 'framer-motion';

interface QuestionCardProps {
  question: GameQuestion;
  currentIndex: number;
  totalQuestions: number;
  timeLimit: number | null;
  onAnswer: (questionId: string, answerIndex: number) => void;
  onTimeUp?: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  currentIndex,
  totalQuestions,
  timeLimit,
  onAnswer,
  onTimeUp
}) => {
  const { id, imageUrl, question: questionText, options, correctAnswer, userAnswer } = question;
  const [selectedAnswer, setSelectedAnswer] = useState<number | undefined>(userAnswer);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit || 0);
  const [answered, setAnswered] = useState(userAnswer !== undefined);
  const { speak } = useVoice();
  
  // If time limit is enabled, start countdown
  useEffect(() => {
    if (!timeLimit || answered) return;
    
    speak(questionText);
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          if (onTimeUp) onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLimit, answered, questionText, speak, onTimeUp]);
  
  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(userAnswer);
    setAnswered(userAnswer !== undefined);
    setTimeRemaining(timeLimit || 0);
    
    // Read the question if not answered
    if (userAnswer === undefined) {
      speak(questionText);
    }
  }, [question, userAnswer, timeLimit, speak, questionText]);
  
  const handleOptionClick = (index: number) => {
    if (answered) return;
    
    setSelectedAnswer(index);
    setAnswered(true);
    onAnswer(id, index);
  };
  
  // Calculate progress percentage
  const progressPercentage = ((currentIndex + 1) / totalQuestions) * 100;
  
  // Calculate time progress percentage
  const timeProgressPercentage = timeLimit ? (timeRemaining / timeLimit) * 100 : 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-3xl px-4 py-6"
    >
      <Card className="memory-card overflow-hidden bg-white/90 backdrop-blur-sm border border-primary/10 shadow-lg">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div className="bg-primary/10 px-3 py-1.5 rounded-full text-sm font-medium">
              Question {currentIndex + 1} of {totalQuestions}
            </div>
            
            {timeLimit && (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                timeRemaining < 10 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
              }`}>
                <Clock className="h-4 w-4" />
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
          </div>
          
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-1.5 bg-primary/20" />
            
            {timeLimit && (
              <Progress 
                value={timeProgressPercentage} 
                className={`h-1.5 ${timeRemaining < 10 ? "bg-red-200" : "bg-blue-200"}`} 
              />
            )}
          </div>
          
          <div className="aspect-video rounded-xl overflow-hidden border border-primary/10 shadow-sm">
            <img 
              src={imageUrl} 
              alt="Memory question" 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-2">{questionText}</h3>
          </div>
          
          <div className="space-y-3">
            {options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleOptionClick(index)}
                className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer
                  ${answered ? 'cursor-default' : 'hover:border-primary hover:bg-primary/5'}
                  ${
                    answered && index === correctAnswer 
                      ? 'bg-green-50 border-green-300' 
                      : answered && index === selectedAnswer && index !== correctAnswer
                      ? 'bg-red-50 border-red-300'
                      : 'border-gray-200'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                    answered && index === correctAnswer 
                      ? 'border-green-500 bg-green-500 text-white'
                      : answered && index === selectedAnswer && index !== correctAnswer
                      ? 'border-red-500 bg-red-500 text-white'
                      : index === selectedAnswer
                      ? 'border-primary bg-primary text-white'
                      : 'border-gray-300'
                  }`}>
                    {answered && index === correctAnswer ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : answered && index === selectedAnswer && index !== correctAnswer ? (
                      <XCircle className="h-4 w-4" />
                    ) : index === selectedAnswer ? (
                      <div className="h-2 w-2 rounded-full bg-current" />
                    ) : (
                      <div className="h-2 w-2 rounded-full" />
                    )}
                  </div>
                  <div className="text-base">{option}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default QuestionCard;
