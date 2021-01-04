# 源码解读/@vue

> by @veaba
>

## 包的依赖关系

```
                         +---------------------+
                         |                     |
                         |  @vue/compiler-sfc  |
                         |                     |
                         +-----+--------+------+
                               |        |
                               v        v
             +-------------------+    +---------------------+
             |                   |    |                     |
     +------>| @vue/compiler-dom +--->| @vue/compiler-core  |
     |       |                   |    |                     |
+----+----+  +-------------------+    +---------------------+
|         |
|   vue   |
|         |
+----+----+  +-------------------+    +--------------------+    +------------------+
     |       |                   |    |                    |    |                  |
     +------>|  @vue/runtime-dom +--->| @vue/runtime-core  +--->| @vue/reactivity  |
             |                   |    |                    |    |                  |
             +-------------------+    +--------------------+    +------------------+
```
## 相关链接
- [Vue-next Repo](https://github.com/vuejs/vue-next)
- [Vue-next docs,by@veaba](https://github.com/veaba/vue-docs)
- [Vue-composition-api](https://vue-composition-api-rfc.netlify.com/#api-introduction)
- [Vue-next 添加注释>branch:veaba](https://github.com/veaba/vue-next)
    - [@Vue/compile-core](/source/compile-core)
        - 平台无关的编译器内核。包括编译器的可扩展基础和所有与平台无关的插件。
    - [@Vue/compile-dom](/source/compile-dom)
        - 编译器，带有专门针对浏览器的附加插件。
    - [@Vue/compile-sfc](/source/compile-sfc)
    - [@Vue/compile-ssr](/source/compile-ssr)
        - 生成为服务器端渲染而优化的渲染函数的编译器。
    - [@Vue/reactivity](/source/reactivity)
        - 响应式系统，独立框架使用。
    - [@Vue/runtime-core](/source/runtime-core)
        - 平台无关的运行时核心。包括虚拟 dom 渲染器、组件实现和JavaScript api的代码。可以使用此包创建针对特定平台的高阶运行时（即自定义渲染器）。
    - [@Vue/runtime-dom](/source/runtime-dom)
        - 以浏览器为目标的运行时。包括本地 DOM API、attribute、property、事件处理程序等的处理。
    - [@Vue/runtime-test](/source/runtime-test)
        - 用于测试的轻量级运行时。可以在任何 JavaScript 环境中使用，因为它"渲染"纯JavaScript对象树。树可用于断言正确的渲染输出。还提供用于序列化树、触发事件和记录更新期间执行的实际节点操作的实用程序。
    - [@Vue/shared](/source/shared)
        - 共享包、工具包
    - [@Vue/server-renderer](/source/server-renderer)
        - 服务端渲染
    - [@vue/template-explorer](/source/template-explorer)
        - 用于调试编译器输出的开发工具。你可以运行 `yarn dev template-explorer` 并打开其 `index.html` 获取基于当前源代码的模板编译的repl。
    - [@vue](/source/vue)

## Vue 3.0 优化过程

- 数据劫持
- 编译优化
    - Block Tree
- 语法 API：Composition API
    - 优化组织逻辑复用

## 归类化 Vue

- Vue 内部使用的原生 dom 选择器是 `document.querySelector(container)`

- 开发模式下 `injectNativeTagCheck` 注入原生 tag 检查

- `createApp` 和 `createSSRApp` 是两个函数，后者不提前处理 `container.innerHTML`，前者是要清空，且移除 attr `v-cloak` 和重置 `data-v-app`

- `ensureRenderer` 函数

- `mount` 函数

- `data` 函数是由 `resolveData` 函数来完成

- 如果 `data` 返回一个 promise，vue 会警告你不要这么做，如果你打算在组件渲染之前执行数据获取，请使用 `async setup()`

```js
 data(){
    return Promise.resolve(1)
},
```

- `data` 如果不是一个 `object`，会被警告

- 如果已存在 `data`，则这是一个 `mixin` 或 `extends`

- vue 内置组件

    - `BaseTransition.ts`
    - `KeepAlive`
    - `Suspense`
    - `Teleport`

- Vue 3 中  `ref` 与 `reactive` 的区别

    - ref 底层调用 reactive

    - ref  有对shallow 处理，以及 track 、trigger 的处理
## Class Vue

------------------------------------------------------------
### Vue的属性/props
#### Comment `{Symbol(Comment)}`
#### Fragment `{Symbol(Fragment)}`
#### Protal `{Symbol(Protal)}`
#### Text `{Symbol(Text)}`
#### version: "3.0.0-alpha.2"

------------------------------------------------------------

### Vue的方法/Methods
#### callWithAsyncErrorHandling `{Function}`
#### callWithErrorHanding `{Function}`
#### camelize `{Function}`
#### capitalize `{Function}`
#### cloneVNode `{Function}`
#### compile `{Function}`
#### computed `{Function}`
#### createApp  `{Function}` 创建实例
#### createBlock `{Function}`
#### createCommentVNode `{Function}`
#### createHook `{Function}` 入参是生命周期
#### createReaderer `{Function}`
#### createSlots `{Function}`
#### createVNode `{Function}`
#### defineComponent `{Function}`
#### effect `{Function}`
#### getCurrentInstance `{Function}`
#### h `{Function}`
#### handleError `{Function}`
#### inject `{Function}`
#### injectHook `{Function}`
#### instanceWatch `{Function}`
#### isReactive `{Function}`
#### isReadonly `{Function}`
#### isRef `{Function}`
#### markNonReactive `{Function}`
#### markReadonly `{Function}`
#### mergeProps `{Function}`
#### nextTick `{Function}`
#### onActivated `{Function}`
#### onBeforeMount `{Function}`
#### onBeforeUnmount `{Function}`
#### onBeforeUpdate `{Function}`
#### onDeactivated `{Function}`
#### onErrorCaptured `{Function}`
#### onMounted `{Function}`
#### onRenderTriggered `{Function}`
#### onUnmounted `{Function}`
#### onUpdated `{Function}`
#### openBlock `{Function}`
#### popScopeId `{Function}`
#### provide `{Function}`
#### pushScopeId `{Function}`
#### reactive `{Function}`
#### readonly `{Function}`
#### recordEffect `{Function}`
#### ref `{Function}`
#### registerRuntimeCompiler `{Function}`
#### render `{Function}`
#### renderList `{Function}`
#### renderSlot `{Function}`
#### resolveComponent `{Function}`
#### resolveDirective `{Function}`
#### resolveDynamicComponent `{Function}`
#### resolveTransitionHooks `{Function}`
#### setBlockTracking `{Function}`
#### setTransitionHooks `{Function}`
#### toHandler `{Function}`
#### toRaw `{Function}`
#### toRefs `{Function}`
#### toString `{Function}`
#### useCSSModule `{Function}`
#### useTransitionState `{Function}`
#### warn `{Function}`
#### watch `{Function}`
#### withDirectives `{Function}`
#### withKeys `{Function}`
#### withModifiers `{Function}`
#### withScopeId `{Function}`

------------------------------------------------------------

### Vue的子类/小对象/枚举组
#### BaseTransition `{Object}`
- name: BaseTransition
- props:
    - appear  `{Boolean}`
    - mode `{string}`
    - onAfterEnter `{Function}`
    - onAfterLeave `{Function}`
    - onBeforeEnter `{Function}`
    - onBeforeLeave `{Function}`
    - onEnter `{Function}`
    - onEnterCancelled `{Function}`
    - onLeave `{Boolean}`
    - onLeaveLCancelled `{Function}`
    - persisted `{Function}`
- setup: setup(props,{slots})
#### KeepAlive `{Object}`
- name
- props:
    - exclude: `[String,RegExp,Array]`
    - include: `[String,RegExp,Array]`
    - max: `[String,Number]`
- setup: setup(props,{slots})
- __isKeepAlive: `true`
#### PatchFlags `{Object}` 一个枚举
- BAIL:-1
- CLASS:2
- DYNAMIC_SLOTS:512
- FULL_PROPS:16
- NEED_PATCH:32
- PROPS:8
- STYLE:4
- TEXT:1
- UNKEYED_FRAGMENT:256
#### ShapeFlags `{Object}`
- ARRAY_CHILDREN: 16
- COMPONENT: 6
- COMPONENT_KEPT_ALIVE: 256
- COMPONENT_SHOULD_KEEP_ALIVE: 128
- ELEMENT: 1
- FUNCTIONAL_COMPONENT: 2
- SLOTS_CHILDREN: 32
- STATEFUL_COMPONENT: 4
- SUSPENSE: 64
- TEXT_CHILDREN: 8
#### Suspense: `{Object}`
- process
- __isSuspense:true
#### Transition `{Object}`
- props:
    - appear: ƒ Boolean()
    - appearActiveClass: ƒ String()
    - appearFromClass: ƒ String()
    - appearToClass: ƒ String()
    - css: {default: true, type: ƒ}
    - duration: ƒ Object()
    - enterActiveClass: ƒ String()
    - enterFromClass: ƒ String()
    - enterToClass: ƒ String()
    - leaveActiveClass: ƒ String()
    - leaveFromClass: ƒ String()
    - leaveToClass: ƒ String()
    - mode: ƒ String()
    - name ƒ String()
    - moveClass: ƒ String()
    - name: ƒ String()
    - onAfterEnter: ƒ Function()
    - onAfterLeave: ƒ Function()
    - onBeforeEnter: ƒ Function()
    - onBeforeLeave: ƒ Function()
    - onEnter: ƒ Function()
    - onEnterCancelled: ƒ Function()
    - onLeave: ƒ Function()
    - onLeaveCancelled: ƒ Function()
    - persisted: ƒ Boolean()
    - type: ƒ String()
- props
    - appear: ƒ Boolean()
    - appearActiveClass: ƒ String()
    - appearFromClass: ƒ String()
    - appearToClass: ƒ String()
    - css: {default: true, type: ƒ}
    - duration: ƒ Object()
    - enterActiveClass: ƒ String()
    - enterFromClass: ƒ String()
    - enterToClass: ƒ String()
    - leaveActiveClass: ƒ String()
    - leaveFromClass: ƒ String()
    - leaveToClass: ƒ String()
    - mode: ƒ String()
    - name: ƒ String()
    - onAfterEnter: ƒ Function()
    - onAfterLeave: ƒ Function()
    - onBeforeEnter: ƒ Function()
    - onBeforeLeave: ƒ Function()
    - onEnter: ƒ Function()
    - onEnterCancelled: ƒ Function()
    - onLeave: ƒ Function()
    - onLeaveCancelled: ƒ Function()
    - persisted: ƒ Boolean()
    - type: ƒ String()
#### TransitionGroup `{Object}`
- props
    - appear: ƒ Boolean()
    - appearActiveClass: ƒ String()
    - appearFromClass: ƒ String()
    - appearToClass: ƒ String()
    - css: {default: true, type: ƒ}
    - duration: ƒ Object()
    - enterActiveClass: ƒ String()
    - enterFromClass: ƒ String()
    - enterToClass: ƒ String()
    - leaveActiveClass: ƒ String()
    - leaveFromClass: ƒ String()
    - leaveToClass: ƒ String()
    - moveClass: ƒ String()
    - name: ƒ String()
    - onAfterEnter: ƒ Function()
    - onAfterLeave: ƒ Function()
    - onBeforeEnter: ƒ Function()
    - onBeforeLeave: ƒ Function()
    - onEnter: ƒ Function()
    - onEnterCancelled: ƒ Function()
    - onLeave: ƒ Function()
    - onLeaveCancelled: ƒ Function()
    - persisted: ƒ Boolean()
    - tag: ƒ String()
    - type: ƒ String()
- setup: setup(props,{slots})
#### vModelCheckbox `{Object}`
- beforeMount `{Function}`
- beforeUpdate `{Function}`
#### vModelDynamic `{Object}`
- beforeMount `{Function}`
- beforeUpdate `{Function}`
- mounted `{Function}`
- updated `{Function}`
#### vModelRadio `{Object}`
- beforeMount `{Function}`
- beforeUpdate `{Function}`
#### vModelSelect `{Object}`
- beforeMount `{Function}`
- beforeUpdate `{Function}`
#### vModelText `{Object}`
- beforeMount `{Function}`
- beforeUpdate `{Function}`
#### vShow `{Object}`
- beforeMount `{Function}`
- beforeUpdate `{Function}`
- mounted `{Function}`
- updated `{Function}`



## Vue 错误枚举

### DOMErrorMessages
- [DOMErrorCodes.X_V_HTML_NO_EXPRESSION]: `v-html is missing expression.`,
- [DOMErrorCodes.X_V_HTML_WITH_CHILDREN]: `v-html will override element children.`,
- [DOMErrorCodes.X_V_TEXT_NO_EXPRESSION]: `v-text is missing expression.`,
- [DOMErrorCodes.X_V_TEXT_WITH_CHILDREN]: `v-text will override element children.`,
- [DOMErrorCodes.X_V_MODEL_ON_INVALID_ELEMENT]: `v-model can only be used on <input>, <textarea> and <select> elements.`,
- [DOMErrorCodes.X_V_MODEL_ARG_ON_ELEMENT]: `v-model argument is not supported on plain elements.`,
- [DOMErrorCodes.X_V_MODEL_ON_FILE_INPUT_ELEMENT]: `v-model cannot used on file inputs since they are read-only. Use a v-on:change listener instead.`,
- [DOMErrorCodes.X_V_SHOW_NO_EXPRESSION]: `v-show is missing expression.`
