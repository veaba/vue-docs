# @vue/shared

Vue其他模块共享的函数和常量，并未作为一个暗度的依赖包，构建时会其他依赖使用，会被做tree-shaking

## 操作

- 生成代码帧：`generateCodeFrame`
- 提取`compile-dom`和`runtime-dom`共享的HTML标记，主要是HTML TAG
- 全局白名单
 ```js
const GLOBALS_WHITE_LISTED =
  'Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,' +
  'decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,' +
  'Object,Boolean,String,RegExp,Map,Set,JSON,Intl'
```
- makeMap: 制作一个map来检查让Rollup做tree-shaking
- patchFlag: 修补程序，编译器生成的优化提示，并打上一些标记以便diff使用
    - 如何合并内联style: style="color:red" :style="{color:'red'}"
