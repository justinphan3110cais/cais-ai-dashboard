import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import caisLogo from '@/assets/cais_icon_black_text.svg';
import githubLogo from '@/assets/external/github-mark.svg';
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
    <nav className="fixed top-0 left-0 right-0 z-[200] w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left side: CAIS Logo + Navigation Links */}
        <div className="flex items-center space-x-6">
          <a 
            href="https://safe.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            <Image
              src={caisLogo}
              alt="Center for AI Safety"
              width={100}
              height={20}
              className="flex-shrink-0"
            />
          </a>
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-4 py-2"
                onClick={() => onNavigate(item.id)}
                title={item.description}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Right side: About Us + GitHub Link */}
        <div className="flex items-center space-x-2">
          <a
            href="https://safe.ai/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:block text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors px-3 py-2 rounded-md hover:bg-gray-100"
          >
            About Us
          </a>
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors px-3 py-2 rounded-md hover:bg-gray-100"
            title="View on GitHub"
          >
            <Image
              src={githubLogo}
              alt="GitHub"
              width={20}
              height={20}
              className="flex-shrink-0"
            />
          </a>
        </div>
      </div>
    </nav>
  );
};
