---
sidebar: auto
---

Vuejs 3.0 在北京时间2020年9月 19 日凌晨，终于发布了 3.0 版本，代号：One Piece

以下为 Vuejs Release 3.0 机器翻译文章，原文 [v3.0.0 One Piece](https://github.com/vuejs/vue-next/releases/tag/v3.0.0)。

# Vue 3.0 发布


<div style="text-align:center">
    <img alt="v3.0.0 One Piece" src="https://user-images.githubusercontent.com/499550/93624428-53932780-f9ae-11ea-8d16-af949e16a09f.png">
</div>

今天，我们很荣幸地宣布 Vue.js 3.0“One Piece”的正式发布。这个框架的新的主要版本提供了改进的性能、更小的捆绑大小、更好的 TypeScript 集成、用于处理大规模用例的新 API，以及为框架未来的长期迭代奠定了坚实的基础。

3.0 版本代表了两年多的开发努力，包括 [30+ RFC](https://github.com/vuejs/rfcs/tree/master/active-rfcs)，2600 多个提交，[99 个贡献者](https://github.com/vuejs/vue-next/graphs/contributors)的 [628 个 PR](https://github.com/vuejs/vue-next/pulls?q=is%3Apr+is%3Amerged+-author%3Aapp%2Fdependabot-preview+)，以及核心仓库之外的大量开发和文档工作。在此，我们要对我们的团队成员、贡献者的拉取请求、赞助商和支持者的资金支持，以及更广泛的社区参与我们的设计讨论并为预发布版本提供反馈表示最深切的感谢。Vue 是一个独立的项目，是为社区而创建的，也是由社区来维持的，如果没有您的一贯支持，Vue 3.0 是不可能实现的。

## 进一步推进“渐进式框架”概念。

Vue 从一开始就有一个简单的使命：成为一个任何人都能快速学会的平易近人的框架。随着我们用户群的增长，框架的范围也在不断扩大，以适应不断增长的需求。随着时间的推移，它演变成了我们所说的“渐进式框架”：一个可以逐步学习和采用的框架，同时随着用户应对越来越多的需求场景而提供持续的支持。

今天，我们在全球拥有 130 多万用户 \*，我们看到 Vue 被应用于各种不同的场景，从在传统的服务器渲染的页面上添加交互性，到拥有数百个组件的完整的单页应用。Vue 3 将这种灵活性进一步提升。

## 分层内部模块

Vue 3.0 核心仍然可以通过一个简单的 `<script>` 标签来使用，但它的内部结构已经被重新编写成一个解耦模块的集合。新的架构提供了更好的可维护性，并允许终端用户通过 tree-shaking 减少多达一半的运行时大小。

这些模块还暴露了底层的 API，解锁了许多高级用例。

- 编译器支持自定义 AST 转换，用于构建时的自定义 (例如构建时的 i18n)。

- 核心运行时提供了一级的 API，用于创建针对不同渲染目标 (如[原生移动端](https://github.com/rigor789/nativescript-vue-next)、[WebGL](https://github.com/Planning-nl/vugel) 或[终端](https://github.com/ycmjason/vuminal)) 的自定义渲染器。默认的 DOM 渲染器也是使用相同的 API 构建的。

- [`@vue/reactivity` 模块](https://github.com/vuejs/vue-next/tree/master/packages/reactivity)导出的函数可以直接访问 Vue 的反应性系统，并且可以作为一个独立的包使用。它可以与其他模板解决方案 (如 [lit-html](https://github.com/yyx990803/vue-lit)) 配对使用，甚至在非 UI 场景中使用。

## 解决规模问题的新 API

在 Vue 3 中，基于对象的 2.x API 基本没有变化。不过，3.0 还引入了 [Composition API](https://v3.vuejs.org/guide/composition-api-introduction.html)——一套新的 API，旨在解决 Vue 在大规模应用中的使用痛点。组成 API 建立在反应性 API 之上，实现了类似于 React 钩子的逻辑组成和重用，比 2.x 基于对象的 API 更灵活的代码组织模式和更可靠的类型推理。

Composition API 也可以通过 [@vue/composition-api](https://github.com/vuejs/composition-api) 插件与 Vue 2.x 一起使用，目前已经有适用于 Vue 2 和 3 的组成 API 实用库 (如 [vueuse](https://github.com/antfu/vueuse)、[vue-composable](https://github.com/pikax/vue-composable))。

### 性能改进

Vue 3 与 Vue 2 相比，在捆绑大小 (tree-shaking 时减少了 41%)、初始渲染 (快了 55%)、更新 (快了 133%) 和内存使用 (少了 54%) 方面都有[显著的性能提升](https://docs.google.com/spreadsheets/d/1VJFx-kQ4KjJmnpDXIEaig-cVAAJtpIGLZNbv3Lr4CR0/edit?usp=sharing)。

在 Vue 3 中，我们采取了“compiler-informed 虚拟 DOM”的方法：模板编译器执行积极的优化，并生成渲染函数代码，以提升静态内容，为绑定类型留下运行时提示，最重要的是，扁平化模板内的动态节点，以减少运行时遍历的成本。因此，用户可以获得两全其美的效果：从模板中获得编译器优化的性能，或者在用例需要时通过手动渲染函数直接控制。

### 改进的 TypeScript 集成

Vue 3 的代码库是用 TypeScript 编写的，具有自动生成，测试和捆绑的类型定义，因此它们始终是最新的。Composition API 可以很好地处理类型推断。Vetur 是我们的官方 VSCode 扩展，现在利用 Vue 3 改进的内部键入功能支持模板表达式和 props 类型检查。哦，如果您愿意，Vue 3 的打字完全支持 TSX。

### 实验特性

我们为单文件组件 (SFC，即 `.vue` 文件) 提出了两个新特性：

- [`<script setup>`：在 SFC 中使用 Composition API 的语法糖](https://github.com/vuejs/rfcs/blob/sfc-improvements/active-rfcs/0000-sfc-script-setup.md)

- [`<style vars>`：单文件组件中状态驱动 CSS 变量](https://github.com/vuejs/rfcs/blob/sfc-improvements/active-rfcs/0000-sfc-style-variables.md)

这些功能已在 Vue 3.0 中实现并可用，但仅出于收集反馈的目的而提供。在 RFC 合并之前，它们将保持试验状态。

我们还实现了一个当前未公开的 `<Suspense>` 组件，该组件允许在初始渲染或分支开关上等待嵌套的异步依赖项 (异步组件或具有 `setup()` 的组件)。我们正在与 Nuxt.js 团队一起测试和迭代此功能 ([Nuxt 3 即将发布](https://nuxtjs.slides.com/atinux/state-of-nuxt-2020))，并且很可能会在 3.1 版中将其固化。

## 分阶段发布流程

Vue 3.0 的发布标志着该框架的全面就绪。尽管某些框架子项目可能仍需要进一步的工作才能达到稳定状态 (特别是 devtools 中的路由器和 Vuex 集成)，但我们认为今天使用 Vue 3 启动新的绿色项目是合适的。我们还鼓励图书馆作者开始升级您的项目以支持 Vue 3。

请查阅 [Vue 3 工具库指南](https://v3.vuejs.org/guide/migration/introduction.html#supporting-libraries)以获取有关所有框架子项目的详细信息。

## 迁移和 IE11 支持

由于时间限制，我们已推迟了迁移版本 (具有 v2 兼容行为的 v3 版本 + 迁移警告) 和 IE11 版本，并计划在 2020 年第四季度重点关注它们。因此，计划迁移现有 v2 应用程序的用户或要求 IE11 支持人员此时应意识到这些限制。

### 下一步

发布后的短期内，我们将专注于：

- 迁移版本

- IE11 支持

- 新 devtools 中的 Router 和 Vuex 集成

- Vetur 中模板类型推断的进一步改进

目前，面向 Vue 3 和 v3 的项目的文档网站，GitHub 分支和 npm dist 标签将保持在下一个状态。这意味着 `npm install vue` 仍将安装 Vue 2.x，`npm install vue@next` 将安装 Vue 3。**我们计划在 2020 年底之前将所有文档链接，分支和 dist 标签切换为默认值 3.0**。

同时，我们已经开始计划 2.7，这将是 2.x 发行版的最后一个计划的次要发行版。2.7 将向后移植来自 v3 的兼容改进，并发出有关 v3 中已删除/更改的 API 使用情况的警告，以帮助潜在的迁移。我们计划在 2021 年第一季度开发 2.7，它将在发布后直接变为 LTS，预计有 18 个月的维护时长。

## 尝试一下

要了解有关 Vue 3.0 的更多信息，请访问我们的[新文档网站](https://v3.vuejs.org/)。如果您是现有的 Vue 2.x 用户，请直接转到[迁移指南](https://v3.vuejs.org/guide/migration/introduction.html)。

- \*根据 Google 报告的每周 Vue Devtools Chrome 扩展活跃用户。

- (另外：[Vue 3 官方中文文档仓库](https://github.com/vuejs/docs-next-zh-cn)在这里)
