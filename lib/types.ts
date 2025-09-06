export interface Dataset {
  id: string; // Unique identifier for the dataset
  name: string;
  link: string;
  description: string;
  logo?: string;
  category: 'capabilities' | 'safety';
  capabilities?: string[]; // List of capability IDs this dataset tests
}

export interface ModelScore {
  [datasetId: string]: number | null; // null for missing scores
}

export interface Model {
  name: string;
  provider: string; // Provider name (e.g., 'openai', 'deepseek', 'qwen', etc.)
  scores: ModelScore;
  modelWeights?: string; // for HuggingFace link
  modelCardUrl?: string; // URL to model card/announcement
  isTopModel?: boolean;
  modelGeneration?: 'gold' | 'silver';
  isTextOnlyModel?: boolean; // true for text-only models, false/null for vision-capable models
}

export interface LeaderboardData {
  capabilities: Dataset[];
  safety: Dataset[];
  models: Model[];
}