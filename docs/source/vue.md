# Vue 入口

```
├─src
  - dev.ts
  - index.ts
  - runtime.ts
- index.js

```

## src/dev.ts

- 初始化 Vue devTools 支持

```ts
import { setDevtoolsHook, initCustomFormatter } from "@vue/runtime-dom";
import { getGlobalThis } from "@vue/shared";

export function initDev() {
  const target = getGlobalThis();

  target.__VUE__ = true;
  setDevtoolsHook(target.__VUE_DEVTOOLS_GLOBAL_HOOK__);

  if (__BROWSER__) {
    if (!__ESM_BUNDLER__) {
      console.info(
        `You are running a development build of Vue.\n` +
          `Make sure to use the production build (*.prod.js) when deploying for production.`
      );
    }

    initCustomFormatter();
  }
}
```

## src/index.ts

```ts
// This entry is the "full-build" that includes both the runtime
// and the compiler, and supports on-the-fly compilation of the template option.
import { initDev } from "./dev";
import { compile, CompilerOptions, CompilerError } from "@vue/compiler-dom";
import {
  registerRuntimeCompiler,
  RenderFunction,
  warn,
} from "@vue/runtime-dom";
import * as runtimeDom from "@vue/runtime-dom";
import { isString, NOOP, generateCodeFrame, extend } from "@vue/shared";
import { InternalRenderFunction } from "packages/runtime-core/src/component";

__DEV__ && initDev();

const compileCache: Record<string, RenderFunction> = Object.create(null);

function compileToFunction(
  template: string | HTMLElement,
  options?: CompilerOptions
): RenderFunction {
  if (!isString(template)) {
    if (template.nodeType) {
      template = template.innerHTML;
    } else {
      __DEV__ && warn(`invalid template option: `, template);
      return NOOP;
    }
  }

  const key = template;
  const cached = compileCache[key];
  if (cached) {
    return cached;
  }

  if (template[0] === "#") {
    const el = document.querySelector(template);
    if (__DEV__ && !el) {
      warn(`Template element not found or is empty: ${template}`);
    }
    // __UNSAFE__
    // Reason: potential execution of JS expressions in in-DOM template.
    // The user must make sure the in-DOM template is trusted. If it's rendered
    // by the server, the template should not contain any user data.
    template = el ? el.innerHTML : ``;
  }

  const { code } = compile(
    template,
    extend(
      {
        hoistStatic: true,
        onError(err: CompilerError) {
          if (__DEV__) {
            const message = `Template compilation error: ${err.message}`;
            const codeFrame =
              err.loc &&
              generateCodeFrame(
                template as string,
                err.loc.start.offset,
                err.loc.end.offset
              );
            warn(codeFrame ? `${message}\n${codeFrame}` : message);
          } else {
            /* istanbul ignore next */
            throw err;
          }
        },
      },
      options
    )
  );

  // The wildcard import results in a huge object with every export
  // with keys that cannot be mangled, and can be quite heavy size-wise.
  // In the global build we know `Vue` is available globally so we can avoid
  // the wildcard object.
  const render = (__GLOBAL__
      ? new Function(code)()
      : new Function("Vue", code)(runtimeDom)) as RenderFunction;

    // mark the function as runtime compiled
  (render as InternalRenderFunction)._rc = true;

  return (compileCache[key] = render);
}

registerRuntimeCompiler(compileToFunction);

export { compileToFunction as compile };
export * from "@vue/runtime-dom";
```

## src/runtime.ts

```ts
// This entry exports the runtime only, and is built as
// `dist/vue.esm-bundler.js` which is used by default for bundlers.
import { initDev } from "./dev";
import { warn } from "@vue/runtime-dom";

__DEV__ && initDev();

export * from "@vue/runtime-dom";

export const compile = () => {
  if (__DEV__) {
    warn(
      `Runtime compilation is not supported in this build of Vue.` +
        (__ESM_BUNDLER__
          ? ` Configure your bundler to alias "vue" to "vue/dist/vue.esm-bundler.js".`
          : __ESM_BROWSER__
          ? ` Use "vue.esm-browser.js" instead.`
          : __GLOBAL__
          ? ` Use "vue.global.js" instead.`
          : ``) /* should not happen */
    );
  }
};
```

## index.js

```js
"use strict";

if (process.env.NODE_ENV === "production") {
  module.exports = require("./dist/vue.cjs.prod.js");
} else {
  module.exports = require("./dist/vue.cjs.js");
}
```
