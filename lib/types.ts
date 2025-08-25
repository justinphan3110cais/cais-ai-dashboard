export interface Dataset {
  name: string;
  link: string;
  description: string;
  logo?: string;
  category: 'capabilities' | 'safety';
}

export interface ModelScore {
  [datasetName: string]: number | null; // null for missing scores
}

export interface Model {
  name: string;
  provider: string; // Provider name (e.g., 'openai', 'deepseek', 'qwen', etc.)
  scores: ModelScore;
  modelWeights?: string; // for HuggingFace link
  isTopModel?: boolean;
  modelGeneration?: 'gold' | 'silver';
  isTextOnlyModel?: boolean; // true for text-only models, false/null for vision-capable models
}

export interface LeaderboardData {
  capabilities: Dataset[];
  safety: Dataset[];
  models: Model[];
}