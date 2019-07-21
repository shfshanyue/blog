# 使用 Grid 进行常见布局

`grid` 布局是W3C提出的一个二维布局系统，通过 `display: grid` 来设置使用，对于以前一些复杂的布局能够得到更简单的解决。本篇文章通过几个布局来对对 `grid` 布局进行一个简单的了解。目前，`grid` 仅仅只有 `Edge`使用前缀能够支持，为了更好地体验，可以使用 Chrome 浏览器，在 `chrome://flags` 开启 ` #enable-experimental-web-platform-features` 选项。

<!--more-->

另外，更多的例子可以前往 [Grid by examples](http://gridbyexample.com/examples/), 更多的用法可以前往 [W3 Specification](https://www.w3.org/TR/css3-grid-layout/),也可以前往 [A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/) 以及 [译文](https://shanyue.tech/post/grid-guide/readme/)

> 2019年2月注：目前 Grid 已被所有主流浏览器所支持

[布局代码示例](https://shanyue.tech/post/grid-layout-common-usage/demo)

原文链接见: [山月的博客](https://shanyue.tech/post/grid-layout-common-usage/readme/)

## 左右固定中间自适应

以前，这需要使用 `negative margin`，`float`, `position` 解决，圣杯布局是一个比较好的解决方案。后来，`flex`横空出世，使用 `flex-grow` 与 `flex-basis` 完成自适应布局。`grid` 布局相比 `flex` 布局更加简单，只需要在 `container` 上设置 `grid-template-columns: 100px auto 100px`。

![](https://shanyue.tech/post/Grid-Layout-Common-Usage/images/1.png)

```css
.container {
  display: grid;
  grid-template-columns: 100px auto 200px;
}
```

## 三等分
以前的方法可以设置 `float: left; width: 33.33333333`，使用 `flex` 可以设置 `flex-basis: 33.33333333`。在 grid 中只需要设置 `grid-template-columns: 1fr 1fr 1fr`
![](https://shanyue.tech/post/Grid-Layout-Common-Usage/images/2.png)
```css
.container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  height: 100px;
  background-color: #feb;
}
```
 
## 三七分
在 grid 中设置 container 为十等分，可以使用 `grid-template-columns: repeat(10, 1fr)`。
`repeat` 为重复10次 `1fr`。`grid-column` 为 `grid-column-start` 与 `grid-column-end` 的缩写，表示起止的 `line`。使用 grid 进行栅格系统的布局也是很简单。
![](https://shanyue.tech/post/Grid-Layout-Common-Usage/images/3.png)

```css
.container {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
}

.column-3 {
  grid-column: 1 / 4;
}

.column-7 {
  grid-column: 4 / 11;
}
```

## 复杂布局
以上几个例子，均是单向布局，`flex` 就能很好的解决，而如下几个布局，均是二维布局，传统布局有些困难。以下示例图，可以在 `container` 上使用 `grid-template-areas`，在 `item` 上设置 `grid-area` 属性来设置复杂布局。
![](https://shanyue.tech/post/Grid-Layout-Common-Usage/images/4.png)
```html
<div class="grid-layout">
  <div class="header">header</div>
  <div class="left">left</div>
  <div class="main">main</div>
  <div class="right">right</div>
  <div class="footer">footer</div>
</div>
```

```css
.container {
  display: grid;
  grid-template-columns: 100px auto 100px;
  grid-template-rows: 40px 300px 50px;
  grid-template-areas: "header header header"
                       "left main right"
                       "footer footer footer";
}

.container .header {
  grid-area: header;
}

.container .footer {
  grid-area: footer;
}

.container .left {
  grid-area: left;
}

.container .right {
  grid-area: right;
}

.container .main {
  grid-area: main;
}
```

## 九宫格
在传统布局中就比较有困难。在 grid 中设置三行三列等宽，并使用 `grid-gap` 设置间隙。
<img src="https://shanyue.tech/post/Grid-Layout-Common-Usage/images/5.png" width="300" height="300">
```css
.container {
  width: 300px;
  height: 300px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-gap: 8px;
  border: 1px solid #fac;
  padding: 8px;
}
```

## 参考
+ [A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)
+ [W3 Specification](https://www.w3.org/TR/css3-grid-layout/)
+ [Grid by examples](http://gridbyexample.com/examples/)
+ [caniuse](http://caniuse.com/)
+ [Grid polyfill](https://github.com/FremyCompany/css-grid-polyfill/)
