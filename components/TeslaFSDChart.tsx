"use client";

import React, { useMemo, useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { HelpCircle, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import teslaLogo from "@/assets/provider-logos/tesla_logo.svg";

interface TeslaDataPoint {
  version: string;
  date: Date;
  miles: number; // Total miles driven
  milesToCritical: number; // Total miles to critical
  cityMilesToCritical: number; // City miles to critical
  majorVersion: number;
}

export function TeslaFSDChart() {
  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  const [clickedPoint, setClickedPoint] = useState<{
    version: string;
    date: Date;
    milesToCritical: number;
    cityMilesToCritical: number;
  } | null>(null);
  
  // Tooltip state for 200k threshold
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isHoveringTooltip, setIsHoveringTooltip] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  
  // Tooltip state for title
  const [showTitleTooltip, setShowTitleTooltip] = useState(false);
  const [titleTooltipPos, setTitleTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [isHoveringTitleTooltip, setIsHoveringTitleTooltip] = useState(false);
  const titleCloseTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const titleTriggerRef = useRef<HTMLAnchorElement>(null);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Close tooltip on scroll
  useEffect(() => {
    const handleScroll = () => {
      setClickedPoint(null);
    };
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  const handleMouseEnter = useCallback((event: React.MouseEvent) => {
    if (isMobile) return;
    
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipPosition({ 
      x: rect.left + rect.width / 2, 
      y: rect.top - 10
    });
    setShowTooltip(true);
  }, [isMobile]);

  const handleMouseLeave = useCallback(() => {
    if (isMobile) return;
    
    // Delay closing to allow moving to tooltip
    closeTimeoutRef.current = setTimeout(() => {
      if (!isHoveringTooltip) {
        setShowTooltip(false);
        setTooltipPosition(null);
      }
    }, 150);
  }, [isMobile, isHoveringTooltip]);

  const handleMouseEnterTooltip = useCallback(() => {
    // Clear any pending close timeout
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsHoveringTooltip(true);
  }, []);

  const handleMouseLeaveTooltip = useCallback(() => {
    setIsHoveringTooltip(false);
    setShowTooltip(false);
    setTooltipPosition(null);
  }, []);

  const handleClick = useCallback(() => {
    if (isMobile) {
      setDialogOpen(true);
    }
  }, [isMobile]);

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

  const data = useMemo(() => {
    // Parse CSV data
    const rawData: TeslaDataPoint[] = [
      // Version 14
      { version: "14.1.7", date: new Date("2025-11-10"), miles: 1902, milesToCritical: 774, cityMilesToCritical: 379, majorVersion: 14 },
      { version: "14.1.4", date: new Date("2025-10-26"), miles: 13198, milesToCritical: 5282, cityMilesToCritical: 2231, majorVersion: 14 },
      { version: "14.1.3", date: new Date("2025-10-20"), miles: 2643, milesToCritical: 363, cityMilesToCritical: 323, majorVersion: 14 },
      { version: "14.1.2", date: new Date("2025-10-16"), miles: 261, milesToCritical: 13, cityMilesToCritical: 13, majorVersion: 14 },
      { version: "14.1.1", date: new Date("2025-10-11"), miles: 680, milesToCritical: 66, cityMilesToCritical: 66, majorVersion: 14 },
      { version: "14.1", date: new Date("2025-10-07"), miles: 524, milesToCritical: 157, cityMilesToCritical: 157, majorVersion: 14 },
      
      // Version 13
      { version: "13.2.9", date: new Date("2025-05-12"), miles: 83441, milesToCritical: 389, cityMilesToCritical: 214, majorVersion: 13 },
      { version: "13.2.8", date: new Date("2025-02-19"), miles: 26040, milesToCritical: 450, cityMilesToCritical: 205, majorVersion: 13 },
      { version: "13.2.7", date: new Date("2025-02-10"), miles: 6441, milesToCritical: 644, cityMilesToCritical: 249, majorVersion: 13 },
      { version: "13.2.6", date: new Date("2025-01-31"), miles: 2325, milesToCritical: 581, cityMilesToCritical: 384, majorVersion: 13 },
      { version: "13.2.5.1", date: new Date("2025-01-27"), miles: 89, milesToCritical: 89, cityMilesToCritical: 85, majorVersion: 13 },
      { version: "13.2.5", date: new Date("2025-01-23"), miles: 22, milesToCritical: 22, cityMilesToCritical: 22, majorVersion: 13 },
      { version: "13.2.4", date: new Date("2025-01-12"), miles: 725, milesToCritical: 362, cityMilesToCritical: 274, majorVersion: 13 },
      { version: "13.2.2.1", date: new Date("2024-12-24"), miles: 3515, milesToCritical: 1757, cityMilesToCritical: 752, majorVersion: 13 },
      { version: "13.2.2", date: new Date("2024-12-21"), miles: 10807, milesToCritical: 450, cityMilesToCritical: 227, majorVersion: 13 },
      { version: "13.2.1", date: new Date("2024-12-16"), miles: 1789, milesToCritical: 298, cityMilesToCritical: 174, majorVersion: 13 },
      { version: "13.2", date: new Date("2024-11-30"), miles: 121, milesToCritical: 121, cityMilesToCritical: 113, majorVersion: 13 },
      
      // Version 12
      { version: "12.6.4", date: new Date("2025-02-18"), miles: 100602, milesToCritical: 194, cityMilesToCritical: 114, majorVersion: 12 },
      { version: "12.6.3", date: new Date("2025-01-31"), miles: 8324, milesToCritical: 225, cityMilesToCritical: 154, majorVersion: 12 },
      { version: "12.6.2", date: new Date("2025-01-23"), miles: 1781, milesToCritical: 356, cityMilesToCritical: 280, majorVersion: 12 },
      { version: "12.6.1", date: new Date("2025-01-14"), miles: 3568, milesToCritical: 170, cityMilesToCritical: 48, majorVersion: 12 },
      { version: "12.5.6.4", date: new Date("2024-12-07"), miles: 558, milesToCritical: 80, cityMilesToCritical: 45, majorVersion: 12 },
      { version: "12.5.5.3", date: new Date("2024-11-25"), miles: 975, milesToCritical: 97, cityMilesToCritical: 66, majorVersion: 12 },
      { version: "12.5.6.3", date: new Date("2024-11-13"), miles: 4725, milesToCritical: 175, cityMilesToCritical: 96, majorVersion: 12 },
      { version: "12.5.6.2", date: new Date("2024-11-06"), miles: 29, milesToCritical: 29, cityMilesToCritical: 29, majorVersion: 12 },
      { version: "12.5.4.2", date: new Date("2024-10-29"), miles: 33500, milesToCritical: 305, cityMilesToCritical: 163, majorVersion: 12 },
      { version: "12.5.6.1", date: new Date("2024-10-23"), miles: 178, milesToCritical: 89, cityMilesToCritical: 89, majorVersion: 12 },
      { version: "12.5.5.2", date: new Date("2024-10-22"), miles: 735, milesToCritical: 147, cityMilesToCritical: 111, majorVersion: 12 },
      { version: "12.5.6", date: new Date("2024-10-15"), miles: 6, milesToCritical: 6, cityMilesToCritical: 6, majorVersion: 12 },
      { version: "12.5.5", date: new Date("2024-09-30"), miles: 1001, milesToCritical: 100, cityMilesToCritical: 62, majorVersion: 12 },
      { version: "12.5.4.1", date: new Date("2024-09-29"), miles: 21578, milesToCritical: 260, cityMilesToCritical: 131, majorVersion: 12 },
      { version: "12.5.4", date: new Date("2024-09-25"), miles: 8978, milesToCritical: 163, cityMilesToCritical: 77, majorVersion: 12 },
      { version: "12.5.2.1", date: new Date("2024-09-18"), miles: 1903, milesToCritical: 190, cityMilesToCritical: 73, majorVersion: 12 },
      { version: "12.5.2", date: new Date("2024-09-05"), miles: 711, milesToCritical: 25, cityMilesToCritical: 14, majorVersion: 12 },
      { version: "12.5.1.5", date: new Date("2024-08-26"), miles: 2138, milesToCritical: 86, cityMilesToCritical: 35, majorVersion: 12 },
      { version: "12.5.1.4", date: new Date("2024-08-22"), miles: 14, milesToCritical: 14, cityMilesToCritical: 14, majorVersion: 12 },
      { version: "12.5.1.3", date: new Date("2024-08-10"), miles: 6472, milesToCritical: 202, cityMilesToCritical: 94, majorVersion: 12 },
      { version: "12.5.1.1", date: new Date("2024-08-04"), miles: 3270, milesToCritical: 234, cityMilesToCritical: 107, majorVersion: 12 },
      { version: "12.5.1", date: new Date("2024-07-29"), miles: 3489, milesToCritical: 581, cityMilesToCritical: 258, majorVersion: 12 },
      { version: "12.5", date: new Date("2024-07-24"), miles: 1327, milesToCritical: 442, cityMilesToCritical: 308, majorVersion: 12 },
      { version: "12.4.3", date: new Date("2024-07-11"), miles: 1054, milesToCritical: 1054, cityMilesToCritical: 760, majorVersion: 12 },
      { version: "12.3.6", date: new Date("2024-04-28"), miles: 31708, milesToCritical: 314, cityMilesToCritical: 145, majorVersion: 12 },
      { version: "12.3.5", date: new Date("2024-04-29"), miles: 79, milesToCritical: 39, cityMilesToCritical: 25, majorVersion: 12 },
      { version: "12.3.4", date: new Date("2024-04-11"), miles: 8187, milesToCritical: 256, cityMilesToCritical: 134, majorVersion: 12 },
      { version: "12.3.3", date: new Date("2024-03-31"), miles: 4556, milesToCritical: 304, cityMilesToCritical: 155, majorVersion: 12 },
      { version: "12.3.1", date: new Date("2024-03-27"), miles: 162, milesToCritical: 162, cityMilesToCritical: 128, majorVersion: 12 },
      { version: "12.3", date: new Date("2024-03-15"), miles: 4376, milesToCritical: 398, cityMilesToCritical: 189, majorVersion: 12 },
      { version: "12.2.1", date: new Date("2024-02-21"), miles: 212, milesToCritical: 35, cityMilesToCritical: 25, majorVersion: 12 },
      
      // Version 11
      { version: "11.4.9", date: new Date("2023-12-20"), miles: 8736, milesToCritical: 291, cityMilesToCritical: 112, majorVersion: 11 },
      { version: "11.4.8.1", date: new Date("2023-12-07"), miles: 56, milesToCritical: 56, cityMilesToCritical: 20, majorVersion: 11 },
      { version: "11.4.7.3", date: new Date("2023-10-22"), miles: 3892, milesToCritical: 56, cityMilesToCritical: 32, majorVersion: 11 },
      { version: "11.4.7.2", date: new Date("2023-10-05"), miles: 1456, milesToCritical: 63, cityMilesToCritical: 36, majorVersion: 11 },
      { version: "11.4.7", date: new Date("2023-08-27"), miles: 3234, milesToCritical: 75, cityMilesToCritical: 44, majorVersion: 11 },
      { version: "11.4.4", date: new Date("2023-06-20"), miles: 9132, milesToCritical: 208, cityMilesToCritical: 98, majorVersion: 11 },
      { version: "11.4.3", date: new Date("2023-06-13"), miles: 168, milesToCritical: 84, cityMilesToCritical: 79, majorVersion: 11 },
      { version: "11.4.2", date: new Date("2023-05-27"), miles: 2916, milesToCritical: 172, cityMilesToCritical: 68, majorVersion: 11 },
      { version: "11.4.1", date: new Date("2023-05-24"), miles: 77, milesToCritical: 77, cityMilesToCritical: 21, majorVersion: 11 },
      { version: "11.3.6", date: new Date("2023-04-09"), miles: 6695, milesToCritical: 181, cityMilesToCritical: 95, majorVersion: 11 },
      { version: "11.3.4", date: new Date("2023-03-31"), miles: 2203, milesToCritical: 275, cityMilesToCritical: 144, majorVersion: 11 },
      { version: "11.3.3", date: new Date("2023-03-27"), miles: 577, milesToCritical: 48, cityMilesToCritical: 40, majorVersion: 11 },
    ];

    // Filter out rows with less than 2,000 total miles before grouping
    const filteredData = rawData.filter(point => point.miles >= 2000);

    // Group by major version and get the first release date for each version
    const versionGroups = filteredData.reduce((acc, point) => {
      if (!acc[point.majorVersion]) {
        acc[point.majorVersion] = [];
      }
      acc[point.majorVersion].push(point);
      return acc;
    }, {} as Record<number, TeslaDataPoint[]>);

    // Calculate average miles to critical for each major version
    const aggregatedData = Object.entries(versionGroups)
      .filter(([, points]) => points.length > 0) // Only include versions with data
      .map(([version, points]) => {
        // Sort by date to get the first release
        const sortedPoints = points.sort((a, b) => a.date.getTime() - b.date.getTime());
        const firstRelease = sortedPoints[0];
        
        // Calculate average miles to critical (both total and city)
        const avgMiles = points.reduce((sum, p) => sum + p.milesToCritical, 0) / points.length;
        const avgCityMiles = points.reduce((sum, p) => sum + p.cityMilesToCritical, 0) / points.length;
        
        return {
          version: `${version}.x`,
          date: firstRelease.date,
          timestamp: firstRelease.date.getTime(),
          milesToCritical: avgMiles,
          cityMilesToCritical: avgCityMiles,
          majorVersion: parseInt(version)
        };
      })
      .sort((a, b) => a.timestamp - b.timestamp);

    return aggregatedData;
  }, []);

  // Calculate X-axis ticks similar to TimelineChart (every 6 months for less crowding)
  const xAxisConfig = useMemo(() => {
    if (data.length === 0) return { ticks: [], domain: [0, 0], yearPositions: [] };
    
    const minDate = new Date(Math.min(...data.map(p => p.timestamp)));
    const maxDate = new Date(Math.max(...data.map(p => p.timestamp)));
    
    // Generate ticks every 6 months (less crowded)
    const ticks: number[] = [];
    const yearPositions: Array<{position: number, year: number}> = [];
    const current = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    const end = new Date(maxDate.getFullYear(), maxDate.getMonth() + 1, 1);
    
    let currentYear = -1;
    let yearStartPosition = 0;
    let ticksInYear = 0;
    
    while (current <= end) {
      const timestamp = current.getTime();
      
      // Only add tick if within data range
      if (timestamp <= end.getTime()) {
        ticks.push(timestamp);
        
        // Track year changes
        if (current.getFullYear() !== currentYear) {
          if (currentYear !== -1) {
            // Calculate middle position for previous year
            const middlePosition = yearStartPosition + ((ticksInYear - 1) / 2);
            yearPositions.push({
              position: middlePosition,
              year: currentYear
            });
          }
          currentYear = current.getFullYear();
          yearStartPosition = ticks.length - 1;
          ticksInYear = 1;
        } else {
          ticksInYear++;
        }
      }
      
      current.setMonth(current.getMonth() + 6); // Increment by 6 months
    }
    
    // Add last year position (this is critical for 2025!)
    if (ticksInYear > 0 && currentYear !== -1) {
      const middlePosition = yearStartPosition + ((ticksInYear - 1) / 2);
      yearPositions.push({
        position: middlePosition,
        year: currentYear
      });
    }
    
    return { 
      ticks, 
      domain: [minDate.getTime(), maxDate.getTime() + (30 * 24 * 60 * 60 * 1000)], // Add 10 days padding
      yearPositions 
    };
  }, [data]);

  // Calculate Y-axis domain and ticks for log scale
  const yAxisConfig = useMemo(() => {
    if (data.length === 0) return { min: 10, max: 10000, ticks: [10, 100, 1000, 10000] };
    
    const minMiles = Math.min(...data.map(p => p.milesToCritical));
    const maxMiles = Math.max(...data.map(p => p.milesToCritical));
    
    // Set reasonable bounds for log scale
    const min = Math.pow(10, Math.floor(Math.log10(minMiles)));
    const max = Math.pow(10, Math.ceil(Math.log10(maxMiles)));
    
    // Generate log scale ticks
    const ticks: number[] = [];
    let current = min;
    while (current <= max) {
      ticks.push(current);
      current *= 10;
    }
    
    return { min, max, ticks };
  }, [data]);

  const formatYAxis = (value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return value.toString();
  };

  const formatXAxis = (timestamp: number) => {
    const date = new Date(timestamp);
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return monthNames[date.getMonth()];
  };

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: TeslaDataPoint & { timestamp: number } }> }) => {
    // On mobile, only show if there's a clicked point
    if (isMobile) {
      if (!clickedPoint) return null;
      return (
        <div className="bg-white border-2 border-black rounded-lg shadow-lg p-3">
          <div className="flex flex-wrap items-baseline gap-2 mb-2">
            <p className="font-bold text-sm">FSD {clickedPoint.version}</p>
            <p className="text-xs text-gray-600">
              {clickedPoint.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold">
              Miles to CD: {Math.round(clickedPoint.milesToCritical).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              City Miles to CD: {Math.round(clickedPoint.cityMilesToCritical).toLocaleString()}
            </p>
          </div>
        </div>
      );
    }

    // Desktop: normal hover behavior
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white border-2 border-black rounded-lg shadow-lg p-3">
          <div className="flex flex-wrap items-baseline gap-2 mb-2">
            <p className="font-bold text-sm">FSD {data.version}</p>
            <p className="text-xs text-gray-600">
              {data.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold">
              Miles to CD: {Math.round(data.milesToCritical).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              City Miles to CD: {Math.round(data.cityMilesToCritical).toLocaleString()}
            </p>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomYAxisLabel = ({ viewBox }: { viewBox?: { x?: number; y?: number; width?: number; height?: number } }) => {
    const { x = 0, y = 0, height = 0 } = viewBox || {};
    const xOffset = isMobile ? 25 : 5; // Move closer to plot on mobile
    return (
      <g>
        <text
          x={x + xOffset}
          y={y + height / 2}
          transform={`rotate(-90, ${x + xOffset}, ${y + height / 2})`}
          textAnchor="middle"
          fill="var(--foreground)"
          fontSize={14}
          fontWeight={500}
        >
          <tspan x={x + xOffset} dy="-0.6em">Miles to Critical Disengagement</tspan>
          <tspan x={x + xOffset} dy="1.2em">(log scale)</tspan>
        </text>
      </g>
    );
  };

  return (
    <div className="w-full h-full flex flex-col md:border-l md:border-gray-300 md:pl-6 border-t md:border-t-0 border-gray-300 pt-6 mt-6 md:mt-0 md:pt-0">
      {/* Header - Centered */}
      <div className="flex flex-col items-center gap-3 mb-3 w-full">
        <div className="relative flex flex-row sm:block items-center justify-center gap-3 sm:gap-0 sm:w-fit">
          <div className="sm:absolute sm:right-full sm:mr-3 sm:top-1/2 sm:-translate-y-1/2 flex items-center justify-center">
            <Image 
              src={teslaLogo} 
              alt="Tesla" 
              width={42} 
              height={42} 
              className="flex-shrink-0"
            />
          </div>
          <a 
            ref={titleTriggerRef}
            href="https://teslafsdtracker.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-foreground hover:text-foreground border-b border-dashed border-black font-bold text-lg sm:text-2xl text-center"
            onMouseEnter={handleTitleMouseEnter}
            onMouseLeave={handleTitleMouseLeave}
          >
            FSD: Driving Automation
          </a>
        </div>

        {/* Main metric - Centered */}
        <div className="flex flex-col items-center gap-1 w-full">
          <div className="flex items-baseline justify-center gap-1">
            <p className="text-xl sm:text-2xl font-bold text-foreground">
              ~2,500 <span className="text-muted-foreground font-normal">/ </span>
            </p>
            <span
              ref={triggerRef}
              className="text-xl sm:text-2xl text-muted-foreground font-normal cursor-pointer inline-flex items-center gap-1"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onClick={handleClick}
            >
              200,000 miles
              <HelpCircle className="w-4 h-4 text-muted-foreground" />
            </span>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">before Critical Disengagement (CD)</p>
        </div>
        
        {/* Legend */}
        <div className="flex items-center justify-center gap-4 text-sm mt-6 w-full">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 bg-[#E82127]"></div>
            <span className="text-gray-600">Miles to CD</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-0.5 bg-[#E82127] opacity-40"></div>
            <span className="text-gray-600">City Miles to CD</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full mt-3 md:mt-0" style={{ height: isMobile ? '320px' : '280px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: isMobile ? 5 : 20, left: isMobile ? 0 : 20, bottom: 5 }}
            onClick={(e) => {
              if (isMobile && e && e.activePayload && e.activePayload.length > 0) {
                const pointData = e.activePayload[0].payload;
                setClickedPoint(clickedPoint?.version === pointData.version ? null : pointData);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="timestamp"
              type="number"
              domain={xAxisConfig.domain}
              ticks={xAxisConfig.ticks}
              tickFormatter={formatXAxis}
              tick={{ fontSize: 12, fill: '#374151' }}
              height={30}
            />
            <YAxis
              scale="log"
              domain={[yAxisConfig.min, yAxisConfig.max]}
              ticks={yAxisConfig.ticks}
              tickFormatter={formatYAxis}
              tick={{ fontSize: 12, fill: '#374151' }}
              label={<CustomYAxisLabel />}
            />
            {!isMobile && <Tooltip content={<CustomTooltip />} />}
            
            {/* City miles line (lighter/more transparent) */}
            <Line
              type="monotone"
              dataKey="cityMilesToCritical"
              stroke="#E82127"
              strokeWidth={2}
              strokeOpacity={0.4}
              dot={{ fill: '#E82127', fillOpacity: 0.4, r: 4 }}
              activeDot={{ r: 6 }}
            />
            
            {/* Total miles line (main) */}
            <Line
              type="monotone"
              dataKey="milesToCritical"
              stroke="#E82127"
              strokeWidth={2.5}
              dot={{ fill: '#E82127', r: 5 }}
              activeDot={{ r: 7 }}
              label={({ x, y, index }: { x: number; y: number; index: number }) => {
                const point = data[index];
                return (
                  <text
                    x={x}
                    y={y - 10}
                    fill="#374151"
                    fontSize={11}
                    fontWeight={500}
                    textAnchor="middle"
                  >
                    {point.version}
                  </text>
                );
              }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* Mobile popup overlay */}
        {isMobile && clickedPoint && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-[999] bg-black/20"
              onClick={() => setClickedPoint(null)}
            />
            {/* Centered popup */}
            <div
              className="fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[1000] bg-white border-2 border-black rounded-lg shadow-lg p-3 max-w-[90vw]"
            >
              <div className="flex flex-wrap items-baseline gap-2 mb-2">
                <p className="font-bold text-sm">FSD {clickedPoint.version}</p>
                <p className="text-xs text-gray-600">
                  {clickedPoint.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold">
                  Miles to CD: {Math.round(clickedPoint.milesToCritical).toLocaleString()}
                </p>
                <p className="text-sm text-muted-foreground">
                  City Miles to CD: {Math.round(clickedPoint.cityMilesToCritical).toLocaleString()}
                </p>
              </div>
            </div>
          </>
        )}
        
        {/* Year labels below the chart */}
        <div className="relative" style={{ height: '20px', marginTop: '-5px', marginBottom: '5px' }}>
          {xAxisConfig.yearPositions.map((yearPos, index) => {
            const totalTicks = xAxisConfig.ticks.length;
            const leftPercent = (yearPos.position / (totalTicks - 1)) * 100;
            // Adjust offset based on mobile/desktop margins: mobile has 0px left, desktop has 20px left
            // We add extra padding to account for the chart's actual left padding
            const leftOffset = isMobile ? 30 : 50;
            
            return (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: `calc(${leftPercent}% + ${leftOffset}px)`,
                  transform: 'translateX(-50%)',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#6b7280'
                }}
              >
                {yearPos.year}
              </div>
            );
          })}
        </div>
      </div>

      {/* Desktop Tooltip for 200k threshold */}
      {!isMobile && showTooltip && tooltipPosition && (() => {
        // Calculate smart positioning to avoid edge clipping
        const tooltipWidth = 224; // w-56 is 224px
        const viewportWidth = window.innerWidth;
        const padding = 20;
        
        let translateX = '-50%'; // default: center
        let left = tooltipPosition.x;
        
        // Check if tooltip would overflow on the right
        if (tooltipPosition.x + tooltipWidth / 2 > viewportWidth - padding) {
          translateX = '-100%';
          left = tooltipPosition.x;
        }
        // Check if tooltip would overflow on the left
        else if (tooltipPosition.x - tooltipWidth / 2 < padding) {
          translateX = '0%';
          left = tooltipPosition.x;
        }
        
        return (
          <div
            style={{
              position: 'fixed',
              left: left,
              top: tooltipPosition.y,
              transform: `translate(${translateX}, -100%)`,
              pointerEvents: 'auto',
              zIndex: 1000,
              width: 'auto'
            }}
            onMouseEnter={handleMouseEnterTooltip}
            onMouseLeave={handleMouseLeaveTooltip}
          >
            <div className="bg-white text-foreground border-2 border-black rounded-lg shadow-lg p-3 w-56">
              <p className="text-sm">
                200,000 miles is the human-level threshold for critical Disengagement (CD).
              </p>
            </div>
          </div>
        );
      })()}

      {/* Mobile Dialog for 200k threshold */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-xs border-2 border-black">
          <p className="text-sm">
            200,000 miles is the human-level threshold for critical Disengagement (CD).
          </p>
        </DialogContent>
      </Dialog>

      {/* Desktop Tooltip for title */}
      {!isMobile && showTitleTooltip && titleTooltipPos && (() => {
        const tooltipWidth = 240;
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
              <p className="text-sm text-foreground">
                Full Self-Driving (FSD) cannot be considered autonomous until critical disengagements—instances requiring urgent human intervention—become extremely rare. See <a 
                  href="https://teslafsdtracker.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-foreground inline-flex items-center gap-1 underline"
                >
                  this site
                  <ExternalLink className="w-3.5 h-3.5" />
                </a> for more information about FSD performance.
              </p>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

