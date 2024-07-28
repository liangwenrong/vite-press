## 引子

### 1
部署前端时，把生成好的dist文件夹复制到服务器上，然后使用nginx静态代理做成一个可访问的静态网站。

这个网站的部署，只需把文件上传到指定的服务器位置，所以手动自己每次上传下也不是很烦。

### 2

如果是部署到GitHub page，那么直接在代码仓库中配置`GitHub page`，每次push代码后，GitHub会自动更新到GitHub page的网站中。

这个把代码拉取上传（部署）到服务器的操作，虽然简单，但也算是一个action了，也就是需要服务器cpu的支持了。

### 3

对于后端代码的部署，比如springboot，人工部署的话，需要先把代码编译打包，把可运行文件上传到服务器，然后启动后端服务。

如果使用持续集成CI、持续部署CD的话，就可以通过比如服务器上安装Jenkins，它会自动做：
1. push代码后webhook触发Jenkins的CI/CD action
2. Jenkins在本地指定位置拉取最新代码
3. Jenkins使用指定环境配置编译打包代码
4. Jenkins把打包好的可运行程序放到本地或者远程服务器上跑起来

### 4

Jenkins需要安装在自己服务器上，

Jenkins环境的cpu性能、空间大小、网速等等都是基于自己的服务器，

**而Github Action呢**？免费使用？性能还好？


## Github Action能否免费用于生产环境？


### 第一个维度：免费运行时长

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/5792d3e52f85424088cc4050737e59c5~tplv-73owjymdk6-watermark.image?policy=eyJ2bSI6MywidWlkIjoiMTIxODczMTUyMzcwNjAzOSJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1722289966&x-orig-sign=DF1PB2RvPo09%2FhxS%2BVqE4aIe8k8%3D)

从上图看到，Github Action提供2000分钟的免费运行时长，这个运行时长跟CPU性能有很大关系（反比例），查询文档估计提供的是Ubuntu 2核cpu。

一次打包估计十来分钟内，也就是说一个月可以执行一百多次，应该是够了的。

### 第二个维度：免费存储额度计算：

![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/4a9f3d47d744414f821c85b8b00355d3~tplv-73owjymdk6-watermark.image?policy=eyJ2bSI6MywidWlkIjoiMTIxODczMTUyMzcwNjAzOSJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1722290297&x-orig-sign=67gp2ML8MMbfQ4vDBm29gQjgSDw%3D)

看不懂，

500Mb的免费额度，一般来说前后端项目的总体积就在几百M之间，

如果是按项目占用空间来算，那么每次执行一个项目，是不会超出这个额度。执行完之后删除空间占用，再执行下一个。


### 第三个维度：可靠性
1. 执行action时间有无保证，是否稳定
2. GitHub的网络是否稳定通畅
3. 安全问题，私有仓库打包发布到生产服务器，里面配置了密钥是否会泄露

#### 如果打包空间不够，或者性能不佳，或者安全无保障，或者需要付费才能满足需求，那么对比像Jenkins这样的工具GitHub action的优势是什么呢？

#### 不管怎样，使用Github Action还是可以做很多事情的，比如：
1. 执行一些服务器端命令
2. 自动化打包node工程，并把成品发布

## 使用Github Action打包发布一个vitepress生成的静态网页网站

#### 准备博客项目

vitepress官方文档：https://vitepress.dev/zh/guide/getting-started


```bash

npm init

npm add -D vitepress

npx vitepress init

git init
```

然后添加.gitignore文件

```
.idea

node_modules

docs/.vitepress/cache
docs/.vitepress/dist
```

配置docs/.vitepress/config.js的左侧导航：
```js
import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "架设个人网站",
  description: "关于架设个人网站的一切...",
  base: '/vite-press/', //发布的网站地址的项目根目录
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
/*    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],*/

    sidebar: [
      {
        text: '作者序',
        items: [
          { text: '想法的由来', link: '/' },
          { text: '关于此博客的搭建', link: '/about-vitepress-create' }
        ]
      },
      {
        text: '第一步：vue3的搭建',
        items: [
          { text: '起因：为了找工作', link: '/vue3/for-jobs' }
        ]
      }
    ],

/*    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]*/
  }
})
```

上传到GitHub


#### 配置GitHub action

参考：https://vitepress.dev/zh/guide/deploy#github-pages

```deploy.yml
# 构建 VitePress 站点并将其部署到 GitHub Pages 的示例工作流程
#
name: Deploy VitePress site to Pages

on:
  # 在针对 `main` 分支的推送上运行。如果你
  # 使用 `master` 分支作为默认分支，请将其更改为 `master`
  push:
    branches: [master]

  # 允许你从 Actions 选项卡手动运行此工作流程
  workflow_dispatch:

# 设置 GITHUB_TOKEN 的权限，以允许部署到 GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# 只允许同时进行一次部署，跳过正在运行和最新队列之间的运行队列
# 但是，不要取消正在进行的运行，因为我们希望允许这些生产部署完成
concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  # 构建工作
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0 # 如果未启用 lastUpdated，则不需要
      - uses: pnpm/action-setup@v3 # 如果使用 pnpm，请取消注释
        with:
          version: 9
      # - uses: oven-sh/setup-bun@v1 # 如果使用 Bun，请取消注释
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm # 或 npm / yarn
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Install dependencies
        run: pnpm install # 或 npm ci / yarn install / bun install
      - name: Build with VitePress
        run: pnpm run docs:build # 或 npm run docs:build / yarn docs:build / bun run docs:build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: docs/.vitepress/dist

  # 部署工作
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

```

可以看到，打包，发布，都成功了：
![image.png](https://p0-xtjj-private.juejin.cn/tos-cn-i-73owjymdk6/e9ac8b4f22d44eceb69802fe62cf3539~tplv-73owjymdk6-watermark.image?policy=eyJ2bSI6MywidWlkIjoiMTIxODczMTUyMzcwNjAzOSJ9&rk3s=e9ecf3d6&x-orig-authkey=f32326d3454f2ac7e96d3d06cdbb035152127018&x-orig-expires=1722297063&x-orig-sign=adaVpfart%2Bh1TbmXoq49KSlt0dk%3D)
