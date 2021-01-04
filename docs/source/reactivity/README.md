# 源码解读@vue/reactivity

关于 Vue.js 3.0 的响应性系统，有做了一个 [copy-vue-next](https://github.com/veaba/copy-vue-next) 的项目，个人认为有助于学习，经过官方的 Jest 测试用例，发现已覆盖。

下面是个人在翻写的过程中，得出一些心得，现在总结下，以便加上理解。

| 响应性模块 | 链接                 |
| ---------- | -------------------- |
| computed   | [computed](computed) |
|            |                      |

## 结构

Vue.js 3.0 的响应性系统目录结构如下：

```
src /

    - baseHandlers.ts         //
    - collectionHandlers.ts   //
    - computed.ts             //
    - effect.ts               //
    - index.ts                //
    - operations.ts           //
    - reactive.ts             //
    - ref.ts                  //
```

`index.ts` 按照惯例，是向外部 export 函数与接口 的入口文件

## Reactivity 过程

```
    [假如新的原始对象]
           |
    检查非Collection =2
           |
    调用 baseHandlers
           |
 proxy 用  proxyMap.set(targe,proxy)
        return proxy

```

具体的函数实现

```js
function createReactiveObject(
  target,
  isReadonly,
  baseHandlers,
  collectionHandlers
) {
  // 如果 target 不是一个对象
  if (!isObject(target)) {
    if (__DEV__) {
      console.warn(`value 无法被响应式化: ${String(target)}`);
    }
    return target;
  }
  // 如果 target 已是一个 Proxy，则返回它
  // 例外：在响应式对象上调用 readonly()
  if (
    target["__v_raw" /* RAW */] &&
    !(isReadonly && target["__v_isReactive" /* IS_REACTIVE */])
  ) {
    return target;
  }
  // target 已有相应的 Proxy
  const proxyMap = isReadonly ? readonlyMap : reactiveMap;
  const existingProxy = proxyMap.get(target); // 现有的 Proxy
  if (existingProxy) {
    return existingProxy;
  }
  // 只有观测到 value 类型的白名单
  const targetType = getTargetType(target);
  if (targetType === 0 /* INVALID */) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 /* COLLECTION */ ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
```

### get 被响应式化的过程

有一个第三个参数 `mutableHandlers`

```js
export function reactive(target) {
  // 如果尝试观察一个只读的 proxy，则返回只读版本
  if (target && target["__v_isReadonly" /* IS_READONLY */]) {
    return target;
  }
  // 开始创建响应式对象
  return createReactiveObject(
    target,
    false,
    mutableHandlers, // 可变的处理器？
    mutableCollectionHandlers // 可变的收集处理器？
  );
}
```

比如获取响应式对象会先通过 `mutableHandlers` 进入 `get`：

在 `baseHandlers.ts` 中

```js
export const mutableHandlers = {
  get, // 进入此函数
  set,
  deleteProperty,
  has,
  ownKeys,
};
```

get 函数如下，调用的 `createGetter`：

```js
function createGetter(isReadonly = false, shallow = false) {
  return function get(target, key, receiver) {
    if (key === "__v_isReactive" /* IS_REACTIVE */) {
      return !isReadonly;
    } else if (key === "__v_isReadonly" /* IS_READONLY */) {
      return isReadonly;
    } else if (
      key === "__v_raw" /* RAW */ &&
      receiver === (isReadonly ? readonlyMap : reactiveMap).get(target)
    ) {
      return target;
    }
    const targetIsArray = isArray(target);
    if (targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }
    const res = Reflect.get(target, key, receiver);
    if (
      isSymbol(key)
        ? builtInSymbols.has(key)
        : key === `__proto__` || key === "__v_isRef"
    ) {
      return res;
    }
    // 如果存在
    if (!isReadonly) {
      track(target, "get" /* GET */, key);
    }
    if (shallow) {
      return res;
    }
    // 如果是 ref，响应式的引用
    if (isRef(res)) {
      // ref 解构，不适用Array、整数 key
      const shouldUnwrap = !targetIsArray || !isIntegerKey(key);
      return shouldUnwrap ? res.value : res;
    }
    if (isObject(res)) {
      // 在这里做isObject检查，避免无效值警告
      // 同时需要在这里做懒性访问 readonly 和 响应式，避免循环依赖
      return isReadonly ? readonly(res) : reactive(res);
    }
    return res;
  };
}
```

如下面的例子中，读取被响应式的数组中的 `object item`:

```js
const original = [{ foo: 1 }];
const observed = reactive(original);
console.log(observed[0]);
```

在 `createGetter` 中，重复走进 `reactive` 函数，对 `{foo:1}` 再响应式化。

而如果如果是访问它本身，直接就打印了，不会再进入 `reactivity`。

如果访问 `observed[0].foo`，在获得值之后，又继续执行两次 `CreateReactiveObject`，最后返回它本身，因为 `observed[0].foo`不是 `isObject`，只能返回它自己。
这个过程将经过：`createGetter` -> `CreateReactiveObject` -> `createGetter`

## Operator type for Vue reactivity system

for symbol

### for array，数组响应式

#### array get 测试

- 原始数组不等于被响应式化的新数组

```js
const original = [{ for: 1 }];
const observed = reactive(original);
console.log(original === observed); // false
```

- 数组被响应式后，连同它的`item` 也会被响应式化

```js
const original = [{ for: 1 }];
const observed = reactive(original);
console.log(isReactive(observed[0])); // true
```

- **TODO: 问题** 那它是如何实现每项都添加上了响应式的呢？

#### array has 测试

```js
const original = [{ for: 1 }];
const observed = reactive(original);
console.log(0 in observed); // false
```

进入 `baseHandlers.ts` `has` 函数：

```js
function has(target, key) {
  const result = Reflect.has(target, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, "has" /* HAS */, key);
  }
  return result;
}
```

`has` 过程中，将不会继续调用 `createReactiveObject`.

#### array clone 过程

```js
const original = [{ foo: 1 }];
const observed = reactive(original);
const clone = observed.slice();
console.info("==>", isReactive(clone[0])); //true
expect(clone[0]).not.toBe(original[0]);
expect(clone[0]).toBe(observed[0]);
```

这个过程，将两次调用 `createGetter`，clone 值不等于原始值，但等于响应化值，它指向观测值。

#### array set 过程

- 观测的值，代表的是原始数组的改变

```js
const original: any[] = [{ foo: 1 }, { bar: 2 }];
const observed = reactive(original);
// set
const value = { baz: 3 };
const reactiveValue = reactive(value);
observed[0] = value;
expect(observed[0]).toBe(reactiveValue);
expect(observed[0]).toBe(value); // false
expect(original[0]).toBe(value); // 存在原始值的引用

// delete
delete observed[0];
expect(observed[0]).toBeUndefined();
expect(original[0]).toBeUndefined();
// mutating methods
observed.push(value);
expect(observed[2]).toBe(reactiveValue);
expect(original[2]).toBe(value);
```

#### 原始数组可以使用原始的方法

```js
const raw = {};
const arr = reactive([{}, {}]);
arr.push(raw);
expect(arr.indexOf(raw)).toBe(2);
expect(arr.indexOf(raw, 3)).toBe(-1);
expect(arr.includes(raw)).toBe(true);
expect(arr.includes(raw, 3)).toBe(false);
expect(arr.lastIndexOf(raw)).toBe(2);
expect(arr.lastIndexOf(raw, 1)).toBe(-1);

// 适用 observed version
const observed = arr[2];
expect(arr.indexOf(observed)).toBe(2);
expect(arr.indexOf(observed, 3)).toBe(-1);
expect(arr.includes(observed)).toBe(true);
expect(arr.includes(observed, 3)).toBe(false);
expect(arr.lastIndexOf(observed)).toBe(2);
expect(arr.lastIndexOf(observed, 1)).toBe(-1);
```

### for Set

支持 `Set` 类型作为响应式的值，比如 `Set` 的子类

```js
class CustomSet extends Set {}
const set1 = reactive(new CustomSet());

expect(set1 instanceof Set).toBe(true);
expect(isReactive(set1)).toBe(true);
```

### for Map

### for object

### for weakMap

支持 `WeakMap` 类型作为响应式的值，比如 `WeakMap`

```js
class CustomMap extends WeakMap {}
const cMap = reactive(new CustomMap());

expect(cMap instanceof WeakMap).toBe(true);
expect(isReactive(cMap)).toBe(true);
```

### track 函数的使用场景

track 本质是做什么？

- get 响应式，`!isReadonly` 都会 track

## 参考

- 关于更多内容，请参考 Vue-next 的测试用例
