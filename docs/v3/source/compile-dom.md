# 源码解读@vue/compile-dom

    开始时间：2020年1月17日09:46:26
    版本：@vue/compile-core 3.0.0-alpha.2
    源码：https://github.com/vuejs/vue/tree/dev/packages/compiler-dom#readme    

主要是在dom里面的一些事件、指令、转换style和属性、

## 操作

- 枚举出来所有HTML 特殊字符
