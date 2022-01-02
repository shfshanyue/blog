# 单页应用的路由与永久缓存优化

## 路由

使用 `react-dom` 为单页应用添加一个路由，由于路由不是本专栏的核心内容，省略掉如何添加路由，最终代码如下。

``` jsx
import logo from './logo.svg';
import './App.css';
import { Routes, Route, Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>当前在 Home 页面</h1>
        <Link to="/about" className="App-link">About</Link>
      </header>
    </div>
  )
}

function About() {
  return (
    <div>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1>当前在 About 页面</h1>
        <Link to="/" className="App-link">Home</Link>
      </header>
    </div>
  )
}

function App() {
  return (
    <div>
      <Routes>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
      </Routes>
    </div>
  );
}

export default App;
```

此时拥有两个路由:

1. `/`，首页
1. `/about`，关于页面

## 重新部署单页应用，此时路由有问题

根据上篇文章的 `docker-compose` 配置文件重新部署页面。

``` bash
$ docker-compose up --build
```

此时访问 `https://localhost:4000/about`，将会显示 404。其实在本地通过 `serve` 部署，直接访问 `/about` 页面也会 404。

其实道理很简单：**在静态资源中并没有 `about/about.html` 该资源，因此返回 404 Not Found。而在单页应用中，`/about` 是由前端通过 `history API` 进行控制。**

解决方法也很简单：**在服务端页面将所有路由均指向 `index.html`，而单页应用再通过 `history API` 控制当前路由显示哪个页面。**

## nginx 的 try_files 指令

在 nginx 中，可通过 try_files 指令将所有页面导向 `index.html`。

``` conf
location / {
    # 如果资源不存在，则回退到 index.html
    try_files  $uri $uri/ /index.html;  
}
```

此时，可解决服务器端路由问题。

## 永久缓存

在 CRA 应用中，`/build/static` 目录均由 webpack 构建产生，资源路径将会带有 hash 值。

此时可通过 `expires` 对它们配置一年的长期缓存。它实际上是配置了 `Cache-Control: max-age=31536000` 的响应头。

``` conf
location /static {
    expires 1y;
}
```

## nginx 配置文件

`nginx.conf` 文件需要维护在项目当中，最终配置如下。

``` conf
server {
    listen       80;
    server_name  localhost;

    root   /usr/share/nginx/html;
    index  index.html index.htm;

    location / {
        # 解决单页应用服务端路由的问题
        try_files  $uri $uri/ /index.html;  

        # 非带 hash 的资源，需要配置 Cache-Control: no-cache，避免浏览器默认为强缓存
        expires -1;
    }

    location /static {
        # 带 hash 的资源，需要配置长期缓存
        expires 1y;
    }
}
```

## Dockerfile 配置文件

``` bash
FROM node:14-alpine as builder

WORKDIR /code

# 单独分离 package.json，是为了 yarn 可最大限度利用缓存
ADD package.json yarn.lock /code/
RUN yarn

# 单独分离 public/src，是为了避免 ADD . /code 时，因为 Readme/nginx.conf 的更改避免缓存生效
# 也是为了 npm run build 可最大限度利用缓存
ADD public /code/public
ADD src /code/src
RUN npm run build

# 选择更小体积的基础镜像
FROM nginx:alpine
ADD nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder code/build /usr/share/nginx/html
``` 

## docker-compose 配置文件

访问 `https://localhost:4000/about` 可直接访问成功

## 检验长期缓存配置

访问 `https://localhost:4000` 页面，打开浏览器控制台网络面板。

此时对于带有 hash 资源， `Cache-Control: max-age=31536000` 响应头已配置。

此时对于非带 hash 资源， `Cache-Control: no-cache` 响应头已配置。


