import openai_logo from "@/assets/provider-logos/openai-logomark.png";
import claude_logo from "@/assets/provider-logos/claude_logo.svg";
import gemini_logo from "@/assets/provider-logos/gemini_logo.png";
import grok_logo from "@/assets/provider-logos/grok_logo.png";
import meta_logo from "@/assets/provider-logos/meta-icon.png";
import deepseek_logo from "@/assets/provider-logos/deepseek_logo.svg";
import qwen_logo from "@/assets/provider-logos/qwen_logo.png";
import kimi_logo from "@/assets/provider-logos/kimi_logo.png";
import o1_logo from "@/assets/provider-logos/o1-logo.png";
import xai_logo from "@/assets/provider-logos/xai_logo.svg";
import manus_logo from "@/assets/provider-logos/manus_logo.svg";
import hle_examples from "@/assets/dataset-examples/hle_examples.png";
import textquests_logo from "@/assets/dataset-logos/textquests_logo.svg";
import hle_logo from "@/assets/dataset-logos/hle_logo.svg";
import arc_agi_logo from "@/assets/dataset-logos/arc_agi_logo.png";
import vct_logo from "@/assets/dataset-logos/vct_logo.svg";
import swebench_logo from "@/assets/dataset-logos/swebench_logo.png";
import mindcube_logo from "@/assets/dataset-logos/mindcube_logo.png";
import terminalbench_logo from "@/assets/dataset-logos/terminalbench_logo.png";
import erqa_logo from "@/assets/dataset-logos/erqa_logo.svg";
import intphys2_logo from "@/assets/dataset-logos/intphys2_logo.svg";
import enigmaeval_logo from "@/assets/dataset-logos/enigmaeval_logo.svg";
import art_logo from "@/assets/dataset-logos/art_logo.png";
import mask_logo from "@/assets/dataset-logos/mask_logo.svg";
import machiavelli_logo from "@/assets/dataset-logos/machiavelli_logo.svg";
import spatialviz_logo from "@/assets/dataset-logos/spatialviz_logo.png";
import textquests_examples from "@/assets/dataset-examples/textquests_examples.png";
import terminalbench_examples from "@/assets/dataset-examples/terminalbench_examples.png";
import swebench_examples from "@/assets/dataset-examples/swebench_examples.png";
import enigmaeval_examples from "@/assets/dataset-examples/enigmaeval_examples.png";
import mask_examples from "@/assets/dataset-examples/mask_examples.png";
import art_examples from "@/assets/dataset-examples/art_examples.png";
import spatialviz_examples from "@/assets/dataset-examples/spatialviz_examples.png";
// Video files are served from public folder
const intphys2_examples = "/dataset-examples/intphys2_examples.mp4";
const intphys2_examples_mobile = "/dataset-examples/intphys2_examples_mobile.mp4";
import erqa_examples from "@/assets/dataset-examples/erqa_examples.png";
import mindcube_examples from "@/assets/dataset-examples/mindcube_examples.png";
import arc_agi_2_examples from "@/assets/dataset-examples/arc_agi_2_examples.png";
import vct_examples from "@/assets/dataset-examples/vct_examples.png";

import { Dataset, Model } from "@/lib/types";
import { Image as ImageIcon, SquareTerminal, GraduationCap, Bot, Earth, Puzzle, Gamepad, Map, Code, Eye } from "lucide-react";
import React from "react";

// Provider color mapping for charts (single color per provider)
export const PROVIDER_COLORS: Record<string, string> = {
  openai: '#22c55e', // Green
  anthropic: '#f97316', // Orange
  xai: '#374151', // Gray/Black
  google: '#F64746', // red
  deepseek: '#4D6BFE', // DeepSeek blue
  meta: '#38bdf8', // Sky blue
  qwen: '#a855f7', // Purple
  moonshot: '#6b7280', // Gray
  manus: '#0ea5e9', // Sky blue (Manus)
};

// Provider color shades for bar charts (from dark/base to light)
export const PROVIDER_COLOR_SHADES: Record<string, string[]> = {
  openai: ['#22c55e', '#36d16f', '#4ade80'], // Green shades
  anthropic: ['#f97316', '#fa8229', '#fb923c'], // Orange shades
  xai: ['#374151', '#515968', '#6b7280'], // Gray/Black shades
  google: ['#F64746', '#f86262', '#fa7e7e'], // Red shades
  deepseek: ['#4D6BFE', '#617cfe', '#758efe'], // DeepSeek blue shades
  meta: ['#38bdf8', '#5ac8fa', '#7dd3fc'], // Sky blue shades
  qwen: ['#a855f7', '#b46cf9', '#c084fc'], // Purple shades
  moonshot: ['#6b7280', '#838aa7', '#9ca3af'], // Gray shades
  manus: ['#0ea5e9', '#38bdf8', '#7dd3fc'], // Sky blue shades (Manus)
};

// Provider list to show by default (before expand)
export const SHOW_PROVIDER_LIST = ["google", "openai", "xai", "anthropic", "deepseek"];

// Provider information with country and display name
export interface ProviderInfo {
  id: string;
  displayName: string;
  country: 'usa' | 'china';
  flag: string; // Emoji flag
}

export const PROVIDER_INFO: Record<string, ProviderInfo> = {
  openai: { id: 'openai', displayName: 'OpenAI', country: 'usa', flag: '🇺🇸' },
  google: { id: 'google', displayName: 'Google', country: 'usa', flag: '🇺🇸' },
  anthropic: { id: 'anthropic', displayName: 'Anthropic', country: 'usa', flag: '🇺🇸' },
  xai: { id: 'xai', displayName: 'xAI', country: 'usa', flag: '🇺🇸' },
  moonshot: { id: 'moonshot', displayName: 'Moonshot', country: 'china', flag: '🇨🇳' },
  deepseek: { id: 'deepseek', displayName: 'DeepSeek', country: 'china', flag: '🇨🇳' },
  qwen: { id: 'qwen', displayName: 'Alibaba', country: 'china', flag: '🇨🇳' },
  meta: { id: 'meta', displayName: 'Meta', country: 'usa', flag: '🇺🇸' },
};

// Helper function to get provider info
export const getProviderInfo = (provider: string): ProviderInfo => {
  return PROVIDER_INFO[provider] || { 
    id: provider, 
    displayName: provider.charAt(0).toUpperCase() + provider.slice(1), 
    country: 'usa', 
    flag: '🌐' 
  };
};

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
  coding: {
    id: "coding",
    name: "Coding",
    icon: Code,
    tooltipText: "Coding Benchmark"
  },
  agent: {
    id: "agent",
    name: "Agentic Capabilities",
    icon: SquareTerminal,
    tooltipText: "Agentic Capabilities Benchmark"
  },
  games: {
    id: "games",
    name: "Text-Based Video Games",
    icon: Gamepad,
    tooltipText: "Text-Based Video Games Benchmark"
  },
  expert: {
    id: "expert",
    name: "Expert-Level Reasoning", 
    icon: GraduationCap,
    tooltipText: "Expert-Level Reasoning Benchmark"
  },
  fluid_reasoning: {
    id: "fluid_reasoning",
    name: "Abstract Reasoning",
    icon: Bot,
    tooltipText: "Abstract Reasoning Benchmark"
  },
  expert_puzzle: {
    id: "expert_puzzle",
    name: "Challenging Puzzles",
    icon: Puzzle,
    tooltipText: "Challenging Puzzles Benchmark"
  },
  realworld_physics: {
    id: "realworld_physics", 
    name: "Intuitive Physics",
    icon: Earth,
    tooltipText: "Intuitive Physics Benchmark"
  },
  embodied_reasoning: {
    id: "embodied_reasoning",
    name: "Embodied Reasoning", 
    icon: Bot,
    tooltipText: "Embodied Reasoning Benchmark"
  },
  spatial_navigation: {
    id: "spatial_navigation",
    name: "Spatial Navigation",
    icon: Map,
    tooltipText: "Spatial Navigation Benchmark"
  },
  mental_visualization: {
    id: "mental_visualization",
    name: "Mental Visualization",
    icon: Eye,
    tooltipText: "Mental Visualization Benchmark"
  },
  dishonesty: {
    id: "dishonesty",
    name: "Deception",
    icon: Bot,
    tooltipText: "Deception Benchmark"
  },
  bioweapons_compliance: {
    id: "bioweapons_compliance",
    name: "Bioweapons Assistance",
    icon: Bot,
    tooltipText: "Bioweapons Assistance Benchmark"
  },
  harmful_propensity: {
    id: "harmful_propensity",
    name: "Harmful Propensities",
    icon: Bot,
    tooltipText: "Harmful Propensities Benchmark"
  },
  deception_propensity: {
    id: "deception_propensity",
    name: "Deception",
    icon: Bot,
    tooltipText: "Deception Benchmark"
  },
  adversarial_robustness: {
    id: "adversarial_robustness",
    name: "Jailbreaks",
    icon: Bot,
    tooltipText: "Jailbreaks Benchmark"
  },
  overconfident: {
    id: "overconfident",
    name: "Overconfidence",
    icon: Bot,
    tooltipText: "Overconfidence Benchmark"
  }
};

export const PAPER_URL = "https://arxiv.org/abs/2507.23701";
export const GITHUB_URL = "https://github.com/centerforaisafety/simple-evals";

export const BIBTEX_CITATION = `@misc{caisaidashboard,
      title={CAIS AI Dashboard},
      author={Long Phan and Arunim Agarwal and Dan Hendrycks},
      year={2025},
      publisher={Center for AI Safety},
      howpublished="\\url{https://dashboard.safe.ai}",
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
  manus: { src: manus_logo, width: 18, height: 18 },
};

// Utility function to get provider logo
export const getProviderLogo = (provider: string) => {
  return PROVIDER_LOGO_MAP[provider as keyof typeof PROVIDER_LOGO_MAP] || PROVIDER_LOGO_MAP.openai;
};

// Text-based capabilities datasets
export const TEXT_CAPABILITIES_DATASETS: Dataset[] = [
  {
    id: "hle",
    name: "Humanity's Last Exam",
    title: "Humanity's Last Exam",
    link: "https://lastexam.ai",
    description: "<a href='https://lastexam.ai' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>Humanity's Last Exam (HLE)</a> <i>(No Tools)</i> tests LLMs on 2,500 expert-written academic questions spanning 100+ disciplines (math, humanities, natural sciences). Most questions are authored by researchers, professors, postdocs, and PhD students across 500+ research institutions and universities worldwide. HLE is designed to evaluate LLMs' knowledge and reasoning at the human frontier. <br><br><i><strong>No Tools</strong></i> evaluates LLMs without access to any external tools (web search, code etc.)",
    logo: hle_logo,
    category: "text",
    capabilities: ["expert"],
    paperLink: "https://arxiv.org/abs/2312.08793",
    githubLink: "https://github.com/centerforaisafety/hle",
    huggingfaceLink: "https://huggingface.co/datasets/cais/hle",
    citationUrl: "https://raw.githubusercontent.com/centerforaisafety/hle/main/citation.txt",
    examples: [{
      type: "image",
      src: hle_examples,
      alt: "Samples of the diverse and challenging questions submitted to Humanity's Last Exam."
    }]
  },
  {
    id: "arc_agi_2",
    name: "ARC-AGI-2",
    link: "https://arcprize.org/",
    description: "<a href='https://arcprize.org/' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>ARC-AGI-2</a> uses abstract visual puzzles to evaluate on-the-spot reasoning skills. The benchmark measures fluid intelligence—the ability to reason, solve novel problems, and adapt to new situations—rather than crystallized intelligence that relies on accumulated knowledge.<br><br>Scoring high on ARC-AGI-2 demonstrates that a system can efficiently acquire new skills outside its training data.",
    logo: arc_agi_logo.src,
    category: "text",
    capabilities: ["fluid_reasoning"],
    paperLink: "https://arxiv.org/abs/1911.01547",
    githubLink: "https://github.com/fchollet/ARC-AGI",
    citation: `@misc{chollet2019measure,
      title={On the Measure of Intelligence}, 
      author={François Chollet},
      year={2019},
      eprint={1911.01547},
      archivePrefix={arXiv},
      primaryClass={cs.AI},
      url={https://arxiv.org/abs/1911.01547}, 
}`,
    examples: [{
      type: "image",
      src: arc_agi_2_examples,
      alt: "Examples of abstract visual reasoning puzzles from ARC-AGI-2."
    }]
  },
  {
    id: "swebench_verified",
    name: "SWE-Bench",
    link: "https://www.swebench.com/bash-only.html",
    description: "<a href='https://www.swebench.com' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>SWE-Bench Verified</a> <i>(Bash Only)</i> tests LLMs ability to solve 500 real Python GitHub issues. <a href='https://www.swebench.com' target='_blank' style='text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>SWE-bench Bash Only</a> only use a minimal bash shell (no tools or special scaffold structure).<br><br>Scoring high would show a model can reliably understand and resolve real-world software engineering issues.",
    logo: swebench_logo.src,
    category: "text",
    capabilities: ["coding"],
    paperLink: "https://arxiv.org/abs/2310.06770",
    githubLink: "https://github.com/SWE-agent/SWE-agent",
    huggingfaceLink: "https://huggingface.co/datasets/princeton-nlp/SWE-bench_Verified",
    examples: [{
      type: "image",
      src: swebench_examples,
      alt: "SWE-bench sources task instances from real-world Python repositories by connecting GitHub issues to merged pull request solutions that resolve related tests. Provided with the issue text and a codebase snapshot, models generate a patch that is evaluated against real tests."
    }],
    citation: `@inproceedings{
    jimenez2024swebench,
    title={{SWE}-bench: Can Language Models Resolve Real-world Github Issues?},
    author={Carlos E Jimenez and John Yang and Alexander Wettig and Shunyu Yao and Kexin Pei and Ofir Press and Karthik R Narasimhan},
    booktitle={The Twelfth International Conference on Learning Representations},
    year={2024},
    url={https://openreview.net/forum?id=VTF8yNQM66}
}`
  },
  {
    id: "terminal_bench",
    name: "Terminal Bench",
    link: "https://www.tbench.ai",
    githubLink: "https://github.com/laude-institute/terminal-bench",
    description: "<a href='https://www.tbench.ai' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>Terminal-Bench 2.0</a> evaluates agents' terminal mastery. Tasks cover a wide range of engineering, game playing, and system administration tasks that are unlikely to be pattern-matched on training data. Outcomes are evaluated programmattically with verification scripts executed in the agent's Docker environment, requiring agents to successfully meet a range of output conditions. Terminal Bench 2.0 is evaluated using <a href='https://github.com/SWE-agent/mini-swe-agent' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>Mini-SWE-Agent</a>.",
    logo: terminalbench_logo.src,
    category: "text",
    capabilities: ["coding"],
    examples: [{
      type: "image",
      src: terminalbench_examples,
      alt: "Examples of terminal-based coding and system administration tasks from Terminal Bench."
    }],
    citation: `@misc{tbench_2025,
      title={Terminal-Bench: A Benchmark for AI Agents in Terminal Environments}, 
      url={https://github.com/laude-institute/terminal-bench}, 
      author={The Terminal-Bench Team}, year={2025}, month={Apr}}`
  },
  {
    id: "textquests",
    name: "TextQuests",
    link: "https://textquests.ai/",
    paperLink: "https://arxiv.org/abs/2507.23701",
    githubLink: "https://github.com/centerforaisafety/textquests",
    huggingfaceLink: "https://huggingface.co/blog/textquests",
    citation: `@article{hendrycks2021jiminycricket,
      title={What Would Jiminy Cricket Do? Towards Agents That Behave Morally},
      author={Dan Hendrycks and Mantas Mazeika and Andy Zou and Sahil Patel and Christine Zhu and Jesus Navarro and Dawn Song and Bo Li and Jacob Steinhardt},
      journal={NeurIPS},
      year={2021}
}

@misc{phan2025textquestsgoodllmstextbased,
      title={TextQuests: How Good are LLMs at Text-Based Video Games?}, 
      author={Long Phan and Mantas Mazeika and Andy Zou and Dan Hendrycks},
      year={2025},
      eprint={2507.23701},
      archivePrefix={arXiv},
      primaryClass={cs.AI},
      url={https://arxiv.org/abs/2507.23701}, 
}`,
    description: "<a href='https://textquests.ai/' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>TextQuests</a> tests LLM agents on 25 classic exploratory text-based adventure games, which can take humans hundreds of precise actions and over 30 hours of gameplay to solve. Most questions revolve around exploratory, long-horizon problem solving, requiring trial-and-error reasoning and multi-step planning.<br><br>Scoring high would show an agent can sustain long-horizon reasoning and planning in exploratory environments.",
    logo: textquests_logo,
    category: "text",
    capabilities: ["games"],
    examples: [{
      type: "image",
      src: textquests_examples,
      alt: "Examples showing the diverse reasoning challenges in TextQuests."
    }]
  }
];

// Multimodal capabilities datasets
export const MULTIMODAL_DATASETS: Dataset[] = [
  {
    id: "erqa",
    name: "ERQA",
    link: "https://github.com/embodiedreasoning/ERQA",
    description: "<a href='https://github.com/embodiedreasoning/ERQA' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>ERQA</a> evaluates Vision-Language Models on embodied reasoning questions, particularly in robotics. The benchmark spans spatial reasoning, trajectory reasoning, action reasoning, state estimation, pointing, multi-view reasoning, and task reasoning.<br><br>Scoring high on ERQA would indicate a model has a broad capability to reason about the physical world in ways critical for embodied robotics.",
    logo: erqa_logo.src,
    randomChance: 25,
    category: "vision",
    capabilities: ["embodied_reasoning"],
    paperLink: "https://arxiv.org/abs/2503.20020",
    githubLink: "https://github.com/embodiedreasoning/ERQA",
    examples: [{
      type: "image",
      src: erqa_examples,
      alt: "Example questions from the Embodied Reasoning Question Answering (ERQA) benchmark"
    }],
    citation: `@misc{geminiroboticsteam2025geminiroboticsbringingai,
      title={Gemini Robotics: Bringing AI into the Physical World}, 
      author={Gemini Robotics Team and Saminda Abeyruwan and Joshua Ainslie and Jean-Baptiste Alayrac and Montserrat Gonzalez Arenas and Travis Armstrong and Ashwin Balakrishna and Robert Baruch and Maria Bauza and Michiel Blokzijl and Steven Bohez and Konstantinos Bousmalis and Anthony Brohan and Thomas Buschmann and Arunkumar Byravan and Serkan Cabi and Ken Caluwaerts and Federico Casarini and Oscar Chang and Jose Enrique Chen and Xi Chen and Hao-Tien Lewis Chiang and Krzysztof Choromanski and David D'Ambrosio and Sudeep Dasari and Todor Davchev and Coline Devin and Norman Di Palo and Tianli Ding and Adil Dostmohamed and Danny Driess and Yilun Du and Debidatta Dwibedi and Michael Elabd and Claudio Fantacci and Cody Fong and Erik Frey and Chuyuan Fu and Marissa Giustina and Keerthana Gopalakrishnan and Laura Graesser and Leonard Hasenclever and Nicolas Heess and Brandon Hernaez and Alexander Herzog and R. Alex Hofer and Jan Humplik and Atil Iscen and Mithun George Jacob and Deepali Jain and Ryan Julian and Dmitry Kalashnikov and M. Emre Karagozler and Stefani Karp and Chase Kew and Jerad Kirkland and Sean Kirmani and Yuheng Kuang and Thomas Lampe and Antoine Laurens and Isabel Leal and Alex X. Lee and Tsang-Wei Edward Lee and Jacky Liang and Yixin Lin and Sharath Maddineni and Anirudha Majumdar and Assaf Hurwitz Michaely and Robert Moreno and Michael Neunert and Francesco Nori and Carolina Parada and Emilio Parisotto and Peter Pastor and Acorn Pooley and Kanishka Rao and Krista Reymann and Dorsa Sadigh and Stefano Saliceti and Pannag Sanketi and Pierre Sermanet and Dhruv Shah and Mohit Sharma and Kathryn Shea and Charles Shu and Vikas Sindhwani and Sumeet Singh and Radu Soricut and Jost Tobias Springenberg and Rachel Sterneck and Razvan Surdulescu and Jie Tan and Jonathan Tompson and Vincent Vanhoucke and Jake Varley and Grace Vesom and Giulia Vezzani and Oriol Vinyals and Ayzaan Wahid and Stefan Welker and Paul Wohlhart and Fei Xia and Ted Xiao and Annie Xie and Jinyu Xie and Peng Xu and Sichun Xu and Ying Xu and Zhuo Xu and Yuxiang Yang and Rui Yao and Sergey Yaroshenko and Wenhao Yu and Wentao Yuan and Jingwei Zhang and Tingnan Zhang and Allan Zhou and Yuxiang Zhou},
      year={2025},
      eprint={2503.20020},
      archivePrefix={arXiv},
      primaryClass={cs.RO},
      url={https://arxiv.org/abs/2503.20020}, 
}`
  },
  {
    id: "mindcube",
    name: "MindCube",
    link: "https://mind-cube.github.io/",
    description: "<a href='https://mind-cube.github.io/' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>MindCube <i>Tiny</i></a> tests Vision-Language Models's spatial navigation working memory. Multi-view image groups are paired with spatial reasoning questions targeting challenges like maintaining object consistency across views, reasoning about occluded elements, perspective-taking, and 'what-if' dynamics.<br><br>Scoring high on MindCube Tiny would indicate a model has a robust ability to reason about the physical world in ways critical for spatial navigation.",
    logo: mindcube_logo.src,
    randomChance: 25,
    category: "vision",
    capabilities: ["spatial_navigation"],
    paperLink: "https://arxiv.org/abs/2506.21458",
    githubLink: "https://github.com/mll-lab-nu/MindCube",
    huggingfaceLink: "https://huggingface.co/datasets/MLL-Lab/MindCube",
    examples: [{
      type: "image",
      src: mindcube_examples,
      alt: "Example spatial reasoning questions from MindCube benchmark showing multi-view image groups and reasoning challenges."
    }],
    citation: `@misc{yin2025spatialmentalmodelinglimited,
      title={Spatial Mental Modeling from Limited Views}, 
      author={Baiqiao Yin and Qineng Wang and Pingyue Zhang and Jianshu Zhang and Kangrui Wang and Zihan Wang and Jieyu Zhang and Keshigeyan Chandrasegaran and Han Liu and Ranjay Krishna and Saining Xie and Manling Li and Jiajun Wu and Li Fei-Fei},
      year={2025},
      eprint={2506.21458},
      archivePrefix={arXiv},
      primaryClass={cs.AI},
      url={https://arxiv.org/abs/2506.21458}, 
}`
  },
  {
    id: "spatialviz",
    name: "SpatialViz",
    link: "https://github.com/wangst0181/Spatial-Visualization-Benchmark",
    description: "<a href='https://arxiv.org/abs/2507.07610' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>SpatialViz</a> evaluates AI systems on their ability to mentally rotate, visualize folded objects, and so on. SpatialViz-Bench evaluates 4 spatial sub-abilities, mental rotation, mental folding, visual penetration, and mental animation.",
    logo: spatialviz_logo.src,
    randomChance: 25,
    category: "vision",
    capabilities: ["mental_visualization"],
    paperLink: "https://arxiv.org/abs/2507.07610",
    githubLink: "https://github.com/wangst0181/Spatial-Visualization-Benchmark",
    huggingfaceLink: "https://huggingface.co/datasets/PLM-Team/Spatial-Visualization-Benchmark",
    examples: [{
      type: "image",
      src: spatialviz_examples,
      alt: "Example spatial visualization questions from SpatialViz benchmark."
    }],
    citation: `@misc{wang2025spatialvizbenchmllmbenchmarkspatial,
      title={SpatialViz-Bench: An MLLM Benchmark for Spatial Visualization}, 
      author={Siting Wang and Minnan Pei and Luoyang Sun and Cheng Deng and Kun Shao and Zheng Tian and Haifeng Zhang and Jun Wang},
      year={2025},
      eprint={2507.07610},
      archivePrefix={arXiv},
      primaryClass={cs.CV},
      url={https://arxiv.org/abs/2507.07610}, 
}`
  },
  {
    id: "intphys2",
    name: "IntPhys 2",
    link: "https://ai.meta.com/blog/v-jepa-2-world-model-benchmarks",
    description: "<a href='https://ai.meta.com/blog/v-jepa-2-world-model-benchmarks' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>IntPhys 2</a> evaluates LLMs understanding of intuitive physics through video clips testing core principles like permanence, solidity, and spatio-temporal continuity. Models must identify physically plausible versus impossible physical-world scenes.<br><br> Scoring high on IntPhys 2 would demonstrate that a model has a sufficient grasp of basic physical-world dynamics.",
    logo: intphys2_logo.src,
    category: "vision",
    capabilities: ["realworld_physics"],
    randomChance: 50,
    paperLink: "https://arxiv.org/abs/2506.09849",
    githubLink: "https://github.com/facebookresearch/IntPhys2/tree/main",
    huggingfaceLink: "https://huggingface.co/datasets/facebook/IntPhys2",
    examples: [{
      type: "video",
      src: intphys2_examples,
      mobileSrc: intphys2_examples_mobile, // Mobile-optimized version
      alt: "Example of a scene in IntPhys2. Each scene consists of a set of four videos. Two pairs depict possible outcomes, while the other two represent impossible outcomes. The presence of an obstacle or occluder determines the outcome: a possible outcome in the first pair becomes impossible in the second, and vice versa. In this example, a silver ball rolls down a path. If a brick obstacle is present, the ball should collide with it and change its trajectory. If the ball passes through the brick obstacle without altering its path, this outcome is deemed impossible. Conversely, when no obstacle is present, the ball's trajectory should remain unchanged, making this the likely outcome."
    }],
    citation: `@misc{bordes2025intphys2benchmarkingintuitive,
      title={IntPhys 2: Benchmarking Intuitive Physics Understanding In Complex Synthetic Environments}, 
      author={Florian Bordes and Quentin Garrido and Justine T Kao and Adina Williams and Michael Rabbat and Emmanuel Dupoux},
      year={2025},
      eprint={2506.09849},
      archivePrefix={arXiv},
      primaryClass={cs.CV},
      url={https://arxiv.org/abs/2506.09849}, 
}`
  },
  {
    id: "enigmaeval",
    name: "EnigmaEval",
    link: "https://scale.com/leaderboard/enigma_eval",
    description: "<a href='https://scale.com/leaderboard/enigma_eval' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>EnigmaEval</a> evaluates LLMs on extremely hard multimodal puzzles from competitions like the MIT Mystery Hunt, one of the world's toughest puzzle competitions. These puzzles often take teams of expert humans several days to solve, requiring lateral, multi-step reasoning over images and text.<br><br>Scoring high on EnigmaEval would show that a LLM is sufficiently capable of solving extremely complex puzzles and problems that push the limits of reasoning ability.",
    logo: enigmaeval_logo.src,
    category: "vision",
    capabilities: ["expert_puzzle"],
    paperLink: "https://arxiv.org/abs/2502.08859",
    examples: [{
      type: "image",
      src: enigmaeval_examples,
      alt: "A sample of puzzles and solutions in EnigmaEval."
    }],
    citation: `@misc{wang2025enigmaevalbenchmarklongmultimodal,
      title={EnigmaEval: A Benchmark of Long Multimodal Reasoning Challenges}, 
      author={Clinton J. Wang and Dean Lee and Cristina Menghini and Johannes Mols and Jack Doughty and Adam Khoja and Jayson Lynch and Sean Hendryx and Summer Yue and Dan Hendrycks},
      year={2025},
      eprint={2502.08859},
      archivePrefix={arXiv},
      primaryClass={cs.AI},
      url={https://arxiv.org/abs/2502.08859}, 
}`,
  }
];

// Legacy export for backward compatibility (combines text and multimodal)
export const CAPABILITIES_DATASETS: Dataset[] = [...TEXT_CAPABILITIES_DATASETS, ...MULTIMODAL_DATASETS];

export const SAFETY_DATASETS: Dataset[] = [
  {
    id: "art",
    name: "Agent Red Teaming",
    link: "https://arxiv.org/abs/2507.20526",
    description: "<a href='https://arxiv.org/abs/2507.20526' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>ART</a> (Agent Red Teaming) measures robustness against malicious use and prompt injections. The benchmark evaluates AI agents across five core behavior categories: Confidentiality Breaches, Conflicting Objectives, Instruction Hierarchy Violations — Information, and Instruction Hierarchy Violations — Actions. Results represent the probability that an attacker finds a successful attack after k=100 attempts for each model.",
    logo: art_logo.src,
    category: "safety",
    capabilities: ["adversarial_robustness"],
    examples: [{
      type: "image",
      src: art_examples,
      alt: "Examples of ART benchmark testing adversarial robustness and prompt injection resistance"
    }],
    citation: `@misc{zou2025securitychallengesaiagent,
      title={Security Challenges in AI Agent Deployment: Insights from a Large Scale Public Competition}, 
      author={Andy Zou and Maxwell Lin and Eliot Jones and Micha Nowak and Mateusz Dziemian and Nick Winter and Alexander Grattan and Valent Nathanael and Ayla Croft and Xander Davies and Jai Patel and Robert Kirk and Nate Burnikell and Yarin Gal and Dan Hendrycks and J. Zico Kolter and Matt Fredrikson},
      year={2025},
      eprint={2507.20526},
      archivePrefix={arXiv},
      primaryClass={cs.AI},
      url={https://arxiv.org/abs/2507.20526}, 
}`
  },
  {
    id: "vct_refusal",
    name: "VCT",
    displayName: "VCT",
    link: "https://www.virologytest.ai",
    paperLink: "https://arxiv.org/abs/2504.16137",
    description: "<a href='https://www.virologytest.ai' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>Virology Capabilities Test (VCT)</a>'s Refusal Set measures the rate of compliance to hazardous expert-level virology queries. VCT-Refusal is a subset of VCT that is manually labeled by experts for queries that should be refused because of potential <b><i>dual-use</i></b>. <br>The ability to provide expert-level troubleshooting is inherently <b><i>dual-use</i></b>: it is useful for beneficial research, but it can also be misused in particularly harmful ways.",
    category: "safety",
    logo: vct_logo,
    capabilities: ["bioweapons_compliance"],
    postprocessScore: (score: number) => 100 - score,
    examples: [{
      type: "image",
      src: vct_examples,
      alt: "Examples of complex virology protocol troubleshooting questions from VCT."
    }],
    citation: `@misc{götting2025virologycapabilitiestestvct,
      title={Virology Capabilities Test (VCT): A Multimodal Virology Q\\&A Benchmark}, 
      author={Jasper Götting and Pedro Medeiros and Jon G Sanders and Nathaniel Li and Long Phan and Karam Elabd and Lennart Justen and Dan Hendrycks and Seth Donoughe},
      year={2025},
      eprint={2504.16137},
      archivePrefix={arXiv},
      primaryClass={cs.CY},
      url={https://arxiv.org/abs/2504.16137}, 
}`
  },
  {
    id: "hle_calibration_error",
    name: "Humanity's Last Exam",
    title: "Humanity's Last Exam - Miscalibration",
    link: "https://lastexam.ai",
    description: "<a href='https://lastexam.ai' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>Humanity's Last Exam (HLE)</a> Miscalibration measures the extent to which AI systems are underconfident or overconfident. This metric evaluates whether models are overconfident or underconfident in their predictions across 2,500 expert-written academic questions spanning 100+ disciplines. Lower calibration error indicates better alignment between a model's expressed confidence and its true performance. We use the RMS Calibration Error metric.",
    logo: hle_logo,
    category: "safety",
    capabilities: ["overconfident"],
    paperLink: "https://arxiv.org/abs/2312.08793",
    githubLink: "https://github.com/centerforaisafety/hle",
    huggingfaceLink: "https://huggingface.co/datasets/cais/hle",
    citationUrl: "https://raw.githubusercontent.com/centerforaisafety/hle/main/citation.txt",
    examples: [{
      type: "image",
      src: hle_examples,
      alt: "Samples of the diverse and challenging questions submitted to Humanity's Last Exam."
    }]
  },
  {
    id: "masks",
    name: "MASK",
    link: "https://www.mask-benchmark.ai",
    description: "<a href='https://www.mask-benchmark.ai' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>MASK</a> is a dataset that tests the extent to which AIs can be pressured to overtly lie. While larger models obtain higher accuracy, they do not become more honest. Surprisingly, frontier LLMs show a substantial propensity to lie when pressured, resulting in low honesty scores.",
    category: "safety",
    logo: mask_logo.src,
    capabilities: ["dishonesty"],
    postprocessScore: (score: number) => 100 - score,
    examples: [{
      type: "image",
      src: mask_examples,
      alt: "Examples of MASK benchmark questions testing honesty in language models"
    }],
    citation: `@misc{ren2025maskbenchmarkdisentanglinghonesty,
      title={The MASK Benchmark: Disentangling Honesty From Accuracy in AI Systems}, 
      author={Richard Ren and Arunim Agarwal and Mantas Mazeika and Cristina Menghini and Robert Vacareanu and Brad Kenstler and Mick Yang and Isabelle Barrass and Alice Gatti and Xuwang Yin and Eduardo Trevino and Matias Geralnik and Adam Khoja and Dean Lee and Summer Yue and Dan Hendrycks},
      year={2025},
      eprint={2503.03750},
      archivePrefix={arXiv},
      primaryClass={cs.LG},
      url={https://arxiv.org/abs/2503.03750}, 
}`
  },
  {
    id: "machiavelli",
    name: "Machiavelli",
    logo: machiavelli_logo.src,
    link: "https://aypan17.github.io/machiavelli/",
    description: "<a href='https://aypan17.github.io/machiavelli/' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>Machiavelli</a> measures harmful behaviors in LLM agents across 30 text-based games. We use its deception measurements from its various goal-oriented scenarios.",
    category: "safety",
    capabilities: ["deception_propensity"],
    citation: `@misc{pan2023rewardsjustifymeansmeasuring,
      title={Do the Rewards Justify the Means? Measuring Trade-Offs Between Rewards and Ethical Behavior in the MACHIAVELLI Benchmark}, 
      author={Alexander Pan and Jun Shern Chan and Andy Zou and Nathaniel Li and Steven Basart and Thomas Woodside and Jonathan Ng and Hanlin Zhang and Scott Emmons and Dan Hendrycks},
      year={2023},
      eprint={2304.03279},
      archivePrefix={arXiv},
      primaryClass={cs.LG},
      url={https://arxiv.org/abs/2304.03279}, 
}`
  },
  {
    id: "textquests_harm",
    name: "TextQuests Harm",
    displayName: "TextQuests Harm",
    link: "https://textquests.ai/",
    description: "<a href='https://textquests.ai/' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>TextQuests</a>'s harm metric measures the AI's propensity to engage in wantonly harmful behaviors in text-based adventure games.",
    logo: textquests_logo,
    category: "safety",
    capabilities: ["harmful_propensity"]
  }
];


// Import models data from JSON file
import modelsData from '@/data/models.json';

export const MODELS: Model[] = modelsData as Model[];