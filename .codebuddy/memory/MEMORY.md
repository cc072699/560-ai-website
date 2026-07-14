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
