# 深入响应式原理


## vue3 使用响应式
```js
import {defineComponent,reactive} from 'vue'
interface LabelProps{
    content:string
}
const Label=defineComponent({
    setup(props:LabelProps){
        return ()=>{
            const {content}=props
            return <span>{content}</span>
        }
    }
})
```