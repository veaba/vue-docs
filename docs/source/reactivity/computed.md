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
