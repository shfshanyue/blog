# You-Dont-Know-JS 题目总结

## types & grammer

1. 判断以下结果

``` js
var s = 'abc';
s[1] = 'B';

console.log(s);

var l = new String('abc');
l[1] = 'B';
console.log(l);
```

2. 如何逆序一个字符串？
3. 接上，为什么不能直接使用 `Array.prototype.reverse.call(s)` 逆序字符串？
4. 判断以下结果，为什么会出现这样的情况，如何做出正确的比较？

``` js
0.1 + 0.2 === 0.3;
0.8 - 0.6 === 0.3;
```
5. 如何判断一个数值为整数？
6. 如何判断一个数值为 +0？
7. `'abc'.toUpperCase()` 中 'abc' 作为 primitive value，如何访问 `toUpperCase` 方法。

8. 判断以下结果

```
Array.isArray(Array.prototype)
```

9. 判断以下结果

``` js
Boolean(Boolean(false));
Boolean(document.all);

[] == '';
[3] == 3;
[] == false;
42 == true;
```

10. 找出以下代码问题

``` js
var a = 3;
let a;
```

11. 找出以下代码问题

``` js
var b = 3;

function foo( a = 42, b = a + b + 5 ) {
    // ..
}

foo()
```
