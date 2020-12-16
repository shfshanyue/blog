---
title: "graphql-tag 使用以及源码解析"
date: 2019-08-02
tags:
  - javascript
categories:
  - 前端
---

`graphql-tag` 是在写 `graphql` 应用必不可少的一个工具，不管你是在服务器端还是客户端。而 `graphql-tag` 的代码也非常简单，大体也就八个字： **他山之石可以攻玉**。

> 本文链接: <https://shanyue.tech/code/graphql-tag>

## 简介

`graphql-tag` 用来把 `string` 转化成 `GraphQL` 的 `AST`。既然，在客户端发请求时仍然使用 `string`，为什么需要客户端转成 `AST`，这有几个原因

1. 编译成 AST 可以在编译时检确保 query 的合法性 (比如查询了不存在的字段)
1. 可以按照特定条件对多个 query 进行合并，多个请求合并为同一个请求
1. 可以按照客户端缓存对某些字段进行过滤 (skip)，避免冗余查询
1. ... 诸多好处

在服务器端也有诸多好处，如

1. 解析出来客户端请求的 field，与数据库一对比，按需请求数据库字段
1. 添加新的 directives
1. ...

<!--more-->

```javascript
const gql = require('graphql-tag')

const query = gql`
  {
    poem (id: 10) {
      id
      title
    }
  }
`

console.log(query)
```

对于打印出来的 `AST`，可以点击这里查看: <https://astexplorer.net/#/gist/341e64826b3b46a03a27edeebf09bc2a/86de1875dfdde05f8b9a784885372f923d43155c>

同时，强推下 <https://astexplorer.net>。除了查看 GraphQL 的 AST，还会有 `SQL`，`javascript` 等的 AST。

## GraphQL AST

对于 GraphQL 的AST，列出以下几点

1. 解析出来最顶层是 `Document`
1. `definitions` 中是 query 的解析
1. `Document.loc.source.body` 中是原始字符串

## 源码

以下是 `graphql-tag` 的 ts 文件，可以根据核心 API 来分析其源码


```javascript
export default function gql(literals: any, ...placeholders: any[]): any;
export function resetCaches(): void;
export function disableFragmentWarnings(): void;
```

## Question & Answer

### 为什么 gql 调用参数没有加括号

为了简捷! 与加上括号 `gql('{ me }')` 完全一样。从代码以下看出它对传入的参数做了判断处理，直接取了字符串

```javascript
function gql(/* arguments */) {
  var args = Array.prototype.slice.call(arguments);

  var literals = args[0];

  // 判断是否为 gql`` 直接调用，并做处理。具体理解可以看下边我列的示例
  var result = (typeof(literals) === "string") ? literals : literals[0];

  /* 注释掉因为不重要
  ...
  */

  return parseDocument(result);
}
```

至于模板字符串的处理，可以看以下示例

```javascript
const f = x => x
f`{ me }`           // ['{ me }']
f(`{ me }`)         // '{ me }'
```

> 原来，typeof 也可以作为函数...

### graphql-tag 做了什么

简单而言，他做了两件事

1. 使用 `graphql/language/parser` 解析成 AST (最重要的事要交给最靠谱的库做！！！)
1. 对 AST 进行一些简单的修剪 (比如去除 loc)
1. 维护一个 string -> AST 的缓存

```javascript
// 用作缓存，而不是使用了 lru，所以很有可能爆掉！！！所以他提供了 resetCache 这个函数
var docCache = {}

function parseDocument(doc) {
  // 去除换行，空格，逗号等，作为缓存的 key
  var cacheKey = normalize(doc);

  if (docCache[cacheKey]) {
    return docCache[cacheKey];
  }

  // 使用 graphql/language/parser 进行 AST 的解析
  var parsed = parse(doc, { experimentalFragmentVariables: experimentalFragmentVariables });
  if (!parsed || parsed.kind !== 'Document') {
    throw new Error('Not a valid GraphQL document.');
  }

  // 对 fragment 做一些校验
  parsed = processFragments(parsed);

  // 去掉 loc 信息
  parsed = stripLoc(parsed, false);
  docCache[cacheKey] = parsed;

  return parsed;
}
```

### graphql-tag 的 webpack loader 做了什么

至于看它的主要功能是什么，除了看文档以外，更详细的信息可以在测试文件中找到，如下

```javascript
it('parses single query and exports as default', () => {
  const jsSource = loader.call({ cacheable() {} }, `
    query Q1 { testQuery }
  `);
  const module = { exports: undefined };
  eval(jsSource);

  // 对单个 query，直接 module.exports
  assert.deepEqual(module.exports.definitions, module.exports.Q1.definitions);
});

it('parses multiple queries through webpack loader', () => {
  const jsSource = loader.call({ cacheable() {} }, `
    query Q1 { testQuery }
    query Q2 { testQuery2 }
  `);
  const module = { exports: undefined };
  eval(jsSource);

  // 对多个 query，使用 module.exports = { Q1, Q2 }
  assert.exists(module.exports.Q1);
  assert.exists(module.exports.Q2);
  assert.equal(module.exports.Q1.kind, 'Document');
  assert.equal(module.exports.Q2.kind, 'Document');
  assert.equal(module.exports.Q1.definitions.length, 1);
  assert.equal(module.exports.Q2.definitions.length, 1);
});
```

至于如何使用 `webpack` 写一个 `loader`，可以移步官方文档: [writing a loader](https://webpack.js.org/contribute/writing-a-loader/#root)。

`loader` 的作用是让我们可以 `require` 特定文件，原理是 `loader` 通过读取文件内容，进行分析处理并返回一段原始可被 `require` 的js代码的大字符串。

这里截取了当 `require('query.gql')` 时，只有单文件的情况，代码如下

```javascript
// 输入为文件内容，即 cat query.gql
module.exports = function(source) {
  this.cacheable();

  // 对 string 进行 AST 转换
  const doc = gql`${source}`;
  let headerCode = `
    var doc = ${JSON.stringify(doc)};
    doc.loc.source = ${JSON.stringify(doc.loc.source)};
  `;

  let outputCode += `
      module.exports = doc;
    `;

  // os.EOL 一般就是 '\n' 了
  const allCode = headerCode + os.EOL + outputCode + os.EOL;

  // 转换后的文件我们就可以 require 了
  return allCode;
}
```
