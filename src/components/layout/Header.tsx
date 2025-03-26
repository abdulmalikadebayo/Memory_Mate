import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Menu, X, Gamepad2, Plus, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const isActive = (path: string) => location.pathname === path;
  
  const links = [
    { name: 'Home', path: '/', icon: Brain },
    { name: 'My Games', path: '/my-games', icon: Gamepad2 },
    { name: 'Create Game', path: '/create-game', icon: Plus },
    { name: 'Help', path: '/help', icon: HelpCircle }
  ];
  
  const NavLinks = () => (
    <>
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Button
            key={link.path}
            variant={isActive(link.path) ? 'default' : 'ghost'}
            asChild
            className={isActive(link.path) ? 'bg-primary text-primary-foreground' : ''}
            onClick={() => setOpen(false)}
          >
            <Link to={link.path} className="flex items-center gap-1">
              <Icon className="h-4 w-4" />
              {link.name}
            </Link>
          </Button>
        );
      })}
    </>
  );
  
  return (
    <header className="fixed top-0 left-0 right-0 bg-background z-50 border-b">
      <div className="h-16 px-4 md:px-8 max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center gap-2">
            <Brain className="h-7 w-7 md:h-8 md:w-8 text-primary animate-pulse" />
            <span className="font-bold text-xl md:text-2xl">MemoryMate</span>
          </Link>
        </div>
        
        {isMobile ? (
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64 pt-12">
              <nav className="flex flex-col gap-2">
                <NavLinks />
              </nav>
            </SheetContent>
          </Sheet>
        ) : (
          <nav className="flex items-center gap-1">
            <NavLinks />
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
