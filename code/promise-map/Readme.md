---
title: "如何实现 Promise 的限流: Promise.map 的简单实现"
date: 2019-08-02
tags:
  - javascript
categories:
  - 前端
---

## 实现

假设有一个 Promise 为 `get` 和一个待请求数组为 `list`，使用它们进行请求数据。但是为了避免 IO 过大，需要限定三个并发数量

```javascript
function get (i) {
  console.log('In ', i)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(i * 1000) 
      console.log('Out', i, 'Out')
    }, i * 1000)
  })
}

const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

<!--more-->

写一段能够实现功能的松散的代码是很简单的，不过对提供 API 的设计思路也是相当重要的。简单实现如下，使用 `count` 维护一个并发数量的计数器即可

```javascript
// 并发数量计数
let count = 0
function run () {
  if (count < 3 && list.length) {
    count+=1
    get(list.shift()).then(() => {
      count-=1 
      run()
    })
  }
}

// 限定三个并发数量
run()
run()
run()
```

## 代码

```javascript
Promise.map(
    Iterable<any>|Promise<Iterable<any>> input,
    function(any item, int index, int length) mapper,
    [Object {concurrency: int=Infinity} options]
) -> Promise
```

设计成 `Bluebird` 的 API，是比较模块化，也是易于使用的。代码的关键在于维护一个队列，当超过限定数量的 Promise 时，则交与队列维护。代码如下

```javascript
class Limit {
  constructor (n) {
    this.limit = n
    this.count = 0
    this.queue = []
  }

  enqueue (fn) {
    // 关键代码: fn, resolve, reject 统一管理
    return new Promise((resolve, reject) => {
      this.queue.push({ fn, resolve, reject })
    })
  }

  dequeue () {
    if (this.count < this.limit && this.queue.length) {
      // 等到 Promise 计数器小于阈值时，则出队执行
      const { fn, resolve, reject } = this.queue.shift()
      this.run(fn).then(resolve).catch(reject)
    }
  }

  // async/await 简化错误处理
  async run (fn) {
    this.count++
    // 维护一个计数器
    const value = await fn()
    this.count--
    // 执行完，看看队列有东西没
    this.dequeue()
    return value
  }

  build (fn) {
    if (this.count < this.limit) {
      // 如果没有到达阈值，直接执行
      return this.run(fn)
    } else {
      // 如果超出阈值，则先扔到队列中，等待有空闲时执行
      return this.enqueue(fn)
    }
  }
}

Promise.map = function (list, fn, { concurrency }) {
  const limit = new Limit(concurrency)
  return Promise.all(list.map((...args) => {
    return limit.build(() => fn(...args))
  }))
}
```

## 参考

### [Bluebird.map](http://bluebirdjs.com/docs/api/promise.map.html)

```javascript
Bluebird.map(list, x => {
  return get(x)
}, {
  concurrency: 3
})
```

主要是参考 `concurrency` 的实现

### [featurist/promise-limit](https://github.com/featurist/promise-limit)
