import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChartColumnBig, Table as TableIcon } from 'lucide-react';
import caisLogo from '@/assets/cais_icon_black_text.svg';
import caisLogoShort from '@/assets/cais_logo.svg';
import textLogoColored from '@/assets/dataset-logos/text_logo_colored.svg';
import visionLogoColored from '@/assets/dataset-logos/vision_logo_colored.svg';
import safetyLogoColored from '@/assets/dataset-logos/safety_logo_colored.svg';

interface NavigationProps {
  onNavigate: (section: string) => void;
  globalViewMode: 'table' | 'chart' | null;
  onGlobalViewModeChange: (mode: 'table' | 'chart') => void;
}

export const Navigation: React.FC<NavigationProps> = ({ onNavigate, globalViewMode, onGlobalViewModeChange }) => {
  const navigationItems = [
    { id: 'text', label: 'Text', description: 'Text capabilities benchmarks', logo: textLogoColored },
    { id: 'vision', label: 'Vision', description: 'Multimodal and vision benchmarks', logo: visionLogoColored },
    { id: 'safety', label: 'Safety', description: 'AI safety benchmarks', logo: safetyLogoColored }
  ];

  // Don't render switch until globalViewMode is initialized
  if (!globalViewMode) {
    return (
      <nav className="fixed top-0 left-0 right-0 z-[200] w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-2 sm:space-x-6">
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
                width={40}
                height={40}
                className="block sm:hidden flex-shrink-0"
              />
            </a>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex items-center space-x-1 sm:space-x-6">
              {navigationItems.map((item, index) => (
                <React.Fragment key={item.id}>
                  {index > 0 && (
                    <div className="h-6 w-px bg-gray-300 sm:hidden" />
                  )}
                  <Button
                    variant="ghost"
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-2 sm:px-4 py-2 flex items-center gap-2"
                    onClick={() => onNavigate(item.id)}
                    title={item.description}
                  >
                    <Image
                      src={item.logo}
                      alt={`${item.label} icon`}
                      width={item.id === 'vision' ? 40 : 28}
                      height={item.id === 'vision' ? 40 : 28}
                      className="flex-shrink-0"
                    />
                    {item.label}
                  </Button>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-[200] w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Left side: CAIS Logo + Navigation Links */}
        <div className="flex items-center space-x-2 sm:space-x-6">
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
              width={40}
              height={40}
              className="block sm:hidden flex-shrink-0"
            />
          </a>
          
          {/* Separator */}
          <div className="h-6 w-px bg-gray-300" />
          
          {/* Navigation Links */}
          <div className="flex items-center space-x-1 sm:space-x-6">
            {navigationItems.map((item, index) => (
              <React.Fragment key={item.id}>
                {index > 0 && (
                  <div className="h-6 w-px bg-gray-300 sm:hidden" />
                )}
                <Button
                  variant="ghost"
                  className="text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 px-2 sm:px-4 py-2 flex items-center gap-2"
                  onClick={() => onNavigate(item.id)}
                  title={item.description}
                >
                  <Image
                    src={item.logo}
                    alt={`${item.label} icon`}
                    width={item.id === 'vision' ? 40 : 28}
                    height={item.id === 'vision' ? 40 : 28}
                    className="flex-shrink-0"
                  />
                  {item.label}
                </Button>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Separator - only on mobile */}
        <div className="h-6 w-px bg-gray-300 sm:hidden" />

        {/* Right side: View Mode Switch */}
        <div className="flex items-cente ml-2 gap-0.5 sm:gap-1 bg-white border border-gray-800 rounded-md p-0.5">
          <button
            onClick={() => onGlobalViewModeChange('table')}
            className={`p-1 sm:p-2 rounded ${globalViewMode === 'table' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-800'} transition-colors`}
            title="Table View"
          >
            <TableIcon className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
          <button
            onClick={() => onGlobalViewModeChange('chart')}
            className={`p-1 sm:p-2 rounded ${globalViewMode === 'chart' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-800'} transition-colors`}
            title="Bar Charts"
          >
            <ChartColumnBig className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </nav>
  );
};
