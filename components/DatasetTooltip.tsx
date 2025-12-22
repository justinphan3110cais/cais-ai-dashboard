"use client";

import React from "react";
import Image from "next/image";
import { Dataset } from "@/lib/types";
import { BENCHMARK_TYPES } from "@/app/constants";

interface DatasetTooltipProps {
  datasets: Dataset[];
  onOpenDetails: (dataset: Dataset) => void;
  onClose?: () => void;
  className?: string;
}

// Helper function to get first sentence from description
const getFirstSentence = (html: string): string => {
  // Split by periods first, then by HTML line breaks (same as table tooltip)
  let firstPart = html.split('. ')[0];
  firstPart = firstPart.split('<br>')[0];
  firstPart = firstPart.split('<br/>')[0];
  firstPart = firstPart.split('<BR>')[0];
  
  // Add period if it doesn't end with one and the original had more content
  const hasMoreContent = html.length > firstPart.length;
  const firstSentence = firstPart + (hasMoreContent && !firstPart.endsWith('.') ? '.' : '');
  
  return firstSentence;
};

export const DatasetTooltip: React.FC<DatasetTooltipProps> = ({
  datasets,
  onOpenDetails,
  onClose,
  className = ""
}) => {
  return (
    <div className={`bg-white text-foreground border-2 border-black rounded-lg shadow-lg p-3 w-64 max-h-[40vh] overflow-y-auto ${className}`}>
      <div className="flex flex-col gap-2">
        {/* Datasets stacked - each with its own category if multiple datasets */}
        {datasets.map((dataset, idx) => (
          <div key={idx} className={`${idx > 0 ? 'pt-2 border-t border-gray-200' : ''}`}>
            {/* Category name for each dataset (show capabilities) */}
            {dataset.capabilities && dataset.capabilities.length > 0 && (
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">
                {dataset.capabilities
                  .map(capabilityId => BENCHMARK_TYPES[capabilityId])
                  .filter(capability => capability !== undefined)
                  .map(capability => capability.name)
                  .join(', ')
                }
              </p>
            )}
            
            {/* Dataset header with logo and name */}
            <div className="flex items-center gap-2 mb-1">
              {dataset.logo && (
                <Image
                  src={dataset.logo}
                  alt={`${dataset.name} logo`}
                  width={20}
                  height={20}
                  className="flex-shrink-0"
                />
              )}
              <p className="font-semibold text-sm text-foreground">{dataset.title || dataset.name}</p>
            </div>
            
            {/* First sentence description */}
            <div 
              className="text-xs text-gray-700 leading-relaxed mb-2"
              dangerouslySetInnerHTML={{ __html: getFirstSentence(dataset.description) }}
            />
            
            {/* Random chance if available */}
            {dataset.randomChance && (
              <div className="text-xs text-muted-foreground mb-2">
                Random chance: {dataset.randomChance.toFixed(1)}%
              </div>
            )}
            
            {/* Button to open full details - matching table cell style */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetails(dataset);
                onClose?.();
              }}
              className="px-3 py-1 bg-background text-foreground border border-foreground text-xs rounded hover:bg-foreground hover:text-background transition-colors"
            >
              Examples and Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

