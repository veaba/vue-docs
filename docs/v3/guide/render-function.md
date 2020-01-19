# 渲染函数 & JSX


## render 的on 变换

vue2
```js
h('div',
    {
        class:'ha ho',
        style:{margin:'1px '},
        attrs:{
            id:'foo'
        },
        on:{
            click:()=>{

            }
        }
    }
)

```

- 取消attrs，不再封装一层
- 取消事件on，不再封装一层

vue3
```js
h('div',
    {
        class:'ha ho',
        style:{margin:'1px '},
        id:'foo',
        onClick:()=>{

        }
    }
)




## 参考

- [使用Vue3.0做JSX风格组件](https://www.zhihu.com/people/loong-56/activities)
- [vue渲染函数&JSX]https://cn.vuejs.org/v2/guide/render-function.html