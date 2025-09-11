export interface Dataset {
  id: string; // Unique identifier for the dataset
  name: string;
  title?: string; // Title for the dialog (defaults to name if not provided)
  link: string;
  description: string;
  logo?: string;
  category: 'text' | 'vision' | 'safety';
  capabilities?: string[]; // List of capability IDs this dataset tests
  paperLink?: string;
  githubLink?: string;
  huggingfaceLink?: string; // Full URL to Hugging Face dataset
  citationUrl?: string; // URL to fetch citation from
  citation?: string; // Direct citation text
  examples?: {
    type: 'image' | 'video';
    src: string | import('next/image').StaticImageData; // Can be string (for videos) or StaticImageData (for images)
    alt?: string;
  }[];
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
  modelGeneration?: 'green';
  isTextOnlyModel?: boolean; // true for text-only models, false/null for vision-capable models
}

export interface LeaderboardData {
  capabilities: Dataset[];
  safety: Dataset[];
  models: Model[];
}