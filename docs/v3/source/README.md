# 源码解读/@vue

> by @veaba
>
>

## 相关链接
- [Vue-next Repo](https://github.com/vuejs/vue-next)
- [Vue-next docs,by@veaba](https://github.com/veaba/vue-docs)
- [Vue-composition-api](https://vue-composition-api-rfc.netlify.com/#api-introduction)
- [Vue-next 添加注释>branch:veaba](https://github.com/veaba/vue-next)
    - [@Vue/compile-core](/source/compile-core)
    - [@Vue/compile-dom](/source/compile-dom)
    - [@Vue/compile-sfc](/source/compile-sfc)
    - [@Vue/reactivity](/source/reactivity)
    - [@Vue/runtime-core](/source/runtime-core)
    - [@Vue/runtime-dom](/source/runtime-dom)
    - [@Vue/shared](/source/shared)

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
