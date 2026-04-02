# Embed API

The leaderboard provides three embeddable views that can be included in external websites via iframes. All embed pages use the same components as the main site.

**Base URL:** `https://safetyxcapabilities.ai/embed`

---

## 1. Table Embed — `/embed`

Renders the leaderboard table with model scores.

### Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `cols` | string (comma-separated or repeated) | all | Dataset column IDs to display |
| `models` | string (comma-separated or repeated) | all | Model IDs to include (only these models shown) |
| `avg` | `true` / `false` | `false` | Show the Average column |
| `sort` | string | `average` | Column to sort by (`average` or a dataset ID) |
| `dir` | `asc` / `desc` | `desc` | Sort direction |
| `title` | string | none | Title text shown above the table |
| `bg` | string | `bg-blue-50` | Tailwind bg class for header (`bg-blue-50`, `bg-green-50`, `bg-purple-50`) |

### Example

```
/embed?cols=swebench_pro&models=opus-4-6-adaptive-64k,sonnet-4-6-adaptive-64k,gpt-5.4-high,gemini-3.1-pro-preview-high&title=SWE-Bench%20Pro&avg=false
```

### iframe

```html
<iframe
  src="https://safetyxcapabilities.ai/embed?cols=swebench_pro&models=opus-4-6-adaptive-64k,sonnet-4-6-adaptive-64k,gpt-5.4-high&title=SWE-Bench%20Pro&avg=false"
  width="100%" height="400" style="border: none; border-radius: 8px;">
</iframe>
```

---

## 2. Timeline Embed — `/embed/timeline`

Renders the timeline (scatter plot) showing model performance over time.

### Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `cols` | string (comma-separated) | all in section | Dataset IDs to include |
| `selected` | string (comma-separated) | none | Pre-select specific datasets (highlights them) |
| `defaultTitle` | `true` / `false` | `true` | Show the default title and logo |
| `section` | `text` / `vision` / `safety` | `text` | Section type (affects colors and default datasets) |

### Examples

```
# SWE-Bench Pro timeline only
/embed/timeline?cols=swebench_pro&defaultTitle=true

# Coding benchmarks with Terminal Bench pre-selected
/embed/timeline?cols=swebench_pro,terminal_bench&selected=terminal_bench&defaultTitle=true

# HLE timeline
/embed/timeline?cols=hle&defaultTitle=true

# All text capabilities (default)
/embed/timeline?defaultTitle=true
```

### Notes

- When only 1 dataset is provided, the title shows the dataset name automatically.
- When 2+ datasets share a category (e.g. swebench_pro + terminal_bench = Coding), sub-dataset toggle buttons appear.
- When only 1 category exists, category buttons are hidden unless there are sub-datasets to toggle.

---

## 3. Bar Chart Embed — `/embed/bars`

Renders the horizontal bar chart comparing models on selected benchmarks.

### Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `cols` | string (comma-separated) | all in section | Dataset IDs to include |
| `models` | string (comma-separated) | default flagship | Model IDs to pre-select on the chart. All models remain available via the filter icon. |
| `selected` | string (comma-separated) | none | Pre-select specific datasets |
| `defaultTitle` | `true` / `false` | `true` | Show the default title and logo |
| `section` | `text` / `vision` / `safety` | `text` | Section type |

### Examples

```
# SWE-Bench Pro with specific models pre-selected
/embed/bars?cols=swebench_pro&models=opus-4-6-adaptive-64k,sonnet-4-6-adaptive-64k,gpt-5.4-high,gemini-3.1-pro-preview-high,kimi-k2.5-thinking&defaultTitle=true&selected=swebench_pro

# HLE with frontier models
/embed/bars?cols=hle&models=gemini-3.1-pro-preview-high,gpt-5.4-high,opus-4-6-adaptive-64k,sonnet-4-6-adaptive-64k&defaultTitle=true

# Coding average (both benchmarks)
/embed/bars?cols=swebench_pro,terminal_bench&defaultTitle=true
```

### Notes

- The `models` param sets the **initial selection**. Users can add/remove models via the filter icon (top-right of the chart).
- If `models` is omitted, the default flagship model selection is used.
- Category buttons are hidden when there's only 1 category.

---

## Available Dataset IDs

### Text Capabilities
| ID | Name |
|----|------|
| `hle` | Humanity's Last Exam |
| `arc_agi_2` | ARC-AGI-2 |
| `swebench_pro` | SWE-Bench Pro |
| `terminal_bench` | Terminal Bench |
| `textquests` | TextQuests |

### Vision / Multimodal
| ID | Name |
|----|------|
| `erqa` | ERQA |
| `mindcube` | MindCube |
| `spatialviz` | SpatialViz |
| `intphys2` | IntPhys2 |
| `enigmaeval` | EnigmaEval |
| `art` | ART |

### Safety
| ID | Name |
|----|------|
| `vct_refusal` | VCT Refusal |
| `hle_calibration_error` | HLE Calibration Error |
| `masks` | MASK |
| `machiavelli` | Machiavelli |
| `textquests_harm` | TextQuests Harm |

---

## Available Model IDs

| ID | Name |
|----|------|
| `gemini-3.1-pro-preview-high` | Gemini 3.1 Pro |
| `sonnet-4-6-adaptive-64k` | Sonnet 4.6 |
| `opus-4-6-adaptive-64k` | Opus 4.6 |
| `kimi-k2.5-thinking` | Kimi K2.5 |
| `gemini-3-flash-preview-high` | Gemini 3 Flash |
| `gemini-3-pro-preview-high` | Gemini 3 Pro |
| `opus-4-5-thinking-32k` | Opus 4.5 |
| `gpt-5.2-high` | GPT-5.2 |
| `gpt-5.1-high` | GPT-5.1 |
| `kimi-k2-thinking` | Kimi K2 |
| `gpt-5-high` | GPT-5 |
| `sonnet-4-5-thinking-32k` | Sonnet 4.5 |
| `grok-4` | Grok 4 |
| `grok-4-2` | Grok 4.2 |
| `grok-4.1-fast-reasoning` | Grok 4.1 Fast |
| `grok-4-fast-reasoning` | Grok 4 Fast |
| `gemini-2-5-pro-high` | Gemini 2.5 Pro |
| `gpt-5-mini-high` | GPT-5-mini |
| `gpt-5.4-mini-high` | GPT-5.4-mini |
| `gemini-2-5-flash-high` | Gemini 2.5 Flash |
| `deepseek-v3.2-thinking` | DeepSeek 3.2 |
| `gemini-2-5-flash-lite-high` | Gemini 2.5 Flash-Lite |
| `gpt-5-nano-high` | GPT-5-Nano |
| `gpt-5.4-nano-high` | GPT-5.4-Nano |
| `haiku-4-5-thinking-32k` | Haiku 4.5 |
| `o3-high` | o3 |
| `o3-mini-high` | o3-mini |
| `o4-mini-high` | o4-mini |
| `deepseek-r1` | DeepSeek R1 |
| `sonnet-4-thinking-16k` | Sonnet 4 |
| `sonnet-3-7-thinking-16k` | Sonnet 3.7 |
| `o1` | o1 |
| `gpt-4o-2024-11-20` | GPT-4o |
| `gemini-3.1-flash-lite-high` | Gemini 3.1 Flash-Lite |
| `gpt-5.4-high` | GPT-5.4 |

---

## Sizing Tips

- **Table:** `height="400"` for ~7 models, add ~45px per additional model.
- **Timeline:** `height="500"` works well for most cases.
- **Bars:** `height="450"` for ~7-10 models, `height="600"` for 15+.
- Always use `width="100%"` to fill the blog column.
- Use `style="border: none; border-radius: 8px;"` for a clean look.
