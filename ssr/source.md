# SSR 的原理

以一个 `hello, world` 进行示例，我们从 SSR 及 CSR 的角度看它们的工作过程。

``` js
function App () {
  return 'hello, world'
}
```

SSR: 在服务器环境中直接渲染组件，计算出所需内容，并向客户端进行输出:

``` html
<body>
  <div id="app">hello, world</div>
</body>
```

CSR: 在浏览器环境中，实际代码如下，所需内容在浏览器中计算并渲染，伪代码如下:

``` html
<body>
  <div id="app"></div>
  <script>
    const html = render(App)
    document.getElementById('app').innerHTML = html
  </script>
</body>
```

正因如此，**服务器渲染的流程中，浏览器可直接获取到最终的 HTML 资源，首次渲染即可得到 title、Description 及主体内容，因此更适合于 SEO。**

> SEO，Search Engine Optimization，搜索引擎优化。

## React SSR

