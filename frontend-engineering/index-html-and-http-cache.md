# index.html 与 http 缓存控制

假设在此之前你已对 http 缓存非常了解，很显然，当我们对静态资源设置 `Cache-Control: max-age=7200` 时，浏览器在两个小时之内将通过缓存读取静态资源，而并不会再次发送请求。

假设我们网站的目录如下，在 `index.html` 中会引用 `main.js` 和 `main.css`，拥有网站 js，css，html 经典的静态资源，

+ `index.html`
+ `main.js`
+ `main.css`

那假设我们对所有静态资源设置均设置成 `Cache-Control: max-age=7200` 会怎么样？

`main.js` 和 `main.css` 肯定会有两个小时的强制缓存，那 `index.html` 呢？

## index.html
