# Project Conventions & Rules

## claude-skill 全局技能

已创建全局 user skill `claude-skill`，位于 `~/.codebuddy/skills/claude-skill/SKILL.md`。

**触发条件：** 仅在用户消息包含 `@claude-skill` 关键词时激活。

**核心机制：** 激活后 CodeBuddy 切换为"架构师模式"：
- CodeBuddy 只负责只读分析、架构设计、任务委派（通过 `claude -p` CLI）和代码审查
- 严格禁止直接编辑/写入源代码文件
- 所有代码实现通过 `claude --dangerously-skip-permissions -p "<prompt>"` 委派给 Subagent
- 支持串行和并行多 Subagent 委派（并行使用 `&` + `wait`）
- 最多 3 次自主重试，超限升级给用户
- 5 阶段工作流：需求澄清 → 任务量评估 → 架构规划 → 委派执行 → 代码审查

## 🔴 图片生成铁律（绝对禁止违反）

**使用 webskill 生成产品图片时，必须严格遵守 skill 规定的工作流，以下规则优先级最高：**

1. **强制使用 AgnesAI**：任何产品图片必须通过 webskill 的 `scripts/generate_image.py` 脚本生成，调用 `agnes-image-2.1-flash` 模型。**绝对禁止**使用 IDE 内置的 `image_gen` 工具（底层非 AgnesAI）去生图。
2. **Skill 规则严格执行**：webskill 的 `image-generation.md` 中规定的所有规则（Chinese Localization Rule、Realism First、High-End Promotional Quality、SVG for Text-Heavy Diagrams、Post-Processing Watermark Removal）必须逐条遵守，不得简化或跳过。
3. **正确命令**：`python3 ~/.codebuddy/skills/webskill/scripts/generate_image.py --prompt "..." --output public/uploads/products/{id}/file.png --width X --height Y`
4. **生成后处理**：每张图必须用 OpenCV TELEA inpaint 去除 AgnesAI 右下角水印。
5. **架构图/文字图用 SVG**：AgnesAI 中文渲染差，任何需要精准中文文字的图（架构图、流程图等）改用 SVG 矢量图。

**违反上述任意一条的行为，用户已明确表示不可接受。**

## 🔴 弹窗/模态必须用 React Portal 挂到 body

**坑：** 在带 `backdrop-filter` / `transform` / `filter` / `perspective` / `will-change: transform` 的父级内部使用 `position: fixed` 不会相对于视口定位，而是相对于该父级（CSS 规范）。Navbar 的 `<header className="bg-white/90 backdrop-blur-md">` 就是典型陷阱，会让 `fixed inset-0` 只能填满 header（高 65px）而非视口（高 577px）。

**铁律：** 所有需要全屏覆盖的弹窗/Dialog/Modal/Sheet/Drawer，**必须**用 `createPortal(node, document.body)` 渲染。`document.body` 没有这些属性，是最干净的 containing block。

**配套模式：**
```tsx
'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const [mounted, setMounted] = useState(false);
useEffect(() => setMounted(true), []);
if (!open || !mounted) return null;
return createPortal(<div className="fixed inset-0 z-[100] overflow-y-auto">...</div>, document.body);
```

**高度适配（视口矮时）：**
- 外层 `fixed inset-0 overflow-y-auto` —— 全屏滚动兜底
- 居中容器 `relative min-h-full flex flex-col p-4`
- 弹窗 `m-auto`（**不要用** `items-center` —— 弹窗比视口高时会被居中后溢出顶部）+ `max-h-[calc(100vh-2rem)]` 用 inline style 强制
- 内部 `flex-1 min-h-0 overflow-y-auto` 让内容在弹窗内独立滚动

**症状速查：**
- 弹窗"被裁"但 DOM `getBoundingClientRect` 显示在视口内 → 检查父级 computed style 有无 `backdrop-filter` / `transform` / `filter` / `perspective`
- `fixed inset-0` 的元素 `offsetHeight` 远小于 100vh → 被父级劫持 containing block

## 🟡 webskill2 内容真实性边界规则

**允许自由发挥优化**（基于素材合理推断、优化表述）：
- 解决方案描述、场景叙事方式、实施细节措辞、FAQ 问答话术、实施路径阶段命名

**绝对禁止编造**：
- 真实客户公司名称、客户方人员姓名/职位、具体合同金额/报价、未经客户授权的引语、未经证实的量化数据

**需标记**：客户证言如从项目成果推测合成（非直接从素材引语），需标注"合成"并由用户确认

## 🔴 Skill 产出的 JSON 必须严格对齐代码的 TypeScript 类型

**铁律：** 任何 skill（如 `webskill`、`webskill2`）最终生成的 JSON，必须逐字段匹配 `src/types/index.ts` 中的实际 TypeScript 定义。**代码的类型系统是唯一权威**，不要凭直觉或行业惯例编造字段名。

**反面案例：** 旧版 `webskill2` 的 `references/case-schema.md` 用了 `painPointsGrid`/`solutionConsole`/`testimonials` 等 type 名，字段也用 `background`/`startYear`/`coverImage` 等（来自其他项目惯例），但 `DetailSectionsRenderer` 实际只识别 `caseChallenges`/`caseScenes`/`caseTestimonial` 等，且字段完全不同。结果是**整个 case 页静默失效**——没有报错，只是不显示任何 section。

**校验方法：** 在 skill 的 schema 文档头部直接引用 TS 源文件的行号，例如：

> Refer to `src/types/index.ts` lines 316-401 for the byte-precise `case*` schemas.

每个 case section type 都要有：① TS interface 块（直接抄源码）② JSON 示例（字段全部对齐）③ 视觉/内容规则（独立成 templates 文件）。

**新 case section type（已就绪）：** `caseOverview`、`caseChallenges`、`caseScenes`、`caseMetrics`、`caseTestimonial`、`caseComparison`、`caseStructure`、`caseFaq`
**新 case 辅助 type（可复用，谨慎使用）：** `cta`、`consultation`、`richText`、`partners`、`timeline`、`comparison`、`carousel`、`architecture`、`bentoGrid`、`scenarios`
**注意区分：** `timeline` vs `caseStructure`（前者日期锚定，后者流程阶段）、`comparison` vs `caseComparison`（前者行业基准对比，后者项目前后对比）

## 🖼️ webskill2 图片规则（v2 — 3-5张）

**每个案例页必须有 3-5 张图片**，分布在以下位置：

| 图片类型 | 数量 | 托管组件 | 插入位置 |
|---|---|---|---|
| 客户/公司实景 | 1 | `richText` (imagePosition: right) | caseOverview 之后 |
| 方案/产品截图 | 2-4 | `carousel` (items[].imageUrl) | caseScenes 之后 |
| 架构/流程图(可选) | 0-1 | `architecture` 或 `richText` | 根据叙事需要 |

**关键组件对照**（哪些产品组件可以托管图片）：
- `richText` — 1张图，`imageUrl` + `imagePosition: 'left'|'right'`
- `carousel` — 2-6张图，`items[].imageUrl` + `caption` + `description`
- `architecture` — 1张大图，`imageUrl`
- `scenarios` — 每个 scene 1张图，`items[].imageUrl`（案例页少用）
- `bentoGrid` — 每个 grid item 1张图，`items[].imageUrl`（案例页少用）
