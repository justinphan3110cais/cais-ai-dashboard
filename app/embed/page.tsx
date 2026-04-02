"use client";

import React, { useMemo, useState } from "react";
import { MODELS, TEXT_CAPABILITIES_DATASETS, MULTIMODAL_DATASETS, SAFETY_DATASETS } from "@/app/constants";
import { Dataset, Model } from "@/lib/types";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { DashboardTable, SortConfig } from "@/components/ModelResultsTable";
import DatasetDetailsDialog from "@/components/DatasetDetailsDialog";

const ALL_DATASETS = [...TEXT_CAPABILITIES_DATASETS, ...MULTIMODAL_DATASETS, ...SAFETY_DATASETS];

function EmbedTableContent() {
  const searchParams = useSearchParams();

  // Parse URL params
  // ?cols=swebench_pro&cols=terminal_bench or ?cols=swebench_pro,terminal_bench
  // ?models=<model-id>&models=<model-id> or ?models=id1,id2
  // ?avg=true to show average column
  // ?sort=average|<dataset_id> &dir=asc|desc
  // ?title=Some Title
  const colParams = searchParams.getAll("cols");
  const modelParams = searchParams.getAll("models");
  const showAvg = searchParams.get("avg") === "true";
  const sortKey = searchParams.get("sort") || "average";
  const sortDir = searchParams.get("dir") || "desc";
  const title = searchParams.get("title");
  const bgColor = searchParams.get("bg") || "bg-blue-50";

  const colIds = colParams.flatMap(c => c.split(",")).filter(Boolean);
  const modelIds = modelParams.flatMap(m => m.split(",")).filter(Boolean);

  // Filter datasets
  const datasets: Dataset[] = useMemo(() => {
    if (colIds.length === 0) return ALL_DATASETS;
    return colIds
      .map(id => ALL_DATASETS.find(d => d.id === id))
      .filter((d): d is Dataset => d !== undefined);
  }, [colIds.join(",")]);

  // If avg=false, only show the selected cols (no average column)
  // We handle this by wrapping datasets: if only 1 col and no avg, just that col
  const displayDatasets = showAvg ? datasets : datasets;

  // Filter models by id
  const allModels: Model[] = useMemo(() => {
    if (modelIds.length === 0) return MODELS;
    return modelIds
      .map(id => MODELS.find(m => m.id === id))
      .filter((m): m is Model => m !== undefined);
  }, [modelIds.join(",")]);

  // Sort config
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: sortKey,
    direction: sortDir as "asc" | "desc",
  });

  const handleSort = (key: string) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === "desc" ? "asc" : "desc",
    }));
  };

  // Sort models
  const getProcessedScore = (dataset: Dataset, rawScore: number | null | undefined): number | null => {
    if (rawScore === null || rawScore === undefined) return null;
    if (dataset.postprocessScore) return dataset.postprocessScore(rawScore);
    return rawScore;
  };

  const sortedModels = useMemo(() => {
    return [...allModels].sort((a, b) => {
      let aVal: number | null, bVal: number | null;
      if (sortConfig.key === "average") {
        const getAvg = (m: Model) => {
          const scores = displayDatasets
            .map(d => getProcessedScore(d, m.scores[d.id]))
            .filter((s): s is number => s !== null);
          return scores.length > 0 ? scores.reduce((x, y) => x + y, 0) / scores.length : null;
        };
        aVal = getAvg(a);
        bVal = getAvg(b);
      } else {
        const ds = displayDatasets.find(d => d.id === sortConfig.key);
        aVal = ds ? getProcessedScore(ds, a.scores[ds.id]) : null;
        bVal = ds ? getProcessedScore(ds, b.scores[ds.id]) : null;
      }
      if (aVal === null && bVal === null) return 0;
      if (aVal === null) return 1;
      if (bVal === null) return -1;
      return sortConfig.direction === "desc" ? bVal - aVal : aVal - bVal;
    });
  }, [allModels, displayDatasets, sortConfig]);

  // Dataset details dialog
  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [datasetDialogOpen, setDatasetDialogOpen] = useState(false);

  const handleShowDetails = (datasetId: string) => {
    const dataset = displayDatasets.find(d => d.id === datasetId);
    if (dataset) {
      setSelectedDataset(dataset);
      setDatasetDialogOpen(true);
    }
  };

  return (
    <div className="w-full h-full overflow-auto bg-white">
      {title && (
        <div className="px-3 py-2">
          <h2 className="text-sm font-semibold text-gray-800">{title}</h2>
        </div>
      )}
      <DashboardTable
        datasets={displayDatasets}
        models={sortedModels}
        bgColor={bgColor}
        sortConfig={sortConfig}
        onSort={handleSort}
        expanded={true}
        onShowDetails={handleShowDetails}
        showAverageArrow={showAvg}
        showAverage={showAvg}
      />
      <DatasetDetailsDialog
        isOpen={datasetDialogOpen}
        onClose={() => setDatasetDialogOpen(false)}
        dataset={selectedDataset}
      />
    </div>
  );
}

export default function EmbedPage() {
  return (
    <Suspense fallback={<div className="p-4 text-sm text-gray-500">Loading...</div>}>
      <EmbedTableContent />
    </Suspense>
  );
}
