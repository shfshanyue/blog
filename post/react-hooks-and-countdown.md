---
title: "react-hook 与 计数器"
---

Hook 是 React 16.8 的新增特性，官网有一个相当简单的示例来展示它的用法

```javascript
import React, { useState } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}
```

一见倾心，它的简洁深深打动了我。于是我决定为它添加几行代码写个计数器:

```javascript
import React, { useState } from 'react';

function Example () {
  const [count, setCount] = useState(0);

  const countdown = () => {
    setTimeout(() => {
      setCount(count + 1)
      countdown()
    }, 1000)
  }

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={countdown}>
        Click me
      </button>
    </div>
  );
}
```
