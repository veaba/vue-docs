# Vue-router-next

## 比较异同
- [Examples->/veaba/vue-route-next](https://github.com/veaba/vue-router-next/tree/dev-veaba/examples)
- 需要手动获取`$route`,但这个`$route`是保留字，暂无无法使用
- 其次，当前路由的常用参数，被放在当前路由的`.value`里面，也就是等于vue中的`$route => route.value`

## vue-router-next 路由使用

```typescript
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

```vuejs
import { useRoute} from 'vue-router-next'
 const route: any = useRoute()
```

## 如果你需要当前组件的参数，类似以前的$route

```typescript
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
