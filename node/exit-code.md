date: 2020-08-25 21:00
alia: 一个进程的灭亡与善后

---

# Node 中进程异常时的退出码与处理

人固有一死，一个 Node 进程亦是如此，总有万般不愿也无法避免。从本篇文章我们看看一个进程灭亡时如何从容离去。

一个 Node 进程，除了提供 HTTP 服务外，也绝少不了跑脚本的身影。跑一个脚本拉取配置、处理数据以及定时任务更是家常便饭。在一些重要流程中能够看到脚本的身影：

1. CI，用以测试、质量保障及部署等
1. Cron，用以定时任务
1. Docker，用以构建镜像

如果在这些重要流程中脚本出错无法及时发现问题，将有可能引发更加隐蔽的问题。如果在 HTTP 服务出现问题时，无法捕获，服务异常是不可忍受的。

最近观察项目镜像构建，会偶尔发现一两个镜像虽然构建成功，但容器却跑不起来的情况究其原因，是因为 **一个 Node 进程灭亡却未曾感知到的问题**。

## Exit Code

> 什么是 exit code?

`exit code` 代表一个进程的返回码，通过系统调用 `exit_group` 来触发。

在 `POSIX` 中，`0` 代表正常的返回码，`1-255` 代表异常返回码，在业务实践中，一般主动抛出的错误码都是 `1`。在 Node 应用中调用 API `process.exitCode = 1` 来代表进程因期望外的异常而中断退出。

这里有一张关于异常码的附表 [Appendix E. Exit Codes With Special Meanings](http://www.tldp.org/LDP/abs/html/exitcodes.html)。

| Exit Code Number | Meaning                                                    | Example                 | Comments                                                                                                     |
|------------------|------------------------------------------------------------|-------------------------|--------------------------------------------------------------------------------------------------------------|
| 1                | Catchall for general errors                                | let "var1 = 1/0"        | Miscellaneous errors, such as "divide by zero" and other impermissible operations                            |
| 2                | Misuse of shell builtins (according to Bash documentation) | empty_function() {}     | Missing keyword or command, or permission problem (and diff return code on a failed binary file comparison). |
| 126              | Command invoked cannot execute                             | /dev/null               | Permission problem or command is not an executable                                                           |
| 127              | "command not found"                                        | illegal_command         | Possible problem with $PATH or a typo                                                                        |
| 128              | Invalid argument to exit                                   | exit 3.14159            | exit takes only integer args in the range 0 - 255 (see first footnote)                                       |
| 128+n            | Fatal error signal "n"                                     | kill -9 $PPID of script | $? returns 137 (128 + 9)                                                                                     |
| 130              | Script terminated by Control-C                             | Ctl-C                   | Control-C is fatal error signal 2, (130 = 128 + 2, see above)                                                |
| 255*             | Exit status out of range                                   | exit -1                 | exit takes only integer args in the range 0 - 255                                                            |

异常码在操作系统中随处可见，以下是一个关于 `cat` 进程的异常以及它的 `exit code`，并使用 `strace` 追踪系统调用。

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

从 `strace` 追踪进程显示的最后一行可以看出，该进程的 `exit code` 是 1，并把错误信息输出到 `stderr` (stderr 的 fd 为2) 中
## 如何查看 exit code

从 `strace` 中可以来判断进程的 `exit code`，但是不够方便过于冗余，更无法第一时间来定位到异常码。

**有一种更为简单的方法，通过 `echo $?` 来确认返回码**

``` bash
$ cat a
cat: a: No such file or directory

$ echo $?
1
```

``` bash
$ node -e "preocess.exit(52)"
$ echo $?
52
```

## 未曾感知的痛苦何在: `throw new Error` 与 `Promise.reject` 区别

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
```

在对上述两个测试用例使用 `echo $?` 查看 exit code，我们会发现 `throw new Error()` 的 `exit code` 为 1，而 `Promise.reject()` 的为 0。

**从操作系统的角度来讲，`exit code` 为 0 代表进程成功运行并退出，然而此时即使有 `Promise.reject`，操作系统也会视为它执行成功。**

这在 `Dockerfile` 与 `CI` 中执行脚本时将留有安全隐患。

## Dockerfile 在 Node 镜像构建时的隐患

当使用 `Dockerfile` 构建镜像或者 CI 时，如果进程返回非0返回码，构建就会失败。

这是一个浅显易懂的含有 `Promise.reject()` 问题的镜像，我们从这个镜像来看出问题所在。

``` dockerfile
FROM node:12-alpine

RUN node -e "Promise.reject('hello, world')"
```

构建镜像过程如下，最后两行提示镜像构建成功：**即使在构建过程打印出了 `unhandledPromiseRejection` 信息，但是镜像仍然构建成功。**

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

但如果是在 node 15 镜像内，镜像会构建失败，至于原因以下再说。

``` dockerfile
FROM node:15-alpine

RUN node -e "Promise.reject('hello, world')"
```

``` bash
$ docker build -t demo .
Sending build context to Docker daemon  2.048kB
Step 1/2 : FROM node:15-alpine
 ---> 8bf655e9f9b2
Step 2/2 : RUN node -e "Promise.reject('hello, world')"
 ---> Running in 4573ed5d5b08
node:internal/process/promises:245
          triggerUncaughtException(err, true /* fromPromise */);
          ^

[UnhandledPromiseRejection: This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). The promise rejected with the reason "hello, world".] {
  code: 'ERR_UNHANDLED_REJECTION'
}
The command '/bin/sh -c node -e "Promise.reject('hello, world')"' returned a non-zero code: 1
```

## Promise.reject 脚本解决方案

能在编译时能发现的问题，绝不要放在运行时。所以，构建镜像或 CI 中需要执行 node 脚本时，对异常处理需要手动指定 `process.exitCode = 1` 来提前暴露问题

``` js
runScript().catch(() => {
  process.exitCode = 1
})
```

在构建镜像时，Node 也有关于异常解决方案的建议：

> (node:1) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). To terminate the node process on unhandled promise rejection, use the CLI flag `--unhandled-rejections=strict` (see https://nodejs.org/api/cli.html#cli_unhandled_rejections_mode). (rejection id: 1)

根据提示，`--unhandled-rejections=strict` 将会把 `Promise.reject` 的退出码设置为 `1`，并在将来的 node 版本中修正 `Promise` 异常退出码。

**而下一个版本 Node 15.0 已把 `unhandled-rejections` 视为异常并返回非0退出码。**

``` bash
$ node --unhandled-rejections=strict error.js 
```

## Signal

在外部，如何杀死一个进程？答：`kill $pid`

而更为准确的来说，一个 `kill` 命令用以向一个进程发送 `signal`，而非杀死进程。大概是杀进程的人多了，就变成了 kill。

> The kill utility sends a signal to the processes specified by the pid operands.

每一个 `signal` 由数字表示，signal 列表可由 `kill -l` 打印

``` bash
# 列出所有的 signal
$ kill -l
 1) SIGHUP       2) SIGINT       3) SIGQUIT      4) SIGILL       5) SIGTRAP
 6) SIGABRT      7) SIGBUS       8) SIGFPE       9) SIGKILL     10) SIGUSR1
11) SIGSEGV     12) SIGUSR2     13) SIGPIPE     14) SIGALRM     15) SIGTERM
16) SIGSTKFLT   17) SIGCHLD     18) SIGCONT     19) SIGSTOP     20) SIGTSTP
21) SIGTTIN     22) SIGTTOU     23) SIGURG      24) SIGXCPU     25) SIGXFSZ
26) SIGVTALRM   27) SIGPROF     28) SIGWINCH    29) SIGIO       30) SIGPWR
31) SIGSYS      34) SIGRTMIN    35) SIGRTMIN+1  36) SIGRTMIN+2  37) SIGRTMIN+3
38) SIGRTMIN+4  39) SIGRTMIN+5  40) SIGRTMIN+6  41) SIGRTMIN+7  42) SIGRTMIN+8
43) SIGRTMIN+9  44) SIGRTMIN+10 45) SIGRTMIN+11 46) SIGRTMIN+12 47) SIGRTMIN+13
48) SIGRTMIN+14 49) SIGRTMIN+15 50) SIGRTMAX-14 51) SIGRTMAX-13 52) SIGRTMAX-12
53) SIGRTMAX-11 54) SIGRTMAX-10 55) SIGRTMAX-9  56) SIGRTMAX-8  57) SIGRTMAX-7
58) SIGRTMAX-6  59) SIGRTMAX-5  60) SIGRTMAX-4  61) SIGRTMAX-3  62) SIGRTMAX-2
63) SIGRTMAX-1  64) SIGRTMAX
```

这些信号中与终端进程接触最多的为以下几个，其中 SIGTERM 为 kill 默认发送信号，SIGKILL 为强制杀进程信号

| 信号      | 数字 | 是否可捕获 | 描述           |
|---------|----|-------|--------------|
| SIGINT  | 2  | 可捕获   | Ctrl+C 中断进程  |
| SIGQUIT | 3  | 可捕获   | Ctrl+D 中断进程  |
| SIGKILL | 9  | 不可捕获  | 强制中断进程（无法阻塞） |
| SIGTERM | 15 | 可捕获   | 优雅终止进程（默认信号） |
| SIGSTOP | 19 | 不可捕获  | 优雅终止进程中      |

在 Node 中，`process.on` 可以监听到可捕获的退出信号而不退出。以下示例监听到 SIGINT 与 SIGTERM 信号，SIGKILL 无法被监听，setTimeout 保证程序不会退出

``` js
console.log(`Pid: ${process.pid}`)

process.on('SIGINT',  () => console.log('Received: SIGINT'))
// process.on('SIGKILL', () => console.log('Received: SIGKILL'))
process.on('SIGTERM', () => console.log('Received: SIGTERM'))

setTimeout(() => {}, 1000000)
```

运行脚本，启动进程，可以看到该进程的 pid，使用 `kill -2 97864` 发送信号，进程接收到信号并未退出

``` bash
$ node signal.js
Pid: 97864
Received: SIGTERM
Received: SIGTERM
Received: SIGTERM
Received: SIGINT
Received: SIGINT
Received: SIGINT
```

## 容器中退出时的优雅处理

当在 k8s 容器服务升级时需要关闭过期 Pod 时，会向容器的主进程(PID 1)发送一个 SIGTERM 的信号，并预留 30s 善后。如果容器在 30s 后还没有退出，那么 k8s 会继续发送一个 SIGKILL 信号。如果古时皇帝白绫赐死，教你体面。

其实不仅仅是容器，CI 中脚本也要优雅处理进程的退出。

当接收到 `SIGTERM`/`SIGINT` 信号时，预留一分钟时间做未做完的事情。

``` js
async function gracefulClose(signal) {
  await new Promise(resolve => {
    setTimout(resolve, 60000)
  })

  process.exit()
}

process.on('SIGINT',  gracefulClose)
process.on('SIGTERM', gracefulClose)
```

这个给脚本预留时间是比较正确的做法，但是如果是一个服务有源源不断的请求过来呢？那就由服务主动关闭吧，调用 `server.close()` 结束服务

``` js
const server = http.createServer(handler)

function gracefulClose(signal) {
  server.close(() => {
    process.exit()
  })
}

process.on('SIGINT',  gracefulClose)
process.on('SIGTERM', gracefulClose)
```

## 总结

1. 当进程结束的 exit code 为非 0 时，系统会认为该进程执行失败
1. 通过 `echo $?` 可查看终端上一进程的 exit code
1. Node 中 `Promise.reject` 时 exit code 为 0
1. Node 中可以通过 `process.exitCode = 1` 显式设置 exit code
1. 在 Node12+ 中可以通过 `node --unhandled-rejections=strict error.js` 执行脚本，视 `Promise.reject` 的 `exit code` 为 1，在 Node15 中修复了这一个问题
1. Node 进程退出时需要优雅退出
1. k8s 关闭 POD 时先发一个 SIGTERM 信号，留 30s 时间处理未完成的事，如若 POD 没有正常退出，30s 过后发送 SIGKILL 信号
