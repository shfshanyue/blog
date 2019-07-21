# 在 react 中，useCallback 和 useMemo 是不是值得大量使用？

现状: 目前我写 React 很少使用，在少数有必要的情况下进行使用。

1. 在 React 中，每一个组件重新渲染时，会导致该组件所有的子组件都会进行重新渲染。
1. 在 React 中，性能优化的核心是**减少组件的渲染次数**。

基于以上两点，当一个子组件所有的 `props` 都未发生改变时，仍然会受到重新渲染，将会造成性能上的浪费。

``` js
function One() {
  console.log("Rndering One Component");
  return <h2>One</h2>;
}

const MemoOne = React.memo(function One() {
  console.log("Rndering MemoOne Component");
  return <h2>MemoOne</h2>;
});
```

如以上两个组件，`MemoOne` 通过 `React.memo` 进行优化，通过**浅比较**对比渲染前后两次的 `props`，避免了每次子组件渲染更新的消耗。

> 而在我的生产实践中，

那此时的主题， `useMemo` 和 `useCallback` 是如何进行性能优化的呢？

`React.memo` 通过浅比较来进行性能优化，

以下是一个关于 `useMemo` 的示例，此时优化无法生效，

``` js
function App() {
  const [count, setCount] = useState(0);

  const normalStyle = {
    color: "white"
  };

  const memoizedStyle = useMemo(() => {
    return {
      color: "white"
    };
  }, []);

  return (
    <>
      <button
        onClick={() => {
          setCount(count + 1);
        }}
      >
        Increment {count}
      </button>
      <One style={memoizedStyle} title="Memoized" />
      <One style={normalStyle} title="Normal" />
    </>
  );
}
```
