# Vue-router-next

::: tip 阅读提示：
以下文档为 [@veaba](https://github.com/veaba) 个人学习笔记，随着版本的更迭，不确保描述是完全可信性的，转载请注明来源，同时此项目开源 [veaba/vue-docs](https://github.com/veaba/vue-docs)
::: 

## 比较异同、新特性、新改变
- [Examples->/veaba/vue-route-next](https://github.com/veaba/vue-router-next/tree/dev-veaba/examples)
- 需要手动获取`$route`,但这个`$route`是保留字，暂无无法使用
- 其次，当前路由的常用参数，被放在当前路由的`.value`里面，也就是等于vue中的`$route => route.value`
- 根据 [vue-router-next核心开发者@posva ](https://github.com/vuejs/vue-router-next/issues/128#issuecomment-596697188) 说，`redirect:'/foo'` 必须是斜杠开头, `redirect:'bar'` 是非法的。（但[vue-router](https://github.com/vuejs/vue-router/blob/dev/examples/redirect/app.js#L19-L29)中是合法的）

## vue-router-next 路由使用

```ts
import { createRouter, createHistory, useRoute,RouteComponent } from 'vue-router-next'
import { createApp} from 'vue'
const Home: RouteComponent = { template: '<div>home</div>' }
const Foo: RouteComponent = { template: '<div>foo</div>' }
const Bar: RouteComponent = { template: '<div>bar</div>' }
const Unicode: RouteComponent = { template: '<div>unicode</div>' }


const app= createApp()
const router: any = createRouter({
  history: createHistory('/' + __dirname),
  routes: [
    { path: '/', component: Home, name: 'home' },
    { path: '/foo', component: Foo, name: 'foo' },
    { path: '/bar', component: Bar, name: 'bar' },
    { path: '/é', component: Unicode, name: 'euro' },
  ],
})

const route:any= useRoute() //vue当前组件的路由
app.use(router)
app.mount('#app')
```

### 组件 route 实例

```json
{
  "fullPath": "/foo",
  "path": "/foo",
  "query": {},
  "hash": "",
  "name": "foo",
  "params": {},
  "matched": [
    {
      "path": "/foo",
      "components": {
        "default": {
          "template": "<div>foo</div>"
        }
      },
      "name": "foo",
      "meta": {},
      "leaveGuards": []
    }
  ],
  "meta": {}
}
      
```

## 在内部组件里面使用router实例

::: warning 特别说明：
由于官方尚未开发完成，vue-next中保留了关键字 `$router`、`$route` 给后面的 `vue-router-next` 使用，这两个关键词现在不能使用
::: 

```ts
import { useRoute } from 'vue-router-next'
const route: any = useRoute()
```

## 如果你需要当前组件的参数，类似以前的$route

```ts
setup() {
    const route = useRoute()
    const currentLocation = computed(() => {
        const { matched, ...rest } = route.value
        return rest
    })
    return {
        currentLocation,// $route是保护的关键字，无法被覆盖
    }
},
```

### 对比下vue2的差异

来自vue2的examples demo

|Item|vue-router(expect)| vue-router-next(actual)|latest remark|
|----|----|---|---|
|`Mode:'hash'`|`/hash-mode/#/`|`/#hash-mode/`| no support IE11|
|`router-link tag="li"`|√|x|attrs `tag` no yet|
|`:to="{params: { zapId: 2 }}"`|√|x| to value is object,not supported yet|
|`{history: createHistory('/' + __dirname)}`|`mode`,`base`| use `history`|`history` mode must be has string `/`|
|需要重新校验 `/x`=>`/x/x` |auto add suffix `/`| auto add last route name,or suffix is add `/`||
| route-matching `{ path: '/' }`|√|typescript err||
|`active-links`、`a-c`,"&" is not allowed in route name||||
|`{ path: '*', redirect: '/' }` |√|x|||
|`/redirect/redirect-with-params/123` -> `/redirect/with-params/:id`|√|x||
|`/redirect/relative-redirect` -> `/redirectfoo`|√ `/redirect/foo`|`/redirectfoo` in url||
|||||
|||||
|||||

### Vue-router-next hash暂不支持IE11

[Source code: /history/hash.ts](https://github.com/vuejs/vue-router-next/blob/master/src/history/hash.ts)
```ts
  
import { RouterHistory } from './common'
import createWebHistory from './html5'

export default function createWebHashHistory(base: string = ''): RouterHistory {
  // Make sure this implementation is fine in terms of encoding, specially for IE11
  return createWebHistory('/#' + base)

  // 改成这样return createHistory('/' + base + '/#') 就和vue2一样了,但看起来时后面追加的'#'，不太对劲
}
```
