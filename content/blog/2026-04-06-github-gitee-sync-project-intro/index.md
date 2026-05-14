---
title: "GitHub-Gitee-Sync：同步 GitHub 和 Gitee 账号下的全部仓库"
description: "介绍 GitHub-Gitee-Sync 的核心能力、接入方式与同步安全策略，适合需要在 GitHub 与 Gitee 之间同步仓库的个人或组织。"
date: 2026-04-06T21:02:29+08:00
draft: false
contributors:
  - "nevstop"
---

> 本文整理自知乎专栏原文，并按站点文档风格进行结构化排版。
> [原文链接](https://zhuanlan.zhihu.com/p/2024590534811886619)

如果你主要在 GitHub 上维护项目，但又希望把公开仓库或私有仓库同步到 Gitee 做镜像、备份或国内访问，这个工具提供了一条比较直接的路径：统一读取两侧仓库列表，按配置做单向或双向同步，并支持把一部分附属信息一并带过去。

相关链接：

- [项目仓库](https://github.com/NEVSTOP-LAB/GitHub-Gitee-Sync)
- [示例 Workflow](https://github.com/NEVSTOP-LAB/.github/actions/workflows/sync-to-gitee.yml)
- 开发复盘：/blog/2026-03-30-ai-driven-development-github-gitee-sync/

## 项目概览

GitHub-Gitee-Sync 的目标很直接：

- 同步 GitHub 和 Gitee 账号下的全部仓库，支持公开仓库和私有仓库。
- 支持多种同步方向：GitHub -> Gitee、Gitee -> GitHub、双向同步。
- 同时支持个人账号和组织账号。

英文简介如下：

> Sync all the repos (public/private) between GitHub and Gitee.

## 功能特性

- 自动同步 GitHub 和 Gitee 账号下的全部仓库。
- 支持 `github2gitee`、`gitee2github`、`both` 三种同步方向。
- 支持组织仓库与私有仓库同步。
- 支持排除指定仓库，或只同步白名单中的仓库。
- 支持同步 Releases、Wiki、Labels、Milestones 等附属信息。
- 提供 Docker 镜像，可直接运行。
- 提供 GitHub Action，方便集成进现有 Workflow。
- 可在目标平台自动创建缺失仓库，也可关闭该行为。

## 快速开始

### 前置条件

- GitHub Personal Access Token，需要 `repo` 权限；若同步组织仓库，还需要 `read:org` 权限。
- Gitee Personal Access Token，需要 `projects` 权限。

参考：

- [GitHub Token](https://github.com/settings/tokens)
- [Gitee Token](https://gitee.com/profile/personal_access_tokens)

### 使用 GitHub Action

在仓库中创建 `.github/workflows/sync.yml`：

```yaml
name: Sync to Gitee
on:
  schedule:
    - cron: '0 2 * * *'
  workflow_dispatch:

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - name: Sync GitHub to Gitee
        uses: NEVSTOP-LAB/GitHub-Gitee-Sync@v1
        with:
          github-owner: ${{ github.repository_owner }}
          github-token: ${{ secrets.GH_TOKEN }}
          gitee-owner: ${{ secrets.GITEE_OWNER }}
          gitee-token: ${{ secrets.GITEE_TOKEN }}
```

> 注意：需要在仓库 `Settings > Secrets` 中配置 `GH_TOKEN`、`GITEE_OWNER`、`GITEE_TOKEN`。

### 使用 Python

```bash
pip install requests

python sync.py \
  --github-owner <GitHub用户名或组织名> \
  --github-token <GitHub Token> \
  --gitee-owner <Gitee用户名或组织名> \
  --gitee-token <Gitee Token>
```

### 使用 Docker

```bash
docker build -t github-gitee-sync .

docker run --rm \
  -e GITHUB_OWNER=<GitHub用户名或组织名> \
  -e GITHUB_TOKEN=<GitHub Token> \
  -e GITEE_OWNER=<Gitee用户名或组织名> \
  -e GITEE_TOKEN=<Gitee Token> \
  github-gitee-sync

# 也可以使用 .env 文件
docker run --rm --env-file .env github-gitee-sync
```

## 参数说明

### 必填参数

- `github-owner` / `GITHUB_OWNER`：GitHub 用户名或组织名。
- `github-token` / `GITHUB_TOKEN`：GitHub Personal Access Token。
- `gitee-owner` / `GITEE_OWNER`：Gitee 用户名或组织名。
- `gitee-token` / `GITEE_TOKEN`：Gitee Personal Access Token。

### 常用可选参数

- `account-type` / `ACCOUNT_TYPE`：`user` 或 `org`，同时应用于 GitHub 和 Gitee 两侧。
- `include-private` / `INCLUDE_PRIVATE`：是否包含私有仓库，默认 `true`。
- `include-repos` / `INCLUDE_REPOS`：仓库白名单，逗号分隔；设置后优先于排除列表。
- `exclude-repos` / `EXCLUDE_REPOS`：仓库排除列表，逗号分隔。
- `direction` / `SYNC_DIRECTION`：同步方向，可选 `github2gitee`、`gitee2github`、`both`。
- `create-missing-repos` / `CREATE_MISSING_REPOS`：目标仓库不存在时是否自动创建，默认 `true`。
- `sync-extra` / `SYNC_EXTRA`：附属信息同步列表，可选 `releases,wiki,labels,milestones,issues`。
- `dry-run` / `DRY_RUN`：只执行检查和计划生成，不真正同步，默认 `false`。
- `visibility` / `VISIBILITY`：按可见性二次过滤，可选 `all`、`public`、`private`。
- `show-private-repo-names` / `SHOW_PRIVATE_REPO_NAMES`：控制日志中私有仓库名的显示方式。
- `git-timeout` / `GIT_TIMEOUT`：单次 Git 操作超时时间，单位秒，默认 `900`。

## 数据安全与同步策略

这个工具强调的是“同步”，不是“镜像覆盖一切”。原文对这部分说明得比较细，核心可以概括为以下几条。

### 代码同步

- 当源平台有新分支或标签时，会推送到目标平台。
- 当目标平台有独有分支或标签时，不会主动删除。
- 当两端存在同名分支时，以源平台状态为准。

实现上使用的是只针对分支和标签的推送策略，而不是直接用 `git push --mirror` 删除目标端独有引用。

### Wiki 与附属信息同步

- Wiki 采用增量同步，不删除目标平台独有页面。
- Releases、Labels、Milestones 等附属信息按名称或主键匹配，创建新的、更新已有的，不清理目标独有内容。
- Issues 同步只覆盖预设范围，并通过标记避免重复创建。

### Token 与凭据安全

- Git 操作通过 `GIT_ASKPASS` 临时脚本传递 Token，不把凭据直接写进远程 URL。
- 日志会自动脱敏常见 GitHub Token 格式和 URL 中的凭据片段。
- 同步完成后清理临时目录和临时凭据脚本。
- 权限建议遵循最小化原则：GitHub 侧主要需要 `repo`，Gitee 侧主要需要 `projects`。

### Dry-Run 模式

首次使用时，建议先开启 `--dry-run`。这样可以先看到将被同步的仓库和预期操作，确认配置无误后再切换到正式执行。

## 使用示例

### Gitee -> GitHub

```yaml
- uses: NEVSTOP-LAB/GitHub-Gitee-Sync@v1
  with:
    github-owner: myuser
    github-token: ${{ secrets.GH_TOKEN }}
    gitee-owner: myuser
    gitee-token: ${{ secrets.GITEE_TOKEN }}
    direction: gitee2github
```

### 双向同步

```yaml
- uses: NEVSTOP-LAB/GitHub-Gitee-Sync@v1
  with:
    github-owner: myuser
    github-token: ${{ secrets.GH_TOKEN }}
    gitee-owner: myuser
    gitee-token: ${{ secrets.GITEE_TOKEN }}
    direction: both
```

### 只同步指定仓库

```yaml
- uses: NEVSTOP-LAB/GitHub-Gitee-Sync@v1
  with:
    github-owner: myuser
    github-token: ${{ secrets.GH_TOKEN }}
    gitee-owner: myuser
    gitee-token: ${{ secrets.GITEE_TOKEN }}
    include-repos: 'repo-a,repo-b'
```

### 同步组织仓库并排除部分仓库

```yaml
- uses: NEVSTOP-LAB/GitHub-Gitee-Sync@v1
  with:
    github-owner: my-org
    github-token: ${{ secrets.GH_TOKEN }}
    gitee-owner: my-org
    gitee-token: ${{ secrets.GITEE_TOKEN }}
    account-type: org
    exclude-repos: 'old-repo,deprecated-repo'
```

> 注意：`account-type` 同时作用于 GitHub 和 Gitee 两侧，不支持一侧个人、一侧组织的非对称配置。

### 同步附属信息并读取输出

```yaml
- uses: NEVSTOP-LAB/GitHub-Gitee-Sync@v1
  id: sync
  with:
    github-owner: myuser
    github-token: ${{ secrets.GH_TOKEN }}
    gitee-owner: myuser
    gitee-token: ${{ secrets.GITEE_TOKEN }}
    sync-extra: 'releases,wiki'

- run: echo "Synced ${{ steps.sync.outputs['synced-count'] }} repos"
```

## Action Outputs 与退出码

### Action Outputs

- `synced-count`：成功同步的仓库数量。
- `failed-count`：同步失败的仓库数量。
- `skipped-count`：被跳过的仓库数量。

### 退出码

- `0`：全部成功。
- `1`：部分仓库失败。
- `2`：全部失败。
- `3`：致命错误，例如认证失败或环境异常。

## 相关文档记录

原文还整理了这类资料，适合继续深入：

- 调研文档
- 开发计划
- 实施记录
