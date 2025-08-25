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
  logo: {
    src: string;
    width: number;
    height: number;
  };
  scores: ModelScore;
  modelWeights?: string; // for HuggingFace link
  isTopModel?: boolean;
  modelGeneration?: 'gold' | 'silver';
}

export interface LeaderboardData {
  capabilities: Dataset[];
  safety: Dataset[];
  models: Model[];
}