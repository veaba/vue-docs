---
sidebar: auto
---

# Effect

- 跟中属性变化并调用回调函数

- get 响应式对象，都会经过 `effect` 的 `track` 函数

## Test

1. 应该运行一次传递的函数，由 `effect` 包装

```js
it("should run the passed function once (wrapped by a effect)", () => {
  const fnSpy = jest.fn((...args) => {
    console.info(args);
  });
  effect(fnSpy);
  expect(fnSpy).toHaveBeenCalledTimes(1);
});
```

2. 应观测基本特性

```ts
it("should observe basic properties", () => {
  let dummy;
  const counter = reactive({ num: 0 });
  effect(() => (dummy = counter.num)); // TODO:为什么不写成 effect(()=>dummy = counter.num),非得加个括号呢？

  expect(dummy).toBe(0);
  counter.num = 7;
  expect(dummy).toBe(7);
});
```

3. 应该可以观测到多个属性

```ts
it("should observe multiple properties", () => {
  let dummy;
  const counter = reactive({ num1: 0, num2: 0 });
  effect(() => (dummy = counter.num1 + counter.num1 + counter.num2));

  expect(dummy).toBe(0);
  counter.num1 = counter.num2 = 7;
  expect(dummy).toBe(21);
});
```

4. 应该可以处理多个 effect

```ts
it("should handle multiple effects", () => {
  let dummy1, dummy2;
  const counter = reactive({ num: 0 });
  effect(() => (dummy1 = counter.num));
  effect(() => (dummy2 = counter.num));

  expect(dummy1).toBe(0);
  expect(dummy2).toBe(0);
  counter.num++;
  expect(dummy1).toBe(1);
  expect(dummy2).toBe(1);
});
```

5. 应该观测到嵌套属性

```ts
it("should observe nested properties", () => {
  let dummy;
  const counter = reactive({ nested: { num: 0 } });
  effect(() => (dummy = counter.nested.num));

  expect(dummy).toBe(0);
  counter.nested.num = 8;
  expect(dummy).toBe(8);
});
```

6. 应该可以观测到删除操作

```ts
it("should observe delete operations", () => {
  let dummy;
  const obj = reactive({ prop: "value" });
  effect(() => (dummy = obj.prop));

  expect(dummy).toBe("value");
  // @ts-ignore
  delete obj.prop;
  expect(dummy).toBe(undefined);
});
```

7. 应该可以观测到 `has` 属性

```ts
it("should observe has operations", () => {
  let dummy;
  const obj = reactive<{ prop: string | number }>({ prop: "value" });
  effect(() => (dummy = "prop" in obj));

  expect(dummy).toBe(true);
  // @ts-ignore
  delete obj.prop;
  expect(dummy).toBe(false);
  obj.prop = 12;
  expect(dummy).toBe(true);
});
```

8. 应该可以观测到 property 在 原型链上

```ts
it("should observe properties on the prototype chain", () => {
  let dummy;
  const counter = reactive({ num: 0 });
  const parentCounter = reactive({ num: 2 });
  Object.setPrototypeOf(counter, parentCounter);
  effect(() => (dummy = counter.num));

  expect(dummy).toBe(0);
  // @ts-ignore
  delete counter.num;
  expect(dummy).toBe(2);
  parentCounter.num = 4;
  expect(dummy).toBe(4);
  counter.num = 3;
  expect(dummy).toBe(3);
});
```

9. 应该可以观测 `has` 操作在原型链上

```ts
it("should observe has operations on the prototype chain", () => {
  let dummy;
  const counter = reactive({ num: 0 });
  const parentCounter = reactive({ num: 2 });
  Object.setPrototypeOf(counter, parentCounter);
  effect(() => (dummy = "num" in counter));

  expect(dummy).toBe(true);
  // @ts-ignore
  delete counter.num;
  expect(dummy).toBe(true);
  // @ts-ignore
  delete parentCounter.num;
  expect(dummy).toBe(false);
  counter.num = 3;
  expect(dummy).toBe(true);
});
```

10. 应该可以观测到继承 property 访问器

```ts
it("should observe inherited property accessors", () => {
  let dummy, parentDummy, hiddenValue: any;
  const obj = reactive<{ prop?: number }>({});
  const parent = reactive({
    set prop(value) {
      hiddenValue = value;
    },
    get prop() {
      return hiddenValue;
    },
  });
  Object.setPrototypeOf(obj, parent);
  effect(() => (dummy = obj.prop));
  effect(() => (parentDummy = parent.prop));

  expect(dummy).toBe(undefined);
  expect(parentDummy).toBe(undefined);
  obj.prop = 4;
  expect(dummy).toBe(4);
  // this doesn't work, should it?
  // expect(parentDummy).toBe(4)
  parent.prop = 2;
  expect(dummy).toBe(2);
  expect(parentDummy).toBe(2);
});
```

11. 应该观测到函数回调链

```ts
it("should observe function call chains", () => {
  let dummy;
  const counter = reactive({ num: 0 });
  effect(() => (dummy = getNum()));

  function getNum() {
    return counter.num;
  }

  expect(dummy).toBe(0);
  counter.num = 2;
  expect(dummy).toBe(2);
});
```

12. 应该观测到迭代

```ts
it("should observe iteration", () => {
  let dummy;
  const list = reactive(["Hello"]);
  effect(() => (dummy = list.join(" ")));

  expect(dummy).toBe("Hello");
  list.push("World!");
  expect(dummy).toBe("Hello World!");
  list.shift(); // Ω => 4375
  expect(dummy).toBe("World!");
});
```

13. 应该观测到隐形数组 `length` 的改变

```ts
it("should observe implicit array length changes", () => {
  let dummy;
  const list = reactive(["Hello"]);
  effect(() => (dummy = list.join(" ")));

  expect(dummy).toBe("Hello");
  list[1] = "World!";
  expect(dummy).toBe("Hello World!");
  list[3] = "Hello!";
  expect(dummy).toBe("Hello World!  Hello!");
});
```

14. TODO: 那么隐形数组改变等同于 effect 的字符串长度吗？

```ts
it("should observe undefined value on array length changes", () => {
  let dummy;
  const list = reactive(["Hello"]);
  effect(() => (dummy = list.join(" ")));

  expect(dummy).toBe("Hello");
  list[1] = "World!";
  expect(dummy).toBe("Hello World!");
  list[3] = "Hello!";
  expect(dummy).toBe("Hello World!  Hello!");

  expect(dummy).toBe(list + ""); // TODO is equal?
});
```

result:

```ts
Expected: "Hello,World!,,Hello!";
Received: "Hello World!  Hello!";
```

15. 应该观测到稀疏数组的变更

```ts
it("should observe sparse array mutations", () => {
  let dummy;
  const list = reactive<string[]>([]);
  list[1] = "World!";
  effect(() => (dummy = list.join(" ")));

  expect(dummy).toBe(" World!");
  list[0] = "Hello";
  expect(dummy).toBe("Hello World!");
  list.pop();
  expect(dummy).toBe("Hello");
});
```

16. 应该观测到枚举

```ts
it("should observe enumeration", () => {
  let dummy = 0;
  const numbers = reactive<Record<string, number>>({ num1: 3 });
  effect(() => {
    dummy = 0;
    for (let key in numbers) {
      dummy += numbers[key];
    }
  });

  expect(dummy).toBe(3);
  numbers.num2 = 4;
  expect(dummy).toBe(7);
  delete numbers.num1;
  expect(dummy).toBe(4);
});
```

17. 应该观测到 symbol 作为 property key

```ts
it("should observe symbol keyed properties", () => {
  const key = Symbol("symbol keyed prop");
  let dummy, hasDummy;
  const obj = reactive({ [key]: "value" });
  effect(() => (dummy = obj[key]));
  effect(() => (hasDummy = key in obj));

  expect(dummy).toBe("value");
  expect(hasDummy).toBe(true);
  obj[key] = "newValue";
  expect(dummy).toBe("newValue");
  // @ts-ignore
  delete obj[key];
  expect(dummy).toBe(undefined);
  expect(hasDummy).toBe(false);
});
```

18. 应该无法观测到已知的 symbol key property

```ts
it("should not observe well-known symbol keyed properties", () => {
  const key = Symbol.isConcatSpreadable;
  let dummy;
  const array: any = reactive([]);
  effect(() => (dummy = array[key]));

  expect(array[key]).toBe(undefined);
  expect(dummy).toBe(undefined);
  array[key] = true;
  expect(array[key]).toBe(true);
  expect(dummy).toBe(undefined);
});
```

19. 应该观测到函数是 property 值

```ts
it("should observe function valued properties", () => {
  const oldFunc = () => {};
  const newFunc = () => {};

  let dummy;
  const obj = reactive({ func: oldFunc });
  effect(() => (dummy = obj.func));

  expect(dummy).toBe(oldFunc);
  obj.func = newFunc;
  expect(dummy).toBe(newFunc);
});
```

20. 应该观察到链式 get 需要依赖 `this`

```ts
it("should observe chained getters relying on this", () => {
  const obj = reactive({
    a: 1,
    get b() {
      return this.a;
    },
  });

  let dummy;
  effect(() => (dummy = obj.b));
  expect(dummy).toBe(1);
  obj.a++;
  expect(dummy).toBe(2);
});
```

21. 应该观测到依赖 `this` 上的方法

```ts
it("should observe methods relying on this", () => {
  const obj = reactive({
    a: 1,
    b() {
      return this.a;
    },
  });

  let dummy;
  effect(() => (dummy = obj.b()));
  expect(dummy).toBe(1);
  obj.a++;
  expect(dummy).toBe(2);
});
```

22. 没有值改变的情况下，应该无法观测到 set 操作

```ts
it("should not observe set operations without a value change", () => {
  let hasDummy, getDummy;
  const obj = reactive({ prop: "value" });

  const getSpy = jest.fn(() => (getDummy = obj.prop));
  const hasSpy = jest.fn(() => (hasDummy = "prop" in obj));
  effect(getSpy);
  effect(hasSpy);

  expect(getDummy).toBe("value");
  expect(hasDummy).toBe(true);
  obj.prop = "value";
  expect(getSpy).toHaveBeenCalledTimes(1);
  expect(hasSpy).toHaveBeenCalledTimes(1);
  expect(getDummy).toBe("value");
  expect(hasDummy).toBe(true);
});
```

23. 应该无法观测到原始变更

```ts
it("should not observe raw mutations", () => {
  let dummy;
  const obj = reactive<{ prop?: string }>({});
  effect(() => (dummy = toRaw(obj).prop));

  expect(dummy).toBe(undefined);
  obj.prop = "value";
  expect(dummy).toBe(undefined);
});
```

24. 应该不会被原始变更而触发

```ts
it("should not be triggered by raw mutations", () => {
  let dummy;
  const obj = reactive<{ prop?: string }>({});
  effect(() => (dummy = obj.prop));

  expect(dummy).toBe(undefined);
  toRaw(obj).prop = "value";
  expect(dummy).toBe(undefined);
});
```

25. 应该不被继承的原始 setter 触发

```ts
it("should not be triggered by inherited raw setters", () => {
  let dummy, parentDummy, hiddenValue: any;
  const obj = reactive<{ prop?: number }>({});
  const parent = reactive({
    set prop(value) {
      hiddenValue = value;
    },
    get prop() {
      return hiddenValue;
    },
  });
  Object.setPrototypeOf(obj, parent);
  effect(() => (dummy = obj.prop));
  effect(() => (parentDummy = parent.prop));

  expect(dummy).toBe(undefined);
  expect(parentDummy).toBe(undefined);
  toRaw(obj).prop = 4;
  expect(dummy).toBe(undefined);
  expect(parentDummy).toBe(undefined);
});
```

26. 应该可以避免与自身隐式无限递归循环

```ts
it("should avoid implicit infinite recursive loops with itself", () => {
  const counter = reactive({ num: 0 });

  const counterSpy = jest.fn(() => counter.num++);
  effect(counterSpy);
  expect(counter.num).toBe(1);
  expect(counterSpy).toHaveBeenCalledTimes(1);
  counter.num = 4;
  expect(counter.num).toBe(5);
  expect(counterSpy).toHaveBeenCalledTimes(2);
});
```

27. 应该允许显式递归的原始函数循环。

```ts
it("should allow explicitly recursive raw function loops", () => {
  const counter = reactive({ num: 0 });
  const numSpy = jest.fn(() => {
    counter.num++;
    if (counter.num < 10) {
      numSpy();
    }
  });
  effect(numSpy);
  expect(counter.num).toEqual(10);
  expect(numSpy).toHaveBeenCalledTimes(10);
});
```

28. 应避免与其他效果的无限循环

```ts
it("should avoid infinite loops with other effects", () => {
  const nums = reactive({ num1: 0, num2: 1 });

  const spy1 = jest.fn(() => (nums.num1 = nums.num2));
  const spy2 = jest.fn(() => (nums.num2 = nums.num1));
  effect(spy1);
  effect(spy2);
  expect(nums.num1).toBe(1);
  expect(nums.num2).toBe(1);
  expect(spy1).toHaveBeenCalledTimes(1);
  expect(spy2).toHaveBeenCalledTimes(1);
  nums.num2 = 4;
  expect(nums.num1).toBe(4);
  expect(nums.num2).toBe(4);
  expect(spy1).toHaveBeenCalledTimes(2);
  expect(spy2).toHaveBeenCalledTimes(2);
  nums.num1 = 10;
  expect(nums.num1).toBe(10);
  expect(nums.num2).toBe(10);
  expect(spy1).toHaveBeenCalledTimes(3);
  expect(spy2).toHaveBeenCalledTimes(3);
});
```

29. 应该返回函数新的响应式版本

```ts
it("should return a new reactive version of the function", () => {
  function greet() {
    return "Hello World";
  }
  const effect1 = effect(greet);
  const effect2 = effect(greet);
  expect(typeof effect1).toBe("function");
  expect(typeof effect2).toBe("function");
  expect(effect1).not.toBe(greet);
  expect(effect1).not.toBe(effect2);
});
```

30. 应该发现新的分支自动运行时

```ts
it("should discover new branches while running automatically", () => {
  let dummy;
  const obj = reactive({ prop: "value", run: false });

  const conditionalSpy = jest.fn(() => {
    dummy = obj.run ? obj.prop : "other";
  });
  effect(conditionalSpy);

  expect(dummy).toBe("other");
  expect(conditionalSpy).toHaveBeenCalledTimes(1);
  obj.prop = "Hi";
  expect(dummy).toBe("other");
  expect(conditionalSpy).toHaveBeenCalledTimes(1);
  obj.run = true;
  expect(dummy).toBe("Hi");
  expect(conditionalSpy).toHaveBeenCalledTimes(2);
  obj.prop = "World";
  expect(dummy).toBe("World");
  expect(conditionalSpy).toHaveBeenCalledTimes(3);
});
```

31. 当手动运行时，应该发现新的分支

```ts
it("should discover new branches when running manually", () => {
  let dummy;
  let run = false;
  const obj = reactive({ prop: "value" });
  const runner = effect(() => {
    dummy = run ? obj.prop : "other";
  });

  expect(dummy).toBe("other");
  runner();
  expect(dummy).toBe("other");
  run = true;
  runner();
  expect(dummy).toBe("value");
  obj.prop = "World";
  expect(dummy).toBe("World");
});
```

32. 不应该通过变更一个在非活动分支中使用的属性来触发。

```ts
it("should not be triggered by mutating a property, which is used in an inactive branch", () => {
  let dummy;
  const obj = reactive({ prop: "value", run: true });

  const conditionalSpy = jest.fn(() => {
    dummy = obj.run ? obj.prop : "other";
  });
  effect(conditionalSpy);

  expect(dummy).toBe("value");
  expect(conditionalSpy).toHaveBeenCalledTimes(1);
  obj.run = false;
  expect(dummy).toBe("other");
  expect(conditionalSpy).toHaveBeenCalledTimes(2);
  obj.prop = "value2";
  expect(dummy).toBe("other");
  expect(conditionalSpy).toHaveBeenCalledTimes(2);
});
```

33. 如果传递的函数是一个 effect 函数，则不应该进行双包裹。

```ts
it("should not double wrap if the passed function is a effect", () => {
  const runner = effect(() => {});
  const otherRunner = effect(runner);
  expect(runner).not.toBe(otherRunner);
  expect(runner.raw).toBe(otherRunner.raw);
});
```

34. 单次变更不应该多次运行

```ts
it("should not run multiple times for a single mutation", () => {
  let dummy;
  const obj = reactive<Record<string, number>>({});
  const fnSpy = jest.fn(() => {
    for (const key in obj) {
      dummy = obj[key];
    }
    dummy = obj.prop;
  });
  effect(fnSpy);

  expect(fnSpy).toHaveBeenCalledTimes(1);
  obj.prop = 16;
  expect(dummy).toBe(16);
  expect(fnSpy).toHaveBeenCalledTimes(2);
});
```

35. 应该允许嵌套 effect

```ts
it("should allow nested effects", () => {
  const nums = reactive({ num1: 0, num2: 1, num3: 2 });
  const dummy: any = {};

  const childSpy = jest.fn(() => (dummy.num1 = nums.num1));
  const childeffect = effect(childSpy);
  const parentSpy = jest.fn(() => {
    dummy.num2 = nums.num2;
    childeffect();
    dummy.num3 = nums.num3;
  });
  effect(parentSpy);

  expect(dummy).toEqual({ num1: 0, num2: 1, num3: 2 });
  expect(parentSpy).toHaveBeenCalledTimes(1);
  expect(childSpy).toHaveBeenCalledTimes(2);
  // this should only call the childeffect
  nums.num1 = 4;
  expect(dummy).toEqual({ num1: 4, num2: 1, num3: 2 });
  expect(parentSpy).toHaveBeenCalledTimes(1);
  expect(childSpy).toHaveBeenCalledTimes(3);
  // this calls the parenteffect, which calls the childeffect once
  nums.num2 = 10;
  expect(dummy).toEqual({ num1: 4, num2: 10, num3: 2 });
  expect(parentSpy).toHaveBeenCalledTimes(2);
  expect(childSpy).toHaveBeenCalledTimes(4);
  // this calls the parenteffect, which calls the childeffect once
  nums.num3 = 7;
  expect(dummy).toEqual({ num1: 4, num2: 10, num3: 7 });
  expect(parentSpy).toHaveBeenCalledTimes(3);
  expect(childSpy).toHaveBeenCalledTimes(5);
});
```

36. 应该可观察到 Json 方法

```ts
it("should observe json methods", () => {
  let dummy = <Record<string, number>>{};
  const obj = reactive<Record<string, number>>({});
  effect(() => {
    dummy = JSON.parse(JSON.stringify(obj));
  });
  obj.a = 1;
  expect(dummy.a).toBe(1);
});
```

37. 应该观测到 class 方法的调用

```ts
it("should observe class method invocations", () => {
  class Model {
    count: number;
    constructor() {
      this.count = 0;
    }
    inc() {
      this.count++;
    }
  }
  const model = reactive(new Model());
  let dummy;
  effect(() => {
    dummy = model.count;
  });
  expect(dummy).toBe(0);
  model.inc();
  expect(dummy).toBe(1);
});
```

38. lazy

- 如果 `option.lazy` 存在，则返回 `effect` 但不执行

- 但如果 `lazy` 不存在，则立即执行 `effect()`

```ts
it("lazy", () => {
  const obj = reactive({ foo: 1 });
  let dummy;
  const runner = effect(() => (dummy = obj.foo), { lazy: true });
  expect(dummy).toBe(undefined);

  expect(runner()).toBe(1);
  expect(dummy).toBe(1);
  obj.foo = 2;
  expect(dummy).toBe(2);
});
```

39. 调度器

```ts
it("scheduler", () => {
  let runner: any, dummy;
  const scheduler = jest.fn((_runner) => {
    runner = _runner;
  });
  const obj = reactive({ foo: 1 });
  effect(
    () => {
      dummy = obj.foo;
    },
    { scheduler }
  );
  expect(scheduler).not.toHaveBeenCalled();
  expect(dummy).toBe(1);
  // 应在第一次触发时调用
  obj.foo++;
  expect(scheduler).toHaveBeenCalledTimes(1);
  // 尚未run
  expect(dummy).toBe(1);
  // 手动run
  runner();
  // should have run
  expect(dummy).toBe(2);
});
```

40. 事件：onTrack

```ts
it("events: onTrack", () => {
  let events: DebuggerEvent[] = [];
  let dummy;
  const onTrack = jest.fn((e: DebuggerEvent) => {
    events.push(e);
  });
  const obj = reactive({ foo: 1, bar: 2 });
  const runner = effect(
    () => {
      dummy = obj.foo;
      dummy = "bar" in obj;
      dummy = Object.keys(obj);
    },
    { onTrack }
  );
  expect(dummy).toEqual(["foo", "bar"]);
  expect(onTrack).toHaveBeenCalledTimes(3);
  expect(events).toEqual([
    {
      effect: runner,
      target: toRaw(obj),
      type: TrackOpTypes.GET,
      key: "foo",
    },
    {
      effect: runner,
      target: toRaw(obj),
      type: TrackOpTypes.HAS,
      key: "bar",
    },
    {
      effect: runner,
      target: toRaw(obj),
      type: TrackOpTypes.ITERATE,
      key: ITERATE_KEY,
    },
  ]);
});
```

41. 事件：onTrigger

```ts
it("events: onTrigger", () => {
  let events: DebuggerEvent[] = [];
  let dummy;
  const onTrigger = jest.fn((e: DebuggerEvent) => {
    events.push(e);
  });
  const obj = reactive({ foo: 1 });
  const runner = effect(
    () => {
      dummy = obj.foo;
    },
    { onTrigger }
  );

  obj.foo++;
  expect(dummy).toBe(2);
  expect(onTrigger).toHaveBeenCalledTimes(1);
  expect(events[0]).toEqual({
    effect: runner,
    target: toRaw(obj),
    type: TriggerOpTypes.SET,
    key: "foo",
    oldValue: 1,
    newValue: 2,
  });

  // @ts-ignore
  delete obj.foo;
  expect(dummy).toBeUndefined();
  expect(onTrigger).toHaveBeenCalledTimes(2);
  expect(events[1]).toEqual({
    effect: runner,
    target: toRaw(obj),
    type: TriggerOpTypes.DELETE,
    key: "foo",
    oldValue: 2,
  });
});
```

42. stop

```ts
it("stop", () => {
  let dummy;
  const obj = reactive({ prop: 1 });
  const runner = effect(() => {
    dummy = obj.prop;
  });
  obj.prop = 2;
  expect(dummy).toBe(2);
  stop(runner);
  obj.prop = 3;
  expect(dummy).toBe(2);

  // 停止的 effect 依然可以通过手动调用
  runner();
  expect(dummy).toBe(3);
});
```

43. 停止调度器，不应该再执行了

```ts
it("stop with scheduler", () => {
  let dummy;
  const obj = reactive({ prop: 1 });
  const queue: (() => void)[] = [];
  const runner = effect(
    () => {
      dummy = obj.prop;
    },
    {
      scheduler: (e) => queue.push(e),
    }
  );
  obj.prop = 2;
  expect(dummy).toBe(1);
  expect(queue.length).toBe(1);
  stop(runner);

  // a scheduled effect should not execute anymore after stopped
  // 调度器 effect 在停止后不应再执行
  queue.forEach((e) => e());
  expect(dummy).toBe(1);
});
```

44. 事件：onStop

```ts
it("events: onStop", () => {
  const onStop = jest.fn();
  const runner = effect(() => {}, {
    onStop,
  });

  stop(runner);
  expect(onStop).toHaveBeenCalled();
});
```

45. 停止的 effect 是嵌套在正常的 effect 中

```ts
it("stop: a stopped effect is nested in a normal effect", () => {
  let dummy;
  const obj = reactive({ prop: 1 });
  const runner = effect(() => {
    dummy = obj.prop;
  });
  stop(runner);
  obj.prop = 2;
  expect(dummy).toBe(1);

  // 内部停止 effect 的观测值
  // 将作为依赖关闭跟中外部 effect
  effect(() => {
    runner();
  });
  expect(dummy).toBe(2);

  // 通知外部 effect 运行
  obj.prop = 3;
  expect(dummy).toBe(3);
});
```

46. markRaw，标记原始

- 除非替换掉，否则 effect 对标记的原始数据不起作用

```ts
it("markRaw", () => {
  const obj = reactive({
    foo: markRaw({
      prop: 0,
    }),
  });
  let dummy;
  effect(() => {
    dummy = obj.foo.prop;
  });
  expect(dummy).toBe(0);
  obj.foo.prop++;
  expect(dummy).toBe(0);
  obj.foo = { prop: 1 };
  expect(dummy).toBe(1);
});
```

47. 当 `value` 和 `old value` 两个都是 `NaN`式，不应该被触发

- 本身跟 NaN 有一定关系，这里主要是 `value` 和 `oldValue` 判断的，通过 `hasChanged` 函数判断的

```ts
export const hasChanged = (value: any, oldValue: any): boolean =>
  value !== oldValue && (value === value || oldValue === oldValue);
```

```ts
it("should not be trigger when the value and the old value both are NaN", () => {
  const obj = reactive({
    foo: NaN,
  });
  const fnSpy = jest.fn(() => obj.foo);
  effect(fnSpy);
  obj.foo = NaN; // 非 NaN的话会再执行一次 fnSpy
  expect(fnSpy).toHaveBeenCalledTimes(1);
});
```

48. 当所有数组的长度被 set 到 0 时，应该触发所有 effect 

```ts
it("should trigger all effects when array length is set to 0", () => {
  const observed: any = reactive([1]);
  let dummy, record;
  effect(() => {
    dummy = observed.length;
  });
  effect(() => {
    record = observed[0];
  });
  expect(dummy).toBe(1);
  expect(record).toBe(1);

  observed[1] = 2;
  expect(observed[1]).toBe(2);

  observed.unshift(3);
  expect(dummy).toBe(3);
  expect(record).toBe(3);

  observed.length = 0;
  expect(dummy).toBe(0);
  expect(record).toBeUndefined();
});
```

## effect()

- 返回一个响应式 `ReactiveEffect`
- effect 中的 trigger 函数触发条件之一是，`value` 与 `oldValue` 是否一样，如果一样，则不会执行

## trigger()

如果 target 是原生原型链的东西，则不触发：

- `value` 与 `oldValue` 需要不一样，才可以在 effect 中触发 `trigger` 函数
- `hasKey` 不存在的时候

```ts
const hadKey =
  isArray(target) && isIntegerKey(key)
    ? Number(key) < target.length
    : hasOwn(target, key);
```

## track()
