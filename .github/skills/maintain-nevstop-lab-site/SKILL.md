---
name: maintain-nevstop-lab-site
description: 维护 NEVSTOP-LAB 组织官网（Hugo + Doks，仓库 NEVSTOP-LAB/nevstop-lab.github.io）的**内容同步与更新**。核心任务是让站点内容与组织源头（`NEVSTOP-LAB/.github` 的 profile README、组织内各 public 仓库的中文 README、新发布的项目 / 博客 / 公告）保持同步：回写组织介绍、对齐 CSM 生态分组、调整 README 自动同步 workflow、补齐过时段落、新增博客/文档页。仅当内容更新连带需要时，才处理布局 / 样式 / 构建失败等次要事项。
---

# Skill: maintain-nevstop-lab-site

> 本 skill 把 PR #1–#13 与 `AGENTS.md` 中沉淀的全部经验固化为一份可执行的操作手册。
> **核心定位：把站点当作组织内容的"镜像与索引"，主任务是保持内容与组织最新状态同步**，而不是做样式微调。
> **入站第一步永远是：阅读仓库根目录的 `AGENTS.md`，再开始改代码。**

---

## 0. 何时使用本 skill

本 skill 服务于"让站点内容与组织最新状态对齐"。按优先级匹配触发场景：

**🟢 主场景 — 内容同步 / 更新（本 skill 的核心目的）**

- 「站点内容已经过时，对照 `NEVSTOP-LAB/.github` 的 profile README 重新对齐」
- 「同步组织里某个仓库的 README 不对 / 缺失 / 分组错」「让仓库 README 列表反映最新的 stars / description / 新增项目」
- 「组织新增 / 下线了某个仓库 / 项目，把它纳入（或从）站点 CSM 生态分组（去掉）」
- 「首页 lead / 组织介绍 / docs 入口 / 博客文案需要按最新组织动态更新」
- 「新增一篇博客、公告、release notes」
- 「修改 README 自动同步 workflow（分组关键字、front matter 字段、过滤规则）以更准确地反映组织现状」

**🟡 次场景 — 仅当内容变更连带需要时才处理**

- 调整导航 / 首页卡片 / footer 排版（通常是因为新增了一类内容入口需要进闭环）
- 修复 Hugo / Doks 构建失败（通常是因为同步出来的 front matter 触发主题模板冲突）
- 新增一个文档 section / about 子页

**❌ 不在范围内**

- 纯粹「美化样式」「换主题色」「调字体」这类与内容同步无关的视觉改动 —— 不主动做，除非用户明确要求。
- 重构未触碰的页面、清理未提及的代码。

如果请求只是问问题（例如「这个站怎么部署的？」），先回答，不要动代码。

---

## 1. 站点速览（Mental Model）

| 维度 | 现状 |
|------|------|
| 仓库 | `NEVSTOP-LAB/nevstop-lab.github.io` |
| 部署 | GitHub Pages，URL `https://nevstop-lab.github.io/` |
| 构建 | `.github/workflows/hugo.yml`，push 到 `main` 自动部署 |
| 技术栈 | Hugo Extended + Doks（Hugo Module：`github.com/thuliteio/doks`，在 `hugo.toml` 中 import；npm 依赖：`@thulite/doks-core` 等 `@thulite/*` 包，通过 `[module] mounts` 从 `node_modules` 提供 `layouts/assets/i18n/...`，二者缺一不可） |
| 语言 | 仅 `zh-cn`，`hugo.toml` 用 `disableLanguages` 关掉其他语言 |
| 内容来源 | ① 手写：`content/_index.md`、`content/about/_index.md`、`content/docs/_index.md`、`content/blog/`<br>② 自动：`content/docs/repo-readmes/`，每天 02:00 UTC 由 `.github/workflows/sync-chinese-readmes.yml` 全量重建 |
| 自定义模板 | `layouts/home.html`（首页）、`layouts/list.html`（去掉 docs 自动 card-list）、`assets/scss/common/_custom.scss`（自定义样式） |
| 数据源依据 | 组织主页 `NEVSTOP-LAB/.github/profile/README.md`（**权威来源**，三段式：CSM Framework / 社区 / AI-Wiki）<br>组织内 public 仓库的中文 README（由同步 workflow 拉取） |

### 1.0 内容同步的"权威来源"清单（Source of Truth）

> 任何「内容是否过时」的判断都以下列来源为准。改站点内容前先比对一遍。

| 站点位置 | 权威来源 | 同步方式 |
|----------|----------|----------|
| `content/_index.md` 首页 lead / CTA | `NEVSTOP-LAB/.github/profile/README.md` 的开篇段落 | **手动**（读源后回写） |
| `content/about/_index.md` 组织介绍 | 同上，三段式（CSM / 社区 / AI-Wiki）必须对齐 | **手动**（读源后回写） |
| `layouts/home.html` 中 CSM 生态分组卡（核心 / 工具 / 应用） | 组织内 public 仓库列表 + `topics` + 当前活跃度 | **半手动**（看仓库列表后调整 home.html 中硬编码的卡片清单） |
| `content/docs/repo-readmes/*.md` | 各 public 仓库的中文 README（`README_zh*.md` / `README.zh*.md`，回退到 `README.md`） | **自动**，每天 02:00 UTC 由 `sync-chinese-readmes.yml` 全量重建 |
| `content/docs/repo-readmes/_index.md` 分组索引 | 仓库 metadata（name / description / language / stars / topics） | **自动**，同上 workflow |
| `content/blog/` | 用户/团队提供的新内容 | **手动** |
| `menu.main` 外链（CSM-Wiki / Discussion / 知乎 / GitHub Org） | 组织实际维护的外部链接 | **手动**（链接变了才动） |

### 1.1 关键文件

| 路径 | 作用 |
|------|------|
| `hugo.toml` | 站点配置、`menu.main`、`menu.social`、`params.doks` 开关 |
| `layouts/home.html` | 自定义首页，**必须保留**：标题 + CTA + 站点导航卡 + CSM 生态分组卡 + 最新博客 |
| `layouts/list.html` | 覆盖 Doks 根 list 模板，去掉自动 card-list（见 PR #13） |
| `assets/scss/common/_custom.scss` | 站点定制样式（卡片、列表、footer、宽度等） |
| `content/_index.md` | 首页 lead/front matter |
| `content/about/_index.md` | 组织介绍，镜像 `NEVSTOP-LAB/.github/profile/README.md` |
| `content/docs/_index.md` | 文档入口 |
| `content/docs/repo-readmes/` | **自动生成**目录，**禁止手工编辑** |
| `.github/workflows/sync-chinese-readmes.yml` | 每日同步逻辑（要改输出格式就改这个，不要改生成结果） |
| `.github/workflows/hugo.yml` | 构建 + 部署 |
| `AGENTS.md` | 维护硬约束 |

---

## 2. 不可违反的硬约束（Hard Constraints）

> 这些约束都是踩坑换来的，违反任何一条都会引起构建失败、视觉回归或方向跑偏。

1. **主体是 NEVSTOP-LAB 组织（CSM + AI + LabVIEW），不是 Doks 主题。** 首页和导航不要宣传 Hugo / Doks；技术栈描述只放在 `README.md` 或页面底部小字。
2. **导航必须闭环。** `menu.main` 必须覆盖：首页 / 组织介绍 / 文档 / 仓库 README / 博客 / 社区讨论 / GitHub 组织。首页同时用导航卡片复述这些入口。
3. **首页内容必须丰富**，至少包含：
   - 组织 lead + 主 CTA
   - 站点导航卡（覆盖主菜单）
   - CSM 生态分组卡（核心 / 工具 / 应用）
   - 最新博客
   - 外部资源（知乎 / Discussion / CSM-Wiki）
4. **`content/docs/repo-readmes/` 是自动生成的，禁止手工编辑。** 要改输出，去改 `sync-chinese-readmes.yml`。
5. **同步生成的 README front matter 约定**（PR #8 定型）：
   - `title` / `linkTitle`：纯仓库名（**不要**追加 ` README` 后缀）
   - `description`：优先 `repo.description`，为空降级为 `<name> 仓库的中文 README（自动同步）。`
   - `weight`：`-1 * stars`（高 star 排前）
   - 元数据字段：`repo_name` / `repo_url` / `repo_language` / `repo_stars` / `repo_group`
   - **使用 `topics:` 而不是 `tags:`** —— 用 `tags:` 会触发 Doks `term.html` 模板要求的 `contributors` 参数导致构建失败
   - 文件名（slug）：纯仓库名小写化，**仅冲突时**追加 `-{repoId}`
6. **同步索引页必须按主题分组**（7 组，order matters，first match wins）：
   `csm-apps` / `csm-core` / `labview-libs` / `lvcicd` / `ai-tools` / `examples` / `other`
   分组逻辑见 `sync-chinese-readmes.yml` 的 `groups` 数组。
7. **图片重写**：同步时把相对路径图片改写成 `https://raw.githubusercontent.com/<full_name>/<default_branch>/<src>`。**不要让相对路径图片漏到站点里**（PR #4 修了相关 crash）。
8. **Bootstrap 是 16 列网格（不是 12）。** Doks 把 Bootstrap 改成了 16 列。`col-12 = 75%`、`col-md-6 = 37.5%`、`col-lg-4 = 25%`、`col-16 = 100%`。写自定义布局（首页卡片、footer 等）时每行宽度必须按 16 累加，否则会出现"右侧留 25% 空白"的对不齐（PR #10、#11、#12 反复栽过）。
9. **每次改动后必须本地构建验证**：`npm ci && hugo --gc --minify`，绝不允许 `error building site`。`WARN Description too short` 是 SEO 提示，可忽略。
10. **任何对自动同步逻辑的扩展，必须先在 `AGENTS.md` 追加约定**，再写实现，避免下一个 LLM 再走一遍弯路。
11. **不要新增多语言** —— `disableLanguages` 关掉了 en/de/nl/fr/es，开启会让构建从 47 页膨胀到 4×47 页且全是空白。

---

## 3. 标准工作流

### Step 1 — Read first（先比对内容源头）

1. 打开并完整阅读 `AGENTS.md`。
2. 打开 `hugo.toml`，看一眼当前 `menu.main` 与 `params`。
3. **核心一步：拉取权威来源做 diff**（这是本 skill 的主任务）：
   - 首页 / 组织介绍类改动 → 抓 <https://github.com/NEVSTOP-LAB/.github/blob/main/profile/README.md>，逐段比对当前 `content/_index.md` / `content/about/_index.md`，列出"需要回写的更新点"。
   - 仓库 README 列表类改动 → 列一遍 NEVSTOP-LAB 组织下 public 仓库（`gh repo list NEVSTOP-LAB --visibility public --no-archived` 或 GitHub MCP `search_repositories`），对照 `content/docs/repo-readmes/` 当前条目，找出新增 / 下线 / 重命名 / topics 变化。
   - 写一份 diff 概要进 PR description 的 `### 改动` 一节，让 reviewer 一眼看出"内容同步了什么"。

### Step 2 — Plan before edit

调用 `report_progress` 把改动写成 checklist（即使只是一个文件也要）。在第一次 `edit` / `create` 之前必须至少调用一次。

> 注：`report_progress` / `edit` / `create` / `create_pull_request` 这些是 **GitHub Copilot Coding Agent**（即托管在 GitHub Actions 中的本仓库自动化代理）提供的内置工具。如果你是其他 LLM 客户端（Claude Desktop、Cursor 等），请用本地等价能力替代：把"提交到分支并开 PR"理解为执行 `git commit && git push` 后再用 `gh pr create` / GitHub MCP 的 `create_pull_request` 工具。

### Step 3 — Make minimal, surgical edits

按下面 §4 对应的 task pattern 操作。**不要顺手"重构"无关代码**。

### Step 4 — Local build & verify

```bash
npm ci
hugo --gc --minify
```

- 必须看到 `Total in NNNms` 且无 `ERROR`。
- 出现 `error building site` 必须立刻修。最常见原因：
  - 在自动同步文件里写了 `tags:` 而不是 `topics:` → 触发 `term.html` 找不到 `contributors`
  - 自定义 layout 里 partial 路径写错
  - `_custom.scss` 里语法错
- **默认每次改动后都必须执行上述 build**（与硬约束 #9 一致）。**唯一例外**：本次改动严格限定为仓库说明类文档（`README.md`、`AGENTS.md`、`.github/skills/**`、`LICENSE` 之类），且**完全没有触碰** `hugo.toml` / `layouts/` / `assets/` / `content/` / `data/` / `i18n/` / `static/` / `.github/workflows/` —— 这种情况下可以省略 build，但必须在 PR 的 `### 验证` 一节里明确写明「未运行构建：仅文档变更」。其余任何场景都不得跳过 build。

### Step 5 — Commit & PR

- 用 `report_progress` 增量提交每一步，commit message 用动词开头的中文/英文短句（例如 `feat: 同步分组新增 ai-tools 关键字`、`fix: footer 列宽对齐 16 网格`）。
- 全部完成后，调用 `create_pull_request`：
  - title：用一句话概括，参考历史风格（PR #8 / #10 / #11 / #12 / #13）
  - description：分 `### 改动` / `### 验证` 两节，列出 bullet。明确说明是否触碰了同步 workflow，便于 reviewer 重点看。
  - draft：默认 `false`，除非用户明确要求 WIP。
- 如果 PR 已存在（同分支），`create_pull_request` 会幂等返回，不要重复创建。

---

## 4. 任务模式手册（Task Patterns）

下面把历史 PR 归纳成 5 类，**按本 skill 的核心目的（内容同步）排序**：A、B 是主任务，C、D、E 通常只在 A/B 引发副作用时才会触发。匹配到哪一类，就照着对应清单做。

### Pattern A — 「内容同步：手写内容回写」🟢 主任务

适用于：组织 profile README 更新了 / 首页 lead / about 段落 / docs 入口文案过时 / 新增博客或公告。

清单：
- [ ] **第一步：先去拉一遍权威来源**：`NEVSTOP-LAB/.github/profile/README.md`（首页 + about 必看）；新博客则以用户提供的素材为准。
- [ ] 列出权威来源相对于站点当前内容的 **diff 要点**（新增了什么模块、改了什么链接、删了哪个项目），改动 PR 描述里要复述这份 diff。
- [ ] 只改 `content/_index.md` / `content/about/_index.md` / `content/docs/_index.md` / `content/blog/<slug>.md`。
- [ ] **不要改** `content/docs/repo-readmes/` 下任何文件（自动生成区，见 Pattern B）。
- [ ] 三段式（CSM Framework / 社区 / AI-Wiki）的标题与段落顺序保持与 profile README 一致，方便后续比对。
- [ ] 新增博客：在 `content/blog/` 下新建 `<slug>.md`，front matter 至少包含 `title` / `description` / `date` / `draft: false`。
- [ ] 如果回写后导航需要新增入口（例如新增了一个外部资源），跳到 Pattern E。
- [ ] 跑 `hugo --gc --minify` 确认无 `error building site`。

### Pattern B — 「内容同步：调整自动同步 workflow」🟢 主任务

适用于：组织新增 / 下线 / 重命名了仓库 → 分组关键字需要更新；想往 README 列表里多展示一个 metadata 字段；图片在某些仓库渲染失败；同步出来的 README 排序 / 分组不准确。

清单：
- [ ] 只改 `.github/workflows/sync-chinese-readmes.yml`，**禁止**直接编辑 `content/docs/repo-readmes/*.md`（下次同步会被覆盖）。
- [ ] 改动前先在 `AGENTS.md` 追加新约定（硬规则）。
- [ ] 新分组写入 `groups` 数组，注意 **first match wins**，更窄的规则要排前面。
- [ ] 所有写入 front matter 的字段都要走 `escapeYamlSingleQuoted`，否则带引号 / 换行会炸 YAML。
- [ ] **永远不要把仓库 topics 输出成 `tags:`**，必须是 `topics:`（否则触发 Doks `term.html` 模板要求 `contributors` 而构建失败）。
- [ ] 全量重建语义不能破坏：脚本是先写 `*.tmp` → 备份旧目录 → 原子 rename → 失败回滚。改动时不要绕开这个流程。
- [ ] 改完后**手动触发一次** `Sync Chinese READMEs`（`workflow_dispatch`）让用户验证；或在 PR 描述里提示用户去触发。
- [ ] 不需要本地跑 `hugo`（生成结果会在下一次定时任务后入库），但要保证脚本本身 lint 通过、YAML 合法。
- [ ] 如果同步逻辑变化会让首页 CSM 生态卡的硬编码项目清单失准，连带按 Pattern D 调整 `layouts/home.html`。

### Pattern C — 「修复 Hugo / Doks 构建失败」🟡 支持任务

适用于：CI 里 `hugo` 报错 / GitHub Pages 没更新（参考 PR #1 / #3 / #4）。通常是 Pattern A/B 的副作用，独立出现的频率很低。

清单：
- [ ] 用 GitHub MCP（Model Context Protocol，GitHub 官方提供的 MCP 服务器，暴露 `list_workflow_runs` / `get_job_logs` 等工具）拿到失败日志，**不要靠猜**。如果你的 LLM 客户端没有接入 GitHub MCP，可以直接用 `gh run list` / `gh run view --log-failed` CLI 命令替代。
- [ ] 常见根因：
  - 缺 Hugo Module 元数据 → 检查 `go.mod` 有 `github.com/thuliteio/doks` 依赖（PR #1）
  - 缺 npm 依赖 / `hugo_stats.json` mount → 检查 `hugo.toml` 的 `[module] mounts` 与 `package.json`（PR #3）
  - 同步生成的 README 写了 `tags:` → 改回 `topics:`
  - render-image partial 在相对路径上 crash → 确认同步逻辑改写了相对图片路径（PR #4）
- [ ] 修完后本地 `npm ci && hugo --gc --minify` 必须通过。
- [ ] PR 描述里贴出失败日志关键行 + 修复点。

### Pattern D — 「调整首页 / 导航 / 卡片 / 样式」🟡 支持任务

适用于：内容更新带出的"入口需要进闭环 / 卡片清单要重排" —— **不是为了美化而美化**。参考 PR #9 / #10 / #11 / #12 / #13。如果用户没有提到内容变化，先反问是否真的需要改样式。

清单：
- [ ] 修改 `layouts/home.html` 时保留五大区块结构（标题 + CTA + 导航卡 + 生态卡 + 最新博客）。
- [ ] 任何 `col-*` 写法都按 **16 列网格** 计算，每行总和必须 = 16。
- [ ] 自定义样式集中放 `assets/scss/common/_custom.scss`，**不要**在 inline style 里堆 CSS。
- [ ] 新菜单项要同时加 `[[menu.main]]`（`hugo.toml`）和 `layouts/home.html` 的导航卡，保持闭环。
- [ ] 外链菜单项需要 `[menu.main.params] external = true`。
- [ ] 跑 `hugo --gc --minify` 后，自查首页关键 class 是否生成（可 grep `public/index.html`）。

### Pattern E — 「新增功能区 / 子页 / 数据展示」🟡 支持任务

适用于：内容同步过程中确实需要新开一个 section（例如新增 `/about/<sub>/`、文档新增一个分类），或想把同步 workflow 写出的 `repo_*` 元数据展示到模板上。

清单：
- [ ] 新增 section：在 `content/<section>/_index.md` 建好 front matter。
- [ ] 新增页面要决定是否进 `menu.main` —— 凡是用户需要直接到达的，必须进菜单 + 首页导航卡（导航闭环原则）。
- [ ] 想把同步生成的 `repo_*` 字段渲染出来，在 `layouts/` 里覆写对应模板（参考 `layouts/home.html` 的写法），不要去动 `node_modules` 里的 Doks 主题。
- [ ] 跑 `hugo --gc --minify`，确认页面真正生成在 `public/` 下。

---

## 5. 自检清单（在创建 PR 前过一遍）

- [ ] 读过 `AGENTS.md` 了吗？
- [ ] **本次改动是否对齐了"权威来源"**（profile README / 组织仓库列表 / 用户提供的素材）？PR description 里有列出 diff 概要吗？
- [ ] 改动是否落在 `content/docs/repo-readmes/` 这个**禁区**？如果是，是不是改成了改 workflow？
- [ ] 任何新文件 / 新菜单是否同时进了 `menu.main` + 首页导航卡？
- [ ] 自定义 `col-*` 是否按 16 列累加？
- [ ] 同步生成的 front matter 用的是 `topics:` 而不是 `tags:`？
- [ ] `npm ci && hugo --gc --minify` 通过、无 `error building site`？（仅文档变更例外，见 Step 4）
- [ ] commit message 简洁、描述「做了什么」而不是「为什么」？
- [ ] 调用 `create_pull_request` 创建了 PR，title/description 清晰？

---

## 6. 给下一个 LLM 的"一句话提示词"

如果只能传一段话给下一个接手这个站点的 LLM，把下面这段贴给它：

> 你正在维护 NEVSTOP-LAB 的 Hugo + Doks 站点 (`NEVSTOP-LAB/nevstop-lab.github.io`)，**核心任务是让站点内容与组织最新状态保持同步**（profile README、组织 public 仓库列表、新博客 / 公告），不是做样式美化。**先用 `skill: maintain-nevstop-lab-site` 调起本 skill，再阅读 `AGENTS.md`**，然后才动代码。标准动作：① 先抓权威来源（`NEVSTOP-LAB/.github/profile/README.md` + 组织仓库列表）做 diff，列出要回写的更新点；② 手写内容只改 `content/_index.md` / `content/about/_index.md` / `content/docs/_index.md` / `content/blog/`；③ `content/docs/repo-readmes/` 由 `.github/workflows/sync-chinese-readmes.yml` 全量生成，要改改 workflow 而不是改生成结果；④ 自动同步 front matter 用 `topics:` 而非 `tags:`，否则 Doks `term.html` 构建失败；⑤ 主菜单 + 首页导航卡必须闭环；⑥ 自定义 `col-*` 按 16 列网格累加；⑦ 改完跑 `npm ci && hugo --gc --minify` 确认无 `error building site`；⑧ 完成后调用 `create_pull_request` 自动开 PR，description 里复述"对齐了源头的哪些更新"。
