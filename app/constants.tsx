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
import swebench_logo from "@/assets/dataset-logos/swebench_logo.png";
import { Dataset, Model } from "@/lib/types";
import { Image as ImageIcon, SquareTerminal, GraduationCap } from "lucide-react";

// Benchmark type definitions
export interface BenchmarkType {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>; // Actual icon component
  tooltipText: string;
}

export const BENCHMARK_TYPES: Record<string, BenchmarkType> = {
  vision: {
    id: "vision",
    name: "Visual Reasoning",
    icon: ImageIcon,
    tooltipText: "Visual Reasoning Benchmark"
  },
  agent: {
    id: "agent", 
    name: "Agentic Capabilities",
    icon: SquareTerminal,
    tooltipText: "Agentic Capabilities Benchmark"
  },
  expert: {
    id: "expert",
    name: "Expert-Level Reasoning", 
    icon: GraduationCap,
    tooltipText: "Expert-Level Reasoning Benchmark"
  }
};

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

// Provider to logo mapping
export const PROVIDER_LOGO_MAP = {
  openai: { src: openai_logo, width: 18, height: 18 },
  meta: { src: meta_logo, width: 18, height: 18 },
  anthropic: { src: claude_logo, width: 18, height: 18 },
  google: { src: gemini_logo, width: 18, height: 18 },
  xai: { src: grok_logo, width: 18, height: 18 },
  qwen: { src: qwen_logo, width: 18, height: 18 },
  deepseek: { src: deepseek_logo, width: 18, height: 18 },
  moonshot: { src: kimi_logo, width: 18, height: 18 },
};

// Utility function to get provider logo
export const getProviderLogo = (provider: string) => {
  return PROVIDER_LOGO_MAP[provider as keyof typeof PROVIDER_LOGO_MAP] || PROVIDER_LOGO_MAP.openai;
};

// Datasets for the leaderboard
export const CAPABILITIES_DATASETS: Dataset[] = [
  {
    id: "hle",
    name: "HLE",
    link: "https://lastexam.ai",
    description: "Humanity's Last Exam ",
    logo: hle_logo,
    category: "capabilities",
    capabilities: ["expert"]
  },
  {
    id: "textquests",
    name: "TextQuests Progress",
    link: "https://textquests.ai/",
    description: "How Good are LLMs at Text-Based Video Games? (Progress metric - higher is better)",
    logo: textquests_logo,
    category: "capabilities",
    capabilities: ["agent"]
  },
  {
    id: "swebench_verified",
    name: "SWE-Bench",
    link: "https://www.swebench.com/bash-only.html",
          description: "<a href='https://www.swebench.com' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>SWE-Bench Verified</a> <i>(Bash Only)</i> tests LLMs ability to solve 500 real Python GitHub issues. <a href='https://www.swebench.com' target='_blank' style='text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>SWE-bench Bash Only</a> only use a minimal bash shell (no tools or special scaffold structure).",
    logo: swebench_logo,
    category: "capabilities",
    capabilities: ["agent"]
  },
  {
    id: "enigmaeval",
    name: "EnigmaEval",
    link: "https://github.com/centerforaisafety/EnigmaEval",
    description: "As language models master existing reasoning benchmarks, we need new challenges to evaluate their cognitive frontiers. Puzzle-solving events are rich repositories of challenging multimodal problems that test a wide range of advanced reasoning and knowledge capabilities, making them a unique testbed for evaluating frontier language models. We introduce EnigmaEval, a dataset of problems and solutions derived from puzzle competitions and events that probes models' ability to perform implicit knowledge synthesis and multi-step deductive reasoning.",
    category: "capabilities",
    capabilities: ["vision"]
  },
  {
    id: "intphys2",
    name: "IntPhysics2",
    link: "#",
    description: "A video benchmark designed to evaluate the intuitive physics understanding of deep learning models. IntPhys 2 focuses on four core principles: Permanence, Immutability, Spatio-Temporal Continuity, and Solidity, and offers a comprehensive suite of tests based on the violation of expectation framework, which challenge models to differentiate between possible and impossible events within controlled and diverse virtual environments.",
    category: "capabilities",
    capabilities: ["vision"]
  }
];

export const SAFETY_DATASETS: Dataset[] = [
  {
    id: "masks",
    name: "MASKS",
    link: "https://www.mask-benchmark.ai",
    description: "As large language models (LLMs) become more capable and agentic, the requirement for trust in their outputs grows significantly, yet at the same time concerns have been mounting that models may learn to lie in pursuit of their goals. To address these concerns, a body of work has emerged around the notion of ``honesty'' in LLMs, along with interventions aimed at mitigating deceptive behaviors. However, evaluations of honesty are currently highly limited, with no benchmark combining large scale and applicability to all models. Moreover, many benchmarks claiming to measure honesty in fact simply measure accuracy—the correctness of a model's beliefs—in disguise. In this work, we introduce a large-scale human-collected dataset for measuring honesty directly, allowing us to disentangle accuracy from honesty for the first time. Across a diverse set of LLMs, we find that while larger models obtain higher accuracy on our benchmark, they do not become more honest. Surprisingly, while most frontier LLMs obtain high scores on truthfulness benchmarks, we find a substantial propensity in frontier LLMs to lie when pressured to do so, resulting in low honesty scores on our benchmark. We find that simple methods, such as representation engineering interventions, can improve honesty. These results underscore the growing need for robust evaluations and effective interventions to ensure LLMs remain trustworthy.",
    category: "safety"
  },
  {
    id: "textquests_harm",
    name: "TextQuests Harm",
    link: "https://textquests.ai/",
    description: "How Good are LLMs at Text-Based Video Games? (Harm metric - lower is better)",
    logo: textquests_logo,
    category: "safety"
  },
  {
    id: "vct_refusal",
    name: "VCT",
    link: "https://www.virologytest.ai",
    description: "Virology Capabilities Test - Virology Capabilities Test (VCT), a large language model (LLM) benchmark that measures the capability to troubleshoot complex virology laboratory protocols. VCT is difficult: expert virologists with access to the internet score an average of 22.1% on questions specifically in their sub-areas of expertise.",
    category: "safety",
    logo: vct_logo,
  }
];


// Import models data from JSON file
import modelsData from '@/data/models.json';

export const MODELS: Model[] = modelsData as Model[];