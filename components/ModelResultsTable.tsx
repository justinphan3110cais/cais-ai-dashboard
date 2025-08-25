"use client";

import React from "react";
import Image from "next/image";
import hf_logo from "@/assets/hf-logo.png";
import { MODELS, CAPABILITIES_DATASETS, SAFETY_DATASETS, LOGO_MAP } from "@/app/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const DatasetHeader = ({ dataset }: { dataset: any }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button 
            onClick={() => window.open(dataset.link, '_blank')}
            className="text-center hover:text-blue-600 transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-center gap-1">
              {dataset.logo && (
                <Image
                  src={dataset.logo}
                  alt={`${dataset.name} logo`}
                  width={16}
                  height={16}
                />
              )}
              <span className="text-xs font-medium">{dataset.name}</span>
            </div>
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm bg-gray-800 text-white">
          <p>{dataset.description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export function ModelResultsTable() {
  const formatValue = (value: number | null) => {
    if (value === null) return "-";
    return value.toFixed(1);
  };

  const allDatasets = [...CAPABILITIES_DATASETS, ...SAFETY_DATASETS];

  return (
    <div className="w-full space-y-4">

      
      <div className="border border-gray-300 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px] border-r border-gray-300 sticky left-0 bg-white z-10" rowSpan={2}>
                Model
              </TableHead>
              <TableHead className="text-center border-r border-gray-300 bg-blue-50" colSpan={CAPABILITIES_DATASETS.length}>
                Capabilities
              </TableHead>
              <TableHead className="text-center bg-red-50" colSpan={SAFETY_DATASETS.length}>
                Safety
              </TableHead>
            </TableRow>
            <TableRow>
              {CAPABILITIES_DATASETS.map((dataset) => (
                <TableHead key={dataset.name} className="text-center border-r border-gray-300 bg-blue-50 min-w-[80px]">
                  <DatasetHeader dataset={dataset} />
                </TableHead>
              ))}
              {SAFETY_DATASETS.map((dataset, index) => (
                <TableHead 
                  key={dataset.name} 
                  className={`text-center bg-red-50 min-w-[80px] ${index < SAFETY_DATASETS.length - 1 ? 'border-r border-gray-300' : ''}`}
                >
                  <DatasetHeader dataset={dataset} />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {MODELS.map((model) => {
              const getRowStyling = () => {
                if (model.modelGeneration === 'gold') {
                  return 'bg-amber-50 hover:bg-amber-100';
                } else if (model.modelGeneration === 'silver') {
                  return 'bg-gray-100 hover:bg-gray-200 border-gray-300';
                } else {
                  return 'hover:bg-gray-50';
                }
              };
              
              return (
                <TableRow 
                  key={model.name} 
                  className={`border-b border-gray-200 ${getRowStyling()}`}
                >
                  <TableCell className="border-r border-gray-300 sticky left-0 bg-inherit z-10">
                    <div className="flex items-center gap-2">
                      <Image
                        src={LOGO_MAP[model.logo.src as keyof typeof LOGO_MAP]}
                        alt={`${model.name} logo`}
                        width={model.logo.width}
                        height={model.logo.height}
                        className="flex-shrink-0"
                      />
                      <span className="text-sm font-medium">{model.name}</span>
                      {model.modelWeights && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => window.open(`https://huggingface.co/${model.modelWeights}`, '_blank')}
                                className="flex-shrink-0 hover:opacity-80 transition-opacity"
                              >
                                <Image
                                  src={hf_logo}
                                  alt="Hugging Face"
                                  width={14}
                                  height={14}
                                />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent className="bg-gray-100 text-foreground border border-gray-300">
                              <div className="flex items-center gap-2">
                                <Image
                                  src={LOGO_MAP[model.logo.src as keyof typeof LOGO_MAP]}
                                  alt={`${model.name} logo`}
                                  width={16}
                                  height={16}
                                />
                                <span className="text-sm">{model.modelWeights}</span>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                    </div>
                  </TableCell>
                  
                  {CAPABILITIES_DATASETS.map((dataset) => (
                    <TableCell key={dataset.name} className="text-center border-r border-gray-300 bg-blue-50/30">
                      <span className="font-mono text-sm">
                        {formatValue(model.scores[dataset.name])}
                      </span>
                    </TableCell>
                  ))}
                  
                  {SAFETY_DATASETS.map((dataset, index) => (
                    <TableCell 
                      key={dataset.name} 
                      className={`text-center bg-red-50/30 ${index < SAFETY_DATASETS.length - 1 ? 'border-r border-gray-300' : ''}`}
                    >
                      <span className="font-mono text-sm">
                        {formatValue(model.scores[dataset.name])}
                      </span>
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-4 text-center">
        
        <p className="text-sm text-gray-600">
          To add a model to the leaderboard or submit benchmark results, send us an email at{' '}
          <a 
            href="mailto:agibenchmark@safe.ai" 
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            agibenchmark@safe.ai
          </a>
        </p>
      </div>
    </div>
  );
}