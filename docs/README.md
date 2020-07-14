---
home: true
heroImage: /images/logo.png
actionText: Get Started →
actionLink: /guide/
footer: MIT Licensed | Copyright © 2020-present Veaba
---
<div style="text-align: center;font-size: 32px">
The Vue III is coming
</div>

<div class="features">
  <div class="feature">
    <h2>易用</h2>
    <p>已经会了 HTML、CSS、JavaScript？即刻阅读指南开始构建应用！</p>
  </div>
  <div class="feature">
    <h2>灵活</h2>
    <p>不断繁荣的生态系统，可以在一个库和一套完整框架之间自如伸缩。</p>
  </div>
  <div class="feature">
    <h2>高效</h2>
    <p>Vue gzip 32kb，截止2020/1/16. 
       超快虚拟 DOM
       最省心的优化</p>
  </div>
</div>

## 快速使用
``` bash
# Clone the Vue 3 preview webpack project
git clone https://github.com/vuejs/vue-next-webpack-preview.git 

# install
npm install 

# or yarn
yarn

# run 
npm run dev

```

### 如何使用Vue 3(How use it）?
```js
import {createApp} from "vue" // import createApp
import App from "./App.vue"   // A vue component
createApp(App).mount("#app")  // Bind component on dom alpha-3=> createApp.mount(App,"#app")

```

### 注意
::: warning 特别说明：
Vue 3 依然在开发中，SSR部分依然未完成开发，官方文档也未释出，你所看到的这个网站是[@veaba](https://github.com/veaba) 瞎搞的
:::

## 已知问题

- 当前无法通过Vue.prototype附加自定义实例属性。
- 当前的实现要求在运行时环境中使用原生ES2015+，但还不支持IE11。
  



