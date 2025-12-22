import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import caisLogo from '@/assets/cais_icon_black_text.svg';
import caisLogoShort from '@/assets/cais_logo.svg';
import textLogoColored from '@/assets/dataset-logos/text_logo_colored.svg';
import visionLogoColored from '@/assets/dataset-logos/vision_logo_colored.svg';
import safetyLogoColored from '@/assets/dataset-logos/safety_logo.svg';
import automationLogo from '@/assets/dataset-logos/automation_logo.svg';
import githubLogo from '@/assets/external/github-mark.svg';
import { GITHUB_URL } from '@/app/constants';

interface NavigationProps {
  onNavigate: (section: string) => void;
  globalViewMode: 'table' | 'chart' | null;
  onGlobalViewModeChange: (mode: 'table' | 'chart') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate, globalViewMode }) => {
  const navigationItems = [
    { id: 'text', label: 'Text', description: 'Text capabilities benchmarks', logo: textLogoColored },
    { id: 'vision', label: 'Vision', description: 'Multimodal and vision benchmarks', logo: visionLogoColored },
    { id: 'safety', label: 'Risk', description: 'AI safety benchmarks', logo: safetyLogoColored },
    { id: 'automation', label: 'Automation', description: 'Automation', logo: automationLogo }
  ];

  // Don't render switch until globalViewMode is initialized
  if (!globalViewMode) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-[200] w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-2 sm:px-4">
          <div className="flex items-center space-x-1 sm:space-x-6">
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
                className="hidden sm:block flex-shrink-0"
              />
              <Image
                src={caisLogoShort}
                alt="Center for AI Safety"
                width={32}
                height={32}
                className="block sm:hidden flex-shrink-0"
              />
            </a>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center space-x-1 sm:space-x-6">
              {navigationItems.map((item) => (
                <React.Fragment key={item.id}>
                  <Button
                    variant="ghost"
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-1.5 sm:px-4 py-2 flex items-center gap-1 sm:gap-2"
                    onClick={() => onNavigate(item.id)}
                    title={item.description}
                  >
                    <Image
                      src={item.logo}
                      alt={`${item.label} icon`}
                      width={32}
                      height={32}
                      className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8"
                    />
                    <span className="text-xs sm:text-sm">{item.label}</span>
                  </Button>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* GitHub Link - Desktop Only */}
          <a 
            href={GITHUB_URL} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden sm:flex hover:opacity-80 transition-opacity"
            title="View on GitHub"
          >
            <Image
              src={githubLogo}
              alt="GitHub"
              width={28}
              height={28}
              className="flex-shrink-0"
            />
          </a>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-[200] w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-2 sm:px-4">
        {/* Left side: CAIS Logo + Navigation Links */}
        <div className="flex items-center space-x-1 sm:space-x-6">
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
          
          {/* Separator */}
          <div className="h-6 w-px bg-gray-300" />
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-8">
            {navigationItems.map((item) => (
              <React.Fragment key={item.id}>
                <Button
                  variant="ghost"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-1.5 sm:px-4 py-2 flex items-center gap-1 sm:gap-2"
                  onClick={() => onNavigate(item.id)}
                  title={item.description}
                >
                  <Image
                    src={item.logo}
                    alt={`${item.label} icon`}
                    width={32}
                    height={32}
                    className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8"
                  />
                  <span className="text-xs sm:text-sm">{item.label}</span>
                </Button>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* GitHub Link - Desktop Only */}
        <a 
          href={GITHUB_URL} 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden sm:flex hover:opacity-80 transition-opacity"
          title="View on GitHub"
        >
          <Image
            src={githubLogo}
            alt="GitHub"
            width={28}
            height={28}
            className="flex-shrink-0"
          />
        </a>
      </div>
    </nav>
  );
};
