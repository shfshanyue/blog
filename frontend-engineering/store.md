``` js
import { createStore } from 'redux'

// 在 React 项目中需要维护: action/counter.js
const INCREMENT = 'INCREMENT'
const DECREMENT = 'DECREMENT'

// 在 React 项目中需要维护: reducer/counter.js
function counter(state = 0, action) {
  switch (action.type) {
    case INCREMENT:
      return state + 1
    case DECREMENT:
      return state - 1
    default:
      return state
  }
}

// 在 React 项目中需要维护: store.js
const store = createStore(counter)
store.subscribe(() => console.log(store.getState()))

// 在 React 项目中需要维护: containers/Counter.js
store.dispatch({ type: INCREMENT })
// 1
store.dispatch({ type: INCREMENT })
// 2
```

+ `combineReduers`
+ `bindActionCreator`



+ `connect`
+ `Provider`
+ `mapStateToProps`
+ `mapDispatchToProps`

## Redux TechStack

+ `redux`
+ `react-redux`
+ `redux-thunk`
+ `redux-saga`
+ `redux-actions`
+ `reselect`
+ `redux-persist`
