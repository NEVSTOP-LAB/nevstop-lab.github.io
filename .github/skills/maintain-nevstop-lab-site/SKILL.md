---
name: maintain-nevstop-lab-site
description: 维护 NEVSTOP-LAB 组织官网（Hugo + Doks，仓库 NEVSTOP-LAB/nevstop-lab.github.io）。当用户需要更新首页 / 组织介绍 / 文档 / 博客内容、调整导航或样式、修改自动同步组织 README 的工作流、修复 Hugo 构建失败、或新增页面时使用本 skill。会按既定硬约束完成改动、本地构建验证，并自动创建 PR。
---

# Skill: maintain-nevstop-lab-site

> 本 skill 把 PR #1–#13 与 `AGENTS.md` 中沉淀的全部经验固化为一份可执行的操作手册。
> **入站第一步永远是：阅读仓库根目录的 `AGENTS.md`，再开始改代码。**

---

## 0. 何时使用本 skill

当用户的请求落在以下任一类时，立刻使用本 skill：

- 「更新 / 修改 / 美化 NEVSTOP-LAB 网站」「调整首页 / 导航 / footer / 卡片」
- 「同步组织里某个仓库的 README 不对 / 缺失 / 分组错」「改自动同步逻辑」
- 「新增一个文档页 / 博客文章 / about 子页」
- 「Hugo / Doks 构建失败」「GitHub Pages 部署没更新」
- 「站点内容已经过时，对照 NEVSTOP-LAB/.github 的 profile 重新对齐」

如果请求只是问问题（例如「这个站怎么部署的？」），先回答，不要动代码。

---

## 1. 站点速览（Mental Model）

| 维度 | 现状 |
|------|------|
| 仓库 | `NEVSTOP-LAB/nevstop-lab.github.io` |
| 部署 | GitHub Pages，URL `https://nevstop-lab.github.io/` |
| 构建 | `.github/workflows/hugo.yml`，push 到 `main` 自动部署 |
| 技术栈 | Hugo Extended + Doks 主题（`@thulite/doks-core`，Hugo Module 形式） |
| 语言 | 仅 `zh-cn`，`hugo.toml` 用 `disableLanguages` 关掉其他语言 |
| 内容来源 | ① 手写：`content/_index.md`、`content/about/_index.md`、`content/docs/_index.md`、`content/blog/`<br>② 自动：`content/docs/repo-readmes/`，每天 02:00 UTC 由 `.github/workflows/sync-chinese-readmes.yml` 全量重建 |
| 自定义模板 | `layouts/home.html`（首页）、`layouts/list.html`（去掉 docs 自动 card-list）、`assets/scss/common/_custom.scss`（自定义样式） |
| 数据源依据 | 组织主页 `NEVSTOP-LAB/.github/profile/README.md`（权威来源），三段式：CSM Framework / 社区 / AI-Wiki |

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

### Step 1 — Read first

1. 打开并完整阅读 `AGENTS.md`。
2. 打开 `hugo.toml`，看一眼当前 `menu.main` 与 `params`。
3. 用户提到「内容过时」时，去对照
   <https://github.com/NEVSTOP-LAB/.github/blob/main/profile/README.md>，找出三段式（CSM / 社区 / AI-Wiki）里需要回写的更新。

### Step 2 — Plan before edit

调用 `report_progress` 把改动写成 checklist（即使只是一个文件也要）。在第一次 `edit` / `create` 之前必须至少调用一次。

> 注：`report_progress` / `edit` / `create` / `create_pull_request` 这些是 **GitHub Copilot Coding Agent**（即托管在 GitHub Actions 中的本仓库自动化代理）提供的内置工具。如果你是其他 LLM 客户端（Claude Desktop、Cursor 等），请用本地等价能力替代：把"提交到分支并开 PR"理解为执行 `git commit && git push` 后再用 `gh pr create` / GitHub MCP 的 `create_pull_request` 工具。

### Step 3 — Make minimal, surgical edits

按下面 §4 对应的 task pattern 操作。**不要顺手"重构"无关代码**。

### Step 4 — Local build & verify

```bash
npm ci
npx hugo --gc --minify
```

- 必须看到 `Total in NNNms` 且无 `ERROR`。
- 出现 `error building site` 必须立刻修。最常见原因：
  - 在自动同步文件里写了 `tags:` 而不是 `topics:` → 触发 `term.html` 找不到 `contributors`
  - 自定义 layout 里 partial 路径写错
  - `_custom.scss` 里语法错
- 仅做 markdown / 文档变更可以省略 build，但只要碰到 `hugo.toml` / `layouts/` / `assets/scss/` / `content/` 中任意一处就必须 build。

### Step 5 — Commit & PR

- 用 `report_progress` 增量提交每一步，commit message 用动词开头的中文/英文短句（例如 `feat: 同步分组新增 ai-tools 关键字`、`fix: footer 列宽对齐 16 网格`）。
- 全部完成后，调用 `create_pull_request`：
  - title：用一句话概括，参考历史风格（PR #8 / #10 / #11 / #12 / #13）
  - description：分 `### 改动` / `### 验证` 两节，列出 bullet。明确说明是否触碰了同步 workflow，便于 reviewer 重点看。
  - draft：默认 `false`，除非用户明确要求 WIP。
- 如果 PR 已存在（同分支），`create_pull_request` 会幂等返回，不要重复创建。

---

## 4. 任务模式手册（Task Patterns）

下面把历史 PR 归纳成 5 类。匹配到哪一类，就照着对应清单做。

### Pattern A — 「更新文字内容」（首页 lead / about / docs 入口 / 博客）

适用于：组织介绍过时、首页文案更新、新增博客文章。

清单：
- [ ] 只改 `content/_index.md` / `content/about/_index.md` / `content/docs/_index.md` / `content/blog/<slug>.md`。
- [ ] **不要改** `content/docs/repo-readmes/` 下任何文件。
- [ ] 内容来源以 `NEVSTOP-LAB/.github/profile/README.md` 为准。
- [ ] 新增博客：在 `content/blog/` 下新建 `<slug>.md`，front matter 至少包含 `title` / `description` / `date` / `draft: false`。
- [ ] 跑 `npx hugo --gc --minify` 确认无 `error building site`。

### Pattern B — 「调整首页 / 导航 / 卡片 / 样式」

适用于：导航卡新增/重排、CSM 生态分组卡更新、footer 列对不齐、列表页太挤等（参考 PR #9 / #10 / #11 / #12 / #13）。

清单：
- [ ] 修改 `layouts/home.html` 时保留五大区块结构（标题 + CTA + 导航卡 + 生态卡 + 最新博客）。
- [ ] 任何 `col-*` 写法都按 **16 列网格** 计算，每行总和必须 = 16。
- [ ] 自定义样式集中放 `assets/scss/common/_custom.scss`，**不要**在 inline style 里堆 CSS。
- [ ] 新菜单项要同时加 `[[menu.main]]`（`hugo.toml`）和 `layouts/home.html` 的导航卡，保持闭环。
- [ ] 外链菜单项需要 `[menu.main.params] external = true`。
- [ ] 跑 `npx hugo --gc --minify` 后，自查首页关键 class 是否生成（可 grep `public/index.html`）。

### Pattern C — 「修改自动同步逻辑」

适用于：分组关键字调整、front matter 字段增删、过滤规则变更、图片处理 bug。

清单：
- [ ] 只改 `.github/workflows/sync-chinese-readmes.yml`，**禁止**直接编辑 `content/docs/repo-readmes/*.md`（下次同步会被覆盖）。
- [ ] 改动前先在 `AGENTS.md` 追加新约定（硬规则）。
- [ ] 新分组写入 `groups` 数组，注意 **first match wins**，更窄的规则要排前面。
- [ ] 所有写入 front matter 的字段都要走 `escapeYamlSingleQuoted`，否则带引号 / 换行会炸 YAML。
- [ ] **永远不要把仓库 topics 输出成 `tags:`**，必须是 `topics:`。
- [ ] 全量重建语义不能破坏：脚本是先写 `*.tmp` → 备份旧目录 → 原子 rename → 失败回滚。改动时不要绕开这个流程。
- [ ] 改完后**手动触发一次** `Sync Chinese READMEs`（`workflow_dispatch`）让用户验证，或在 PR 描述里提示用户去触发。
- [ ] 不需要本地跑 `hugo`（生成结果会在下一次定时任务后入库），但要保证脚本本身 lint 通过、YAML 合法。

### Pattern D — 「修复 Hugo / Doks 构建失败」

适用于：CI 里 `hugo` 报错、GitHub Pages 没更新（参考 PR #1 / #3 / #4）。

清单：
- [ ] 用 GitHub MCP（Model Context Protocol，GitHub 官方提供的 MCP 服务器，暴露 `list_workflow_runs` / `get_job_logs` 等工具）拿到失败日志，**不要靠猜**。如果你的 LLM 客户端没有接入 GitHub MCP，可以直接用 `gh run list` / `gh run view --log-failed` CLI 命令替代。
- [ ] 常见根因：
  - 缺 Hugo Module 元数据 → 检查 `go.mod` 有 `github.com/thuliteio/doks` 依赖（PR #1）
  - 缺 npm 依赖 / `hugo_stats.json` mount → 检查 `hugo.toml` 的 `[module] mounts` 与 `package.json`（PR #3）
  - 同步生成的 README 写了 `tags:` → 改回 `topics:`
  - render-image partial 在相对路径上 crash → 确认同步逻辑改写了相对图片路径（PR #4）
- [ ] 修完后本地 `npm ci && npx hugo --gc --minify` 必须通过。
- [ ] PR 描述里贴出失败日志关键行 + 修复点。

### Pattern E — 「新增功能区 / 子页 / 数据展示」

适用于：新增 `/about/<sub>/`、文档新增一个 section、想把同步元数据展示到模板上等。

清单：
- [ ] 新增 section：在 `content/<section>/_index.md` 建好 front matter。
- [ ] 新增页面要决定是否进 `menu.main` —— 凡是用户需要直接到达的，必须进菜单 + 首页导航卡（导航闭环原则）。
- [ ] 想把同步生成的 `repo_*` 字段渲染出来，在 `layouts/` 里覆写对应模板（参考 `layouts/home.html` 的写法），不要去动 `node_modules` 里的 Doks 主题。
- [ ] 跑 `npx hugo --gc --minify`，确认页面真正生成在 `public/` 下。

---

## 5. 自检清单（在创建 PR 前过一遍）

- [ ] 读过 `AGENTS.md` 了吗？
- [ ] 改动是否落在 `content/docs/repo-readmes/` 这个**禁区**？如果是，是不是改成了改 workflow？
- [ ] 任何新文件 / 新菜单是否同时进了 `menu.main` + 首页导航卡？
- [ ] 自定义 `col-*` 是否按 16 列累加？
- [ ] 同步生成的 front matter 用的是 `topics:` 而不是 `tags:`？
- [ ] `npm ci && npx hugo --gc --minify` 通过、无 `error building site`？
- [ ] commit message 简洁、描述「做了什么」而不是「为什么」？
- [ ] 调用 `create_pull_request` 创建了 PR，title/description 清晰？

---

## 6. 给下一个 LLM 的"一句话提示词"

如果只能传一段话给下一个接手这个站点的 LLM，把下面这段贴给它：

> 你正在维护 NEVSTOP-LAB 的 Hugo + Doks 站点 (`NEVSTOP-LAB/nevstop-lab.github.io`)。**先用 `skill: maintain-nevstop-lab-site` 调起本 skill，再阅读 `AGENTS.md`**，然后才动代码。硬约束摘要：① 站点主题是 NEVSTOP-LAB 组织（CSM + AI + LabVIEW），不要宣传 Doks；② 主菜单 + 首页导航卡必须闭环（首页/组织介绍/文档/仓库 README/博客/讨论/GitHub）；③ `content/docs/repo-readmes/` 由 workflow 全量生成，禁止手工编辑，要改改 `.github/workflows/sync-chinese-readmes.yml`；④ 自动同步 front matter 用 `topics:` 而非 `tags:`，否则 Doks `term.html` 构建失败；⑤ 自定义 `col-*` 按 16 列网格累加；⑥ 改完跑 `npm ci && npx hugo --gc --minify` 确认无 `error building site`；⑦ 完成后调用 `create_pull_request` 自动开 PR。
