# 前端node项目自动化部署方案-bat脚本

> 本文bat脚本属于本地构建和推送到git远程仓库

## node项目构建、部署的3个步骤

1. 代码审查通过，提交代码记录到git
2. 在代码根目录下，执行npm run build，生成可发布文件夹（静态）
3. 复制发布文件夹到服务器指定目录，开启http(s)访问（比如nginx网站代理）


## 本地构建 vs 远程构建

::: info
两种构建部署方式都包含`node项目构建、部署的3个步骤`。
但是实现步骤顺序和方式有所差异。
:::

### 本地构建和远程构建对比

| 本地构建                                         | 远程构建                                   |
|:---------------------------------------------|:---------------------------------------|
| 在本地端build<br/>依赖本地构建环境                       | 在远程端build<br/>依赖远程构建环境                 |
| 本地已产生可发布最种代码<br/>只需要把静态代码上传至指定服务器位置          | 本地只负责提交源码到git远程仓库<br/>服务器端需要从源码开始编译并发布 |
| 因此，在本地执行bat脚本完成构建和推送代码到git<br/>并由远程服务器拉取代码发布 | 因此，在远程服务器端监听git提交触发自动构建<br/>并发布             |

## 远程通过GitHub Action或者Jenkins部署（略）

### 1、GitHub Action部署的思路

> 比如[使用GitHub Action自动发布博客](./deploy-by-github-action.md)提到的就是使用GitHub Action自动化构建node编译

- 设置git push钩子，推送代码后自动触发构建和发布流程
    - 具体不赘述，主要说明两点：
      - GitHub Action流程中主要是组装别人写好的脚本，比如使用`uses: actions/checkout@v4`来检出代码，使用`uses: actions/deploy-pages@v4`来发布
      - GitHub Action构建完毕后也需要实现`复制上传到服务器`这个最后的步骤，可以通过ssh脚本或者推送到git完成

### 2、Jenkins部署的思路

- 设置git push钩子，推送代码后自动触发构建和发布流程
  - 拉取代码到workspace目录下
  - Jenkins已安装nodejs脚本，在根目录下根据npm的`package.json`，执行`npm install ，npm run build`（参考[文章：Jenkins部署前端应用](https://cloud.tencent.com/developer/article/1578400)）
  - 发布打包好的代码到指定目录，使用脚本命令，或者使用`rsync`之类的工具，参考[rsync 用法教程](https://www.ruanyifeng.com/blog/2020/08/rsync.html)

## 使用本地bat脚本自动化构建，并把可发布代码推送到git远程

::: info

其实，在发布版本时，使用自动化后触发后并不是就可以睡大觉不用等构建完成。

自动化只是省去了人工每次执行相同的打包的繁琐操作。

等待自动化构建发布完成后，有必要确认构建结果是成功并且生成环境中发布的功能正常。

:::

::: tip

因此，在本地运行构建脚本还是在远程自动化构建的主要区别在于：远程构建不依赖每个人各自的本地环境，能够统一管理。
:::

### 第一步，提交审查通过的最终源码到git

::: tip

虽然本地构建可以不用提前提交git代码，但这绝对不是一个好习惯。

发布记录最好跟代码提交记录关联，这个约定能够很好避免自己忘记打包发布了哪一个版本的代码。
:::

### 第二步，git push钩子触发本地bat脚本执行自动化构建和发布



### 第三步，bat脚本要做的事情

#### 先粘贴bat脚本，一览：
```cmd

@echo off

set log=%1
if "%log%"=="" (for /F %%i in ('git rev-parse --short HEAD') do ( set log=%%i))

echo your commit msg is : %log%

set build=D:\coding\for-vue\lwrong-home\build
cd  %build%\..\

echo building project for you.........

call npm run build

echo build done! remove the old directory........

echo %build%

del /f /s /q  %build%\assets\*.*
del /f /s /q  %build%\database\*.*
del /f /s /q  %build%\images\*.*

cd  %build%\

echo timeout 3s
timeout /t 3 /nobreak

rd /s /q  %build%\assets
rd /s /q  %build%\database
rd /s /q  %build%\images

echo now copy all files ,auto overwrite all ............

xcopy /S /F /Y   D:\coding\for-vue\lwrong-home\dist\    D:\coding\for-vue\lwrong-home\build\

echo git add .  git commit -m '%log%' git push ............

cd %build%

git add .

git commit -m '%log%'

git push

echo done!!!!!!!!!!!!!!

pause


```

**解析：**

1. 因为构建好之后是要把可发布代码推送到git远程仓库，所以先获取git commit要填入的信息
    - 先接收bat脚本的第一个参数`%1`，如果为空（没传参数），则设置为git 源码的最新的提交记录的commit hash(ID)
2. bat脚本是在源码根目录下执行，所以进入根目录：`cd  %build%\..\`（自己修改路径）
3. 直接构建`call npm run build`，使用 call 是因为不然执行完npm命令后会直接退出
4. 使用del、rd命令删除目标目录中的，之前发布过的目录和代码文件
    - 删除的不是打包之后的`（你配置的）dist`目录，而是将要把dist复制过去的目录，先清空
    - 不要误删里面的.git目录，因为此目录是推送可发布静态代码的git仓库
5. 清空目标目录后，使用xcopy复制项目打包好的代码过去
6. `cd %build%`进入目标目录，使用git命令添加、提交、推送可发布代码
7. 脚本中有个`timeout /t 3 /nobreak`睡眠3s，不要也不影响，用来等待文件释放。

## 最终，远程服务器拉取可发布代码，进行发布

::: tip 为什么不在本地直接上传部署

其实在本地可以直接使用ssh脚本登录服务器并上传代码到指定位置发布。
但是一次git push有多个提交记录，无法管理服务器每次发布的版本记录。

而通过Jenkins等CI/CD工具，每次推送代码都会产生一个构建记录。
:::

Jenkins被git webhooks触发自动构建的配置不再赘述，主要就是拉取代码后把发布内容复制到nginx代理的目录下。


