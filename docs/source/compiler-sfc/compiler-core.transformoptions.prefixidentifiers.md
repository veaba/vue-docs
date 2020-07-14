<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@vue/compiler-core](./compiler-core.md) &gt; [TransformOptions](./compiler-core.transformoptions.md) &gt; [prefixIdentifiers](./compiler-core.transformoptions.prefixidentifiers.md)

## TransformOptions.prefixIdentifiers property

Transform expressions like {<!-- -->{ foo }<!-- -->} to `_ctx.foo`<!-- -->. If this option is false, the generated code will be wrapped in a `with (this) { ... }` block. - This is force-enabled in module mode, since modules are by default strict and cannot use `with`  mode === 'module'

<b>Signature:</b>

```typescript
prefixIdentifiers?: boolean;
```