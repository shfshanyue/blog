# 在 JS 中如何进行调试

使用 Javascript 写代码，如论是在 Node 后端环境还是前端单页应用，调试必不可少！

本篇文章教你如何进行调试 Javascript，并在 Node 与浏览器环境中如何实践。

## 如何进行调试

+ `Resume`: 执行到下一个断点
+ `Step`: 
+ `Step Over`:
+ `Step Into`: 
+ `Step Out`:

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
const n = sub(sum(2, sum(3, 4)), 1)
```

### 在单行调用多个函数表达式时，如何设置条件断点

```javascript
// 如何在 map 函数中，当 x === 3 时打断点
const = [1, 2, 3, 4, 5].map(x => sum(x, 1))
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


## Async/Await

### 如何跳进 `await` 的函数中进行调试？

``` javascript
const sleep = (seconds) => {
  // 从 await sleep(2000) 如何调试到这里边
  console.log('DEBUG TO HERE')
  return new Promise(resolve => setTimeout(resolve, seconds))
}

await sleep(2000)
```

### 以下 `sum` 函数和 `asyncSum` 函数 `Step Into` 的步骤是否一致？

```javascript
function _sum (a, b) {
  return a + b
}

async function _asyncSum (a, b) {
  return a + b
}

async function main () {
  const sum = await _sum(3, 4)
  const asyncSum = await _asyncsum(3, 4)
}
```

## Error

### 当发生异常时，如何直接断点到异常位置调试
