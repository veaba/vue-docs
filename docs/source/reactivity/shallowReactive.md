---
sidebar: auto
---

# ShallowReactive

- 根 property 实现响应式
- 返回原始对象的浅层响应式副本
- 不会自欧东解构 refs

## Test

1. 应该不会让非响应式的属性成为响应式

```ts
test("should not make non-reactive properties reactive", () => {
  const props = shallowReactive({ n: { foo: 1 } });
  expect(isReactive(props.n)).toBe(false);
});
```

2. 应该保持响应性属性响应化

```ts
test("should keep reactive properties reactive", () => {
  const props: any = shallowReactive({ n: reactive({ foo: 1 }) });
  props.n = reactive({ foo: 2 });
  expect(isReactive(props.n)).toBe(true);
});
```

3. 收集 - 应该是一个响应式

```ts
test("should be reactive", () => {
  const shallowSet = shallowReactive(new Set());
  const a = {};
  let size;

  effect(() => {
    size = shallowSet.size;
  });

  expect(size).toBe(0);

  shallowSet.add(a);
  expect(size).toBe(1);

  shallowSet.delete(a);
  expect(size).toBe(0);
});
```

4. 收集 - 当是迭代时应该无法观测

```ts
test("should not observe when iterating", () => {
  const shallowSet = shallowReactive(new Set());
  const a = {};
  shallowSet.add(a);

  const spreadA = [...shallowSet][0];
  expect(isReactive(spreadA)).toBe(false);
});
```

5. 收集 - 应该无法 get 响应式入口

```ts
test("should not get reactive entry", () => {
  const shallowMap = shallowReactive(new Map());
  const a = {};
  const key = "a";

  shallowMap.set(key, a);

  expect(isReactive(shallowMap.get(key))).toBe(false);
});
```

6. 收集 - foreach 上应该无法 get 响应式

```ts
test("should not get reactive on foreach", () => {
  const shallowSet = shallowReactive(new Set());
  const a = {};
  shallowSet.add(a);

  shallowSet.forEach((x) => expect(isReactive(x)).toBe(false));
});
```

7. 收集 - 在对象拓展上 onTrack

```ts
// #1210
test("onTrack on called on objectSpread", () => {
  const onTrackFn = jest.fn();
  const shallowSet = shallowReactive(new Set());
  let a;
  effect(
    () => {
      a = Array.from(shallowSet);
    },
    {
      onTrack: onTrackFn,
    }
  );

  expect(a).toMatchObject([]);
  expect(onTrackFn).toHaveBeenCalled();
});
```

8. 数组 - 应该响应式

```ts
test("should be reactive", () => {
  const shallowArray = shallowReactive<unknown[]>([]);
  const a = {};
  let size;

  effect(() => {
    size = shallowArray.length;
  });

  expect(size).toBe(0);

  shallowArray.push(a);
  expect(size).toBe(1);

  shallowArray.pop();
  expect(size).toBe(0);
});
```

9. 数组 - 当迭代时应该无法观测

```ts
test("should not observe when iterating", () => {
  const shallowArray = shallowReactive<object[]>([]);
  const a = {};
  shallowArray.push(a);

  const spreadA = [...shallowArray][0];
  expect(isReactive(spreadA)).toBe(false);
});
```

10. 数组 - 在对象拓展上 onTrack

```ts
test("onTrack on called on objectSpread", () => {
  const onTrackFn = jest.fn();
  const shallowArray = shallowReactive([]);
  let a;
  effect(
    () => {
      a = Array.from(shallowArray);
    },
    {
      onTrack: onTrackFn,
    }
  );

  expect(a).toMatchObject([]);
  expect(onTrackFn).toHaveBeenCalled();
});
```
