"use client";

import React, { useMemo } from "react";
import { MODELS, TEXT_CAPABILITIES_DATASETS, MULTIMODAL_DATASETS, SAFETY_DATASETS } from "@/app/constants";
import { Dataset, Model } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { InlineBarChart } from "@/components/InlineBarChart";

const ALL_DATASETS = [...TEXT_CAPABILITIES_DATASETS, ...MULTIMODAL_DATASETS, ...SAFETY_DATASETS];

function EmbedBarsContent() {
  const searchParams = useSearchParams();

  // ?cols=swebench_pro,terminal_bench - dataset columns
  // ?models=model-id-1,model-id-2 - specific models to show
  // ?defaultTitle=true (default) - show the default title/logo
  // ?section=text|vision|safety - section type
  // ?selected=swebench_pro - pre-select a specific dataset
  const colParams = searchParams.getAll("cols");
  const modelParams = searchParams.getAll("models");
  const defaultTitle = searchParams.get("defaultTitle") !== "false";
  const sectionType = (searchParams.get("section") || "text") as "text" | "vision" | "safety";
  const selectedParams = searchParams.getAll("selected");

  const colIds = colParams.flatMap(c => c.split(",")).filter(Boolean);
  const modelIds = modelParams.flatMap(m => m.split(",")).filter(Boolean);
  const selectedIds = selectedParams.flatMap(s => s.split(",")).filter(Boolean);

  const datasets: Dataset[] = useMemo(() => {
    if (colIds.length === 0) {
      if (sectionType === "vision") return MULTIMODAL_DATASETS;
      if (sectionType === "safety") return SAFETY_DATASETS;
      return TEXT_CAPABILITIES_DATASETS;
    }
    return colIds
      .map(id => ALL_DATASETS.find(d => d.id === id))
      .filter((d): d is Dataset => d !== undefined);
  }, [colIds.join(","), sectionType]);

  // models param = pre-selected models on the bar chart; all models available in filter
  const preSelectedModelNames: string[] = useMemo(() => {
    if (modelIds.length === 0) return [];
    return modelIds
      .map(id => MODELS.find(m => m.id === id)?.name)
      .filter((n): n is string => n !== undefined);
  }, [modelIds.join(",")]);

  // Pre-select datasets if specified
  const initialIncluded = useMemo(() => {
    if (selectedIds.length === 0) return undefined;
    const included: Record<string, boolean> = {};
    datasets.forEach(d => {
      included[d.id] = selectedIds.includes(d.id);
    });
    return included;
  }, [selectedIds.join(","), datasets]);

  return (
    <div className="w-full h-full bg-white">
      <InlineBarChart
        datasets={datasets}
        models={MODELS}
        sectionType={sectionType}
        showTimeline={false}
        showBars={true}
        showTitle={defaultTitle}
        showModelFilter={true}
        showCategoryButtons={false}
        initialIncludedDatasets={initialIncluded}
        initialSelectedModels={preSelectedModelNames.length > 0 ? preSelectedModelNames : undefined}
      />
    </div>
  );
}

export default function EmbedBarsPage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-gray-500">Loading...</div>}>
      <EmbedBarsContent />
    </Suspense>
  );
}
