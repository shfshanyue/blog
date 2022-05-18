什么是一道好的面试题呢？

我认为其中最重要的一个点就是：**有区分度**。对于初级开发可以看到一层，而对于高级开发可以看到第十层。

这样的面试题在前端领域很多，比如最常见的两个问题:

1. 当你做性能优化时，你会考虑什么
2. 当页面输入 URL 时，发生了什么

在前端中也有一道代码题目，出自字节跳动区分度很大，其中考察的元素过多，**promise 串行，并行，二分，并发控制，层层递进**，不失为一道好的面试题。

**请实现以下 sum 函数，只能调用 add 进行实现，而 add 为异步方法**

``` js
/*
  请实现一个 sum 函数，接收一个数组 arr 进行累加，并且只能使用add异步方法
  
  add 函数已实现，模拟异步请求后端返回一个相加后的值
*/
function add(a, b) {
  return Promise.resolve(a + b);
}

function sum(arr) {
  
}
```

## 初级实现: 串行方式

遇到这种题目，第一反应就是如同同步 sum 的实现一样，一个一个进行累加。

以下是一个借助于 `Array.prototype.reduce` 实现的 Promise 版本。

这里一个注意的点是：**不能将 0 作为累加器的初始值，因此 add 为异步的，不能保证 `add(x, 0) === x`**

```js
function sum(arr) {
  if (arr.length === 1) return arr[0];
  return arr.reduce((x, y) => Promise.resolve(x).then((x) => add(x, y)));
}
```

借助于 `async/await` 的异步 sum 的实现，逻辑更为清楚，同样我们把初始值设置为数组中第一个数，而非 0。

``` js
async function sum(arr) {
  let s = arr[0]
  for (let i = 1; i < arr.length; i++) {
    s = await add(s, arr[i])
  }
  return s
}
```

[代码片段](https://code.juejin.cn/pen/7091460261323735048)

不管是基于 promise 还是 async 实现，这应该是大部分人的第一反应，然而还有很多同学，直接最简单的实现无法通过，很可能无法通过面试。

但是它有一个问题，在异步sum函数中，**其中最为耗时的是 add()，因为他是一个异步 IO 操作，模拟的是服务器数据请求，假设 add 延时一秒，此时需要 N-1 秒，延时太长。**

## 中级实现: 并行方式

关于上边的同步实现，有可能就会筛了一部分同学。面试官到了这里，就会继续增加难度。

接下来是并行的写法: **我们实现一个 `chunk` 函数，将数组两两分组，每两个计算一次，使用 chunk 二分，此时延时变为 logN 秒**

关于 `chunk` 的 API 可以参考 [lodash.chunk](https://lodash.com/docs/4.17.15#concat): `_.concat(array, [values])`，在平常工作中也会用到。

```js
function chunk(list, size) {
  const l = [];
  for (let i = 0; i < list.length; i++) {
    const index = Math.floor(i / size);
    l[index] ??= [];
    l[index].push(list[i]);
  }
  return l;
}
```

**在通过 chunk 进行两两分组时，有可能最后一项为单数，此时直接返回数值即可，在最终得到结果后，迭代该函数继续二分，直到最后只有一个数值。**

``` js
async function sum(arr) {
  if (arr.length === 1) return arr[0];
  const promises = chunk(arr, 2).map(([x, y]) =>
    // 注意此时单数的情况
    y === undefined ? x : add(x, y)
  );
  return Promise.all(promises).then((list) => sum(list));
}
```

[代码片段](https://code.juejin.cn/pen/7091470717836853255)

写到这里，感觉难度还不是很大，注意，此时使用的是 `Promise.all`，意味着不管 `Promise.all` 所接收的数组中有多少元素，将会同时进行处理。

此时面试官会进行扩展: **比如有10000个数据，那第一次就会发送5000个请求，网络拥堵了，我想控制成只能同时发送10个请求怎么办？**

## 更进一步: 控制并行数

如果需要控制并行数，则可以先实现一个 `promise.map` 用以控制并发，这也是在面试中经常考察的一个点。使用 `promise.map` 来代替上一步的 `promise.all`。

关于 `promise.map` 的 API 可以参考 `bluebird`: `new Promise(function(function resolve, function reject) resolver) -> Promise`。

与上一步相同，使用 sum 迭代该函数继续二分，直到最后只有一个数值。

```js
function pMap(list, mapper, concurrency = Infinity) {
  return new Promise((resolve, reject) => {
    let currentIndex = 0;
    let result = [];
    let resolveCount = 0;
    let len = list.length;
    function next() {
      const index = currentIndex++;
      Promise.resolve(list[index])
        .then((o) => mapper(o, index))
        .then((o) => {
          result[index] = o;
          if (++resolveCount === len) {
            resolve(result);
          }
          if (currentIndex < len) {
            next();
          }
        });
    }
    for (let i = 0; i < concurrency && i < len; i++) {
      next();
    }
  });
}

async function sum(arr, concurrency) {
  if (arr.length === 1) return arr[0];
  return pMap(
    chunk(arr, 2),
    ([x, y]) => {
      return y === undefined ? x : add(x, y);
    },
    concurrency
  ).then((list) => sum(list, concurrency));
}
```

关于 `promise.map` 还有一个更简单的实现，可参考 [async-pool](https://github.com/rxaviers/async-pool/blob/master/lib/es9.js)

## 思考

在面试中，如果以代码为主进行考核，那这一道题就已经足够了，刚好与一场面试的时间差不多，这也是我在面试过程中面试候选人最喜欢的一个问题。

如果是你，你这个问题能通关到哪一步？