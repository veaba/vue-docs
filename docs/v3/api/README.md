# API Vue 3

## 全局配置

## 全局API

## 选项 / 数据

### setup
可以看这个描述[点击](https://vue-composition-api-rfc.netlify.com/api.html#setup)

#### 生命周期

仅在`setup`函数内部有效

```js
import {onMounted,onUpdated,onUnmounted} from 'vue'

const myComponent={
setup(){
    // 组件挂载触发
    onMounted(()=>{
        console.log('第一步: 组件挂载')
    })
    // 组件有更新
    onUpdated(()=>{
        console.log('第二步：组件有更新')
    })
    // 卸载组件
    onUnmounted(()=>{
        console.log('第三步：卸载组件')
    })
}

}




```

## 选项 / DOM

## 选项 / 声明周期钩子

## 选项 / 资源

## 选项 / 组合

## 选项 / 其他

---------------------------------------

## 实例属性

## 实例配置 / config
### devtools
- **类型:** `Boolean`
- **默认值:** false
- **用法:** 
### errorHandler
- **类型:** `String`
- **默认值:** `undefined`
- **用法:**
 
### isCustomElement
- **类型:** `Function`
- **默认值:** `fasle`
- **用法:** 

### performance
- **类型:** `Function`
- **默认值:** `fasle`
- **用法:** 

### warnHandler
- **类型:** `String`
- **默认值:** `undefined`
- **用法:**

### isNativeTag
- **类型:** `Boolean`
- **默认值:** `fasle`
- **用法:** 

## 实例方法 / 数据
### component
- **类型:** `Function`
- **参数:**
    - name
    - component
- **默认值:** 
- **用法:** 

### directive
- **类型:** `Function`
- **参数:**
    - name
    - directive
- **默认值:** 
- **用法:** 

### mixin
- **类型:** `Function`
- **参数:**
    - mixin
- **默认值:** 
- **用法:** 

### mount
- **类型:** `Function`
- **参数:**
    - component
    - container
    - props
- **默认值:** 
- **用法:** 

### provide
- **类型:** `Function`
- **参数:**
    - key
    - value
- **默认值:** 
- **用法:** 

### use
- **类型:** `Function`
- **参数:**
    - plugin
    - options: 解构对象`...options`
- **默认值:** 
- **用法:** 

## 实例方法 / 事件

## 实例方法 / 生命周期

## 指令 
### v-text 
### v-html
### v-show
### v-if
### v-else
### v-else-if
### v-for
### v-on
### v-bind
### v-model
### v-slot
### v-pre
### v-cloak
### v-once


## 特殊特性
### key
### ref
### is
### slot
### slot-sopse
### scope

## 内置组件
### component
### transition
### transition-group
### keep-alive
### slot

## VNode 接口
- 请参考[VNode class declaration](https://github.com/vuejs/vue/blob/dev/src/core/vdom/vnode.js)

## 服务端渲染
- 请参考[ vue-server-renderer package docs](https://github.com/vuejs/vue/tree/dev/packages/vue-server-renderer)
