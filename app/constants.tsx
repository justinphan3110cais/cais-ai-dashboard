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
import textquests_examples from "@/assets/dataset-examples/textquests_examples.png";
import terminalbench_examples from "@/assets/dataset-examples/terminalbench_examples.png";
import swebench_examples from "@/assets/dataset-examples/swebench_examples.png";
import enigmaeval_examples from "@/assets/dataset-examples/enigmaeval_examples.png";
import mask_examples from "@/assets/dataset-examples/mask_examples.png";
// Video files are served from public folder
const intphys2_examples = "/dataset-examples/intphys2_examples.mp4";
import erqa_examples from "@/assets/dataset-examples/erqa_examples.png";
import mindcube_examples from "@/assets/dataset-examples/mindcube_examples.png";
import arc_agi_2_examples from "@/assets/dataset-examples/arc_agi_2_examples.png";
import vct_examples from "@/assets/dataset-examples/vct_examples.png";

import { Dataset, Model } from "@/lib/types";
import { Image as ImageIcon, SquareTerminal, GraduationCap, Bot, Earth, Puzzle, Gamepad, Map, Code } from "lucide-react";
import React from "react";

// Provider color mapping for charts (single color per provider)
export const PROVIDER_COLORS: Record<string, string> = {
  openai: '#22c55e', // Green
  anthropic: '#f97316', // Orange
  xai: '#374151', // Gray/Black
  google: '#1e40af', // Dark blue
  deepseek: '#06b6d4', // Cyan/Light blue
  meta: '#38bdf8', // Sky blue
  qwen: '#a855f7', // Purple
  moonshot: '#6b7280', // Gray
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
  honesty: {
    id: "honesty",
    name: "Honesty",
    icon: Bot,
    tooltipText: "Honesty Benchmark"
  },
  bioweapons_refusal: {
    id: "bioweapons_refusal",
    name: "Bioweapons Refusal",
    icon: Bot,
    tooltipText: "Bioweapons Refusal Benchmark"
  },
  harmful_propensity: {
    id: "harmful_propensity",
    name: "Harmful Propensity",
    icon: Bot,
    tooltipText: "Harmful Propensity Benchmark"
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
    description: "<a href='https://arcprize.org/' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>ARC-AGI-2</a> measures fluid intelligence—the ability to reason, solve novel problems, and adapt to new situations—rather than crystallized intelligence that relies on accumulated knowledge. The benchmark uses abstract visual puzzles based on core knowledge priors (cognitive building blocks present at birth) to evaluate genuine skill-acquisition efficiency on tasks the AI has never encountered.<br><br>Scoring high on ARC-AGI-2 demonstrates that a system can efficiently acquire new skills outside its training data.",
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
    description: "<a href='https://www.tbench.ai' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>terminal-bench</a> is a collection of tasks and an evaluation harness to help agent makers quantify their agents' terminal mastery. Tasks cover a wide range of engineering, game playing, and system administration tasks that are unlikely to be pattern-matched on training data. Outcomes are evaluated programmattically with verification scripts executed in the agent's Docker environment, requiring agents to successfully meet a range of output conditions.",
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
    description: "<a href='https://textquests.ai/' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>TextQuests</a> tests LLM agents on 25 classic Infocom text-based adventure games, which can take humans hundreds of precise actions and over 30 hours of gameplay to solve. Most questions revolve around exploratory, long-horizon problem solving, requiring trial-and-error reasoning and multi-step planning.<br><br>Scoring high would show an agent can sustain long-horizon reasoning and planning in exploratory environments.",
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
    description: "<a href='https://github.com/embodiedreasoning/ERQA' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>ERQA</a> evaluates Vision-Language Models on 400 multiple-choice embodied reasoning questions designed around the capabilities needed by an embodied agent interacting with the physical world, particularly in robotics. The benchmark spans spatial reasoning, trajectory reasoning, action reasoning, state estimation, pointing, multi-view reasoning, and task reasoning.<br><br>Scoring high on ERQA would indicate a model has a broad capability to reason about the physical world in ways critical for embodied robotics.",
    logo: erqa_logo.src,
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
    id: "intphys2",
    name: "IntPhys 2",
    link: "https://ai.meta.com/blog/v-jepa-2-world-model-benchmarks",
    description: "<a href='https://ai.meta.com/blog/v-jepa-2-world-model-benchmarks' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>IntPhys 2</a> evaluates LLM-driven models' understanding of intuitive physics through video clips testing core principles like permanence, solidity, and spatio-temporal continuity. Models must identify physically plausible versus impossible physical-world scenes.<br><br> Scoring high on IntPhys 2 would demonstrate that a model has a sufficient grasp of basic physical-world dynamics.",
    logo: intphys2_logo.src,
    category: "vision",
    capabilities: ["realworld_physics"],
    paperLink: "https://arxiv.org/abs/2506.09849",
    githubLink: "https://github.com/facebookresearch/IntPhys2/tree/main",
    huggingfaceLink: "https://huggingface.co/datasets/facebook/IntPhys2",
    examples: [{
      type: "video",
      src: intphys2_examples,
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
    description: "<a href='https://scale.com/leaderboard/enigma_eval' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>EnigmaEval</a> evaluates LLMs on 1,184 extremely hard multimodal puzzles from competitions like the MIT Mystery Hunt, one of the world's toughest puzzle competitions. These puzzles often take teams of expert humans several days to solve, requiring lateral, multi-step reasoning over images and text.<br><br>Scoring high on EnigmaEval would show that a LLM is sufficiently capable of solving extremely complex puzzles and problems that push the limits of reasoning ability.",
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
  },
  {
    id: "mindcube",
    name: "MindCube",
    link: "https://mind-cube.github.io/",
    description: "<a href='https://mind-cube.github.io/' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>MindCube <i>Tiny</i></a> evaluates Vision-Language Models on spatial reasoning under partial observations and dynamic viewpoints. Multi-view image groups are paired with spatial reasoning questions targeting challenges like maintaining object consistency across views, reasoning about occluded elements, perspective-taking, and 'what-if' dynamics.<br><br>Scoring high on MindCube Tiny would indicate a model has a robust ability to reason about the physical world in ways critical for spatial navigation.",
    logo: mindcube_logo.src,
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
    citation: `@misc{chen2025mindcubevisualquestionanswering,
      title={MindCube: Visual Question Answering with Multi-Agent Debate and Retrieval-Augmented Generation}, 
      author={Jiaxuan Chen and others},
      year={2025},
      eprint={2506.21458},
      archivePrefix={arXiv},
      primaryClass={cs.CV},
      url={https://arxiv.org/abs/2506.21458}, 
}`
  }
];

// Legacy export for backward compatibility (combines text and multimodal)
export const CAPABILITIES_DATASETS: Dataset[] = [...TEXT_CAPABILITIES_DATASETS, ...MULTIMODAL_DATASETS];

export const SAFETY_DATASETS: Dataset[] = [
  {
    id: "masks",
    name: "MASK",
    link: "https://www.mask-benchmark.ai",
    description: "<a href='https://www.mask-benchmark.ai' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>MASK</a> is a large-scale human-collected dataset for measuring honesty in LLMs directly, disentangling accuracy from honesty for the first time. While larger models obtain higher accuracy, they do not become more honest. Surprisingly, frontier LLMs show a substantial propensity to lie when pressured, resulting in low honesty scores. The benchmark underscores the need for robust evaluations to ensure LLMs remain trustworthy.",
    category: "safety",
    capabilities: ["honesty"],
    examples: [{
      type: "image",
      src: mask_examples,
      alt: "Examples of MASK benchmark questions testing honesty in language models"
    }]
  },
  {
    id: "vct_refusal",
    name: "VCT",
    displayName: "VCT - Refusal",
    link: "https://www.virologytest.ai",
    paperLink: "https://arxiv.org/abs/2504.16137",
    description: "<a href='https://www.virologytest.ai' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>Virology Capabilities Test (VCT)</a> Refusal measures the rate of LLM refuse complex virology laboratory protocols queries.<br><br>The ability to provide expert-level troubleshooting is inherently <b><i>dual-use</i></b>: it is useful for beneficial research, but it can also be misused in particularly harmful ways.",
    category: "safety",
    logo: vct_logo,
    capabilities: ["bioweapons_refusal"],
    examples: [{
      type: "image",
      src: vct_examples,
      alt: "Examples of complex virology protocol troubleshooting questions from VCT."
    }],
    citation: `@misc{götting2025virologycapabilitiestestvct,
      title={Virology Capabilities Test (VCT): A Multimodal Virology Q&A Benchmark}, 
      author={Jasper Götting and Pedro Medeiros and Jon G Sanders and Nathaniel Li and Long Phan and Karam Elabd and Lennart Justen and Dan Hendrycks and Seth Donoughe},
      year={2025},
      eprint={2504.16137},
      archivePrefix={arXiv},
      primaryClass={cs.CY},
      url={https://arxiv.org/abs/2504.16137}, 
}`
  },
  {
    id: "machiavelli",
    name: "Machiavelli",
    link: "https://aypan17.github.io/machiavelli/",
    description: "<a href='https://aypan17.github.io/machiavelli/' target='_blank' style='font-weight: 500; text-decoration: underline; text-decoration-style: dashed; text-underline-offset: 4px;'>Machiavelli</a> benchmark measures harmful behaviors in LLM agents across 134 text-based games, evaluating tendencies toward deception, manipulation, and unethical actions in goal-oriented scenarios.",
    category: "safety",
    capabilities: ["harmful_propensity"],
    postprocessScore: (score: number) => 100 - score
  },
  {
    id: "textquests_harm",
    name: "TextQuests Harm",
    displayName: "TextQuests Harm",
    link: "https://textquests.ai/",
    description: "Harm metric from TextQuests measuring unethical behaviors in text-based adventure games (lower is better).",
    logo: textquests_logo,
    category: "safety",
    capabilities: ["harmful_propensity"],
    postprocessScore: (score: number) => 100 - score
  }
];


// Import models data from JSON file
import modelsData from '@/data/models.json';

export const MODELS: Model[] = modelsData as Model[];