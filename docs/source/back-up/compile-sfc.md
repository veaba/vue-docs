# 源码解读@vue/compile-sfc

编译`.vue` 单文件组件程序


##  对外暴露的函数

### parse: 解析`.vue`文件
- 如何设置了sourceMap 将会生成SourceMap
    - 由函数`generateSourceMap` 生成
- `warnDuplicateBlock` 警告重复block
- `padContent` 这个是干嘛

### compileTemplate: 编译模板

### compileStyle: 编译style

### compileStyleAsync: 编译异步Style

### SFCParserOptions

### SFCDescriptor

### SFCBlock

### SFCTemplateBlock

### SFCScriptBlock

### SFCStyleBlock

### TemplateCompiler

### SFCTemplateCompileOptions

### SFCTemplateCompileResults

### SFCStyleCompileOptions 

### SFCStyleCompileResults

### CompilerOptions

### CompilerError

### generateCodeFrame


