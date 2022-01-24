## 关键词

+ 一年工作经验
+ 项目版本号
+ 基础组件封装
+ React
+ UMI
+ 包装类型
+ Object.create
+ new

## 问题

+ hooks 的优势
  + 状态难以复用 (状态管理)
  + withRouter(HOC)/useRouter(hook) ...
+ hoc
  + 高阶组件 (属性注入)
+ hooks 哪些
  + useState
  + useEffect
    + componentDidMount
    + [deps]
  + useCallback
  + useMemo
    + 如何避免不必要的渲染？
+ hooks 第三方
  + ahooks
  + react-use
+ 如何在项目中发送请求
  + umi.request (fetch) ...
+ React.memo
  + 避免 rerender，浅比较
  + {a: 3, b: 4}
  + {a: 3, b: 4, o: {}} ...
  + https://codesandbox.io/s/reactmemo-and-reactusememo-79txp?file=/src/App.js
+ 原始数据类型
  + number
  + string
  + bool
  + undefined
  + null
  + bigint
  + symbol
+ 包装类型
  + String
  + Number
  + 'hello'.replace()
+ ES6
  + Map 和 WeakMap 的区别
  + Promise.race 及用途(timeout) ...
  + Promise.all 手写实现吗
  + 如何拍平数组 (.flat)
  + 如何判断一个值是数组
    + Array.isArray
    + .toString.call
  + Object.create
    + Object.create(null) / {}
+ 防抖和节流
  + debounde
  + throtle
+ CommonJS/UMD/ESM
+ 如何创建一个数组大小为 100，每个值都为 0 的数组
  + Array.from({ length: 100 }).map(() => 0)
  + https://q.shanyue.tech/fe/js/520.html

## 反馈建议

在问完 React 基础后，山月觉得该同学略有不足，准备结束面试。但是候选人多说了一句，(20:08 位置)可以再多问我一些 Javascript 基础问题，于是我便多问了一些。

这一举动很容易使面试逆风翻盘，从而通过面试。

因为面试官是期望候选人通过面试，甚至有时对候选人不太满意，还会咨询下候选人：你觉得你擅长哪一块内容但我没有面试到呢？

+ 如果中途面试官(山月)没有被打断，很容易就会挂了，但在中途，候选人问，可以再多问我一些 JS 基础。则很容易翻盘通过此面，而到了二面。
+ React 不足，要多加强此方面的练习。基础再继续加强。
+ Javascript -> MDN
+ React/在项目中全局搜索 use -> 了解自己的项目中使用了哪些第三方 hooks
+ ahooks/react-use -> usePrevious
+ React
  + https://q.shanyue.tech/fe/react/9.html
  + https://github.com/shfshanyue/Daily-Question#codesandbox-%E7%A4%BA%E4%BE%8B%E9%9B%86
+ React.memo 与 useMemo: https://codesandbox.io/s/reactmemo-and-reactusememo-79txp?file=/src/App.js
+ 简历多罗列一些擅长的东西
