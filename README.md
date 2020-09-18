![Vue-docs CI](https://github.com/veaba/vue-docs/workflows/Vue-docs%20CI/badge.svg)

# Vue 3 docs

> 个人仿照Vue 2 版本的docs 进行学习性质的描述Vue 3的docs


## 指引
- [Vue.js](https://cn.vuejs.org/)

## How to join ? 

```shell

# clone this repo
git clone  https://github.com/veaba/vue-docs.git 

# install dependent
npm install

# dev
npm run dev 

# build
npm run build

```

## about 
- 个人学习Vue 3.0 项目
- 与官方Vue 3 docs 没半毛钱关系
- 增加Github actions 部属
- 启动域名 vue.datav.ai、vue3.datav.ai


## CI部署
 
### 生成Depoly key 公钥和secrets 秘钥

在Git bash中执行一下命令，注意改下邮箱. 

```bash 
ssh-keygen -t rsa -b 4096 -C "your@email.com" -f gh-pages -N ""
```

生成两个文件：
gh-pages(secret)、gh-pages.pub（depoly）

- 将gh-pages.pub里面的内容粘贴到仓库的settings->Deploy key,可以起个名字
- 将gh-pages 里面的内容粘贴到仓库的settings->Secrets，起个英文的KEY，后续要使用这个字段

### 配置Secrets配置到 .github/workflows/xxx.yml里面去

```yml
name: Vuepress CI

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [12.x]

    steps:
      - uses: actions/checkout@v1
      - name: 步骤：第一步 Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v1
        with:
          node-version: ${{ matrix.node-version }}
      - name: 步骤：第二步，安装依赖
        run: |
          npm install
          npm run build --if-present
        env:
          CI: true
      - name: 步骤：第三步：Deploy,部署
        uses: peaceiris/actions-gh-pages@v2.5.0
        env:
          ACTIONS_DEPLOY_KEY: ${{ secrets.ACTIONS_ACCESS_TOKEN_VUE_DOCS_CI }}
          PUBLISH_BRANCH: gh-pages
          PUBLISH_DIR: ./docs/.vuepress/dist

```

