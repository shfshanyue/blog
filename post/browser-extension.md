# 浏览器插件开发

## 创建 Chrome APP

``` js
chrome.app.runtime.onLaunched.addListener(() => {
  chrome.app.window.create('index.html', {
    id: "clockWinID"
  })
})
```

## 设置快捷键

``` js
{
  "commands" : {
    "cmdNew": {
        "suggested_key": {
          "default": "Ctrl+Shift+1"
        },
        "global": true,
        "description": "Create new window"
    }
  }
}
```

## 