# 在现代 JavaScript 代码中，应该推荐使用 undefined 还是 null？

+ `undefined`: 值未定义或不存在
+ `null`: 值定义但未空

`null` 一般显式地使用，`undefined` 为被动地隐式地使用(并不主动把变量赋值为 `undefined`)。

但尽管 `undefined` 语义为未定义，但是有时该定义仍存在模糊。由以下几个示例看看。

## 示例一：`_.get(object, path, [defaultValue])`

首先，从 `lodash.get` 这个 API，几乎是我 `lodash` 中使用频率最高的 API 说起。

``` js
// null
_.get({ name: null }, 'name', '已注销')

//=> 已注销
_.get({ name: undefined }, 'name', '已注销')


//=> 已注销
_.get({}, 'name', '已注销')
```

`_.get` 使用 `undefined` 认定当值不存在时，才取默认值。

这时你认为通过 `undefined` 可判断是否存在，但有时不仅仅止于此，如以下示例:

``` js
const o = {
  a: undefined
}
```

此时的 `o.a` 与 `o.b` 又有何不同，`o.a` 仿佛是存在但值又是 `undefined`，貌似与 null 语义相同过了？

此时往下看示例二

## 示例二: `Array.prototype.reduce`

众所周知，`Array.prototype.reduce` 第二个参数为累计器(accumulator)初始值，如

``` js
// 115
[1, 2, 3, 4, 5].reduce((x, y) => x + y, 100)
```

我们如何判断累加器初始值存不存在，使用 `undefined`？

``` js
//=> NaN
[1, 2, 3, 4, 5].reduce((x, y) => x + y, undefined)

//=> 15
[1, 2, 3, 4, 5].reduce((x, y) => x + y)
```

以上的答案，告诉我们，明显不是通过 `undefined` 来判断是否存在，这也很容易理解，万一累加器真的是想把初始值定义为 `undefined` 呢？此时 `undefined` 也不能认为是不存在未定义了。

而实际上，在 `reduce` 中是否有第二个参数，是通过参数的个数来判断，写段简单的代码帮助理解

``` js
const reduce = (list, fn, ...init) => {
  let next = init.length ? init[0] : list[0]
  for (let i = init.length ? 0 : 1; i < list.length; i++) {
    next = fn(next, list[i], i)
  }
  return next
}
```

## null

现代前后端分离的大势下，前后端多用 `JSON` 格式的 API 进行交互，而 `null` 是 JSON 中有效的数据类型，更方便进行数据交互，也更方便与其他语言进行沟通。

``` js
//=> {"a": null}
JSON.stringify({ a: null, b: undefined })
```

在 ORM 设计上，一些库中 `null` 用的也比较多，比如 `sequelize`。

``` js
const user = await User.findOne({ where: { name: '山月大哥' } });

if (user === null) {
  console.log('该用户不存在')
}
```

最后，`python` 中只有一个 `None`，感觉还是还可以的。敲入以下代码进行对比

``` python
#=》 Hello, World!
#=> None
print(print("Hello, World!"))

d = {'a': None}

#=> None
d.get('a', 3)

#=> 3
d.get('b', 3)

#=> '{"a": null}'
json.dumps({ 'a': None})
```

以下是 JS

``` js
// Hello, World!
//=> undefined
console.log(console.log("Hello, World!"))

d= { a: null }

//=> null
_.get(d, 'a', 3)

//=> 3
_.get(d, 'b', 3)

//=> {"a": null}
JSON.stringify({ a: null, b: undefined })
```