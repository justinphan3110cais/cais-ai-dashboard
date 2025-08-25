import openai_logo from "@/assets/provider-logos/openai-logomark.png";
import claude_logo from "@/assets/provider-logos/claude_logo.png";
import gemini_logo from "@/assets/provider-logos/gemini_logo.png";
import grok_logo from "@/assets/provider-logos/grok_logo.png";
import meta_logo from "@/assets/provider-logos/meta-icon.png";
import deepseek_logo from "@/assets/provider-logos/deepseek_logo.svg";
import qwen_logo from "@/assets/provider-logos/qwen_logo.png";
import kimi_logo from "@/assets/provider-logos/kimi_logo.png";
import o1_logo from "@/assets/provider-logos/o1-logo.png";
import xai_logo from "@/assets/provider-logos/xai_logo.svg";
import textquests_logo from "@/assets/dataset-logos/textquests_logo.svg";
import hle_logo from "@/assets/dataset-logos/hle_logo.svg";
import vct_logo from "@/assets/dataset-logos/vct_logo.svg";
import { Dataset, Model } from "@/lib/types";

export const PAPER_URL = "https://arxiv.org/abs/2507.23701";
export const GITHUB_URL = "https://github.com/centerforaisafety/safetyxcapabilities-leaderboard";

export const BIBTEX_CITATION = `@misc{safetyxcapabilities2025leaderboard,
      title={SafetyxCapabilities Leaderboard: Evaluating Frontier AI Models on Safety and Capabilities Benchmarks}, 
      author={Center for AI Safety},
      year={2025},
      url={https://github.com/centerforaisafety/safetyxcapabilities-leaderboard}, 
}`;

export const LOGO_MAP = {
  openai_logo: openai_logo,
  claude_logo: claude_logo,
  gemini_logo: gemini_logo,
  grok_logo: grok_logo,
  meta_logo: meta_logo,
  deepseek_logo: deepseek_logo,
  qwen_logo: qwen_logo,
  kimi_logo: kimi_logo,
  o1_logo: o1_logo,
  xai_logo: xai_logo,
};

// Datasets for the leaderboard
export const CAPABILITIES_DATASETS: Dataset[] = [
  {
    name: "HLE",
    link: "https://lastexam.ai",
    description: "Humanity's Last Exam ",
    logo: hle_logo,
    category: "capabilities"
  },
  {
    name: "EnigmaEval",
    link: "https://github.com/centerforaisafety/EnigmaEval",
    description: "As language models master existing reasoning benchmarks, we need new challenges to evaluate their cognitive frontiers. Puzzle-solving events are rich repositories of challenging multimodal problems that test a wide range of advanced reasoning and knowledge capabilities, making them a unique testbed for evaluating frontier language models. We introduce EnigmaEval, a dataset of problems and solutions derived from puzzle competitions and events that probes models' ability to perform implicit knowledge synthesis and multi-step deductive reasoning. Unlike existing reasoning and knowledge benchmarks, puzzle solving challenges models to discover hidden connections between seemingly unrelated pieces of information to uncover solution paths. The benchmark comprises 1184 puzzles of varying complexity -- each typically requiring teams of skilled solvers hours to days to complete -- with unambiguous, verifiable solutions that enable efficient evaluation. State-of-the-art language models achieve extremely low accuracy on these puzzles, even lower than other difficult benchmarks such as Humanity's Last Exam, unveiling models' shortcomings when challenged with problems requiring unstructured and lateral reasoning.",
    category: "capabilities"
  },
  {
    name: "RLI",
    link: "https://github.com/centerforaisafety/RLI",
    description: "Reasoning and Logic Intelligence benchmark",
    category: "capabilities"
  },
  {
    name: "TextQuests",
    link: "https://textquests.ai/",
    description: "How Good are LLMs at Text-Based Video Games?",
    logo: textquests_logo,
    category: "capabilities"
  },
  {
    name: "Aider's Polyglot",
    link: "https://aider.chat/docs/leaderboards/",
    description: "Code editing performance across multiple programming languages",
    category: "capabilities"
  },
  {
    name: "SWE-Bench Lite",
    link: "https://www.swebench.com/",
    description: "Software engineering benchmark for real-world coding tasks",
    category: "capabilities"
  },
  {
    name: "HealthBench",
    link: "https://github.com/centerforaisafety/HealthBench",
    description: "Medical and healthcare knowledge evaluation benchmark",
    category: "capabilities"
  }
];

export const SAFETY_DATASETS: Dataset[] = [
  {
    name: "MASKS",
    link: "https://www.mask-benchmark.ai",
    description: "As large language models (LLMs) become more capable and agentic, the requirement for trust in their outputs grows significantly, yet at the same time concerns have been mounting that models may learn to lie in pursuit of their goals. To address these concerns, a body of work has emerged around the notion of ``honesty'' in LLMs, along with interventions aimed at mitigating deceptive behaviors. However, evaluations of honesty are currently highly limited, with no benchmark combining large scale and applicability to all models. Moreover, many benchmarks claiming to measure honesty in fact simply measure accuracy—the correctness of a model's beliefs—in disguise. In this work, we introduce a large-scale human-collected dataset for measuring honesty directly, allowing us to disentangle accuracy from honesty for the first time. Across a diverse set of LLMs, we find that while larger models obtain higher accuracy on our benchmark, they do not become more honest. Surprisingly, while most frontier LLMs obtain high scores on truthfulness benchmarks, we find a substantial propensity in frontier LLMs to lie when pressured to do so, resulting in low honesty scores on our benchmark. We find that simple methods, such as representation engineering interventions, can improve honesty. These results underscore the growing need for robust evaluations and effective interventions to ensure LLMs remain trustworthy.",
    category: "safety"
  },
  {
    name: "MACHIAVELLI",
    link: "https://github.com/centerforaisafety/machiavelli",
    description: "Evaluating moral reasoning in text-based choice games",
    category: "safety"
  },
  {
    name: "VCT",
    link: "https://www.virologytest.ai",
    description: "Virology Capabilities Test - Virology Capabilities Test (VCT), a large language model (LLM) benchmark that measures the capability to troubleshoot complex virology laboratory protocols. VCT is difficult: expert virologists with access to the internet score an average of 22.1% on questions specifically in their sub-areas of expertise.",
    category: "safety",
    logo: vct_logo,
  }
];

export const MODELS: Model[] = [
  {
    name: "GPT-5",
    logo: {
      src: "openai_logo",
      width: 18,
      height: 18,
    },
    scores: {
      "HLE": 25.32,
      "EnigmaEval": 10.47, // gpt-5-2025-08-07
      "RLI": null,
      "TextQuests": 70.0, // with clues progress
      "Aider's Polyglot": null,
      "SWE-Bench Lite": null,
      "HealthBench": null,
      "MASKS": 79.33, // gpt-5-2025-08-07
      "MACHIAVELLI": null,
      "VCT": null
    },
    isTopModel: true,
    modelGeneration: "gold"
  },
  {
    name: "Claude Opus 4.1",
    logo: {
      src: "claude_logo",
      width: 18,
      height: 18,
    },
    scores: {
      "HLE": 7.92, // claude-opus-4-1-20250805
      "EnigmaEval": 7.18, // claude-opus-4-1-20250805-thinking
      "RLI": null,
      "TextQuests": 68.0,
      "Aider's Polyglot": null,
      "SWE-Bench Lite": null,
      "HealthBench": null,
      "MASKS": 94.20, // claude-opus-4-1-20250805-thinking
      "MACHIAVELLI": null,
      "VCT": null
    },
    isTopModel: true,
    modelGeneration: "gold"
  },
  {
    name: "Grok 4",
    logo: {
      src: "grok_logo",
      width: 18,
      height: 18,
    },
    scores: {
      "HLE": null,
      "EnigmaEval": null,
      "RLI": null,
      "TextQuests": 61.4,
      "Aider's Polyglot": null,
      "SWE-Bench Lite": null,
      "HealthBench": null,
      "MASKS": null,
      "MACHIAVELLI": null,
      "VCT": null
    },
    isTopModel: true,
    modelGeneration: "silver"
  },
  {
    name: "o3",
    logo: {
      src: "openai_logo",
      width: 18,
      height: 18,
    },
    scores: {
      "HLE": 20.32, // o3 (high) (April 2025)
      "EnigmaEval": 11.91, // o3 (high) (April 2025)
      "RLI": null,
      "TextQuests": 60.4,
      "Aider's Polyglot": null,
      "SWE-Bench Lite": null,
      "HealthBench": null,
      "MASKS": 84.47, // o3 (high) (April 2025)
      "MACHIAVELLI": null,
      "VCT": 43.8 // o3
    },
    isTopModel: true,
    modelGeneration: "silver"
  },
  {
    name: "Claude Opus 4",
    logo: {
      src: "claude_logo",
      width: 18,
      height: 18,
    },
    scores: {
      "HLE": 6.68, // Claude Opus 4
      "EnigmaEval": 3.21, // Claude Opus 4
      "RLI": null,
      "TextQuests": 60.5,
      "Aider's Polyglot": null,
      "SWE-Bench Lite": null,
      "HealthBench": null,
      "MASKS": 80.28, // Claude Opus 4
      "MACHIAVELLI": null,
      "VCT": null
    },
    isTopModel: true,
    modelGeneration: "silver"
  },
  {
    name: "Gemini 2.5 Pro",
    logo: {
      src: "gemini_logo",
      width: 18,
      height: 18,
    },
    scores: {
      "HLE": 21.64, // gemini-2.5-pro-preview-06-05
      "EnigmaEval": 5.57, // gemini-2.5-pro-preview-06-05
      "RLI": null,
      "TextQuests": 60.6,
      "Aider's Polyglot": null,
      "SWE-Bench Lite": null,
      "HealthBench": null,
      "MASKS": 55.67, // gemini-2.5-pro-preview-06-05
      "MACHIAVELLI": null,
      "VCT": 37.6 // Gemini 2.5 Pro
    },
    isTopModel: true,
    modelGeneration: "silver"
  },
  {
    name: "Claude Sonnet 4",
    logo: {
      src: "claude_logo",
      width: 18,
      height: 18,
    },
    scores: {
      "HLE": 5.52, // Claude Sonnet 4
      "EnigmaEval": 2.20, // Claude Sonnet 4
      "RLI": null,
      "TextQuests": 57.2,
      "Aider's Polyglot": null,
      "SWE-Bench Lite": null,
      "HealthBench": null,
      "MASKS": 89.27, // Claude Sonnet 4
      "MACHIAVELLI": null,
      "VCT": 30.8 // Claude 3.7 Sonnet (closest match)
    },
    isTopModel: false,
    modelGeneration: "silver"
  },
  {
    name: "Grok 3",
    logo: {
      src: "grok_logo",
      width: 18,
      height: 18,
    },
    scores: {
      "HLE": null,
      "EnigmaEval": null,
      "RLI": null,
      "TextQuests": 41.9,
      "Aider's Polyglot": null,
      "SWE-Bench Lite": null,
      "HealthBench": null,
      "MASKS": null,
      "MACHIAVELLI": null,
      "VCT": null
    },
    isTopModel: false
  },
  {
    name: "GPT-5-mini",
    logo: {
      src: "openai_logo",
      width: 18,
      height: 18,
    },
    scores: {
      "HLE": 19.44, // gpt-5-mini-2025-08-07
      "EnigmaEval": 8.19, // gpt-5-mini-2025-08-07
      "RLI": null,
      "TextQuests": 42.1,
      "Aider's Polyglot": null,
      "SWE-Bench Lite": null,
      "HealthBench": null,
      "MASKS": 82.60, // gpt-5-mini-2025-08-07
      "MACHIAVELLI": null,
      "VCT": null
    },
    isTopModel: false
  },
  {
    name: "GPT-4.1",
    logo: {
      src: "openai_logo",
      width: 18,
      height: 18,
    },
    scores: {
      "HLE": 5.40, // GPT-4.1
      "EnigmaEval": 2.17, // GPT-4.1
      "RLI": null,
      "TextQuests": 37.5,
      "Aider's Polyglot": null,
      "SWE-Bench Lite": null,
      "HealthBench": null,
      "MASKS": 51.13, // GPT-4.1
      "MACHIAVELLI": null,
      "VCT": 28.3 // GPT-4.5 Preview (closest match)
    },
    isTopModel: false
  },
  {
    name: "Grok 3 mini",
    logo: {
      src: "grok_logo",
      width: 18,
      height: 18,
    },
    scores: {
      "HLE": null,
      "EnigmaEval": null,
      "RLI": null,
      "TextQuests": 32.2,
      "Aider's Polyglot": null,
      "SWE-Bench Lite": null,
      "HealthBench": null,
      "MASKS": null,
      "MACHIAVELLI": null,
      "VCT": null
    },
    isTopModel: false
  },
  {
    name: "Qwen 3 Thinking",
    logo: {
      src: "qwen_logo",
      width: 18,
      height: 18,
    },
    scores: {
      "HLE": null,
      "EnigmaEval": null,
      "RLI": null,
      "TextQuests": 29.8,
      "Aider's Polyglot": null,
      "SWE-Bench Lite": null,
      "HealthBench": null,
      "MASKS": null,
      "MACHIAVELLI": null,
      "VCT": null
    },
    isTopModel: false,
    modelWeights: "Qwen/Qwen3-235B-A22B-Thinking-2507"
  },
  {
    name: "Gemini 2.5 Flash",
    logo: {
      src: "gemini_logo",
      width: 18,
      height: 18,
    },
    scores: {
      "HLE": 12.08, // Gemini 2.5 Flash (April 2025)
      "EnigmaEval": null,
      "RLI": null,
      "TextQuests": 31.8,
      "Aider's Polyglot": null,
      "SWE-Bench Lite": null,
      "HealthBench": null,
      "MASKS": null,
      "MACHIAVELLI": null,
      "VCT": null
    },
    isTopModel: false
  },
  {
    name: "DeepSeek R1",
    logo: {
      src: "deepseek_logo",
      width: 18,
      height: 18,
    },
    scores: {
      "HLE": null,
      "EnigmaEval": null,
      "RLI": null,
      "TextQuests": 23.8,
      "Aider's Polyglot": null,
      "SWE-Bench Lite": null,
      "HealthBench": null,
      "MASKS": null,
      "MACHIAVELLI": null,
      "VCT": null
    },
    isTopModel: false,
    modelWeights: "deepseek-ai/DeepSeek-R1"
  },
  {
    name: "o4-mini",
    logo: {
      src: "openai_logo",
      width: 18,
      height: 18,
    },
    scores: {
      "HLE": 18.08, // o4-mini (high) (April 2025)
      "EnigmaEval": 9.21, // o4-mini (high) (April 2025)
      "RLI": null,
      "TextQuests": 20.6,
      "Aider's Polyglot": null,
      "SWE-Bench Lite": null,
      "HealthBench": null,
      "MASKS": 78.60, // o4-mini (high) (April 2025)
      "MACHIAVELLI": null,
      "VCT": 37.0 // o4-mini
    },
    isTopModel: false
  },
  {
    name: "Qwen 3 Instruct",
    logo: {
      src: "qwen_logo",
      width: 18,
      height: 18,
    },
    scores: {
      "HLE": null,
      "EnigmaEval": null,
      "RLI": null,
      "TextQuests": 21.1,
      "Aider's Polyglot": null,
      "SWE-Bench Lite": null,
      "HealthBench": null,
      "MASKS": null,
      "MACHIAVELLI": null,
      "VCT": null
    },
    isTopModel: false,
    modelWeights: "Qwen/Qwen3-235B-A22B-Instruct-2507"
  },
  {
    name: "Kimi K2",
    logo: {
      src: "kimi_logo",
      width: 18,
      height: 18,
    },
    scores: {
      "HLE": null,
      "EnigmaEval": null,
      "RLI": null,
      "TextQuests": 19.7,
      "Aider's Polyglot": null,
      "SWE-Bench Lite": null,
      "HealthBench": null,
      "MASKS": null,
      "MACHIAVELLI": null,
      "VCT": null
    },
    isTopModel: false,
    modelWeights: "moonshotai/Kimi-K2-Instruct"
  },
  {
    name: "GPT-OSS-120B",
    logo: {
      src: "openai_logo",
      width: 18,
      height: 18,
    },
    scores: {
      "HLE": 9.04, // gpt-oss-120b
      "EnigmaEval": null,
      "RLI": null,
      "TextQuests": 18.1,
      "Aider's Polyglot": null,
      "SWE-Bench Lite": null,
      "HealthBench": null,
      "MASKS": null,
      "MACHIAVELLI": null,
      "VCT": null
    },
    isTopModel: false,
    modelWeights: "openai/gpt-oss-120b"
  },
  {
    name: "Gemini 2.5 Flash-Lite",
    logo: {
      src: "gemini_logo",
      width: 18,
      height: 18,
    },
    scores: {
      "HLE": null,
      "EnigmaEval": null,
      "RLI": null,
      "TextQuests": 16.6,
      "Aider's Polyglot": null,
      "SWE-Bench Lite": null,
      "HealthBench": null,
      "MASKS": null,
      "MACHIAVELLI": null,
      "VCT": null
    },
    isTopModel: false
  },
  {
    name: "GPT-4.1-mini",
    logo: {
      src: "openai_logo",
      width: 18,
      height: 18,
    },
    scores: {
      "HLE": null,
      "EnigmaEval": null,
      "RLI": null,
      "TextQuests": 15.9,
      "Aider's Polyglot": null,
      "SWE-Bench Lite": null,
      "HealthBench": null,
      "MASKS": null,
      "MACHIAVELLI": null,
      "VCT": null
    },
    isTopModel: false
  },
  {
    name: "Llama 4 Maverick",
    logo: {
      src: "meta_logo",
      width: 18,
      height: 18,
    },
    scores: {
      "HLE": 5.68, // Llama 4 Maverick
      "EnigmaEval": 0.58, // Llama 4 Maverick
      "RLI": null,
      "TextQuests": 16.1,
      "Aider's Polyglot": null,
      "SWE-Bench Lite": null,
      "HealthBench": null,
      "MASKS": 49.73, // Llama 4 Maverick
      "MACHIAVELLI": null,
      "VCT": null
    },
    isTopModel: false,
    modelWeights: "meta-llama/Llama-4-Maverick-17B-128E-Instruct"
  },
  {
    name: "Claude Haiku 3.5",
    logo: {
      src: "claude_logo",
      width: 18,
      height: 18,
    },
    scores: {
      "HLE": null,
      "EnigmaEval": null,
      "RLI": null,
      "TextQuests": 13.4,
      "Aider's Polyglot": null,
      "SWE-Bench Lite": null,
      "HealthBench": null,
      "MASKS": null,
      "MACHIAVELLI": null,
      "VCT": null
    },
    isTopModel: false
  },
  {
    name: "Llama 4 Scout",
    logo: {
      src: "meta_logo",
      width: 18,
      height: 18,
    },
    scores: {
      "HLE": null,
      "EnigmaEval": null,
      "RLI": null,
      "TextQuests": 7.7,
      "Aider's Polyglot": null,
      "SWE-Bench Lite": null,
      "HealthBench": null,
      "MASKS": null,
      "MACHIAVELLI": null,
      "VCT": null
    },
    isTopModel: false,
    modelWeights: "meta-llama/Llama-4-Scout-17B-16E-Instruct"
  }
];