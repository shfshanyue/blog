# JS 调试问题汇总与示例

在写 node 应用或者 react 应用时，经常需要看一些库的源码，而在看源码时，除了一个顺手的 IDE 外，学会调试也至关重要。因此，我把常见的调试的一些小问题记录下来。

<!--more-->

## Return Value

### 如何通过调试获取函数的返回值

当函数返回的是一个表达式时，如何在 debug 中，在当前函数中获取到返回值

如下例所示，如何在 `sum` 函数中通过调试得到 `7`，而非获取到 `a` 和 `b` 再两者相加

```javascript
function sum (a, b) {
  // 在调试中如何得到 7 这个结果
  return a + b
}

sum(3, 4)
```

## Step Over

### 当单行调用多个函数表达式时，`Step Over` 是跳过一行还是一个表达式？

```javascript
// 当此行有断点时，Step Over 进入哪里
const l = [1, 2, 3, 4, 5].map(x => sum(x, 1)).filter(x => x > 3)

const n = sub(sum(3, 4), 1)
```

## 多层嵌套

### 当单行调用多个函数表达式时，如何进入特定函数中进行 debug

(不通过对指定函数起始位置打断点的方法，因为有时无法得知指定函数位置)

```javascript
// 如何进入到 `.filter` 函数中进行调试
const l = [1, 2, 3, 4, 5].map(x => sum(x, 1)).filter(x => x > 3)

// 如何进入到 sub 函数中进行调试
const n = sub(sum(3, 4), 1)
```

### 在单行调用多个函数表达式时，如何设置条件断点

```javascript
// 如何在 map 函数中，当 x === 3 时打断点
const = [1, 2, 3, 4, 5].map(x => sum(x, 1))
```

## Async/Await

### 如何跳进 `await` 的函数中进行调试？

### 以下 `sum` 函数和 `asyncSum` 函数 `Step Into` 的步骤是否一致？

```javascript
function sum (a, b) {
  return a + b
}

async function asyncSum (a, b) {
  return a + b
}

async function main () {
  const sum = await sum(3, 4)
  const asyncSum = await sum(3, 4)
  return sum
}
```

## Promise

### 如何进入到 `promise.then` 函数中进行调试？(不通过直接打断点)

```javascript
Promise.resolve(3).then(o => {
  // 如何 StepOver/StepInto 到当前行进行调试
  console.log(o)
})

console.log('hello, world')
```

### 调试过程中，经常进入的 `async_hooks` 是什么

## Error

### 当发生异常时，如何直接断点到异常位置调试
