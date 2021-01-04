# reactivity

## reactive()

- 调用 `createReactiveObject`

````ts
/**
 * 创建一个原始对象的响应式副本 {reactive:响应式,reactivity:响应性}
 * 1. 响应式转换是 `深层的`，它影响所有的嵌套 property。
 * 2. 在基于ES5实现中，返回的 proxy 是不**等**于原始对象的。
 * 3. 建议只是用响应式 proxy，避免依赖原始对象
 *
 * 响应式对象会自动解构其中包含的 refs，所以在访问和变更它们的值时，不需要使用 `.value`
 *
 * ```js
 * const count = ref(0)
 * const obj =reactive({
 *     count
 * })
 * obj.count++
 * obj.count   // ->1
 * count.value // ->1
 * ```
 * */
export function reactive<T extends object>(target: T): UnwrapNestedRefs<T>;

export function reactive(target: object) {
  // 如果尝试观察一个只读的 proxy，则返回只读版本
  if (target && (target as Target)[ReactiveFlags.IS_READONLY]) {
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
````

## createReactiveObject()

创建响应式对象

```js
function createReactiveObject(
  target: Target,
  isReadonly: boolean,
  baseHandlers: ProxyHandler<any>,
  collectionHandlers: ProxyHandler<any>
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
    target[ReactiveFlags.RAW] &&
    !(isReadonly && target[ReactiveFlags.IS_REACTIVE])
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
  if (targetType === TargetType.INVALID) {
    return target;
  }
  const proxy = new Proxy(
    target,
    targetType === TargetType.COLLECTION ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
```

## toRaw()

```ts
/**
 * 返回 `reactive` 或 `readonly` proxy 的原始对象
 * */
export function toRaw<T>(observed: T): T {
  return (
    (observed && toRaw((observed as Target)[ReactiveFlags.RAW])) || observed
  );
}

export const enum ReactiveFlags {
  SKIP = "__v_skip",
  IS_READONLY = "__v_isReadonly",
  IS_REACTIVE = "__v_isReactive",
  RAW = "__v_raw",
}
```

将上述的 `ts` 转译到 `ts`，实际代码如下：

```js
/**
 * 返回 `reactive` 或 `readonly` proxy 的原始对象
 * */
export function toRaw(observed) {
  return (observed && toRaw(observed["__v_raw" /* RAW */])) || observed;
}
```

- 这个表示的是，当入参变量存在属性 `__v_raw` 即 `observe["__v_raw"]`时，返回它本身 或 `observe["__v_raw"]`。

- 这是对属性打 `__v_raw` 原始标签的标志，从而判断是不是原始对象

## markRaw()

- 对某个对象，打上私有属性 `__v_skip`，以快速跳过，不会被转为 `proxy`

TODO: 哪些情况不需要转为 `proxy`？

```ts
/**
 * @desc 标记一个对象，使其永远不会被转为 proxy，返回对象本身
 * */
export function markRaw(value) {
  def(value, "__v_skip" /* SKIP */, true);
  return value;
}
// 添加特定的不可枚举的私有属性
export const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value,
  });
};
```

```js
// 使用
const value = { b: 2 };
def(value, "__v_skip" /* SKIP */, true);

/**
 *
 * {
 *  b:2,
 *  __v_skip:true,
 *  __proto__: Object
 * }
 *
 */
```
