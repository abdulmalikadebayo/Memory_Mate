
import React from 'react';
import Header from './Header';
import Footer from './Footer';

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ children, className = "" }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className={`flex-1 pt-24 pb-12 px-4 md:px-8 max-w-7xl w-full mx-auto ${className}`}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default PageLayout;
