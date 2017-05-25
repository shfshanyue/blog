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
> `string` 及其包装对象 (Boxed Object) 是不可变 (immutable) 类型，因此不能改变它本身(modify in place)，所以 `String` 的所有方法都是返回一个新的字符串，而不会改变自身。

<small style="text-align: right">

[source](https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch2.md#user-content-strings)

</small>

2. 如何逆序一个字符串？

> `s.split('').reverse().join('')`

3. 接上，为什么不能直接使用 `Array.prototype.reverse.call(s)` 逆序字符串？

> 当一个数组逆序时 `l.reverse()` 会改变 l 本身。正如第一题，`string` 不能改变自身。

4. 判断以下结果，为什么会出现这样的情况，如何做出正确的比较？

``` js
0.1 + 0.2 === 0.3;
0.8 - 0.6 === 0.2;
```

> 浮点数根据 IEEE 754 标准存储64 bit 双精度，能够表示 2^64 个数，而浮点数是无穷的，代表有些浮点数必会有精度的损失，0.1，0.2 表示为二进制会有精度的损失。比较时引入一个很小的数值 `Number.EPSILON` 容忍误差，其值为 `2^-52`。
>
> ``` js
> function equal (a, b) {
>   return Math.abs(a - b) < Number.EPSILON
> }
> ```

<small style="text-align: right">

[source](https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch2.md#user-content-small-decimal-values)
[zhihu](https://www.zhihu.com/question/28551135)

</small>

5. 如何判断一个数值为整数？

> ``` js
> # ES6
> Number.isInteger(num);
> 
> # ES5
> if (!Number.isInteger) {
>   Number.isInteger = function(num) {
>     return typeof num == "number" && num % 1 == 0;
>   };
> }
> ```

<small style="text-align: right">

[source](https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch2.md#user-content-testing-for-integers)

</small>

6. 如何判断一个数值为 +0？

> ``` js
> function isPosZero (n) {
>   return n === 0 && n / 0 === -Infinity
> }
> ```

7. `'abc'.toUpperCase()` 中 'abc' 作为 primitive value，如何访问 `toUpperCase` 方法

> 当 `primitive value` 访问属性或者方法时，会自动转化为它的包装对象。另外也可以使用 `Object.prototype.valueOf()` 解包装(Unboxing)。

<small style="text-align: right">

[source](https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch3.md#user-content-boxing-wrappers)

</small>

8. 判断以下结果 (Boxing Wrappers)

``` js
function foo() {
  console.log(this)
}

foo.call(3);
```

> Number(3)。理由如上。

8. 判断以下结果

```
Array.isArray(Array.prototype)
```

> 内置对象的 prototype 都不是纯对象，比如 `Date.prototype` 是 Date，`Set.prototype` 是 Set。

<small style="text-align: right">

[source](https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch3.md#user-content-native-prototypes)

</small>

9. 判断以下结果

``` js
Boolean(new Boolean(false));
Boolean(document.all);

[] == '';
[3] == 3;
[] == false;
42 == true;
```

> new Boolean() 返回 object，为 true
> document.all，历史问题，参考[这里](https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch3.md#user-content-native-prototypes)
> 
> Falsy value 指会被强制转化为 false 的值，有以下五种。除此之外全部会转化为 true
> + undefined
> + null
> + false
> + +0, -0, and NaN
> + ""

<small style="text-align: right">

[source](https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch4.md#user-content-toboolean)

</small>


10. 找出以下代码问题 (TDZ)

``` js
var a = 3;
let a;
```

> 这是暂时性死域(Temporal Dead Zone)的问题，let a 声明之前，不能使用 a。

11. 找出以下代码问题 (TDZ)

``` js
var x = 3;

function foo (x=x) {
    // ..
}

foo()
```

> 同样，在函数默认参数中，也有 TDZ。

## scope & closures

1. `var a = 2` 中，`Engine`，`Scope`，`Compiler` 做了什么工作

2. 判断以下结果 (Lexical Scope)
``` js
var scope = 'global scope';
function checkscope () {
  var scope = 'local scope';
  function f() {
    return scope; 
  }
  return f;
}

checkScope()();
```

> local scope。由于 js 为词法作用域(Lexical Scope)，访问某个变量时，先在当前作用域中查找，如果查找不到则在嵌套作用域中查找，直到找到。如果找不到，则报 `ReferenceError`。

3. 判断以下结果 (Hoisting)
``` js
console.log(a);
var a = 3;
```

> undefined。会被编译器理解为
> ``` js
> var a;
> console.log(a);
> a = 3;
> ```

4. 判断以下结果 (Function First)
``` js
var foo = 1;
function foo () {

}
console.log(foo);
```

> 1。函数也会有提升，所以会被赋值覆盖。

5. 判断以下结果 (IIFE & Function First)
``` js
var foo = 1;
(function () {
  foo = 2;
  function foo () {
     
  }

  console.log(foo);
})()

console.log(foo);
```

> 2，1。会被编译器理解为如下形式
``` js
var foo = 1;
(function () {
  var foo;
  function foo () {
     
  }

  foo = 2;
  console.log(foo);
})()

console.log(foo);
```

6. 判断以下结果，如何按序输出 (Closure)
``` js
for (var i = 0; i < 10; i++) {
  setTimeout(function () {
    console.log(i);
  }, 1000)
}
```

> 1s 之后连续输出 10 个 10。因为没有块级作用域，可以把 var 改成 let，也可以给 setTimeout 包装一层 IIFE。

## this & object prototypes

> 以下均为浏览器环境

1. 判断以下结果 (Default Binding)
``` js
function foo() {
  "use strict";
  console.log( this.a );
}

var a = 2;

foo();
```

> 会报错，在函数的严格模式下，默认绑定其中的 this 指向 undefined。

2. 判断以下结果
``` js
"use strict";
var a = 2;
let b = 3;

console.log(this.a, this.b);
```

> 2
> 在浏览器环境中 this 指向 window，而 var 声明的变量会被挂在 window 上。而 let 声明的变量不会挂在 window 上。

3. 判断以下结果 (Strict Mode & Default Binding)
``` js
function foo() {
	console.log( this.a );
}

var a = 2;

(function(){
	"use strict";

	foo();
})();
```

> 2
> 只有存在 this 的函数中设置严格模式，this 为 undefined。因此会正常输出。

4. 判断以下结果 (Hard Binding)
``` js
function foo () {
  console.log(this.a);
}

const o1 = { a: 3 };
const o2 = { a: 4 };

foo.bind(o1).bind(o2)();
```

> 3
> bind 为硬绑定，只会在第一次绑定有效

4. 如何实现 `Function.prototype.bind` 与 `Function.prototype.softBind`

4. `new` 的过程中发生了什么，判断以下结果 (new)
``` js
function F () {
  this.a = 3;
  return {
    a: 4;
  }
}

const f = new F();
console.log(f.a);
```

5. 什么是 `data descriptor` 和 `accessor descriptor`
6. 如何访问一个对象的属性与如何对一个对象的属性赋值 ([[Get]] & [[Put]])
7. 如何遍历一个对象 ($$iterator)
8. 如何实现一个继承 (Object.create & call)
9. 如何实现 `__proto__`
10. 如何实现 `Object.create`
