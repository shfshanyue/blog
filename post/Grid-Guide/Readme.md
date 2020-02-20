# 译: Grid 布局完全指南

> [英文链接](https://css-tricks.com/snippets/css/complete-guide-grid/)

## [简介](#grid-introduction)

CSS 栅格布局 (亦称 "Grid")，是一个基于栅格的二维布局系统，旨在彻底改变基于网格用户界面的设计。CSS 一直以来并没有把布局做的足够好。刚开始，我们使用 tables，后来是 floats，positioning 和 inline-block，这些本质上是一些 hacks 而且许多重要功能尚未解决（例如垂直居中）。Flexbox 可以做到这些，但是它主要用来一些简单的一维布局，并不适合复杂的二维布局（当然 Flexbox 与 Grid 可以一并使用）。Grid 是第一个为了解决布局问题的 CSS 模块，只要我们做过网页，就会遇到这些问题。

<!--more-->

有两件事情在激励着我创作这篇指南，首先是 Rachel Andrew 那本非常不错的书 [Get Ready for CSS Grid Layout.](http://abookapart.com/products/get-ready-for-css-grid-layout)，清晰透彻地介绍了 Grid，它是本篇文章的基础。我**强烈建议**你去购买并且阅读它。另一件事是 Chris Coyier 的文章 [A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)，是关于 flexbox 的首选资源。它帮助了很多人，当你 Google "flexbox" 的时候，第一眼便能够看见它。或许你已经注意到我的文章与它有很大相似之处，但我们有什么理由不借鉴它呢？

我会把 Grid 在最新版本规范上的概念呈现出来。因此，我将不会照顾过期的 IE 语法。当规范成熟时，我将尽可能去定期更新。

## [基础与浏览器支持](#grid-browser-support)

开始 Grid 是简单的，你仅仅需要在容器(container)元素上定义一个栅格使用 `display: grid`，并通过 `grid-template-columns` 与 `grid-template-rows` 设置行与列。通过设置 `grid-column` 和 `grid-row` 把子元素置于栅格中。与 `flexbox` 类似，栅格项目(items)的顺序是无关紧要的，你可以通过 CSS 来控制顺序。当使用媒体查询时，改变它们的顺序是极其简单的。假设你设计好了网页的布局，但你需要适应不同的屏幕宽度，这仅仅需要几行代码，Grid 是最为有效的模块。

**关于 Grid 一件非常重要的事情是你还不能够在生产环境中使用它**。它目前仅仅是一个 [W3C工作草案](https://www.w3.org/TR/css-grid-1/)，而且不能够被任何浏览器默认支持。虽然IE10 与 IE11 能够支持它，但使用了过期语法旧的实现。为了现在能够体验 Grid，最好的方法是使用 Chrome, Opera 或者 Firefox，并且开启特定的标志。在 Chrome 中，导航到 chrome://flags 并且开启 “experimental web platform features”。在 Opera 中同样如此（opera://flags）。在 Firefox 中，开启标志 layout.css.grid.enabled（about:config）。

这有一张浏览器支持表格，我将保持更新。

Chrome 29+ (Behind flag)
Safari Not supported
Firefox 40+ (Behind flag)
Opera 28+ (Behind flag)
IE 10+ (Old syntax)
Android Not supported
iOS Not supported

> 译者注：现在有些最新浏览器的最新版本已经能够支持，可以查看 [caniuse](caniuse.com) 网站。

你在生产环境中使用它仅仅是一个时间问题。但是，学习正在当下！

## 重要术语

在深入了解 Grid 概念之前，了解它的术语是极为重要的。因为在此涉及到的术语概念相似，不易混淆。不过不用担心，他们并没有很多。

### Grid Container （栅格容器）

设置 `display: grid` 的元素，它是所有栅格项目的直接父级元素。在这个例子中，`container` 是栅格的容器。

```html
<div class="container">
  <div class="item item-1"></div>
  <div class="item item-2"></div>
  <div class="item item-3"></div>
</div>
```

### Grid Item （栅格项目）

栅格容器的直接子代。在这里 `item` 是栅格项目，而 `sub-item` 不是栅格项目。

```html
<div class="container">
  <div class="item"></div> 
  <div class="item">
    <p class="sub-item"></p>
  </div>
  <div class="item"></div>
</div>
```

### Grid Line （栅格线）

组成栅格结构的分割线。它们位于行与列的两侧，有的是垂直的（列栅格线），有的是水平的（行栅格线）。以下黄色线是一个列栅格线。

![Grid line](http://p0.qhimg.com/t010b0d593c912074bc.png)

### Grid Track （栅格轨迹）

相邻栅格线的区域。你可以认为他们是栅格的一行或者一列。以下是第二与第三栅格线间的栅格轨迹。

![Grid track](http://p0.qhimg.com/t013745f6e74cf7d816.png)

### Grid Cell （栅格格子）

相邻行栅格线与相邻列栅格线间的区域。它是栅格的独立“单元”。以下栅格格子位于1，2行栅格线与2，3列栅格线间。

![Grid cell](http://p0.qhimg.com/t011525144466eab825.png)

### Grid Area （栅格区域）

被四个栅格线围绕的区域。一个栅格区域由任意数量的栅格格子组成。以下栅格区域位于1，3行栅格线与1，3列栅格线间。

![Grid area](http://p0.qhimg.com/t01813808bbd3562ad3.png)

## 栅格属性内容表

属于栅格容器的属性：
+ [display](#prop-display)
+ [grid-template-columns](#prop-grid-template-columns)
+ [grid-template-rows](#prop-grid-template-columns)
+ [grid-template-areas](#prop-grid-template-areas)
+ [grid-column-gap](#prop-grid-column-gap)
+ [grid-row-gap](#prop-grid-row-gap)
+ [grid-gap](#prop-grid-gap)
+ [justify-items](#prop-justify-items)
+ [align-items](#prop-align-items)
+ [justify-content](#prop-justify-content)
+ [align-content](#prop-align-content)
+ [grid-auto-columns](#prop-grid-auto-columns)
+ [grid-auto-rows](#prop-grid-auto-rows)
+ [grid-auto-flow](#prop-grid-auto-flow)
+ [grid](#prop-grid)

属于栅格项目的属性：
* [grid-column-start](#prop-grid-column-start)
* [grid-column-end](#prop-grid-column-end)
* [grid-row-start](#prop-grid-row-start)
* [grid-row-end](#prop-grid-row-end)
* [grid-column](#prop-grid-column)
* [grid-row](#prop-grid-row)
* [grid-area](#prop-grid-area)
* [justify-self](#prop-justify-self)
* [align-self](#prop-align-self)


## 栅格容器属性（Grid Container）

### display

定义该元素为栅格项目，并且为它的内容建立一个新的*栅格格式上下文（grid formatting context）*。

> 译者注：还记得 BFC 与 IFC 吗？

属性值：

+ **grid** 生成块状栅格
+ **inline-grid** 生成行间栅格
+ **subgrid** 如果你的栅格容器本身是一个栅格项目的话（例如：嵌套栅格），你可以根据它的父元素而不是它自己，指定行列大小。

```css
.container{
  display: grid | inline-grid | subgrid;
}
```

注意：`column`，`float`，`clear` 与 `vertical-align` 在栅格容器上无效。

### grid-template-columns <br> grid-template-rows

通过空格分隔的值定义栅格的行与列。值代表轨迹大小（track size），它们中间的间隙代表栅格线。

属性值：

+ **&lt;track-size\>** 可以是长度，百分比，或者栅格中的空白空间（使用 `fr`）
+ **&lt;line-name\>** 任意名字，任君选择

```css
.container{
  grid-template-columns: <track-size> ... | <line-name> <track-size> ...;
  grid-template-rows: <track-size> ... | <line-name> <track-size> ...;
}
```

示例:

当你在轨迹值之间预留空格时，栅格线会被自动分配为数值名字。

```css
.container{
  grid-template-columns: 40px 50px auto 50px 40px;
  grid-template-rows: 25% 100px auto;
}
```

![Grid with auto named lines](http://p0.qhimg.com/t01800e6196346b74a6.png)

你也可以为栅格线设置名字，注意栅格线名字的括号语法：

```css
.container{
  grid-template-columns: [first] 40px [line2] 50px [line3] auto [col4-start] 50px [five] 40px [end];
  grid-template-rows: [row1-start] 25% [row1-end] 100px [third-line] auto [last-line];
}
```

![Grid with user named lines](http://p0.qhimg.com/t01ef91a9cf4b5217c7.png)

注意一条线可以有多个名字。例如，这里第二条线有两个名字：row1-end 和 row2-start。

```css
.container{
  grid-template-rows: [row1-start] 25% [row1-end row2-start] 25% [row2-end];
}
```

如果你定义的内容包含重复部分，你可以使用 `repeat()` 标记去组织它。

```css
.container{
  grid-template-columns: repeat(3, 20px [col-start]) 5%;
}
```

与以下代码是等价的

```css
.container{
  grid-template-columns: 20px [col-start] 20px [col-start] 20px [col-start] 5%;
}
```

`fr` 允许你设置轨迹大小为栅格容器的一部分。例如，以下示例将设置每个项目为栅格容器的三分之一。

```css
.container{
  grid-template-columns: 1fr 1fr 1fr;
}
```

空白空间将在固定项目 *之后* 被计算。在这个例子中，给 `fr` 分配的全部空余时间不包括 50px。

```css
.container{
  grid-template-columns: 1fr 50px 1fr 1fr;
}
```

### grid-template-areas

通过指定栅格区域的名字来定义栅格模板，这样栅格项目会通过 [`grid-area`](#prop-grid-area) 属性来指定区域。重复栅格区域的名字将会合并栅格格子，一个句点表示一个空的栅格格子。语法本身提供了一个可视化的栅格结构。

属性值：

+ **&lt;grid-area-name\>** 在项目中使用 [`grid-area`](#prop-grid-area) 属性指定的栅格区域
+ **.** 句点表示空白栅格格子
+ **none** 不定义栅格区域

```css
.container{
  grid-template-areas: "<grid-area-name> | . | none | ..."
                       "..."
}
```

示例:

```css
.item-a{
  grid-area: header;
}
.item-b{
  grid-area: main;
}
.item-c{
  grid-area: sidebar;
}
.item-d{
  grid-area: footer;
}

.container{
  grid-template-columns: 50px 50px 50px 50px;
  grid-template-rows: auto;
  grid-template-areas: "header header header header"
                       "main main . sidebar"
                       "footer footer footer footer"
}
```

这将建造一个三行四列的栅格。第一行全部由 **header** 区域组成，第二行由两个 **main** 区域，一个空白格子与一个 **sidebar** 区域组成。最后一行全部由 **footer** 组成。

![Example of grid-template-areas](http://p0.qhimg.com/t0100d72cb04db7fd4e.png)

你声明的每行都需要有相同数量的栅格格子。

你可以使用任意数量无空格分割的相邻句点去表示单个空白栅格格子。

> 译者注：`grid-template-areas: "first . last"` 与 `grid-template-areas: "first ...... last"` 等价。

注意，这种语法仅仅能命名区域，而无法命名栅格线。实际上，当你使用这种语法的时候，栅格区域两端的栅格线已被自动命名。如果你的栅格区域叫 ***foo***，栅格区域开始的行与列将被命名为 ***foo-start***，而结束的行与列将被命名为 ***foo-end***。这意味着一些栅格线会有很多名字，比如上述例子的最左边的栅格线将会有三个名字：header-start, main-start 和 footer-start。

### grid-template
[`grid-template-columns`](#prop-grid-template-columns)，[`grid-template-rows`](#prop-grid-template-rows) 和 [`grid-template-areas`](#prop-grid-template-areas) 的简写。

属性值：

+ **none** 设置这三个属性为初始属性
+ **subgrid** 设置 `grid-template-rows` 和 `grid-template-columns` 为 `subgrid`，`grid-template-areas` 为初始值。
+ **&lt;grid-template-columns\> / &lt;grid-template-rows\>** 设置 `grid-template-columns` 与 `grid-template-rows` 为各自指定的值。而 `grid-template-areas` 为 `none`。

```css
.container{
  grid-template: none | subgrid | <grid-template-columns> / <grid-template-rows>;
}
```

另外，也有一个比较复杂但是方便的语法指定三个属性，示例如下

```css
.container{
  grid-template: auto 50px auto /
    [row1-start] 25px "header header header" [row1-end]
    [row2-start] "footer footer footer" 25px [row2-end];
}
```

与以下代码是等价的：

```css
.container{
  grid-template-columns: auto 50px auto;
  grid-template-rows: [row1-start] 25px [row1-end row2-start] 25px [row2-end];
  grid-template-areas: 
    "header header header" 
    "footer footer footer";
}
```

因为 `grid-template` 无法 *隐式* 重置属性（[`grid-auto-columns`](#prop-grid-auto-columns)，[`grid-auto-rows`](#prop-grid-auto-rows) 与 [`grid-auto-flow`](#prop-grid-auto-flow)）。或许你想做更多的事，那么推荐你使用 `grid` 属性去替代 `grid-template`。

### grid-column-gap <br> grid-row-gap

指定栅格线的大小，你可以理解它为设置行/列间隙。

属性值：

+ **&lt;line-size\>** 长度值

```css
.container{
  grid-column-gap: <line-size>;
  grid-row-gap: <line-size>;
}
```

示例:

```css
.container{
  grid-template-columns: 100px 50px 100px;
  grid-template-rows: 80px auto 80px; 
  grid-column-gap: 10px;
  grid-row-gap: 15px;
}
```

![Example of grid-column-gap and grid-row-gap](http://p0.qhimg.com/t016578aaf2c91f4465.png)

栅格间隙仅仅在行/列 *之间*，不包括最外部的边。

### grid-gap

[`grid-column-gap`](#prop-grid-row-gap) 与 [`grid-row-gap`](#prop-grid-row-gap) 的简写。

属性值：

+ **&lt;grid-row-gap\> &lt;grid-column-gap\>** 长度值

```css
.container{
  grid-gap: <grid-row-gap> <grid-column-gap>;
}
```

示例:

```css
.container{
  grid-template-columns: 100px 50px 100px;
  grid-template-rows: 80px auto 80px; 
  grid-gap: 10px 15px;
}
```

如果没有设置 `grid-row-gap`，它将于 `grid-column-gap` 保持一致。

### justify-items

使栅格项目中的内容与 *列* 轴对齐（相应地，[`align-items`](#prop-align-items) 与 *行* 轴对齐）。这个属性值应用在容器中的所有项目上。

属性值：

+ **start** 使内容与栅格区域左侧对齐
+ **end** 使内容与栅格区域右侧对齐
+ **center** 使内容在栅格区域中居中
+ **stretch** 使内容充满整个栅格区域的宽（默认属性）

```css
.container{
  justify-items: start | end | center | stretch;
}
```

示例

```css
.container{
  justify-items: start;
}
```

![Example of justify-items set to start](http://p0.qhimg.com/t014aac0561a2356880.png)

```css
.container{
  justify-items: end;
}
```

![Example of justify-items set to end](http://p0.qhimg.com/t0150250ab32231e09d.png)

```css
.container{
  justify-items: center;
}
```

![Example of justify-items set to center](http://p0.qhimg.com/t0165c50666a5eb75e3.png)

```css
.container{
  justify-items: stretch;
}
```

![Example of justify-items set to stretch](http://p0.qhimg.com/t013f7d913386d24db6.png)

这个行为也可以通过 [`justify-self`](#prop-justify-self) 属性设置在独立的栅格项目上。

### align-items

使栅格项目中的内容与 *行* 轴对齐（相应地，[`justify-items`](prop-justify-items) 与 *列* 轴对齐）。这个属性值应用在容器中的所有项目上。

属性值：

+ **start** 使内容与栅格区域顶部对齐
+ **end** 使内容与栅格区域底部对齐
+ **center** 使内容在栅格区域中居中
+ **stretch** 使内容充满整个栅格区域的高（默认属性）

```css
.container{
  align-items: start | end | center | stretch;
}
```

示例:

```css
.container{
  align-items: start;
}
```

![Example of align-items set to start](http://p0.qhimg.com/t01ff0fa166f558197d.png)

```css
.container{
  align-items: end;
}

```

![Example of align-items set to end](http://p0.qhimg.com/t01db036a5039b6f137.png)

```css
.container{
  align-items: center;
}

```

![Example of align-items set to center](http://p0.qhimg.com/t0169cb9db61ffbae54.png)

```css
.container{
  align-items: stretch;
}

```

![Example of align-items set to stretch](http://p0.qhimg.com/t013f7d913386d24db6.png)

这个行为也可以通过 [`align-self`](#prop-align-self) 属性设置在独立的栅格项目上。


### justify-content

有时候，栅格的总大小小于栅格容器的大小，比如你使用 `px` 给所有的栅格项目设置了固定大小。本例中，你可以设置栅格容器中栅格的对齐。这个属性会使栅格与 *列* 轴对齐（相应地，[`align-content`](#prop-align-content) 会使栅格与 *行* 轴对齐）。

属性值：

+ **start** 与栅格容器的左侧对齐
+ **end** 与栅格容器的右侧对齐
+ **center** 在栅格容器中居中
+ **stretch** 调整栅格项目的大小，使栅格充满整个栅格容器。
+ **space-around** 每两个项目之间留有相同的空白，在最左端与最右端为一半大小的空白。
+ **space-between** 每两个项目之间留有相同的空白，在最左端与最右端不留空白。
+ **space-evenly** 每两个项目之间留有相同的空白，包括两端。

```css
.container {
  align-content: start | end | center | stretch | space-around | space-between | space-evenly;  
}
```

示例:

```css
.container{
  justify-content: start;
}

```

![Example of justify-content set to start](http://p0.qhimg.com/t011c175bd21bd04873.png)

```css
.container{
  justify-content: end;  
}

```

![Example of justify-content set to end](http://p0.qhimg.com/t012fdfb43be210320b.png)

```css
.container{
  justify-content: center;  
}

```

![Example of justify-content set to center](http://p0.qhimg.com/t0121f6243af228e533.png)

```css
.container{
  justify-content: stretch;  
}

```

![Example of justify-content set to stretch](http://p0.qhimg.com/t01d47cbca62430ca01.png)

```css
.container{
  justify-content: space-around;  
}

```

![Example of justify-content set to space-around](http://p0.qhimg.com/t01a20181854966e956.png)

```css
.container{
  justify-content: space-between;  
}

```

![Example of justify-content set to space-between](http://p0.qhimg.com/t01ce2fa8742987e2d7.png)

```css
.container{
  justify-content: space-evenly;  
}

```

![Example of justify-content set to space-evenly](http://p0.qhimg.com/t01850de3364c4bbe46.png)

### align-content

有时候，栅格的总大小小于栅格容器的大小，比如你使用 `px` 给所有的栅格项目设置了固定大小。本例中，你可以设置栅格容器中栅格的对齐。这个属性会使栅格与 *行* 轴对齐（相应地，`align-content` 会使栅格与 *列* 轴对齐）。

属性值：

+ **start** 与栅格容器的顶部对齐
+ **end** 与栅格容器的底部对齐
+ **center** 在栅格容器中居中
+ **stretch** 调整栅格项目的大小，使栅格充满整个栅格容器。
+ **space-around** 每两个项目之间留有相同的空白，在最左端与最右端为一半大小的空白。
+ **space-between** 每两个项目之间留有相同的空白，在最左端与最右端不留空白。
+ **space-evenly** 每两个项目之间留有相同的空白，包括两端。

```css
.container{
  align-content: start | end | center | stretch | space-around | space-between | space-evenly;  
}

```

示例:

```css
.container{
  align-content: start;  
}

```

![Example of align-content set to start](http://p0.qhimg.com/t017f5b8278a30f5c6d.png)

```css
.container{
  align-content: end;  
}

```

![Example of align-content set to end](http://p0.qhimg.com/t018c44b23f2d7d8bcd.png)

```css
.container{
  align-content: center;  
}

```

![Example of align-content set to center](http://p0.qhimg.com/t01e3f8dffe087bebcf.png)

```css
.container{
  align-content: stretch;  
}

```

![Example of align-content set to stretch](http://p0.qhimg.com/t015b64390a99043ad4.png)

```css
.container{
  align-content: space-around;  
}

```

![Example of align-content set to space-around](http://p0.qhimg.com/t01e4088675bc8f2291.png)

```css
.container{
  align-content: space-between;  
}

```

![Example of align-content set to space-between](http://p0.qhimg.com/t011990e6cf87af8a91.png)

```css
.container{
  align-content: space-evenly;  
}

```

![Example of align-content set to space-evenly](http://p0.qhimg.com/t0177c7695d648f9823.png)


### grid-auto-columns <br> grid-auto-rows

指定自动生成的栅格轨迹的大小（亦称*隐式栅格轨迹*）。当你显式定位行与列的时候（通过 `grid-template-rows` / `grid-template-columns`），隐式栅格轨迹会在定义的栅格外被创建。

属性值：

+ **&lt;track-size>** 可以是长度，百分比或者 `fr`

```css
.container{
  grid-auto-columns: <track-size> ...;
  grid-auto-rows: <track-size> ...;
}
```

举例了解隐式栅格轨迹是如何被创建的，考虑以下示例：

```css
.container{
  grid-template-columns: 60px 60px;
  grid-template-rows: 90px 90px
}
```

![Example of implicit tracks](http://p0.qhimg.com/t013dd10f7cf04f23d7.png)

本示例建造了 2 * 2 的栅格。

你使用 `[grid-column`](#prop-grid-column) 与 [`grid-row`](#prop-grid-row) 去定位你的项目如下：

```css
.item-a{
  grid-column: 1 / 2;
  grid-row: 2 / 3;
}
.item-b{
  grid-column: 5 / 6;
  grid-row: 2 / 3;
}
```

![Example of implicit tracks](https://cdn.css-tricks.com/wp-content/uploads/2016/03/implicit-tracks.png)

我们告知 .item-b 在 5-6 列间，*但我们从未定义第五列或者第六列*。因为我们引用的栅格线不存在，宽度为0的隐式栅格轨迹将会创建去填充空白。我们可以使用 [`grid-auto-columns`](#prop-grid-auto-rows) 和 [`grid-auto-rows`](#prop-grid-auto-rows) 去指定这些轨迹的宽。

> 译者注：经译者测试，并非以宽度为0的 implicit track 去填充。[w3c auto-tracks](https://www.w3.org/TR/css-grid-1/#auto-tracks) 上表明 `grid-auto-columns` 的默认值为 `auto`，则超过的列将会平分空白空间。

![Example of implicit tracks](https://cdn.css-tricks.com/wp-content/uploads/2016/03/implicit-tracks-with-widths.png)

```css
.container{
  grid-auto-columns: 60px;
}
```

![Example of implicit tracks](http://p0.qhimg.com/t010ddf221c5b3c93b5.png)


### grid-auto-flow

如果你的栅格项目没有显式地在栅格中设置位置，*自动放置算法*便会生效。这个属性控制自动放置算法的的运作。

属性值：

+ **row** 自动放置算法将按行依次排列，按需添加新行。
+ **column** 自动放置算法将按列依次排列，按需添加新列。
+ **dense** 如果较小的项目出现靠后时，自动防止算法将尽可能早地填充栅格的空白格子

```css
.container{
  grid-auto-flow: row | column | row dense | column dense
}
```

注意 **dense** 可能使你的项目次序颠倒。

示例:

考虑以下 html:
  
```html
<section class="container">
    <div class="item-a">item-a</div>
    <div class="item-b">item-b</div>
    <div class="item-c">item-c</div>
    <div class="item-d">item-d</div>
    <div class="item-e">item-e</div>
</section>
```

你定义了一个两行五列的栅格，并设置它的 [`grid-auto-flow`](#prop-grid-auto-flow) 属性为 `row` （默认属性便是 `row`）。

```css
.container{
    display: grid;
    grid-template-columns: 60px 60px 60px 60px 60px;
    grid-template-rows: 30px 30px;
    grid-auto-flow: row;
}
```

当我们把项目放置在栅格中的时候，明确指定以下两个项目的位置

```css
.item-a{
    grid-column: 1;
    grid-row: 1 / 3;
}
.item-e{
    grid-column: 5;
    grid-row: 1 / 3;
}
```

因为我们设置了 [`grid-auto-flow`](#prop-grid-auto-flow) 属性为 `row`，呈现在我们眼前的栅格便是如下这个样子。注意，这三个项目（**item-b**，**item-c** 与 **item-d**）并没有特意指定位置。

![Example of grid-auto-flow set to row](http://p0.qhimg.com/t010c337beef320ef8a.png)

如果设置 [`grid-auto-flow`](#prop-grid-auto-flow) 的属性为 `column`，item-b**，**item-c** 与 **item-d** 将按列以此排序。

```css
.container{
    display: grid;
    grid-template-columns: 60px 60px 60px 60px 60px;
    grid-template-rows: 30px 30px;
    grid-auto-flow: column;
}
```

![Example of grid-auto-flow set to column](http://p0.qhimg.com/t015f3b6d634d9bf1a1.png)


### grid

以下属性的缩写：[`grid-template-rows`](#prop-grid-template-rows)， [`grid-template-columns`](#prop-grid-template-columns)， [`grid-template-areas`](#prop-grid-template-areas)，[`grid-auto-rows`](#prop-grid-auto-rows)，[`grid-auto-columns`](#prop-grid-auto-columns)`，与 [`grid-auto-flow`](#prop-grid-auto-flow)`。它也可以设置 [`grid-column-gap`](#prop-grid-column-gap) 和 [`grid-row-gap`](#prop-grid-column-gap)为默认值，即使并没有在 `grid` 中明确设置。

属性值：

+ **none** 设置所有子属性的值为初始值。
+ **&lt;grid-template-rows\> / &lt;grid-template-columns\>** 仅仅设置这两个属性值，其它子属性值为初始值。
+ **&lt;grid-auto-flow\> [&lt;grid-auto-rows\> [ / &lt;grid-auto-columns\>] ]** 如果 [`grid-auto-columns`](#prop-grid-auto-rows) 属性值确实，则采用 [`grid-auto-rows`](#prop-grid-auto-rows)的值。如果属性值均缺失，则采用默认值。

```css
.container{
    grid: none | <grid-template-rows> / <grid-template-columns> | <grid-auto-flow> [<grid-auto-rows> [/ <grid-auto-columns>]];
}
```

以下两种写法是等价的：

```css
.container{
    grid: 200px auto / 1fr auto 1fr;
}
```

```css
.container{
    grid-template-rows: 200px auto;
    grid-template-columns: 1fr auto 1fr;
    grid-template-areas: none;
}
```

以下两种写法也是等价的：

```css
.container{
    grid: column 1fr / auto;
}
```

```css
.container{
    grid-auto-flow: column;
    grid-auto-rows: 1fr;
    grid-auto-columns: auto;
}
```

另外你可以设置更为复杂但相当方便的语法一次性设置所有属性。你可以指定[`grid-template-areas`](#prop-grid-template-areas)， [`grid-auto-rows`](#prop-grid-auto-rows) 与 [`grid-auto-columns`](#prop-grid-auto-rows)，其他子属性将被设为默认值。你需要指定栅格线与轨迹大小，这很容易用一个例子表示：

```css
.container{
    grid: [row1-start] "header header header" 1fr [row1-end]
          [row2-start] "footer footer footer" 25px [row2-end]
          / auto 50px auto;
}
```

与以下写法是等价的：

```css
.container{
    grid-template-areas: "header header header"
                         "footer footer footer";
    grid-template-rows: [row1-start] 1fr [row1-end row2-start] 25px [row2-end];
    grid-template-columns: auto 50px auto;    
}
```

## 栅格项目属性 （Grid Items）

### grid-column-start <br> grid-column-end <br> grid-row-start <br> grid-row-end

通过指定栅格线来确定栅格项目的位置。`grid-column-start` / `grid-row-start` 代表项目开始的线，`grid-column-end`/`grid-row-end` 代表项目结束的线。

属性值：

+ **&lt;Line\>** 可以是一个表示栅格线名字或数字。
+ **span &lt;number\>** 项目将横跨指定数量栅格轨迹
+ **span &lt;name\>** 项目将横跨至指定名字的栅格线
+ **auto** 自动放置，自动跨越轨迹或者默认跨越轨迹

```css
.item{
  grid-column-start: <number> | <name> | span <number> | span <name> | auto
  grid-column-end: <number> | <name> | span <number> | span <name> | auto
  grid-row-start: <number> | <name> | span <number> | span <name> | auto
  grid-row-end: <number> | <name> | span <number> | span <name> | auto
}
```

示例:

```css
.item-a{
  grid-column-start: 2;
  grid-column-end: five;
  grid-row-start: row1-start
  grid-row-end: 3
}
```

![Example of grid-row/column-start/end](http://p0.qhimg.com/t01c319940a0751c21a.png)

```css
.item-b{
  grid-column-start: 1;
  grid-column-end: span col4-start;
  grid-row-start: 2
  grid-row-end: span 2
}
```

![Example of grid-row/column-start/end](http://p0.qhimg.com/t01637405e7c4e4b477.png)

如果没有指定 grid-column-end/grid-row-end，项目默认横跨一个轨迹。

项目可能会互相重叠，你可以使用 `z-index` 控制它们的层叠顺序（stacking order）。

### grid-column <br> grid-row

各自表示[`grid-column-start`](#prop-grid-row-start) + [`grid-column-end`](#prop-grid-row-start) 与 [`grid-row-start`](#prop-grid-row-start) + [`grid-row-end`](#prop-grid-row-start)的缩写。

属性值：

+ **&lt;start-line\> / &lt;end-line\>** 接收 grid-column-start 同样的属性值，包括 span

```css
.item{
  grid-column: <start-line> / <end-line> | <start-line> / span <value>;
  grid-row: <start-line> / <end-line> | <start-line> / span <value>;
}
```

Example:

```css
.item-c{
  grid-column: 3 / span 2;
  grid-row: third-line / 4;
}
```

![Example of grid-column/grid-row](http://p0.qhimg.com/t01f866d9710ca9325b.png)

如果没有指定 end line，项目将默认跨越一个轨迹。

### grid-area

当创建栅格容器使用 [`grid-template-areas`](#prop-grid-template-areas) 属性时，可以通过制定区域名字确定栅格项目的位置。同样，它也可以作为以下属性的缩写：[`grid-row-start`](#prop-grid-row-start) + [`grid-column-start`](#prop-grid-row-start) + [`grid-row-end`](#prop-grid-row-start) + [`grid-column-end`](#prop-grid-row-start)。

属性值：

+ **&lt;name\>**
+ **&lt;row-start\> / &lt;column-start\> / &lt;row-end\> / &lt;column-end\>**

```css
.item{
  grid-area: <name> | <row-start> / <column-start> / <row-end> / <column-end>;
}
```

示例:

你可以给项目设置名字：

```css
.item-d{
  grid-area: header
}
```

也可以作为[`grid-row-start`](#prop-grid-row-start) + [`grid-column-start`](#prop-grid-row-start) + [`grid-row-end`](#prop-grid-row-start) + [`grid-column-end`](#prop-grid-row-start) 的缩写：

```css
.item-d{
  grid-area: 1 / col4-start / last-line / 6
}
```

![Example of grid-area](http://p0.qhimg.com/t01adce45c1a81e99a9.png)

### justify-self

使栅格项目中的内容与 *列* 轴对齐（相应地，[`align-self`](#prop-align-self) 与 *行* 轴对齐）。本属性值适用于单个项目的内容。

属性值：

+ **start** 使内容与栅格区域左侧对齐
+ **end** 使内容与栅格区域右侧对齐
+ **center** 使内容在栅格区域中居中
+ **stretch** 使内容充满整个栅格区域的宽（默认属性）

```css
.item{
  justify-self: start | end | center | stretch;
}
```

示例:

```css
.item-a{
  justify-self: start;
}
```

![Example of justify-self set to start](http://p0.qhimg.com/t012726e6a9b31ae7b9.png)

```css
.item-a{
  justify-self: end;
}
```

![Example of justify-self set to end](http://p0.qhimg.com/t017b10ee4bdb228696.png)

```css
.item-a{
  justify-self: center;
}
```

![Example of justify-self set to center](http://p0.qhimg.com/t0137ce363f085b12b7.png)

```css
.item-a{
  justify-self: stretch;
}

```

![Example of justify-self set to stretch](http://p0.qhimg.com/t0129d1eb7fd5521656.png)

为了对栅格项目中的**所有**项目设置对齐，可以是指栅格容器的 [`justify-items`](#prop-justify-items) 属性。

### align-self

使栅格项目中的内容与 *行* 轴对齐（相应地，[`justify-self`](#prop-justify-self) 与*列*轴对齐）。本属性值适用于单个项目的内容。

属性值：

+ **start** 使内容与栅格区域顶部对齐
+ **end** 使内容与栅格区域底部对齐
+ **center** 使内容在栅格区域中居中
+ **stretch** 使内容充满整个栅格区域的高（默认属性）

```css
.item{
  align-self: start | end | center | stretch;
}
```

示例:

```css
.item-a{
  align-self: start;
}
```

![Example of align-self set to start](http://p0.qhimg.com/t0135bf5bf8c59224bb.png)

```
.item-a{
  align-self: end;
}

```

![Example of align-self set to end](http://p0.qhimg.com/t0138110adbf89ff364.png)

```
.item-a{
  align-self: center;
}

```

![Example of align-self set to center](http://p0.qhimg.com/t0176017095e3a523f2.png)

```
.item-a{
  align-self: stretch;
}

```

![Example of align-self set to stretch](http://p0.qhimg.com/t01808ac36d9b99d412.png)

为了对栅格项目中的**所有**项目设置对齐，可以设置栅格容器的 [`align-items`](#prop-align-items) 属性。
