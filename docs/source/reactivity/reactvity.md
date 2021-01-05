# reactivity

## reactive()

- 参数必须是对象，否则报错, `value cannot be made reactive: xx`

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

- 如何理解 toRaw 函数？这个函数的意思是说，被响应化的变量存在一个私有的属性 `__v_raw`，原始的变量值就在这个 `__v_raw`下，toRaw 也只是把这个 `变量的.__v_raw` 提取出来而已，（TODO：但现在看不出再何处塞了这个原始值）

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

## Test

1. object

```ts
test("Object", () => {
  const original = { foo: 1 };
  const observed = reactive(original);
  expect(observed).not.toBe(original);
  expect(isReactive(observed)).toBe(true);
  expect(isReactive(original)).toBe(false);
  // get
  expect(observed.foo).toBe(1);
  // has
  expect("foo" in observed).toBe(true);
  // ownKeys
  expect(Object.keys(observed)).toEqual(["foo"]);
});
```

2. proto

```ts
test("proto", () => {
  const obj = {};
  const reactiveObj = reactive(obj);
  expect(isReactive(reactiveObj)).toBe(true);
  // read prop of reactiveObject will cause reactiveObj[prop] to be reactive
  // @ts-ignore
  const prototype = reactiveObj["__proto__"];
  const otherObj = { data: ["a"] };
  expect(isReactive(otherObj)).toBe(false);
  const reactiveOther = reactive(otherObj);
  expect(isReactive(reactiveOther)).toBe(true);
  expect(reactiveOther.data[0]).toBe("a");
});
```

3. 嵌套响应式

```ts
test("nested reactives", () => {
  const original = {
    nested: {
      foo: 1,
    },
    array: [{ bar: 2 }],
  };
  const observed = reactive(original);
  expect(isReactive(observed.nested)).toBe(true);
  expect(isReactive(observed.array)).toBe(true);
  expect(isReactive(observed.array[0])).toBe(true);
});
```

4. 可观测可迭代集合(Map,Set) 的子类型

```ts
test("observing subtypes of IterableCollections(Map, Set)", () => {
  // subtypes of Map
  class CustomMap extends Map {}
  const cmap = reactive(new CustomMap());

  expect(cmap instanceof Map).toBe(true);
  expect(isReactive(cmap)).toBe(true);

  cmap.set("key", {});
  expect(isReactive(cmap.get("key"))).toBe(true);

  // subtypes of Set
  class CustomSet extends Set {}
  const cset = reactive(new CustomSet());

  expect(cset instanceof Set).toBe(true);
  expect(isReactive(cset)).toBe(true);

  let dummy;
  effect(() => (dummy = cset.has("value")));
  expect(dummy).toBe(false);
  cset.add("value");
  expect(dummy).toBe(true);
  cset.delete("value");
  expect(dummy).toBe(false);
});
```

5. 可观测 WeakCollections 集合(WeakMap,WeakSet) 的子类型

```ts
test("observing subtypes of WeakCollections(WeakMap, WeakSet)", () => {
  // subtypes of WeakMap
  class CustomMap extends WeakMap {}
  const cmap = reactive(new CustomMap());

  expect(cmap instanceof WeakMap).toBe(true);
  expect(isReactive(cmap)).toBe(true);

  const key = {};
  cmap.set(key, {});
  expect(isReactive(cmap.get(key))).toBe(true);

  // subtypes of WeakSet
  class CustomSet extends WeakSet {}
  const cset = reactive(new CustomSet());

  expect(cset instanceof WeakSet).toBe(true);
  expect(isReactive(cset)).toBe(true);

  let dummy;
  effect(() => (dummy = cset.has(key)));
  expect(dummy).toBe(false);
  cset.add(key);
  expect(dummy).toBe(true);
  cset.delete(key);
  expect(dummy).toBe(false);
});
```

6. 观察值应代理变更到原始的（对象）

```ts
test("observed value should proxy mutations to original (Object)", () => {
  const original: any = { foo: 1 };
  const observed = reactive(original);
  // set
  observed.bar = 1;
  expect(observed.bar).toBe(1);
  expect(original.bar).toBe(1);
  // delete
  delete observed.foo;
  expect("foo" in observed).toBe(false);
  expect("foo" in original).toBe(false);
});
```

7. 原始值的变化应该反映到观测者上(object)

```ts
test("original value change should reflect in observed value (Object)", () => {
  const original: any = { foo: 1 };
  const observed = reactive(original);
  // set
  original.bar = 1;
  expect(original.bar).toBe(1);
  expect(observed.bar).toBe(1);
  // delete
  delete original.foo;
  expect("foo" in original).toBe(false);
  expect("foo" in observed).toBe(false);
});
```

8. 设置一个未观测到值的属性，应该用响应式的方式来包装

```ts
test("setting a property with an unobserved value should wrap with reactive", () => {
  const observed = reactive<{ foo?: object }>({});
  const raw = {};
  observed.foo = raw;
  expect(observed.foo).not.toBe(raw);
  expect(isReactive(observed.foo)).toBe(true);
});
```

9. 观测到已观测到的值应该返回相同的 proxy

```ts
test("observing already observed value should return same Proxy", () => {
  const original = { foo: 1 };
  const observed = reactive(original);
  const observed2 = reactive(observed);
  expect(observed2).toBe(observed);
});
```

10. 多次观察相同的值应该返回相同的 Proxy。

```ts
test("observing the same value multiple times should return same Proxy", () => {
  const original = { foo: 1 };
  const observed = reactive(original);
  const observed2 = reactive(original);
  expect(observed2).toBe(observed);
});
```

11. 不应该用 Proxy 污染原始对象。

```ts
test("should not pollute original object with Proxies", () => {
  const original: any = { foo: 1 };
  const original2 = { bar: 2 };
  const observed = reactive(original);
  const observed2 = reactive(original2);
  observed.bar = observed2;
  expect(observed.bar).toBe(observed2);
  expect(original.bar).toBe(original2);
});
```

12. 原始对象转换 toRaw

```ts
test("toRaw", () => {
  const original = { foo: 1 };
  const observed = reactive(original);
  expect(toRaw(observed)).toBe(original);
  expect(toRaw(original)).toBe(original);
});
```

13. 在对象上使用 reactive 作为原型的 toRaw。

```ts
test("toRaw on object using reactive as prototype", () => {
  const original = reactive({});
  const obj = Object.create(original);
  const raw = toRaw(obj);
  expect(raw).toBe(obj);
  expect(raw).not.toBe(toRaw(original));
});
```

14. 不应该解构 Ref<T>

```ts
test("should not unwrap Ref<T>", () => {
  const observedNumberRef = reactive(ref(1));
  const observedObjectRef = reactive(ref({ foo: 1 }));

  expect(isRef(observedNumberRef)).toBe(true);
  expect(isRef(observedObjectRef)).toBe(true);
});
```

15. 应该解构 computed refs

```ts
test("should unwrap computed refs", () => {
  // readonly
  const a = computed(() => 1);
  // writable
  const b = computed({
    get: () => 1,
    set: () => {},
  });
  const obj = reactive({ a, b });
  // check type
  obj.a + 1;
  obj.b + 1;
  expect(typeof obj.a).toBe(`number`);
  expect(typeof obj.b).toBe(`number`);
});
```

16. 应允许将一个 ref 的属性设置为另一个 ref。

```ts
test("should allow setting property from a ref to another ref", () => {
  const foo = ref(0);
  const bar = ref(1);
  const observed = reactive({ a: foo });
  const dummy = computed(() => observed.a);
  expect(dummy.value).toBe(0);

  // @ts-ignore
  observed.a = bar;
  expect(dummy.value).toBe(1);

  bar.value++;
  expect(dummy.value).toBe(2);
});
```

17. 不可观测的值

```ts
test("non-observable values", () => {
  const assertValue = (value: any) => {
    reactive(value);
    expect(
      `value cannot be made reactive: ${String(value)}`
    ).toHaveBeenWarnedLast();
  };

  // number
  assertValue(1);
  // string
  assertValue("foo");
  // boolean
  assertValue(false);
  // null
  assertValue(null);
  // undefined
  assertValue(undefined);
  // symbol
  const s = Symbol();
  assertValue(s);

  // built-ins should work and return same value
  const p = Promise.resolve();
  expect(reactive(p)).toBe(p);
  const r = new RegExp("");
  expect(reactive(r)).toBe(r);
  const d = new Date();
  expect(reactive(d)).toBe(d);
});
```

18. 让参数不会被响应式化

```ts
test("markRaw", () => {
  const obj = reactive({
    foo: { a: 1 },
    bar: markRaw({ b: 2 }),
  });
  expect(isReactive(obj.foo)).toBe(true);
  expect(isReactive(obj.bar)).toBe(false);
});
```

19. 不可观测到不可拓展的对象

```ts
test("should not observe non-extensible objects", () => {
  const obj = reactive({
    foo: Object.preventExtensions({ a: 1 }),
    // sealed or frozen objects are considered non-extensible as well
    bar: Object.freeze({ a: 1 }),
    baz: Object.seal({ a: 1 }),
  });
  expect(isReactive(obj.foo)).toBe(false);
  expect(isReactive(obj.bar)).toBe(false);
  expect(isReactive(obj.baz)).toBe(false);
});
```

20. 如果对象有 `__v_skip`，将不会被观测到

```ts
test("should not observe objects with __v_skip", () => {
  const original = {
    foo: 1,
    __v_skip: true,
  };
  const observed = reactive(original);
  expect(isReactive(observed)).toBe(false);
});
```
