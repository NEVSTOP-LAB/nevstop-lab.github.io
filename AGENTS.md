# AGENTS.md — NEVSTOP-LAB 站点维护提示词

> 这份文件为后续维护本站点的 LLM / 协作 Agent 提供约定与上下文。修改任何 Agent 自动化逻辑时，请先阅读本文件。

## 站点定位

- 仓库：`NEVSTOP-LAB/nevstop-lab.github.io`，部署到 GitHub Pages（[https://nevstop-lab.github.io/](https://nevstop-lab.github.io/)）。
- 技术栈：**Hugo Extended** + **Doks 主题**（`@thulite/doks-core`）。
- 语言：仅启用 `zh-cn`，其它语言在 `hugo.toml` 中通过 `disableLanguages` 关闭。
- 内容来源有两类：
  1. **手写内容**：`content/_index.md`（首页）、`content/about/_index.md`（组织介绍）、`content/docs/_index.md`、`content/blog/`。
  2. **自动同步**：`content/docs/repo-readmes/` —— 由 `.github/workflows/sync-chinese-readmes.yml` 每天 02:00 (UTC) 从 NEVSTOP-LAB 组织内 public 仓库抓取中文 README。

## 设计原则（请始终遵守）

1. **以"组织 + CSM 生态"为中心**，而不是以"Hugo / Doks 主题"为中心。
   - 不要在显眼位置宣传所用主题；技术栈说明放在 `README.md` 或页面底部。
   - 首页应当反映 [`NEVSTOP-LAB/.github` 仓库的 `profile/README.md`](https://github.com/NEVSTOP-LAB/.github/blob/main/profile/README.md) 中的三条主线：CSM Framework、社区、AI-Wiki。
2. **导航闭环**：站点上的每一个区域都应能从首页或主菜单触达。
   - 主菜单（`menu.main`）必须覆盖：首页、组织介绍、文档、仓库 README、博客、Discussion、GitHub 组织。
   - 首页提供导航卡片复述这些入口；外部资源（知乎、Discussion、CSM-Wiki 等）也要给出链接。
3. **首页内容要丰富**：除了标题/Lead，还要有：组织介绍 CTA、CSM 生态分组卡片（核心 / 工具 / 应用）、最新博客、外部资源卡片。避免出现「网页空空的」感受。
4. **`content/docs/repo-readmes/` 必须分组、必须有摘要**：
   - 索引页按主题分组（CSM 应用 / CSM 核心 / LabVIEW 库与工具 / lvCICD / AI 与跨平台工具 / 示例 / 其他）。
   - 每个仓库条目展示：仓库名、`description`、语言、stars、GitHub 链接。
   - 不要把 `仓库名 README` 当 title 用；title 用纯仓库名。
   - 文件名（slug）使用纯仓库名小写化结果，仅在冲突时再追加 `-{repoId}`。
   - 不要把 `topics` 字段写成 Hugo 的 `tags`，否则会触发 Doks `term.html` 模板（要求 `contributors` 参数）而构建失败；用自定义字段 `topics: [...]`。
5. **front matter 字段约定**（自动同步生成）：
   - `title`、`linkTitle`：仓库名
   - `description`：优先 `repo.description`；为空则降级为 `<name> 仓库的中文 README（自动同步）。`
   - `weight`：`-1 * stars`，使高 star 仓库在 Hugo 排序中靠前
   - `repo_name` / `repo_url` / `repo_language` / `repo_stars` / `repo_group`：仓库元数据，便于将来在模板中引用
   - `topics`：仓库 GitHub topics（**不要**叫 `tags`）
6. **图片处理**：自动同步时把相对路径图片改写成 `https://raw.githubusercontent.com/<full_name>/<default_branch>/...`，不要让相对路径图片出现在站点中。
7. **构建验证**：任何改动后都执行 `npm ci && hugo --gc --minify`。出现 `error building site` 必须修复；`WARN Description too short` 仅是 SEO 提示，可忽略。

## 常用文件指引

| 路径 | 作用 |
|------|------|
| `hugo.toml` | 站点配置、菜单、`params.doks` 开关、关闭多语言 |
| `layouts/home.html` | 自定义首页：标题区 + 站点导航卡片 + CSM 生态速览 + 最新博客；覆盖 Doks 默认的 "Get Started" 模板 |
| `content/_index.md` | 首页 front matter 与 `lead` 文案 |
| `content/about/_index.md` | 组织介绍页（镜像 `.github/profile/README.md` 的三段式结构） |
| `content/docs/_index.md` | 文档入口页 |
| `content/docs/repo-readmes/` | 自动同步生成的仓库 README（不要手工编辑这里的文件） |
| `.github/workflows/sync-chinese-readmes.yml` | 每日同步逻辑；改动后请用本文件的"设计原则"自检 |
| `.github/workflows/hugo.yml` | 构建 + 部署到 GitHub Pages |

## 后续 LLM 更新本网站时的标准提示词

可以将下面这段直接喂给下一个 Agent：

> 你正在维护 NEVSTOP-LAB 的 Hugo + Doks 站点，仓库 `NEVSTOP-LAB/nevstop-lab.github.io`。修改前请阅读 `AGENTS.md`，并遵守以下硬约束：
>
> 1. 站点主题是 NEVSTOP-LAB 组织（CSM Framework + AI + LabVIEW），**不是** Doks 主题；首页与导航不要突出 Hugo / Doks。
> 2. 主菜单必须覆盖：首页 / 组织介绍 / 文档 / 仓库 README / 博客 / Discussion / GitHub 组织；首页同时提供导航卡片复述这些入口。
> 3. 首页内容必须丰富，至少包含：组织 lead + CTA、站点导航卡片、CSM 生态分组（核心 / 工具 / 应用）、最新博客；参考 `NEVSTOP-LAB/.github` 仓库的 `profile/README.md`。
> 4. `content/docs/repo-readmes/` 由 `.github/workflows/sync-chinese-readmes.yml` 自动生成，**不要手工编辑**该目录下文件；如需修改输出格式，改 workflow 而不是改生成结果。
> 5. 自动同步生成的 readme 文件：title 用纯仓库名（不加 `README` 后缀）；slug 用纯仓库名（仅冲突时追加 `-{id}`）；front matter 用 `topics:` 而非 `tags:`（避免触发 Doks taxonomy 模板的 `contributors` 检查导致构建失败）；按主题分组生成索引页（CSM 应用 / CSM 核心 / LabVIEW 库与工具 / lvCICD / AI 与跨平台工具 / 示例 / 其他）。
> 6. 修改后执行 `npm ci && hugo --gc --minify`，确保 `error building site` 不出现。
> 7. 任何对自动同步逻辑的扩展，都先在 `AGENTS.md` 中追加约定，再实现，避免下一个 Agent 再次走弯路。
