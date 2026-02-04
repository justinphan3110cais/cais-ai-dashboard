"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Image from 'next/image';
import { ExternalLink } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, LabelList } from 'recharts';
import rliLogo from "@/assets/dataset-logos/rli_logo.webp";
import { PROVIDER_COLORS, getProviderLogo } from "@/app/constants";
import rliData from "@/data/rli.json";

interface RLIModelData {
  name: string;
  rate: number;
  provider: string;
}

export function RemoteLaborIndex() {
  const [isMobile, setIsMobile] = useState(false);
  
  // Sort RLI models by rate descending
  const RLI_MODELS: RLIModelData[] = useMemo(() => {
    return [...rliData].sort((a, b) => b.rate - a.rate);
  }, []);
  
  // Title tooltip state
  const [showTitleTooltip, setShowTitleTooltip] = useState(false);
  const [titleTooltipPos, setTitleTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [isHoveringTitleTooltip, setIsHoveringTitleTooltip] = useState(false);
  const titleCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const titleTriggerRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (titleCloseTimeoutRef.current) {
        clearTimeout(titleCloseTimeoutRef.current);
      }
    };
  }, []);

  // Title tooltip handlers
  const handleTitleMouseEnter = useCallback(() => {
    if (isMobile) return;
    
    if (titleCloseTimeoutRef.current) {
      clearTimeout(titleCloseTimeoutRef.current);
      titleCloseTimeoutRef.current = null;
    }
    
    if (titleTriggerRef.current) {
      const rect = titleTriggerRef.current.getBoundingClientRect();
      setTitleTooltipPos({
        x: rect.left + rect.width / 2,
        y: rect.bottom
      });
      setShowTitleTooltip(true);
    }
  }, [isMobile]);

  const handleTitleMouseLeave = useCallback(() => {
    titleCloseTimeoutRef.current = setTimeout(() => {
      if (!isHoveringTitleTooltip) {
        setShowTitleTooltip(false);
        setTitleTooltipPos(null);
      }
    }, 100);
  }, [isHoveringTitleTooltip]);

  const handleTitleTooltipEnter = useCallback(() => {
    if (titleCloseTimeoutRef.current) {
      clearTimeout(titleCloseTimeoutRef.current);
      titleCloseTimeoutRef.current = null;
    }
    setIsHoveringTitleTooltip(true);
  }, []);

  const handleTitleTooltipLeave = useCallback(() => {
    setIsHoveringTitleTooltip(false);
    setShowTitleTooltip(false);
    setTitleTooltipPos(null);
  }, []);

  // Custom label component for bar chart (matching InlineBarChart style)
  const createCustomLabel = () => {
    // eslint-disable-next-line react/display-name, @typescript-eslint/no-explicit-any
    return (props: any) => {
      const { x, y, width, height, value, index } = props;
      
      if (value === null || value === undefined) return null;
      if (!RLI_MODELS[index]) return null;
      
      const entry = RLI_MODELS[index];
      const providerLogo = getProviderLogo(entry.provider);
      
      return (
        <g>
          {/* Provider logo - positioned on top of bar */}
          <foreignObject 
            x={Number(x) + Number(width) / 2 - 10} 
            y={Number(y) - 28} 
            width={20} 
            height={20}
          >
            <div className="flex justify-center items-center">
              <Image
                src={providerLogo.src}
                alt={`${entry.provider} logo`}
                width={20}
                height={20}
                className="rounded"
              />
            </div>
          </foreignObject>
          {/* Score text - centered in the middle of bar */}
          <text 
            x={Number(x) + Number(width) / 2} 
            y={Number(y) + Number(height) / 2} 
            fill="white"
            textAnchor="middle" 
            dominantBaseline="middle"
            fontSize={isMobile ? "10" : "12"}
            fontWeight="600"
          >
            {typeof value === 'number' ? value.toFixed(2) : value}%
          </text>
        </g>
      );
    };
  };

  return (
    <div className="w-full h-full flex flex-col border-t border-gray-300 pt-6 mt-6">
      {/* Header with Logo and Title */}
      <div className="flex flex-col items-center gap-3 mb-4 w-full">
        <div className="relative flex flex-col sm:block items-center sm:w-fit">
          <div className="sm:absolute sm:right-full sm:mr-3 sm:top-1/2 sm:-translate-y-1/2 flex items-center justify-center">
            <Image src={rliLogo} alt="Remote Labor Index" width={72} height={72} className="flex-shrink-0" />
          </div>
          <a 
            ref={titleTriggerRef}
            href="https://remotelabor.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-foreground hover:text-foreground border-b border-dashed border-black font-bold text-lg sm:text-2xl text-center"
            onMouseEnter={handleTitleMouseEnter}
            onMouseLeave={handleTitleMouseLeave}
          >
            RLI: Remote Labor Automation
          </a>
        </div>
        {/* Main metric */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-3xl sm:text-4xl font-bold text-foreground">
            {RLI_MODELS.length > 0 ? RLI_MODELS[0].rate.toFixed(2) : '0.00'}%
          </p>
          <p className="text-base sm:text-xl text-gray-700 text-center">
            full automation of remote projects
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      <div 
        className={`overflow-visible mt-2 mx-auto ${isMobile ? 'h-96 w-full relative' : 'h-80 w-full'}`}
        style={isMobile ? undefined : { maxWidth: `${RLI_MODELS.length * 75 + 80}px` }}
      >
        {/* Mobile Y-axis label positioned absolutely */}
        {isMobile && (
          <div className="absolute left-1 top-4 z-10">
            <p className="text-[12px] text-gray-700 font-medium leading-tight">
              Automation<br />Rate (%)
            </p>
          </div>
        )}
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={RLI_MODELS}
            barCategoryGap={isMobile ? "0%" : "1.5%"}
            margin={{
              top: isMobile ? 60 : 35,
              right: isMobile ? 5 : 10,
              left: isMobile ? -40 : 60,
              bottom: 0,
            }}
          >
            <XAxis 
              dataKey="name" 
              height={isMobile ? 70 : 90}
              interval={0}
              padding={{ left: 5, right: 0 }}
              tick={(props: any) => {
                const { x, y, payload } = props;
                const modelName = payload.value;
                const words = modelName.split(' ');
                const firstName = words[0];
                const restName = words.slice(1).join(' ');
                
                // Smaller font on mobile
                const fontSize = isMobile ? '7.8px' : '11px';
                // Reduced line spacing on mobile
                const lineSpacing = isMobile ? 10 : 15;
                
                return (
                  <g transform={`translate(${x},${y})`}>
                    {/* First word (horizontal) */}
                    <text
                      x={0}
                      y={10}
                      textAnchor="middle"
                      style={{ 
                        fontSize: fontSize, 
                        fontWeight: 600, 
                        fill: '#374151'
                      }}
                    >
                      {firstName}
                    </text>
                    
                    {/* Rest of name (horizontal, second line) */}
                    {restName && (
                      <text
                        x={0}
                        y={10 + lineSpacing}
                        textAnchor="middle"
                        style={{ 
                          fontSize: fontSize, 
                          fontWeight: 600, 
                          fill: '#374151'
                        }}
                      >
                        {restName}
                      </text>
                    )}
                  </g>
                );
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              domain={[0, 5]}
              ticks={[0, 1, 2, 3, 4, 5]}
              tick={{ fontSize: 12, fill: '#374151' }}
              axisLine={{ stroke: '#d1d5db', strokeWidth: 1 }}
              tickLine={false}
              label={isMobile ? undefined : { 
                value: 'Automation Rate (%)', 
                angle: -90, 
                position: 'insideLeft',
                offset: 10,
                style: { textAnchor: 'middle', fill: '#374151', fontSize: 14, fontWeight: 500 }
              }}
            />
            <Bar 
              dataKey="rate"
              radius={[4, 4, 0, 0]}
              maxBarSize={isMobile ? 40 : 70}
            >
              <LabelList content={createCustomLabel()} />
              {RLI_MODELS.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={PROVIDER_COLORS[entry.provider] || PROVIDER_COLORS['moonshot']}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Desktop Tooltip for title */}
      {!isMobile && showTitleTooltip && titleTooltipPos && (() => {
        const tooltipWidth = 320;
        const viewportWidth = window.innerWidth;
        const padding = 20;
        
        let translateX = '-50%';
        let left = titleTooltipPos.x;
        
        if (titleTooltipPos.x + tooltipWidth / 2 > viewportWidth - padding) {
          translateX = '-100%';
          left = titleTooltipPos.x;
        } else if (titleTooltipPos.x - tooltipWidth / 2 < padding) {
          translateX = '0%';
          left = titleTooltipPos.x;
        }
        
        return (
          <div
            style={{
              position: 'fixed',
              left: left,
              top: titleTooltipPos.y,
              transform: `translate(${translateX}, 0)`,
              zIndex: 9999,
              pointerEvents: 'auto',
              marginTop: '-10px'
            }}
            onMouseEnter={handleTitleTooltipEnter}
            onMouseLeave={handleTitleTooltipLeave}
          >
            <div className="bg-white text-foreground border-2 border-black rounded-lg shadow-lg p-3 w-80">
              <p className="text-sm text-gray-700">
              <a 
                href="http://remotelabor.ai/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground hover:text-foreground inline-flex items-center gap-1 text-sm underline"
              >
                Remote Labor Index (RLI) <ExternalLink className="w-3.5 h-3.5" /></a> measures the AI automation rate of remote work.
              </p>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
