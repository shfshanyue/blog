---
location: 成都双流
date: 2021-09-07 13:37

---

# 在 VS Code 中如何调试 Node

大家好，我是山月。

不啰嗦，直接开始。

## 最简单的调试方式: Run Current File

由于 `VSCode` 内置 Node 调试器，调试 Node 极其简单，遵循以下步骤

![Run Current File](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/image.2gscriiq4i80.png)

1. 在 ToolBar 中找到 `Run And Debug` 按钮并点击，或直接 `<Command+Shift+D>` 打开调试
1. 在调试面板顶测选择 `Run Current File`
1. 点击绿色调试小按钮，开始调试

`Run Current File` 对于调试 NodeJS 而言仅仅是点一点即可，那如何调试 `Typescript` 以及更复杂的大型项目呢？

## 调试项目: JavaScript Debug Terminal

如果有一个 `ts` 文件需要调试，应如何处理？

![Javascript Debug Terminal](https://cdn.jsdelivr.net/gh/shfshanyue/assets@master/src/image.4dsek6k6zzs0.png)

1. `<Control + ~>` 打开 Terminal
2. 在 `Terminal` 面板右侧点击 `+` 号小按钮，并继续点击 `Javascript Debug Terminal`，打开 JS 可调试的终端
3. 输入执行该 ts 文件的命令: `npx ts-node index.ts`

如果，启动该项目特别复杂，如何处理？

以下为例(虽然不是特别复杂)，把启动命令抽象为 `npm start`。

``` js
{
  "scripts": {
    "start": "NODE_ENV=production node index.js"
  }
}
```

第二步，在可调试终端中输入命令 `npm start`

第三步，开始调试

