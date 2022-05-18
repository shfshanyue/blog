# 跟着示例学习 React 18

在3月29号，React 正式发布了 React 18，目前 React 18 已经是 React 的默认版本号，可以在[React18 发布日志](https://github.com/facebook/react/releases/tag/v18.0.0)中查看新特性及新API。

![](https://files.mdnice.com/user/5840/bc803594-7d96-4984-89b6-11838c7908be.png)

## 尝试 React 18

+ [Glossary + Explain Like I'm Five](https://github.com/reactwg/react-18/discussions/46)
+ [New Suspense SSR Architecture in React 18](https://github.com/reactwg/react-18/discussions/37)

## React 18 新特性一览

+ concept: `Concurrent`
+ hooks: `useId`、`useTransition`、`useDeferredValue`、`useSyncExternalStore`、`useInsertionEffect`
+ React DOM Client: `createRoot`、`hydrateRoot`
+ React DOM Server: `renderToPipeableStream`、`renderToReadableStream`
+ 一些更新特性:
  + `Automatic batching`
  + `Stricter Strict Mode`
  + `Consistent useEffect timing`
  + `Stricter hydration errors`
  + `Suspense trees are always consistent`
  + `Layout Effects with Suspense`
  + `New JS Environment Requirements`

## Concurrent

