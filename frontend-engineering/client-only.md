# 前后端分离

强大的分裂感。现在使用 React 开发业务，但是这里边 Component 我来写，你来负责 CSS。

## 前后端未分离时开发方式

+ controller
  + user
+ views
  + user

``` js
app.get('/users/:userId', ctx => {
  ctx.render('views/user.html', {
    userId: ctx.userId
  })
})
```

``` html
<% include header.html %>
<body>
  <div class="user">
    <%- userId %>
  </div>
</body>
```

## 前后端未分离时的部署方案 

## 前后端分离

``` js
app.get('/api/users/:userId', ctx => {
  ctx.json({
    id: userId
  })
})
```

``` html
<body>
  <div class="user"></userId>
</body>
<script>
  const userId = getUserIdByURL(location.href)
  fetch(`/api/users/${userId}`)
    .then(res => res.json())
    .then(user => {
      document.getElementById('user').innerText = user.id
    })
</script>
```

由于 set-cookie 的需要，`/etc/host`

``` bash
local.shanyue.tech 127.0.0.1
```

## 前后端分离后部署方案

静态资源服务器

``` bash
$ serve .

$ http-server .
```

在线上使用性能更加强大的 `nginx`。

``` conf
server {
  listen 80;
  server_name shanyue.tech;

  location / {
    # 使用 nginx 托管静态资源
    try_files $uri $uri/ /index.html;
  }
}
```

## Node 中间层: 进一步前后端分离

`BFF`，`Backend for Frontend`，狭义上来讲为前端工程师使用 Node Server 所写的介于前端与后端的部分。

Client -> Server

Client -> BFF -> Server

+ 鉴权
+ 缓存
+ 限流
+ 代理
+ 日志
