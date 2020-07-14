# 源码解读@vue/compile-core

    开始时间：2020年1月17日09:53:36
    版本：@vue/compile-core 3.0.0-alpha.2
    源码：https://github.com/vuejs/vue/tree/dev/packages/compiler-core#readme    

## 目录

|-- package.json
```text
|-- api-extractor.json                  // 一个json文件，不知干啥
|-- index.js                            // dev->./dist/compile-core.cjs.js、pro->./dist/compile-core.cjs.prod.js
|-- LICENSE                             //
|-- README.md                           //
|-- package.json                        //
|-- __test__                            // 测试
|-- dist                                // 打包出来的文件
`-- src                                 //
    |-- ast.ts                          //
    |-- codegen.ts                      //
    |-- compile.ts                      //
    |-- errors.ts                       //
    |-- index.ts                        //
    |-- options.ts                      //
    |-- parse.ts                        //
    |-- runtimeHelpers.ts               //
    |-- transform.ts                    //
    |-- transforms                      //
    |   |-- hoistStatic.ts              //
    |   |-- transformElement.ts         //
    |   |-- transformExpression.ts      //
    |   |-- transformSlotOutlet.ts      //
    |   |-- transformText.ts            //
    |   |-- vBind.ts                    //
    |   |-- vFor.ts                     //
    |   |-- vIf.ts                      //
    |   |-- vModel.ts                   //
    |   |-- vOn.ts                      //
    |   |-- vOnce.ts                    //
    |   `-- vSlot.ts                    //
    `-- utils.ts                        //
```

## 对外暴露文件index.ts

暴露：
- **./compile**
    - `baseCompile` 
同时也暴露低等级API和类型声明

- **./options**
    `CompilerOptions`
    - `ParserOptions`
    - `TransformOptions`
    - `CodegenOptions`

- **./parse**
    - `baseParser` 
    - `TextNode`

- **./transform**
    - transform
    - createStructuralDirectiveTransform
    - TransformContext
    - NodeTransform
    - StructuralDirectiveTransform
    - DirectiveTransform
- **./codegen**
    - generate
    - CodegenContext
    - codegenResult
- **errors**
    - ErrorCodes
    - CoreCompilerError
    - CompilerError
    - createCompilerError
- **ast** 语法树，全部暴露
    - 全部
- **utils**
    - 全部
- **runtimeHelpers**
    - registerRuntimeHelpers
 
暴露转换，以便高阶编译器可以导入和扩展它们

- **transform/vModel**
    - transformModel
- **transform/vOn**
    - transformOn

实用程序，但需要重写类型以避免dts依赖于@vue/shared

- **@vue/shared**
    - generateCodeFrame


## 主要功能

- AST vue语法树,虚拟出来的dom
