# 如何临时修复 node_modules 某个库的紧急问题？

假设 `lodash` 有一个 Bug，影响线上开发，应该怎么办？

![把大象扔进冰箱里需要几步](https://cdn.jsdelivr.net/gh/shfshanyue/assets/2021-11-11/clipboard-5920.ee51bc.webp)

答: 三步走。

1. 在 Github 提交 Pull Request，修复 Bug，等待合并
1. 合并 PR 后，等待新版本发包
1. 升级项目中的 lodash 依赖

很合理很规范的一个流程，但是它一个最大的问题就是，太慢了，三步走完黄花菜都凉了。

此时可直接上手修改 `node_modules` 中 lodash 代码，并修复问题！

新问题：`node_modules` 未纳入版本管理，在生产环境并没有用。请看流程

1. 本地修改 `node_modules/lodash`，本地正常运行 ✅
1. 线上 `npm i lodash`，lodash 未被修改，线上运行失败 ❌

此时有一个简单的方案，临时将修复文件纳入工作目录，可以解决这个问题

1. 本地修改 `node_modules/lodash`，本地正常运行 ✅
2. 将修改文件复制到 `${work_dir}/patchs/lodash` 中，纳入版本管理 
3. 线上 `npm i lodash`，并将修改文件再度复制到 `node_modules/lodash` 中，线上正常运行 ✅

但此时并不是很智能，且略有小问题，演示如下:

1. 本地修改 `node_modules/lodash`，本地正常运行 ✅
2. 将修改文件复制到 `${work_dir}/patchs/lodash` 中，纳入版本管理 ✅
3. 线上 `npm i lodash`，并将修改文件再度复制到 `node_modules/lodash` 中，线上正常运行 ✅
4. 两个月后升级 `lodash`，该问题得以解决，而我们代码引用了 lodash 的新特性
5. 线上 `npm i lodash`，并将修改文件再度复制到 `node_modules/lodash` 中，由于已更新了 lodash，并且依赖于新特性，线上运行失败 ❌

此时有一个万能之策，那就是 [patch-package](https://github.com/ds300/patch-package)

## patch-package

想要知道 `patch-package` 如何解决上述问题，请先了解下它的用法，流程如下

``` bash
# 修改 lodash 的一个小问题
$ vim node_modules/lodash/index.js

# 对 lodash 的修复生成一个 patch 文件，位于 patches/lodash+4.17.21.patch
$ npx patch-package lodash

# 将修复文件提交到版本管理之中
$ git add patches/lodash+4.17.21.patch
$ git commit -m "fix 一点儿小事 in lodash"

# 此后的命令在生产环境或 CI 中执行
# 此后的命令在生产环境或 CI 中执行
# 此后的命令在生产环境或 CI 中执行

# 在生产环境装包
$ npm i

# 为生产环境的 lodash 进行小修复
$ npx patch-package

# 大功告成！
```

再次看下 `patch-package` 自动生成 patch 文件的本来面目吧:

它实际上是一个 `diff` 文件，在生产环境中可自动根据 diff 文件与版本号 (根据patch文件名存取) 将修复场景复原！

``` bash
$ cat patches/lodash+4.17.21.patch
diff --git a/node_modules/lodash/index.js b/node_modules/lodash/index.js
index 5d063e2..fc6fa33 100644
--- a/node_modules/lodash/index.js
+++ b/node_modules/lodash/index.js
@@ -1 +1,3 @@
+console.log('DEBUG SOMETHING')
+
 module.exports = require('./lodash');
\ No newline at end of file
```