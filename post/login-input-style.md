# 使用纯 CSS 实现仿 Material Design 的 input 过渡效果

以前一段时间，基于对 `next` 与 `graphql` 的调研，再加上本人的兴趣，我做了一个站点，也作为我以后各种技术折腾，实践以及兴趣交汇的试验田。

最近我需要在我的[实验田](https://shici.xiange.tech)使用 `jwt` 实践校验码的功能。校验码，就是指注册时邮箱或者短信的校验码。需要校验码则需要有登录注册，而在登录注册时，为了多写一些 CSS，我决定实现一个 Material Design 的表单过渡效果。

实现效果见 [诗词弦歌 - 登录](https://shici.xiange.tech/login)

开始之前，你先看看是否认识以下几个选择器。如果不，那么通过本文你可以学习到以下几个选择器，以及他们的试用场景

+ `:not(:empty)`
+ `input:not([value=""])`
+ `input:valid`
+ `input:not(:placeholder-shown)`


## 问题概述

至于 Material Design 是什么样的效果，如上所示。实现以上效果，可以简单把问题归结为以下两点的实现

1. 当 input 中没有值且没有获得焦点时，hint 信息灰色呈现在 input 框内
1. 当 input 获取到焦点或者有值时，hint 信息以动画形式位移到 input 上方

直接把 html 和 css 代码贴上来，先来完成简单的功能

label 置于 input 后边，方便通过 `~` 与 `+` 选择器定位。

```pug
form
  .input-wrapper
    input[type="text"]
    label
  .input-wrapper
    input[type="password"]
    label
```

CSS 代码如下，label 初始时通过绝对定位置于 input 的 placeholder 位置，input 获得焦点时的 label 的 CSS Selector 也很容易通过 `input:focus + label` 确定

```css
label {
  /* 定位到input框中 */
  position: absolute;
  bottom: 10px;
  left: 0;
  font-size: 1.2em;
  color: #ccc;
  transition: all ease 0.3s;
  pointer-events: none;
}

input:focus + label {
  /* 定位到 input 上方 */
  color: #f60;
  font-size: 0.8em;
  transform: translateY(-150%);
}
```

已经在 20% 的时间内完成了 80% 的工作量，还有剩下 20% 的问题总结如下

1. 因被 label 遮挡，无法在 label 文字区域点击 input
1. 获得焦点的 CSS Selector 很简单，还有一种复杂的情况是 `input` 非空值时的 CSS Selector

## 焦点

`pointer-events` 用来控制鼠标点击的行为，如果要实现透过 `label` 点击，可以设置该属性为 `none`。

```css
label {
  pointer-events: none;
}
```

## input:not(:empty)

我条件性反射想到用这个来匹配值非空的 input。但我仔细查了下文档，发现它是不适用的。

根据 [empty-pesudo Selectors](https://www.w3.org/TR/selectors/#empty-pseudo) 描述为

> The :empty pseudo-class represents an element that has no children at all. In terms of the document tree, only element nodes and content nodes (such as DOM text nodes, CDATA nodes, and entity references) whose data has a non-zero length must be considered as affecting emptiness;

我来大致翻译一下，如果一个元素, 它的子节点数为 0，那么它将匹配到 `:empty`。这和 input 的 value 风马牛不相及了。

那如何获取元素 `element` 子节点的个数呢？ 使用 `element.childNodes.length`。

> 参考 stackoverflow [:not(:empty) CSS selector is not working?](https://stackoverflow.com/questions/8639282/notempty-css-selector-is-not-working)

## input:not([value=""])

那么再简单粗暴些，直接匹配属性 value 是不就可以了。

**No. 不可以。input 中的显示值并不等同与属性 value。**

那这就引出了下一个问题

### 如何获取 input 的值

用以下代码测试一下

```html
<input type="text" id="input">
```

```javascript
input.value // ''
input.getAttribute('value') // null

input.setAttribute('value', 4)
input.value // '4'，value 值同步过来了
input.getAttribute('value') // '4'

input.value = 3
input.value // '3'
input.getAttribute('value') // '4'
```

结论：

1. **input 通过 `input.value` 获取值，而非 `input.getAttribute('value')`**
1. **如果 `input.value` 为空，那么可以通过 `input.setAttribute('value', value)` 设置值，并且会同时修改 `input.value`**
1. **如果手动为 `input.value` 赋值后，则使用 `input.setAttribute('value', value)` 无效**

那么匹配值非空的 input，可以更深理解为 **匹配input.value为空的input**

这说明在纯css实现时无法使用 `input:not([value=""])` 作为选择器

## 使用 js

思路很简单，同步 `input.value` 到 `input.getAttribute('value')`

```html
<input onkeyup="this.setAttribute('value', this.value);" />
```

### 使用 React

受控的 `input` 组件通过手动控制属性 `value`，来设置 input 的值。

这时再结合使用 `input:not([value=""])` 选择器可以成功控制 input 的过渡效果

而我项目中也是在使用 `React`，使用这一选择器可以很好的满足我的需求

## input:valid

在 html5 中，input 的 type 新增了以下类型

+ email
+ number
+ search
+ url
+ datetime
+ ...

并且添加了检验方式，如是否必须，正则等

+ max/min，最大最小值
+ pattern，正则
+ required，是否必填

这里引入一个新的选择器 `input:required`，匹配所有拥有合法值的 `input`

我们可以对所有 `input` 添加 `required` 的标志，此时 `input:valid` 的含义即匹配有值时的 `input`，顺利解决问题

但是使用 `input:valid` 也有一些限制，如以下两点

1. 所有的 input 必须是 `required`，选填的也必须作为 `required`，失去了语义化，且提交时会有提示无法正常提交
1. 无法使用 pattern，email 等复杂 input 的校验

### 校验提示触发时机

在 `form` 的 `submit` 事件触发后，会引发浏览器自带的校验提示

而 `form` 的 `submit` 事件触发需要满足以下两个条件

1. 包裹在 form 下
1. 点击form下 `input[type="submit"]` 或者 `button` 进行提交

对于 `input:valid` 的两点限制，可以通过把 `form` 改成 `div` 解决，此时无法有 `submit` 事件，选填项也可以正确处理。至于复杂表单校验，则通过js控制

## input:not(:placeholder-shown)

见名思意，`:placeholder-shown` 此选择器匹配是否有 `placeholder`，既然有 `placeholder`，那么 `input` 就没有 `value`。

它有一个必要条件，`placeholder` 属性不能为空，如果实在不必要可以设置为空字符串

```html
<input placeholder=" " />
```

## 参考

+ [Detect if an input has text in it using CSS — on a page I am visiting and do not control?
](https://stackoverflow.com/questions/16952526/detect-if-an-input-has-text-in-it-using-css-on-a-page-i-am-visiting-and-do-no)

