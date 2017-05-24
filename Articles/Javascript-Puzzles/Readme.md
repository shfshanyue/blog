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
7. `'abc'.toUpperCase()` 中 'abc' 作为 primitive value，如何访问 `toUpperCase` 方法

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

10. 找出以下代码问题 (TDZ)

``` js
var a = 3;
let a;
```

11. 找出以下代码问题 (TDZ)

``` js
var b = 3;

function foo( a = 42, b = a + b + 5 ) {
    // ..
}

foo()
```

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
```

3. 判断以下结果 (Hoisting)
``` js
console.log(a);
var a = 3;
```

4. 判断以下结果 (Function First)
``` js
var foo = 1;
function foo () {

}
console.log(foo);
```

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

6. 判断以下结果，如何按序输出 (Closure)
``` js
for (var i = 0; i < 10; i++) {
  setTimeout(function () {
    console.log(i);
  }, i * 1000)
}
```

## this & object prototypes
1. 判断以下结果 (Default Binding)
``` js
function foo() {
  "use strict";
  console.log( this.a );
}

var a = 2;

foo();
```

2. 判断以下结果
``` js
"use strict";
var a = 2;

console.log(this);
```

3. 判断以下结果 (Strict Mode & Default Binding)
``` js
function foo() {
	console.log( this.a );
}

var a = 2;

(function(){
	"use strict";

	foo(); // 2
})();
```

4. 判断以下结果 (Hard Binding)
``` js
function foo () {
  console.log(this.a);
}

const o1 = { a: 3 };
const o2 = { a: 4 };

foo.bind(o1).bind(o2)();
```

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
