"use client";

import React from 'react';
import Image from 'next/image';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer } from 'recharts';
import { ExternalLink } from 'lucide-react';
import agiDefinitionLogo from "@/assets/dataset-logos/agi_definition_logo.svg";
import kIcon from "@/assets/dataset-logos/agi_icons/k.svg";
import rwIcon from "@/assets/dataset-logos/agi_icons/rw.svg";
import mIcon from "@/assets/dataset-logos/agi_icons/m.svg";
import rIcon from "@/assets/dataset-logos/agi_icons/r.svg";
import wmIcon from "@/assets/dataset-logos/agi_icons/wm.svg";
import msIcon from "@/assets/dataset-logos/agi_icons/ms.svg";
import mrIcon from "@/assets/dataset-logos/agi_icons/mr.svg";
import vIcon from "@/assets/dataset-logos/agi_icons/v.svg";
import aIcon from "@/assets/dataset-logos/agi_icons/a.svg";
import sIcon from "@/assets/dataset-logos/agi_icons/s.svg";

interface AGIScores {
  K: number;
  RW: number;
  M: number;
  R: number;
  WM: number;
  MS: number;
  MR: number;
  V: number;
  A: number;
  S: number;
}

interface AGIRadarChartProps {
  gpt4Data?: AGIScores;
  gpt5Data?: AGIScores;
  gpt52Data?: AGIScores;
}

// Definitions for each cognitive component
const DEFINITIONS = {
  'Knowledge': "The breadth of factual understanding of the world, encompassing commonsense, culture, science, social science, and history.",
  'Reading & Writing': "Proficiency in consuming and producing written language, from basic decoding to complex comprehension, composition, and usage.",
  'Math': "The depth of mathematical knowledge and skills across arithmetic, algebra, geometry, probability, and calculus.",
  'Reasoning': "The flexible control of attention to solve novel problems without relying exclusively on previously learned schemas, tested via deduction and induction.",
  'Working Memory': "The ability to maintain and manipulate information in active attention across textual, auditory, and visual modalities.",
  'Memory Storage': "The capability to continually learn new information (associative, meaningful, and verbatim).",
  'Memory Retrieval': "The fluency and precision of accessing stored knowledge, including the critical ability to avoid confabulation (hallucinations).",
  'Visual': "The ability to perceive, analyze, reason about, generate, and scan visual information.",
  'Auditory': "The capacity to discriminate, recognize, and work creatively with auditory stimuli, including speech, rhythm, and music.",
  'Speed': "The ability to perform simple cognitive tasks quickly, encompassing perceptual speed, reaction times, and processing fluency."
};

// Icon mapping for each cognitive component
const ICONS = {
  'Knowledge': kIcon,
  'Reading & Writing': rwIcon,
  'Math': mIcon,
  'Reasoning': rIcon,
  'Working Memory': wmIcon,
  'Memory Storage': msIcon,
  'Memory Retrieval': mrIcon,
  'Visual': vIcon,
  'Auditory': aIcon,
  'Speed': sIcon
};

export function AGIRadarChart({ 
  gpt4Data = { K: 8, RW: 6, M: 4, R: 0, WM: 2, MS: 0, MR: 4, V: 0, A: 0, S: 3 },
  gpt5Data = { K: 9, RW: 10, M: 10, R: 7, WM: 4, MS: 0, MR: 4, V: 4, A: 6, S: 3 },
  gpt52Data = { K: 9, RW: 10, M: 10, R: 9, WM: 4, MS: 0, MR: 4, V: 4, A: 6, S: 3 }
}: AGIRadarChartProps) {
  const [hoveredDimension, setHoveredDimension] = React.useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = React.useState<{ x: number; y: number } | null>(null);
  const [hoveredModel, setHoveredModel] = React.useState<string | null>(null);
  const [modelTooltipPos, setModelTooltipPos] = React.useState<{ x: number; y: number } | null>(null);
  const closeTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const modelCloseTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const mousePositionRef = React.useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  
  // Title tooltip state
  const [showTitleTooltip, setShowTitleTooltip] = React.useState(false);
  const [titleTooltipPos, setTitleTooltipPos] = React.useState<{ x: number; y: number } | null>(null);
  const [isHoveringTitleTooltip, setIsHoveringTitleTooltip] = React.useState(false);
  const titleCloseTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const titleTriggerRef = React.useRef<HTMLAnchorElement>(null);
  
  // Mobile detection
  const [isMobile, setIsMobile] = React.useState(false);
  
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (titleCloseTimeoutRef.current) {
        clearTimeout(titleCloseTimeoutRef.current);
      }
    };
  }, []);

  // Track mouse position globally
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePositionRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const data = [
    {
      dimension: 'Knowledge',
      fullName: 'General Knowledge',
      'GPT-4': gpt4Data.K,
      'GPT-5': gpt5Data.K,
      'GPT-5.2': gpt52Data.K,
    },
    {
      dimension: 'Reading & Writing',
      fullName: 'Reading and Writing',
      'GPT-4': gpt4Data.RW,
      'GPT-5': gpt5Data.RW,
      'GPT-5.2': gpt52Data.RW,
    },
    {
      dimension: 'Math',
      fullName: 'Mathematical Ability',
      'GPT-4': gpt4Data.M,
      'GPT-5': gpt5Data.M,
      'GPT-5.2': gpt52Data.M,
    },
    {
      dimension: 'Reasoning',
      fullName: 'On-the-Spot Reasoning',
      'GPT-4': gpt4Data.R,
      'GPT-5': gpt5Data.R,
      'GPT-5.2': gpt52Data.R,
    },
    {
      dimension: 'Working Memory',
      fullName: 'Working Memory',
      'GPT-4': gpt4Data.WM,
      'GPT-5': gpt5Data.WM,
      'GPT-5.2': gpt52Data.WM,
    },
    {
      dimension: 'Memory Storage',
      fullName: 'Long-Term Memory Storage',
      'GPT-4': gpt4Data.MS,
      'GPT-5': gpt5Data.MS,
      'GPT-5.2': gpt52Data.MS,
    },
    {
      dimension: 'Memory Retrieval',
      fullName: 'Long-Term Memory Retrieval',
      'GPT-4': gpt4Data.MR,
      'GPT-5': gpt5Data.MR,
      'GPT-5.2': gpt52Data.MR,
    },
    {
      dimension: 'Visual',
      fullName: 'Visual Processing',
      'GPT-4': gpt4Data.V,
      'GPT-5': gpt5Data.V,
      'GPT-5.2': gpt52Data.V,
    },
    {
      dimension: 'Auditory',
      fullName: 'Auditory Processing',
      'GPT-4': gpt4Data.A,
      'GPT-5': gpt5Data.A,
      'GPT-5.2': gpt52Data.A,
    },
    {
      dimension: 'Speed',
      fullName: 'Speed',
      'GPT-4': gpt4Data.S,
      'GPT-5': gpt5Data.S,
      'GPT-5.2': gpt52Data.S,
    },
  ];

  const gpt4Total = Object.values(gpt4Data).reduce((a, b) => a + b, 0);
  const gpt5Total = Object.values(gpt5Data).reduce((a, b) => a + b, 0);
  const gpt52Total = Object.values(gpt52Data).reduce((a, b) => a + b, 0);

  const handleMouseEnter = React.useCallback((dimension: string, event: React.MouseEvent<SVGTextElement>) => {
    // On mobile, don't show hover tooltip (use click instead)
    if (isMobile) return;
    
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    
    const target = event.currentTarget as SVGElement;
    const rect = target.getBoundingClientRect();
    
    setHoveredDimension(dimension);
    setTooltipPosition({ 
      x: rect.left + rect.width / 2, 
      y: rect.top
    });
  }, [isMobile]);

  const handleClick = React.useCallback((dimension: string) => {
    // On mobile, show as centered popup
    if (isMobile) {
      setHoveredDimension(dimension);
      setTooltipPosition(null); // Centered popup doesn't need position
    }
  }, [isMobile]);

  const handleMouseLeave = React.useCallback(() => {
    // Delay closing to allow moving to tooltip
    closeTimeoutRef.current = setTimeout(() => {
      setHoveredDimension(null);
      setTooltipPosition(null);
    }, 150);
  }, []);

  const handleMouseEnterTooltip = React.useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const handleMouseLeaveTooltip = React.useCallback(() => {
    setHoveredDimension(null);
    setTooltipPosition(null);
  }, []);

  const handleRadarMouseEnter = (modelName: string) => {
    // On mobile, don't show hover tooltip (use click instead)
    if (isMobile) return;
    
    if (modelCloseTimeoutRef.current) {
      clearTimeout(modelCloseTimeoutRef.current);
      modelCloseTimeoutRef.current = null;
    }
    setHoveredModel(modelName);
    
    // Use the current mouse position from the ref
    setModelTooltipPos({ 
      x: mousePositionRef.current.x, 
      y: mousePositionRef.current.y 
    });
  };

  const handleRadarClick = (modelName: string) => {
    // On mobile, show as centered popup
    if (isMobile) {
      setHoveredModel(modelName);
      setModelTooltipPos(null); // Centered popup doesn't need position
    }
  };

  const handleRadarMouseLeave = () => {
    // Don't set timeout on mobile since we're using click
    if (!isMobile) {
      modelCloseTimeoutRef.current = setTimeout(() => {
        setHoveredModel(null);
        setModelTooltipPos(null);
      }, 100);
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      // Close all tooltips when scrolling
      setHoveredDimension(null);
      setTooltipPosition(null);
      setHoveredModel(null);
      setModelTooltipPos(null);
      setShowTitleTooltip(false);
      setTitleTooltipPos(null);
      
      // Clear any pending timeouts
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
        closeTimeoutRef.current = null;
      }
      if (modelCloseTimeoutRef.current) {
        clearTimeout(modelCloseTimeoutRef.current);
        modelCloseTimeoutRef.current = null;
      }
      if (titleCloseTimeoutRef.current) {
        clearTimeout(titleCloseTimeoutRef.current);
        titleCloseTimeoutRef.current = null;
      }
    };

    // Add scroll listener
    window.addEventListener('scroll', handleScroll, true);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
      if (modelCloseTimeoutRef.current) {
        clearTimeout(modelCloseTimeoutRef.current);
      }
      if (titleCloseTimeoutRef.current) {
        clearTimeout(titleCloseTimeoutRef.current);
      }
    };
  }, []);

  const CustomAxisTick = ({ x, y, payload }: { x: number; y: number; payload: { value: string } }) => {
    return (
      <g>
        <text
          x={x}
          y={y}
          textAnchor="middle"
          fill="#374151"
          fontSize={12}
          fontWeight={500}
          className="cursor-help"
          onMouseEnter={(e) => handleMouseEnter(payload.value, e)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(payload.value)}
          style={{ pointerEvents: 'all' }}
        >
          {payload.value}
        </text>
      </g>
    );
  };

  const CustomRadiusTick = ({ x, y, payload }: { x: number; y: number; payload: { value: number } }) => {
    // Offset the text slightly to the left to avoid the vertical line
    return (
      <text
        x={x}
        y={y + 10}
        fill="#000000"
        fontSize={10}
        fontWeight={500}
        style={{ zIndex: 20 }}
      >
        {payload.value}
      </text>
    );
  };

  const dimensionData = hoveredDimension ? data.find(d => d.dimension === hoveredDimension) : null;

  // Title tooltip handlers
  const handleTitleMouseEnter = React.useCallback(() => {
    if (isMobile) return; // No tooltip on mobile
    
    if (titleCloseTimeoutRef.current) {
      clearTimeout(titleCloseTimeoutRef.current);
      titleCloseTimeoutRef.current = null;
    }
    
    if (titleTriggerRef.current) {
      const rect = titleTriggerRef.current.getBoundingClientRect();
      setShowTitleTooltip(true);
      setTitleTooltipPos({
        x: rect.left + rect.width / 2,
        y: rect.top
      });
    }
  }, [isMobile]);

  const handleTitleMouseLeave = React.useCallback(() => {
    if (isMobile) return;
    
    if (!isHoveringTitleTooltip) {
      titleCloseTimeoutRef.current = setTimeout(() => {
        setShowTitleTooltip(false);
        setTitleTooltipPos(null);
      }, 150);
    }
  }, [isMobile, isHoveringTitleTooltip]);

  const handleTitleTooltipEnter = React.useCallback(() => {
    if (titleCloseTimeoutRef.current) {
      clearTimeout(titleCloseTimeoutRef.current);
      titleCloseTimeoutRef.current = null;
    }
    setIsHoveringTitleTooltip(true);
  }, []);

  const handleTitleTooltipLeave = React.useCallback(() => {
    setIsHoveringTitleTooltip(false);
    setShowTitleTooltip(false);
    setTitleTooltipPos(null);
  }, []);

  return (
    <div className="w-full">
      {/* Mobile Legend - positioned above chart */}
      <div className="flex flex-col items-center gap-2 mb-2 md:hidden">
        <div className="flex items-center gap-2 mb-2">
          <Image src={agiDefinitionLogo} alt="AGI Definition" width={42} height={42} className="flex-shrink-0" />
          <a 
            ref={titleTriggerRef}
            href="https://agidefinition.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-foreground hover:text-foreground border-b border-dashed border-black font-bold text-lg sm:text-2xl"
            onMouseEnter={handleTitleMouseEnter}
            onMouseLeave={handleTitleMouseLeave}
          >
            AGI: Intelligence Automation
          </a>
        </div>
        <div
          className={`flex items-center gap-1.5 border-b-2 border-[#dc2626] pb-1 cursor-pointer transition-opacity ${hoveredModel === 'GPT-5.2' ? 'opacity-100' : hoveredModel ? 'opacity-40' : ''}`}
          onClick={() => handleRadarClick('GPT-5.2')}
        >
          <span className="text-sm font-medium text-gray-700">GPT-5.2 AGI Score:</span>
          <span className="text-2xl font-bold text-foreground">{gpt52Total}%</span>
        </div>
        <div
          className={`flex items-center gap-1.5 pb-1 cursor-pointer transition-opacity ${hoveredModel === 'GPT-5' ? 'opacity-100' : hoveredModel ? 'opacity-40' : ''}`}
          onClick={() => handleRadarClick('GPT-5')}
        >
          <span className="text-sm text-muted-foreground">GPT-5 AGI Score:</span>
          <span className="text-sm text-muted-foreground">{gpt5Total}%</span>
        </div>
        <div
          className={`flex items-center gap-1.5 border-b-2 border-[#6b21a8] pb-1 cursor-pointer transition-opacity ${hoveredModel === 'GPT-4' ? 'opacity-100' : hoveredModel ? 'opacity-40' : ''}`}
          onClick={() => handleRadarClick('GPT-4')}
        >
          <span className="text-sm font-medium text-gray-700">GPT-4 AGI Score:</span>
          <span className="text-sm font-medium text-foreground">{gpt4Total}%</span>
        </div>
      </div>

      {/* Desktop Title - positioned above chart */}
      <div className="hidden md:flex flex-col items-center gap-2 mb-2 md:gap-3 md:mb-4 w-full">
        <div className="relative flex items-center justify-center w-fit">
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 flex items-center">
            <Image src={agiDefinitionLogo} alt="AGI Definition" width={42} height={42} className="flex-shrink-0" />
          </div>
          <a 
            ref={titleTriggerRef}
            href="https://agidefinition.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-foreground hover:text-foreground border-b border-dashed border-black font-bold text-lg sm:text-2xl text-center"
            onMouseEnter={handleTitleMouseEnter}
            onMouseLeave={handleTitleMouseLeave}
          >
            AGI: Intelligence Automation
          </a>
        </div>
      </div>
      
      {/* Radar Chart with Legend on the right */}
      <div className="relative">
        <ResponsiveContainer width="100%" height={450}>
          <RadarChart 
            data={data} 
            outerRadius="70%" 
            margin={{ top: 0, right: isMobile ? 0 : 80, bottom: 0, left: 0 }} 
            cx={isMobile ? "50%" : "35%"}
          >
            <PolarGrid stroke="#e5e7eb" strokeWidth={1.0} />
            <PolarAngleAxis 
              dataKey="dimension" 
              tick={(props) => <CustomAxisTick {...props} />}
              tickSize={30}
            />
            <Radar
              name="GPT-5.2"
              dataKey="GPT-5.2"
              stroke="#dc2626"
              fill="transparent"
              strokeWidth={isMobile ? 5 : (hoveredModel === 'GPT-5.2' ? 4 : 2.5)}
              strokeOpacity={hoveredModel === null ? 0.7 : (hoveredModel === 'GPT-5.2' ? 1 : 0.3)}
              onMouseEnter={() => {
                if (!isMobile) {
                  handleRadarMouseEnter('GPT-5.2');
                }
              }}
              onMouseLeave={() => {
                if (!isMobile) {
                  handleRadarMouseLeave();
                }
              }}
              onClick={() => handleRadarClick('GPT-5.2')}
            />
            <Radar
              name="GPT-4"
              dataKey="GPT-4"
              stroke="#6b21a8"
              fill="transparent"
              strokeWidth={isMobile ? 5 : (hoveredModel === 'GPT-4' ? 4.5 : 3.2)}
              strokeOpacity={hoveredModel === null ? 0.7 : (hoveredModel === 'GPT-4' ? 1 : 0.3)}
              onMouseEnter={() => {
                if (!isMobile) {
                  handleRadarMouseEnter('GPT-4');
                }
              }}
              onMouseLeave={() => {
                if (!isMobile) {
                  handleRadarMouseLeave();
                }
              }}
              onClick={() => handleRadarClick('GPT-4')}
            />
          <PolarRadiusAxis 
            angle={-90}
            domain={[0, 10]} 
            tick={(props) => <CustomRadiusTick {...props} />}
            tickCount={6}
          />
        </RadarChart>
      </ResponsiveContainer>
      
      {/* Custom Legend - positioned on the right side */}
      <div className="absolute right-0 top-[15%] -translate-y-1/2 hidden md:flex flex-col gap-2">
        <div
          className={`flex items-center gap-1.5 border-b-2 border-[#dc2626] pb-1 cursor-pointer transition-opacity ${hoveredModel === 'GPT-5.2' ? 'opacity-100' : hoveredModel ? 'opacity-40' : ''}`}
          onMouseEnter={() => handleRadarMouseEnter('GPT-5.2')}
          onMouseLeave={() => handleRadarMouseLeave()}
        >
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">GPT-5.2 AGI Score:</span>
          <span className="text-3xl font-bold text-foreground">{gpt52Total}%</span>
        </div>
        <div
          className={`flex items-center gap-1.5 pb-1 cursor-pointer transition-opacity ${hoveredModel === 'GPT-5' ? 'opacity-100' : hoveredModel ? 'opacity-40' : ''}`}
          onMouseEnter={() => handleRadarMouseEnter('GPT-5')}
          onMouseLeave={() => handleRadarMouseLeave()}
        >
          <span className="text-sm text-muted-foreground whitespace-nowrap">GPT-5 AGI Score:</span>
          <span className="text-sm text-muted-foreground">{gpt5Total}%</span>
        </div>
        <div
          className={`flex items-center gap-1.5 border-b-2 border-[#6b21a8] pb-1 cursor-pointer transition-opacity ${hoveredModel === 'GPT-4' ? 'opacity-100' : hoveredModel ? 'opacity-40' : ''}`}
          onMouseEnter={() => handleRadarMouseEnter('GPT-4')}
          onMouseLeave={() => handleRadarMouseLeave()}
        >
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">GPT-4 AGI Score:</span>
          <span className="text-sm font-medium text-foreground">{gpt4Total}%</span>
        </div>
      </div>
    </div>

      {/* Model Comparison Table - shows all models in a grid */}
      {hoveredModel && (
        <>
          {isMobile && (
            /* Mobile: backdrop to close popup */
            <div 
              className="fixed inset-0 z-[999] bg-black/20"
              onClick={() => {
                setHoveredModel(null);
                setModelTooltipPos(null);
              }}
            />
          )}
          <div
            style={
              isMobile
                ? {
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'auto',
                    zIndex: 1000,
                  }
                : modelTooltipPos
                ? {
                    position: 'fixed',
                    left: modelTooltipPos.x,
                    top: modelTooltipPos.y,
                    transform: 'translate(-50%, -100%)',
                    pointerEvents: 'none',
                    zIndex: 1000,
                    marginTop: '-10px'
                  }
                : { display: 'none' }
            }
            className="bg-white border-2 border-black rounded-lg shadow-lg p-3 max-w-[90vw]"
          >
            {/* Grid Header */}
            <div className="grid grid-cols-4 gap-2 text-xs border-b border-gray-200 pb-2 mb-2">
              <div className="font-medium text-gray-500"></div>
              <div className={`text-center border-b-2 border-[#6b21a8] pb-1 ${hoveredModel === 'GPT-4' ? 'font-bold' : 'font-medium'}`}>GPT-4</div>
              <div className={`text-center pb-1 ${hoveredModel === 'GPT-5' ? 'font-bold' : 'font-medium'}`}>GPT-5</div>
              <div className={`text-center border-b-2 border-[#dc2626] pb-1 ${hoveredModel === 'GPT-5.2' ? 'font-bold' : 'font-medium'}`}>GPT-5.2</div>
            </div>
            {/* Grid Body */}
            <div className="space-y-1">
              {data.map((item) => (
                <div key={item.dimension} className="grid grid-cols-4 gap-2 text-xs items-center">
                  <div className="flex items-center gap-1">
                    <Image 
                      src={ICONS[item.dimension as keyof typeof ICONS]} 
                      alt={item.dimension} 
                      width={14} 
                      height={14} 
                      className="flex-shrink-0"
                    />
                    <span className="text-gray-600 truncate">{item.dimension}</span>
                  </div>
                  <span className={`font-mono text-center ${hoveredModel === 'GPT-4' ? 'font-bold' : 'font-medium'}`}>
                    {item['GPT-4']}
                  </span>
                  <span className={`font-mono text-center ${hoveredModel === 'GPT-5' ? 'font-bold' : 'font-medium'}`}>
                    {item['GPT-5']}
                  </span>
                  <span className={`font-mono text-center ${hoveredModel === 'GPT-5.2' ? 'font-bold' : 'font-medium'}`}>
                    {item['GPT-5.2']}
                  </span>
                </div>
              ))}
              {/* Totals Row */}
              <div className="grid grid-cols-4 gap-2 text-xs items-center border-t border-gray-200 pt-2 mt-2">
                <span className="font-medium">Total</span>
                <span className={`font-mono text-center ${hoveredModel === 'GPT-4' ? 'font-bold' : 'font-medium'}`}>{gpt4Total}%</span>
                <span className={`font-mono text-center ${hoveredModel === 'GPT-5' ? 'font-bold' : 'font-medium'}`}>{gpt5Total}%</span>
                <span className={`font-mono text-center ${hoveredModel === 'GPT-5.2' ? 'font-bold' : 'font-medium'}`}>{gpt52Total}%</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Custom tooltip overlay */}
      {hoveredDimension && dimensionData && (
        <>
          {isMobile && (
            /* Mobile: backdrop to close popup */
            <div 
              className="fixed inset-0 z-[999] bg-black/20"
              onClick={() => {
                setHoveredDimension(null);
                setTooltipPosition(null);
              }}
            />
          )}
          <div
            style={
              isMobile
                ? {
                    position: 'fixed',
                    left: '50%',
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    pointerEvents: 'auto',
                    zIndex: 1000,
                    width: 'auto'
                  }
                : tooltipPosition
                ? {
                    position: 'fixed',
                    left: tooltipPosition.x,
                    top: tooltipPosition.y,
                    transform: 'translate(-50%, -100%)',
                    pointerEvents: 'auto',
                    zIndex: 1000,
                    width: 'auto'
                  }
                : { display: 'none' }
            }
            onMouseEnter={isMobile ? undefined : handleMouseEnterTooltip}
            onMouseLeave={isMobile ? undefined : handleMouseLeaveTooltip}
          >
            <div className="bg-white border-2 border-black rounded-lg shadow-lg p-3 max-w-xs mb-2">
              <div className="flex items-center gap-2 mb-2">
                <Image 
                  src={ICONS[hoveredDimension as keyof typeof ICONS]} 
                  alt={dimensionData.fullName} 
                  width={20} 
                  height={20} 
                  className="flex-shrink-0"
                />
                <p className="font-semibold text-sm">{dimensionData.fullName}</p>
              </div>
              <p className="text-xs text-gray-700 leading-relaxed mb-3">
                {DEFINITIONS[hoveredDimension as keyof typeof DEFINITIONS]}
              </p>
              <div className="space-y-1.5 border-t border-gray-200 pt-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-0.5 bg-[#dc2626]"></div>
                  <span className="font-medium">GPT-5.2: {dimensionData['GPT-5.2']}%</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-0.5 bg-transparent"></div>
                  <span className="text-muted-foreground">GPT-5: {dimensionData['GPT-5']}%</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-0.5 bg-[#6b21a8]"></div>
                  <span className="font-medium">GPT-4: {dimensionData['GPT-4']}%</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Title Tooltip */}
      {!isMobile && showTitleTooltip && titleTooltipPos && (
        <div
          style={{
            position: 'fixed',
            left: titleTooltipPos.x,
            top: titleTooltipPos.y,
            transform: 'translate(-50%, -100%)',
            pointerEvents: 'auto',
            zIndex: 1000,
            marginTop: '-10px'
          }}
          onMouseEnter={handleTitleTooltipEnter}
          onMouseLeave={handleTitleTooltipLeave}
        >
          <div className="bg-white text-foreground border-2 border-black rounded-lg shadow-lg p-3 w-80">
            <p className="text-sm text-gray-700 mb-2">
              Artificial General Intelligence (AGI) is an AI that can match or exceed the cognitive versatility and proficiency of a well-educated adult.
            </p>
            <p className="text-sm text-gray-700">
              See             <a 
              href="https://agidefinition.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-foreground hover:text-foreground inline-flex items-center gap-1 text-sm underline"
            >this paper  <ExternalLink className="w-3.5 h-3.5" /></a> for more information about how AGI is defined and measured.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

