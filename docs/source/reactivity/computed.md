---
sidebar: auto
---

# Computed

## Implementation

Vue 3 中，computed 是通过一个 `ComputedRefImpl` 的类实现的，`__v_isRef`.

### 私有属性

- `private _value!: T`

- `private _dirty:boolean` ，脏数据检查标志

### 公开属性

- `public readonly effect: ReactiveEffect<T>`

- `public readonly __v_isRef=true`

- `public readonly [ReactiveFlags.IS_READONLY]:boolean`

### 脏数据检查

`computedRefImpl` 类中，有一个 private 的属性值 `_dirty`，类型为 `boolean`。

## 疑问

1. class 中，这种语法？

```ts
class ComputedRefImpl<T> {
  private _value!: T;
}
```

- 以 TS 无法识别的方式初始化属性，可以使用感叹号(确定分配断言)，关闭 ts 的警告

2. class 中，枚举值的定义？

```ts
class ComputedRefImpl<T> {
  public readonly [ReactiveFlags.IS_READONLY]: boolean;
}
```

## Test

1. 应该返回更新后的值

```ts
it("should return updated value", () => {
  const value = reactive<{ foo?: number }>({});
  const cValue = computed(() => value.foo);
  expect(cValue.value).toBe(undefined);
  value.foo = 1;
  expect(cValue.value).toBe(1);
});
```

2. 应该是懒计算

```ts
it("should compute lazily", () => {
  const value = reactive<{ foo?: number }>({});
  const getter = jest.fn(() => value.foo);
  const cValue = computed(getter);

  // lazy
  expect(getter).not.toHaveBeenCalled();

  expect(cValue.value).toBe(undefined);
  expect(getter).toHaveBeenCalledTimes(1);

  // 不应该重新计算
  cValue.value;
  expect(getter).toHaveBeenCalledTimes(1);

  // 不到万不得已不计算
  value.foo = 1;
  expect(getter).toHaveBeenCalledTimes(1);

  // 此刻，重新计算
  expect(cValue.value).toBe(1);
  expect(getter).toHaveBeenCalledTimes(2);

  // 不应该重新计算
  cValue.value;
  expect(getter).toHaveBeenCalledTimes(2);
});
```

3. 应该触发 effect

```ts
it("should trigger effect", () => {
  const value = reactive<{ foo?: number }>({});
  const cValue = computed(() => value.foo);
  let dummy;
  effect(() => {
    dummy = cValue.value;
  });
  expect(dummy).toBe(undefined);
  value.foo = 1;
  expect(dummy).toBe(1);
});
```

4. 应该可以链式运行

```ts
it("should work when chained", () => {
  const value = reactive({ foo: 0 });
  const c1 = computed(() => value.foo);
  const c2 = computed(() => c1.value + 1);
  expect(c2.value).toBe(1);
  expect(c1.value).toBe(0);
  value.foo++;
  expect(c2.value).toBe(2);
  expect(c1.value).toBe(1);
});
```

5. 链式时应该可触发 effect

```ts
it("should trigger effect when chained", () => {
  const value = reactive({ foo: 0 });
  const getter1 = jest.fn(() => value.foo);
  const getter2 = jest.fn(() => {
    return c1.value + 1;
  });
  const c1 = computed(getter1);
  const c2 = computed(getter2);

  let dummy;
  effect(() => {
    dummy = c2.value;
  });
  expect(dummy).toBe(1);
  expect(getter1).toHaveBeenCalledTimes(1);
  expect(getter2).toHaveBeenCalledTimes(1);
  value.foo++;
  expect(dummy).toBe(2);
  // 不应导致重复调用
  expect(getter1).toHaveBeenCalledTimes(2);
  expect(getter2).toHaveBeenCalledTimes(2);
});
```

6. 当链式调用（混合调用时），应该触发 effect

```ts
it("should trigger effect when chained (mixed invocations)", () => {
  const value = reactive({ foo: 0 });
  const getter1 = jest.fn(() => value.foo);
  const getter2 = jest.fn(() => {
    return c1.value + 1;
  });
  const c1 = computed(getter1);
  const c2 = computed(getter2);

  let dummy;
  effect(() => {
    dummy = c1.value + c2.value;
  });
  expect(dummy).toBe(1);

  expect(getter1).toHaveBeenCalledTimes(1);
  expect(getter2).toHaveBeenCalledTimes(1);
  value.foo++;
  expect(dummy).toBe(3);
  // should not result in duplicate calls
  expect(getter1).toHaveBeenCalledTimes(2);
  expect(getter2).toHaveBeenCalledTimes(2);
});
```

7. 停止时不应该再更新

```ts
it("should no longer update when stopped", () => {
  const value = reactive<{ foo?: number }>({});
  const cValue = computed(() => value.foo);
  let dummy;
  effect(() => {
    dummy = cValue.value;
  });
  expect(dummy).toBe(undefined);
  value.foo = 1;
  expect(dummy).toBe(1);
  stop(cValue.effect);
  value.foo = 2;
  expect(dummy).toBe(1);
});
```

8. 应该支持 setter

```ts
it("should support setter", () => {
  const n = ref(1);
  const plusOne = computed({
    get: () => n.value + 1,
    set: (val) => {
      n.value = val - 1;
    },
  });

  expect(plusOne.value).toBe(2);
  n.value++;
  expect(plusOne.value).toBe(3);

  plusOne.value = 0;
  expect(n.value).toBe(-1);
});
```

9. 应该触发 effect w/ setter

```ts
it("should trigger effect w/ setter", () => {
  const n = ref(1);
  const plusOne = computed({
    get: () => n.value + 1,
    set: (val) => {
      n.value = val - 1;
    },
  });

  let dummy;
  effect(() => {
    dummy = n.value;
  });
  expect(dummy).toBe(1);

  plusOne.value = 0;
  expect(dummy).toBe(-1);
});
```

10. 应该警告如果试图 set readonly 的计算属性

```ts
it("should warn if trying to set a readonly computed", () => {
  const n = ref(1);
  const plusOne = computed(() => n.value + 1);
  (plusOne as WritableComputedRef<number>).value++; // Type cast to prevent TS from preventing the error

  expect(
    "Write operation failed: computed value is readonly"
  ).toHaveBeenWarnedLast();
});
```

11. 应该是 readonly

```ts
it("should be readonly", () => {
  let a = { a: 1 };
  const x = computed(() => a);
  expect(isReadonly(x)).toBe(true);
  expect(isReadonly(x.value)).toBe(false);
  expect(isReadonly(x.value.a)).toBe(false);
  const z = computed<typeof a>({
    get() {
      return a;
    },
    set(v) {
      a = v;
    },
  });
  expect(isReadonly(z)).toBe(false);
  expect(isReadonly(z.value.a)).toBe(false);
});
```
