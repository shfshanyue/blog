date: 2020-08-25 21:00

---

# Node 中脚本异常时的退出码

一个 Node 相关的项目中，总是少不了跑脚本。跑一个脚本拉取配置、处理一些数据以及定时任务更是家常便饭。

在一些重要流程中能够看到脚本的身影：

1. CI，用以测试、质量保障及部署等
1. Docker，用以构建镜像
1. Cron，用以定时任务

如果在这些重要流程中脚本出错无法及时发现问题，将有可能引发更加隐蔽的问题。

最近观察项目镜像构建，会偶尔发现一两个镜像虽然构建成功，但容器却跑不起来的情况。**究其原因，是因为 `Exit Code` 的问题**。

## Exit Code

> 什么是 exit code?

`exit code` 代表一个进程的返回码，通过系统调用 `exit_group` 来触发。在 `POSIX` 中，`0` 代表正常的返回码，`1-255` 代表异常返回码，一般主动抛出的错误码都是 `1`。在 Node 应用中使用 `process.exitCode = 1` 来代表因不期望的异常而中断。

这里有一张关于异常码的附表 [Appendix E. Exit Codes With Special Meanings](http://www.tldp.org/LDP/abs/html/exitcodes.html)。

异常码在操作系统中随处可见，以下是一个关于 `cat` 命令的异常以及它的 `exit code`，并使用 `strace` 追踪系统调用。

``` bash
$ cat a
cat: a: No such file or directory

# 使用 strace 查看 cat 的系统调用
# -e 只显示 write 与 exit_group 的系统调用
$ strace -e write,exit_group cat a
write(2, "cat: ", 5cat: )                    = 5
write(2, "a", 1a)                        = 1
write(2, ": No such file or directory", 27: No such file or directory) = 27
write(2, "\n", 1
)                       = 1
exit_group(1)                           = ?
+++ exited with 1 +++
```

从系统调用的最后一行可以看出，该进行的 `exit code` 是 1，并把错误信息输出到 `stderr` (标准错误的 fd 为2) 中

## 如何查看 exit code

从 `strace` 中可以来判断进程的 `exit code`，但是不够方便过于冗余，特别身处 shell 编程环境中。

**有一种简单的方法，通过 `echo $?` 来确认返回码**

``` bash
$ cat a
cat: a: No such file or directory

$ echo $?
1
```

## `throw new Error` 与 `Promise.reject` 区别

以下是两段代码，第一段抛出一个异常，第二段 `Promise.reject`，两段代码都会如下打印出一段异常信息，那么两者有什么区别？

```javascript
function error () {
  throw new Error('hello, error')
}

error()

// Output:

// /Users/shanyue/Documents/note/demo.js:2
//   throw new Error('hello, world')
//   ^
// 
// Error: hello, world
//     at error (/Users/shanyue/Documents/note/demo.js:2:9)
//     at Object.<anonymous> (/Users/shanyue/Documents/note/demo.js:5:1)
//     at Module._compile (internal/modules/cjs/loader.js:701:30)
```

```javascript
async function error () {
  return new Error('hello, error')
}

error()

// Output:

// (node:60356) UnhandledPromiseRejectionWarning: Error: hello, world
//    at error (/Users/shanyue/Documents/note/demo.js:2:9)
//    at Object.<anonymous> (/Users/shanyue/Documents/note/demo.js:5:1)
//    at Module._compile (internal/modules/cjs/loader.js:701:30)
//    at Object.Module._extensions..js (internal/modules/cjs/loader.js:712:10)
// (node:2787) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1)
// (node:2787) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
```

在对上述两个测试用例使用 `echo $?` 查看 exit code，我们会发现 `throw new Error()` 的 `exit code` 为 1，而 `Promise.reject()` 的为 0。

**从操作系统的角度来讲，`exit code` 为 0 代表进程成功运行并退出，此时即使有 `Promise.reject`，操作系统也会视为它执行成功。**

这在 `Dockerfile` 与 `CI` 中将留有安全隐患。

## Dockerfile 在 node 中的注意点

当使用 `Dockerfile` 构建镜像时，如果 `RUN` 的进程返回非0的返回码，构建就会失败。

**而在 `Node` 中的错误处理中，我们倾向于所有的异常都交由 `async/await` 来处理，而当发生异常时，由于此时 exit code 为 0 并不会导致镜像构建失败。**

这是一个浅显易懂的含 `Promise.reject()` 问题的镜像。

``` dockerfile
FROM node:12-alpine

RUN node -e "Promise.reject('hello, world')"
```

构建镜像过程如下：**即使在构建过程打印出了 `unhandledPromiseRejection` 信息，但是镜像仍然构建成功。**

``` bash
$ docker build -t demo .
Sending build context to Docker daemon  33.28kB
Step 1/2 : FROM node:12-alpine
 ---> 18f4bc975732
Step 2/2 : RUN node -e "Promise.reject('hello, world')"
 ---> Running in 79a6d53c5aa6
(node:1) UnhandledPromiseRejectionWarning: hello, world
(node:1) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1)
(node:1) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
Removing intermediate container 79a6d53c5aa6
 ---> 09f07eb993fe
Successfully built 09f07eb993fe
Successfully tagged demo:latest
```

## Promise.reject 脚本解决方案

能在编译时能发现的问题，绝不要放在运行时。所以，构建镜像或 CI 中需要执行 node 脚本时，对异常处理需要手动指定 `process.exitCode = 1` 来提前暴露问题

``` js
runScript().catch(() => {
  process.exitCode = 1
})
```

在构建镜像时，也有关于异常解决方案的建议：

> (node:1) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1)

根据提示，`--unhandled-rejections=strict` 将会把 `Promise.reject` 的退出码设置为 `1`，并在将来的 node 版本中修正 `Promise` 异常退出码。

``` bash
$ node --unhandled-rejections=strict error.js 
```

`--unhandled-rejections=strict` 的配置对 node 有版本要求：

> Added in: v12.0.0, v10.17.0
> 
> By default all unhandled rejections trigger a warning plus a deprecation warning
> for the very first unhandled rejection in case no unhandledRejection hook
> is used.

## 总结

1. 当进程结束的 exit code 为非 0 时，系统会认为该进程执行失败
1. 通过 `echo $?` 可查看终端上一进程的 exit code
1. Node 中 `Promise.reject` 时 exit code 为 0
1. Node 中可以通过 `process.exitCode = 1` 显式设置 exit code
1. 在 Node12+ 中可以通过 `node --unhandled-rejections=strict error.js` 执行脚本，视 `Promise.reject` 的 `exit code` 为 1

