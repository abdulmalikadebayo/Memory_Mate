
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="w-full py-6 px-8 bg-white/80 backdrop-blur-md border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center space-x-1 mb-4 md:mb-0">
          <span className="text-sm text-muted-foreground">
          Memory Lane Games - Supporting cognitive wellbeing
          </span>
        </div>
        
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
          <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            About
          </Link>
          <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Help
          </Link>
          <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
            Privacy
          </Link>
          <div className="flex items-center space-x-1">
            <span className="text-sm text-muted-foreground">Made with</span>
            <Heart className="h-3 w-3 text-destructive fill-destructive" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
