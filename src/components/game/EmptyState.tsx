
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { PlusCircle, BookOpen } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  icon?: React.ReactNode;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  buttonText,
  buttonLink,
  icon = <BookOpen className="h-12 w-12 text-muted-foreground/50" />
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-accent/30 rounded-lg animate-fade-in">
      <div className="p-4 bg-background rounded-full mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-md mb-6">{description}</p>
      <Button asChild className="animated-button-hover">
        <Link to={buttonLink}>
          <PlusCircle className="h-4 w-4 mr-2" />
          {buttonText}
        </Link>
      </Button>
    </div>
  );
};

export default EmptyState;
