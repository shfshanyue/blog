# 为你的 Node 应用添加测试用例

> 当新增一个新功能时，如何保证不会影响到旧功能的正常运作？

单元测试是提高代码质量的一个必要手段，也能够最大限度地减少对旧有功能的最大破坏。对于一些公共库，如 `lodash`，`koa` 及 `react` 而言，它们对健壮性，代码质量有着更高的要求，单元测试则是必备条件了。

除了提高代码质量，单元测试还可以充当 **文档** 或者 **示例** 的功能，特别是对那些文档不齐及不见文档特性而言。

## BDD 与 TDD

测试分为两大流派，分别为

1. BDD: Behavior Driven Development，行为驱动开发，先作实现，然后对实现做尽量完整的测试
1. TDD: Test Driven Development，测试驱动开发，先写测试用例，根据测试用例驱动开发，对于开发细节有很好的把控


## 断言 | chai

``` js
function sum (a, b){
  return a + b;
}
```

假设项目中有一个函数 `sum`，我们要对它进行测试:

``` js
sum(1, 1) === 2
```

当然这种写法过于简单，当有更多个测试用例时也无法更直观地查看详情，于是有很多优秀的断言库支持：

1. [assert](https://nodejs.org/docs/latest-v12.x/api/assert.html): Node 原生支持的断言模块
1. [chai](https://github.com/chaijs/chai) (6.7k star): 可支持浏览器及 Node 的断言库，支持 TDD 与 BDD
1. [should](https://github.com/tj/should.js) (2.8k star): 支持 BDD
1. [expect](https://github.com/Automattic/expect.js) (2.1k star)

## 框架 | mocha

一个测试用例可以包含一个断言或多个断言，那如何组织多个测试用例呢？

通过框架：

1. [mocha](https://github.com/mochajs/mocha) (19.1k)
1. [jest](https://github.com/facebook/jest) (30.2k)

## 测试覆盖率

1. [nyc](https://github.com/istanbuljs/nyc) (4.1k star)
1. [codecov](https://github.com/codecov/codecov-node)

## API 测试

