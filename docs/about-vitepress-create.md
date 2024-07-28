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

vitepress官方文档：https://vitepress.dev/zh/guide/getting-started


