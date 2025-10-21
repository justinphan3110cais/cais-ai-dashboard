import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import caisLogo from '@/assets/cais_icon_black_text.svg';
import caisLogoShort from '@/assets/cais_logo.svg';
import githubLogo from '@/assets/external/github-mark.svg';
import githubLogoWhite from '@/assets/external/github-mark-white.png';
import { GITHUB_URL } from '@/app/constants';

interface NavigationProps {
  onNavigate: (section: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate }) => {
  const navigationItems = [
    { id: 'text', label: 'Text', description: 'Text capabilities benchmarks' },
    { id: 'vision', label: 'Vision', description: 'Multimodal and vision benchmarks' },
    { id: 'safety', label: 'Safety', description: 'AI safety benchmarks' }
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[200] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left side: CAIS Logo + Navigation Links */}
        <div className="flex items-center space-x-6">
          <a 
            href="https://safe.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            {/* Desktop logo with text */}
            <Image
              src={caisLogo}
              alt="Center for AI Safety"
              width={100}
              height={20}
              className="hidden sm:block flex-shrink-0"
            />
            {/* Mobile logo - shorter version */}
            <Image
              src={caisLogoShort}
              alt="Center for AI Safety"
              width={32}
              height={32}
              className="block sm:hidden flex-shrink-0"
            />
          </a>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent px-4 py-2"
                onClick={() => onNavigate(item.id)}
                title={item.description}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Right side: About Us + GitHub Link + Theme Toggle */}
        <div className="flex items-center space-x-2">
          <a
            href="https://safe.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-accent"
          >
            About Us
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-muted-foreground hover:text-foreground transition-colors px-3 py-2 rounded-md hover:bg-accent"
            title="View on GitHub"
          >
            <Image
              src={githubLogo}
              alt="GitHub"
              width={20}
              height={20}
              className="flex-shrink-0 dark:hidden"
            />
            <Image
              src={githubLogoWhite}
              alt="GitHub"
              width={20}
              height={20}
              className="flex-shrink-0 hidden dark:block"
            />
          </a>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};
