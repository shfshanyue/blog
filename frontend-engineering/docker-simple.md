# 如何使用 docker 部署前端

使用 `docker` 部署前端最大的好处是隔离环境，单独管理：

1. 前端项目依赖于 Node v16，而宿主机无法满足依赖，使用容器满足需求
1. 前端项目依赖于 npm v8，而宿主机无法满足依赖，使用容器满足需求
1. 前端项目需要将 8080 端口暴露出来，而容易与宿主机其它服务冲突，使用容器与服务发现满足需求

## 使用 docker 部署前端

假设本地跑起一个前端项目，需要以下步骤，并最终可在 `localhost:8080` 访问服务。

``` bash
$ npm i
$ npm run build
$ npm start
```

**那在 docker 中部署前端，与在本地将如何将项目跑起来步骤大致一致**，一个 Dockerfile 如下

``` dockerfile
# 指定 node 版本号，满足宿主环境
FROM node:16-alpine

# 指定工作目录，将代码添加至此
WORKDIR /code
ADD . /code

# 如何将项目跑起来
RUN npm install
RUN npm run build
CMD npm start

# 暴露出运行的端口号，可对外接入服务发现
EXPOSE 8080
```

此时，我们使用 `docker build` 构建镜像并把它跑起来。

``` bash
# 构建镜像
$ docker build -t fe-app .

# 运行容器
$ docker run -it --rm fe-app
```

恭喜你，能够写出以上的 Dockerfile，这说明你对 Docker 已经有了理解。但其中还有若干问题，我们对其进行一波优化

1. 使用 `node:16` 作为基础镜像过于奢侈，占用体积太大，而最终产物 (js/css/html) 无需依赖该镜像。可使用更小的 nginx 镜像做多阶段构建。
1. 多个 RUN 命令，不利于 Docker 的镜像分层存储。*可合并为一个 RUN 命令*
1. 每次都需要 `npm i`，可合理利用 Docker 缓存，ADD 命令中内容发生改变将会破坏缓存。可将 package.json 提前移至目标目录，只要 *package.json/lockfile* 不发生变动，将不会重新 `npm i`

优化后 Dockerfile 如下:

``` dockerfile
FROM node:16-alpine as builder

WORKDIR /code

ADD package.json package-lock.json /code/
RUN npm install

ADD . /code

RUN npm run build 

# 选择更小体积的基础镜像
FROM nginx:alpine

# 将构建产物移至 nginx 中
COPY --from=builder code/build/ /usr/share/nginx/html/
```