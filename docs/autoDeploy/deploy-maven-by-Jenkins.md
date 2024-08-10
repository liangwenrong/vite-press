# 使用Jenkins自动打包发布springboot

> 假设你已经熟悉Jenkins配置git的webhooks的部分
> 
> 下面从Jenkins使用maven打包并发布到服务器
> 
> 注意：本文中Jenkins与服务器为同个主机（否则Jenkins需要使用ssh登录服务器发布）


## 前置条件

::: info
已安装jdk（版本21）
:::

::: info
已安装Jenkins（比如war包安装）并启动可访问
:::

::: info
已安装maven（推荐3.x版本）并配置全局MAVEN_HOME到系统变量path
:::

::: info
已有git仓库代码，并设置了Jenkins访问
:::

## 安装插件和全局配置

### Jenkins安装maven插件

进入Jenkins插件安装路径：`/manage/pluginManager/available`：

> Dashboard > Manage Jenkins > Plugins

搜索`maven`，安装`Maven Integration plugin` 和 `Pipeline Maven Integration Plugin`

### Jenkins全局配置

进入系统配置路径：

> Dashboard > Manage Jenkins > Tools

配置`Maven Configuration`

- 选择`Settings file in filesystem`=`File path(/usr/local/maven-3.9.8/conf/settings.xml)`

配置`JDK installations`

- 填入`JAVA_HOME`路径(`/usr/local/jdk/jdk-21`)

配置`Maven installations`

- 填入`MAVEN_HOME`路径(`/usr/local/maven-3.9.8`)

永久配置BUILD_ID值(防止Jenkins构建完成后杀死启动的子进程)
- 打开Manage Jenkins -> Configure System -> Global properties 全局属性
- 添加Environment variables：
- Name：`BUILD_ID` ，value：随便比如`allow_sub_process`
- see [Jenkins : Spawning processes from build](https://wiki.jenkins.io/display/JENKINS/Spawning+processes+from+build)


## 新建项目，配置maven打包

### 选择`构建一个maven项目`

### 配置git、以及触发钩子（略）


### 步骤：Build
默认 Root POM 填 `pom.xml`

Goals and options 填 `clean package -Dmaven.test.skip=true`


## 把打包好的jar复制发布

### 前置操作：在jar运行目录写一个备份脚本

```sh
cd jar运行目录
touch bakup.sh
chmod +x bakup.sh # 运行权限
vi bakup.sh

# 写入内容 [ -f 判断文件是否存在 ] && 存在则mv ，并且exit 0 成功
[ -f springboot-admin-0.0.1-SNAPSHOT.jar ] && mv -f springboot-admin-0.0.1-SNAPSHOT.jar  springboot-admin-0.0.1-SNAPSHOT.jar.bak
exit 0

# 同理 ，写一个start.sh
touch start.sh
chmod +x start.sh # 运行权限
vi start.sh
# 写入内容 
nohup java -jar springboot-admin-0.0.1-SNAPSHOT.jar > nohup.log  2>&1 &

#同理， 写一个stop.sh
touch stop.sh
chmod +x stop.sh # 运行权限
vi stop.sh
#写入内容
ps -ef | grep springboot-admin-0.0.1-SNAPSHOT.jar | grep -v grep | awk '{print $2}' | xargs kill -9
exit 0
```


### 配置Jenkins发布重启

**Post Steps** 选择：
 - Run only if build succeeds

添加一个`Add post-build step`，选择
- Execute shell


```sh
# 在shell中填写：
from=`pwd`
to=/opt/web/springboot/springboot-admin/

# 第一步 备份
cd $to && ./bakup.sh

# 第二步 复制jar
cd $from && cp ./target/springboot-admin-0.0.1-SNAPSHOT.jar $to
 
# 第三步 重启jar
cd $to && ./stop.sh
cd $to && ./start.sh

tail -f nohup.log &  sleep 10

echo finish!!!!!!!!!
```

## 构建失败，回滚

::: tip

构建失败，应该把备份文件回滚，并发送告警信息。

:::

操作步骤：略。
