---
title: Canvas 与 SVG 画图对比小记
date: 2018-07-23
thumbnail: ""
categories:
  - 前端
  - 后端
tags:
  - css
  - canvas
  - svg
---

画影图形指描画犯人面影，悬赏通缉。这里用法明显有问题，不过取其表义而已。

在一个前端看来，画图有三种方法，Cavas，SVG 以及 CSS。至于三者优劣，将在此针对各种图形做逐一比较，有方，圆，椭圆，扇形，多边形，渐变，文本处理以及动画

以下是在 codepen 的代码以及实际效果地址，可打开实际效果地址进行调试

+ [codepen](https://codepen.io/shanyue/pen/bYBMjY)
+ [codepen live](https://s.codepen.io/shanyue/debug/bYBMjY/bYAdyeGbWxqk)

<!--more-->

## Stroke and Fill

描边与填充是图形的基本属性。

### CSS

在 CSS 中是 `border-color` 以及 `background-color` 属性。

```css
.rect {
  border: 1px solid #fff;
  background-color: #000;
  width: 100px;
  height: 100px;
}
```

### SVG

在 SVG 中是 `fill` 和 `stroke`。可以直接作为 `element` 的属性，另外也可以写到 css 样式中

```svg
<rect width="100" height="100" fill="#fff" stroke="#000"></rect>
```

也可以作为 css 样式

```css
.rect {
  fill: #fff;
  stoke: #000;
}
```

**除了基本的描边，SVG 也有以下属性，此是 canvas 以及 css 所不及的**

+ stroke-dasharray
+ stroke-dashoffset
+ stroke-linecap
+ stroke-linejoin

### Canvas

在 Canvas 中，是 `fillStyle` 及 `strokeStyle` 属性。

```javascript
const canvas = document.getElementById('rect')
const ctx = canvas.getContext('2d')

ctx.fillStyle = '#000'
ctx.strokeStyle = '#fff'
ctx.fillRect(0, 0, 100, 100)
ctx.fillRect(115, 0, 100, 100)
```

## 矩形

### CSS

不作介绍

```css
.rect {
  width: 100px;
  height: 100px;
  border-radius: 15px;
}
```

### SVG

```svg
<svg>
  <rect width="100" height="100" rx="15" ry="15"></rect>
</svg>
```

由 `rx` 及 `ry` 设置圆角矩形大小

### Canvas

```javascript

const canvas = document.getElementById('rect')
const ctx = canvas.getContext('2d')

ctx.fillRect(0, 0, 100, 100)
ctx.fillRect(115, 0, 100, 100)
```

在效果地址中可以看到没有使用 Canvas 绘出的圆角矩形， **Canvas 没法直接通过矩形的 API 直接绘制出圆角矩形，这是它的硬伤**

以下是通过其它方法绘制出来的圆角矩形，略(非常)麻烦

[CSS3 border radius to HTML5 Canvas](https://stackoverflow.com/questions/13482322/css3-border-radius-to-html5-canvas)

## 多边形

多边形由多个点连接而成，只需要确定多个点的位置，便能确定多边形。在效果页面中，使用五角星作为示例

构成五角星的五个点分别是 `[[81, 95], [0, 36], [100, 36], [19, 95], [50, 0]]`

### CSS

### SVG

svg 使用元素 `polyline` 以及 `polygon`。`polygon` 会把终点和起点连接起来，形成闭合图形。

`points` 属性指连成多边形的点。

`fill-rule` 决定哪里是图形的内部。`nonzero` 代表如果被路径所包围，即是内部，`fill-rule` 代表从某一点出发，到无限远处，如果只途经奇数条边，则在图形内部。因为效果地址中的五角星是空心的。

```svg
<polyline points="81, 95 0, 36 100, 36 19, 95 50, 0" fill-rule="evenodd"></polyline>
```

### Canvas

canvas 需要使用 `path` 来绘制路径。

使用 `moveTo` 及 `lineTo` 来绘制直线，`closePath` 代表把终点和起点连接起来，相当于 svg 的 `polygon`。

canvas 的 `fill` 方法也有 `fillRule` 属性。

```javascript
const canvas = document.getElementById('star')
const ctx = canvas.getContext('2d')

const drawStar = ({ stroke = false, fillRule = 'nonzero' } = {}) => {
  ctx.beginPath()
  ctx.moveTo(81, 95)
  ctx.lineTo(0, 36)
  ctx.lineTo(100, 36)
  ctx.lineTo(19, 95)
  ctx.lineTo(50, 0)
  ctx.closePath()
  // fill 的时候自动 closePath
  stroke ? ctx.stroke() : ctx.fill(fillRule)
}

drawStar({ stroke: true })

ctx.translate(115, 0)
drawStar()

ctx.translate(115, 0)
drawStar()

ctx.translate(115, 0)
drawStar({ fillRule: 'evenodd' })
```

## 圆，扇形和椭圆

圆的标准方程为 `(x-a)²+(y-b)²=r²`，其中 (a, b) 为圆心，r 为半径。只要确定了圆心和半径便能确定一个圆。

扇形为圆周的一部分以及对应的圆周角组成，是圆的一部分。

### CSS

### SVG

svg 使用元素 `circle` 代表圆，`(cx, cy)` 为圆心，`r` 为半径。使用元素 `ellipse` 代表椭圆，`rx` 和 `ry` 代表长轴和短轴。

```svg
<circle cx="50" cy="50" r="49"></circle>
<ellipse cx="50" cy="50" rx="30" ry="40"></ellipse>
```

svg 对于扇形没有现成的元素，需要使用 `path` 来作扇形。当然 canvas 除了矩形剩余图形都是使用 `path` 来绘制出来。

`path` 中的 `d` 代表路径，`d` 有诸多属性

+ M，Move，与 canvas 的 move 方法一致
+ L，Line，与 canvas 的 line 方法一致
+ A，Arc，七个参数 `(x, y, r, d1, d2, direction)` ，A 用来画椭圆，详细参考 [MDN SVG Paths](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths)。

**如果使用 svg 画扇形的话，需要确认圆弧的两个端点以及圆心的位置，远没有 canvas 直接使用圆心角确定一个圆方便地多**

```svg
<path d="M 50 50 L 99 50 A 49 49 0 1 0 50 99"></path>
```

### Canvas

canvas 使用方法 `arc` 进行圆的绘制，有六个参数 `void ctx.arc(x, y, radius, startAngle, endAngle [, anticlockwise]);`。使用 `startAngle` 和 `endAngle` 可以很方便地绘制扇形。 **但是没法绘制椭圆是硬伤**

```javascript
const canvas = document.getElementById('circle')
const ctx = canvas.getContext('2d')

function drawArc (radius, { anticlockwise = false, stroke = false } = {}) {
  ctx.beginPath()
  ctx.arc(50, 50, 49, 0, radius / 180 * Math.PI * 2, anticlockwise)
  ctx.lineTo(50, 50)
  ctx.closePath()
  stroke ? ctx.stroke() : ctx.fill()
}

drawArc(360)

ctx.translate(115, 0)
drawArc(60, { anticlockwise: true })

ctx.translate(115, 0)
drawArc(60)

ctx.translate(115, 0)
ctx.scale(0.6, 0.8)
ctx.translate(20, 10)
drawArc(360)
```

## 渐变

渐变分为线性渐变和径向渐变

### CSS

略

### SVG

`linearGradient` 代表线性渐变，`radialGradient` 代表径向渐变。

```svg
<svg>
  <defs>
    <linearGradient id="linear" x1="0" y1="0" x2="0.3" y2="0.3" spreadMethod="reflect">
      <stop offset="0" stop-color="red"></stop>
      <stop offset="100%" stop-color="#fff"></stop>
    </linearGradient>
    <radialGradient id="radial" cx="0.5" cy="0.5" r="0.5" fx="0.8" fy="0.8"> 
      <stop offset="0" stop-color="red"></stop>
      <stop offset="100%" stop-color="#fff"></stop>
    </radialGradient>
  </defs>
  <rect x="0" y="0" width="100" height="100" fill="url(#linear)"></rect>
  <circle cx="50" cy="50" r="50" fill="url(#radial)" transform="translate(115, 0)"></circle>
</svg>
```

### Canvas

`createLinearGradient` 代表线性渐变，`createRadialGradient` 代表径向渐变。

```javascript
const canvas = document.getElementById('grad')
const ctx = canvas.getContext('2d')

// canvas 实现 reflect 和 repeat 需要自己编程实现
const grad1 = ctx.createLinearGradient(0, 0, 100, 100)
grad1.addColorStop(0, 'red') 
grad1.addColorStop(0.3, '#fff')
grad1.addColorStop(0.6, 'red')
grad1.addColorStop(0.9, '#fff')

ctx.fillStyle = grad1
ctx.fillRect(0, 0, 100, 100)

const grad2 = ctx.createRadialGradient(50, 50, 50, 80, 80, 0)
// 注意与 svg 中 stop 的颜色值相反
grad2.addColorStop(0, '#fff')
grad2.addColorStop(1, 'red')

ctx.fillStyle = grad2
ctx.translate(115, 0)
ctx.beginPath()
ctx.arc(50, 50, 50, 0, Math.PI * 2)
ctx.fill()
```

## 文本

效果页面上的示例是垂直居中

### CSS

略

### SVG

svg 使用元素 `text` 代表文本，属性 `text-anchor` 和 `alignment-baseline` 控制垂直居中。

```svg
<text x="50" y="50" text-anchor="middle" alignment-baseline="middle">垂直居中</text>
```

### Canvas

canvas 使用属性 `textAlign` 和 `textBaseline` 控制垂直居中。

```javascript
const canvas = document.getElementById('text')
const ctx = canvas.getContext('2d')

ctx.textAlign = 'center'
ctx.textBaseline = 'middle'
ctx.fillText('垂直居中', 50, 50)
```

## 动画

效果页面的示例是一个简单的 loading 动画

### CSS

说到动画和 css， `animation` 以及 `@keyframes` 最常被用来制作动画。

但是最新出了 css 的属性 `offset-path` 可以像 svg 的 `animateMotion` 一样沿着特定轨迹运动。具体可参考以下

+ [MDN: offset-path](https://developer.mozilla.org/en-US/docs/Web/CSS/offset-path)
+ [CSS-TRICKS: offset-path](https://developer.mozilla.org/en-US/docs/Web/CSS/offset-path)
+ [W3C: Motion Path Module Level 1](https://www.w3.org/TR/motion-1/)

### SVG

关于动画的元素有三种

+ animate
+ animateTransform
+ animateMotion，沿着特定轨迹进行运动

关于以下 loading 动画绘制的原理是，圆的半径从大变小，颜色由有至透明

```svg
<svg>
  <circle cx="50" cy="50" r="49">
    <animate attributeName="r" values="50; 5; 50" keyTimes="0; 0.5; 1" dur="3s" repeatCount="indefinite">
    </animate>
    <animate attributeName="fill" values="red; white; red" dur="3s" repeatCount="indefinite">
    </animate>
  <circle/>
</svg>
```

### Canvas

canvas 的动画就比较简单粗暴了。大致步骤便是 绘制帧，清画板，绘制帧，循环往复。优点是可定制话程度高。

## 参考
+ [svgwg](https://svgwg.org/)
+ [MDN: svg element reference](https://developer.mozilla.org/en-US/docs/Web/SVG/Element)
+ [MDN: Canvas Drawing_shapes](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes)
