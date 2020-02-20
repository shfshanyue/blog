# You-Dont-Know-JS 疑难汇总

最近我看了 You-Dont-Know-JS 的两个小册，在看书的过程中，为了方便以后索引与更深入的了解，也为了避免遗忘，我对每一册的较为复杂的点做了总结，编辑如下

<!--more-->

## types & grammer

1. 判断以下结果

    ```js
    var s = 'abc';
    s[1] = 'B';

    console.log(s);

    var l = new String('abc');
    l[1] = 'B';
    console.log(l);
    ```

    > `string` 及其包装对象 (Boxed Object) 是不可变 (immutable) 类型，因此不能改变它本身(modify in place)，所以 `String` 的所有方法都是返回一个新的字符串，而不会改变自身。
    > 
    > + [You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch2.md#user-content-strings)

1. 如何逆序一个字符串？

    > `s.split('').reverse().join('')`

1. 接上，为什么不能直接使用 `Array.prototype.reverse.call(s)` 逆序字符串？

    > 当一个数组逆序时 `l.reverse()` 会改变 l 本身。正如第一题，`string` 不能改变自身。

1. 判断以下结果，为什么会出现这样的情况，如何做出正确的比较？

    ```js
    0.1 + 0.2 === 0.3;
    0.8 - 0.6 === 0.2;
    ```

    > 浮点数根据 IEEE 754 标准存储64 bit 双精度，能够表示 2^64 个数，而浮点数是无穷的，代表有些浮点数必会有精度的损失，0.1，0.2 表示为二进制会有精度的损失。比较时引入一个很小的数值 `Number.EPSILON` 容忍误差，其值为 `2^-52`。
    >
    > ```js
    > function equal (a, b) {
    >   return Math.abs(a - b) < Number.EPSILON
    > }
    > ```
    >
    > + [You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch2.md#user-content-small-decimal-values)
    > + [知乎](https://www.zhihu.com/question/28551135)

1. 如何判断一个数值为整数？

    > ```js
    > // ES6
    > Number.isInteger(num);
    > 
    > // ES5
    > if (!Number.isInteger) {
    >   Number.isInteger = function(num) {
    >     return typeof num == "number" && num % 1 == 0;
    >   };
    > }
    > ```
    >
    > + [You-Dont-Know-JS#user-content-testing-for-integers](https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch2.md#user-content-testing-for-integers)


1. 如何判断一个数值为 +0？

    > ```js
    > function isPosZero (n) {
    >   return n === 0 && 1 / n === Infinity
    > }
    > ```

1. `'abc'.toUpperCase()` 中 'abc' 作为 primitive value，如何访问 `toUpperCase` 方法

    > 当 `primitive value` 访问属性或者方法时，会自动转化为它的包装对象。另外也可以使用 `Object.prototype.valueOf()` 解包装(Unboxing)。

    > + [You-Dont-Know-JS#user-content-boxing-wrappers](https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch3.md#user-content-boxing-wrappers)

1. 判断以下结果 (Boxing Wrappers)

    ```js
    function foo() {
      console.log(this)
    }

    foo.call(3);
    ```

    > Number(3)。理由如上。

1. 判断以下结果

    ```javascript
    Array.isArray(Array.prototype)
    ```

    > true
    > 内置对象的 prototype 都不是纯对象，比如 `Date.prototype` 是 Date，`Set.prototype` 是 Set。
    > + [You-Dont-Know-JS#user-content-native-prototypes](https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch3.md#user-content-native-prototypes)

1. 判断以下结果

    ```js
    Boolean(new Boolean(false));
    Boolean(document.all);

    [] == '';
    [3] == 3;
    [] == false;
    42 == true;
    ```

    > new Boolean() 返回 object，为 true
    > document.all，历史问题，参考[这里](https://stackoverflow.com/questions/10350142/why-is-document-all-falsy)
    > Falsy value 指会被强制转化为 false 的值，有以下五种。除此之外全部会转化为 true
    > + undefined
    > + null
    > + false
    > + +0, -0, and NaN
    > + ""
    >
    > [You-Dont-Know-JS#user-content-toboolean](https://github.com/getify/You-Dont-Know-JS/blob/master/types%20%26%20grammar/ch4.md#user-content-toboolean)


1. 找出以下代码问题 (TDZ)

    ```js
    var a = 3;
    let a;
    ```

    > 这是暂时性死域(Temporal Dead Zone)的问题，let a 声明之前，不能使用 a。

1. 找出以下代码问题 (TDZ)

    ```js
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

    ```javascript
    var scope = 'global scope';
    function checkScope () {
      var scope = 'local scope';
      function f() {
        return scope; 
      }
      return f;
    }

    checkScope()();
    ```

    > 'local scope'
    >
    > 由于 js 为词法作用域(Lexical Scope)，访问某个变量时，先在当前作用域中查找，如果查找不到则在嵌套作用域中查找，直到找到。如果找不到，则报 `ReferenceError`。

1. 判断以下结果 (Hoisting)

    ```js
    console.log(a);
    var a = 3;
    ```

    > undefined
    >
    > 以上代码会被编译器理解为
    >
    > ```js
    > var a;
    > console.log(a);
    > a = 3;
    > ```

1. 判断以下结果 (Function First)

    ```javascript
    var foo = 1;
    function foo () {

    }
    console.log(foo);
    ```

    > 1。函数也会有提升，所以会被赋值覆盖。

1. 判断以下结果 (IIFE & Function First)

    ```javascript
    var foo = 1;
    (function () {
      foo = 2;
      function foo () {}
    
      console.log(foo);
    })()
    
    console.log(foo);
    ```

    > 2，1
    >
    > 以上代码会被编译器理解为如下形式
    >
    > ```javascript
    > var foo = 1;
    > (function () {
    >   var foo;
    >   function foo () {
    >   }
    > 
    >   foo = 2;
    >   console.log(foo);
    > })()
    > 
    > console.log(foo);
    > ```

1. 判断以下结果，如何按序输出 (Closure)

    ```js
    for (var i = 0; i < 10; i++) {
      setTimeout(function () {
        console.log(i);
      }, 1000)
    }
    ```

    > 大约 1s 之后连续输出 10 个 10。因为没有块级作用域，可以把 var 改成 let，也可以给 setTimeout 包装一层 IIFE。

## this & object prototypes

> 注意：以下均为浏览器环境中

1. 判断以下结果 (Default Binding)

    ```js
    function foo() {
      "use strict";
      console.log( this.a );
    }
    
    var a = 2;
    
    foo();
    ```

    > 会报错，在函数的严格模式下，默认绑定其中的 this 指向 undefined。

1. 判断以下结果

    ```js
    "use strict";
    var a = 2;
    let b = 3;

    console.log(this.a, this.b);
    ```

    > 2, undefined
    >
    > 在浏览器环境中 this 指向 window，而 var 声明的变量会被挂在 window 上。而 let 声明的变量不会挂在 window 上。

1. 判断以下结果 (Strict Mode & Default Binding)

    ```js
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
    >
    > 只有存在 this 的函数中设置严格模式，this 为 undefined。因此会正常输出。

1. 判断以下结果 (Hard Binding)

    ```js
    function foo () {
      console.log(this.a);
    }

    const o1 = { a: 3 };
    const o2 = { a: 4 };

    foo.bind(o1).bind(o2)();
    ```

    > 3
    >
    > bind 为硬绑定，第一次绑定后 this 无法再次绑定。

1. 如何实现 `Function.prototype.bind` 与 `Function.prototype.softBind`

    > bind 为硬绑定，softBind 可以多次绑定 this。大致实现代码如下。bind 第二个参数可以预设函数参数，所以，bind 也是一个偏函数。另外，bind 也需要考虑 `new ` 的情况。**但以下示例主要集中在硬绑定和软绑定的差异之上。**
    >
    > ```js
    > Function.prototype.fakeBind = function (obj) {
    >   var self = this;
    >   return function () {
    >     self.call(obj);
    >   }
    > }
    > 
    > Function.prototype.softBind = function(obj) {
    >   var self = this;
    >   return function () {
    >     self.call(this === window? obj : this);
    >   }
    > };
    > ```

1. `new` 的过程中发生了什么，判断以下结果 (new)

    ```js
    function F () {
      this.a = 3;
      return {
        a: 4;
      }
    }
    
    const f = new F();
    console.log(f.a);
    ```

    > 4
    >
    > `new` 的过程大致为如下几个步骤
    > 1. 创建一个新的对象
    > 2. this 指向实例，并且执行函数
    > 3. **如果没有显式返回，则默认返回这个实例**
    >
    > 因为函数最后显式返回了一个对象，所以打印为 4

1. 什么是 `data descriptor` 和 `accessor descriptor`

    > 两者均通过 `Object.defineProperty()` 定义，有两个公有的键值
    > + configurable 设置该键是否可以删除
    > + enumerable 设置是否可被遍历
    >
    > 数据描述符有以下键值
    > + writable 该键是否可以更改
    > + value
    >
    > 访问器描述符有以下键值
    > + set
    > + get
    > 另外，也可以通过字面量的形式表示访问器描述符
    > ```js
    > const obj = {
    >   get a() {},
    >   set a(val) {}
    > }
    > ```
    > Vue中 `computed` 的内部原理便是`get`，而 `watch` 的内部原理是 `set`

1. 如何访问一个对象的属性？ ([[Get]])

    > 访问对象的属性会触发 [[Get]] 操作，大致简述如下
    > 1. 是否被 Proxy 拦截，如果拦截，查看拦截器的返回值，如果没拦截，继续下一步
    > 2. 检查自身属性，如果没找到则继续下一步
    > 3. 如果没被找到，则在原型链上查找，如果没找到，则返回 undefined
    > 
    > 查找过程与 Scope 查找变量很相似，只不过，对象属性找不到，返回 undefined，而变量找不到报 Reference Error。

1. 如何对一个对象的属性赋值 ([[Put]])

    > 对一个对象的属性赋值会触发 [[Put]] 操作，大致简述如下
    > 1. 检查是否被 Proxy 拦截
    > 2. 如果该对象属性为自身属性 (obj.hasOwnProperty('a') === true)
    >     1. 如果属性是访问描述符，则调用 setter 函数
    >     2. 如果属性是 data descriptor，则检查 writable 是否可写 
    >     3. 普通属性，直接赋值
    > 3. 如果该对象属性存在于原型链上
    >     1. 如果属性是访问描述符，则调用 setter 函数
    >     2. 如果属性是 data descriptor，则检查 writable 是否可写。如果可写，被自身属性覆盖，否则在严格模式下将会报错
    >     3. 普通属性，被自身属性覆盖
    > 4. 如果该对象不存在与原型链上，直接给自身属性赋值

1. 如何遍历一个对象 ($$iterator)

    > 给对象设置 Symbol.iterator 属性

1. 如何实现一个继承 (Object.create & call)

    > 在 ES6 时代可以简单的通过 class & extends 实现继承，ES5 时代用如下方法
    >
    > ```js
    > function A () {}
    > 
    > function B () {
    >   A.call(this)
    > }
    > 
    > B.prototype = Object.create(A.prototype)
    > // B.prototype = new A()     不推荐
    > ```


1. 如何实现 `Object.create`

    > 至于为什么在继承的时候不推荐`new`，原因在于你很难保证 A 是一个纯函数，比如它会有自身属性，有可能操作 DOM 等。以下是一个简单版本的实现，省略了第二个参数。
    >
    > ```js
    > Object.create = function (o) {
    >   function F() {}
    >   F.prototype = o;
    >   return new F();
    > }
    > ```

