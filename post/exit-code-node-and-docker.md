# Node 中异常，exit code 与 docker

最近观察项目 `CI` 跑的情况如何时，会偶尔发现一两个镜像虽然构建成功但是容器跑不起来的情况。究其原因，是因为一个 `exit code` 的问题

## `throw new Error` 与 `Promise.reject` 区别

以下是两段代码，第一个是抛出一个异常，第二个是 `Promise.reject`，两段代码都会如下打印出一段异常信息，那么两者有什么区别？

```javascript
function error () {
  throw new Error('hello, error')
}

error()
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

// (node:60356) UnhandledPromiseRejectionWarning: Error: hello, world
//    at error (/Users/shanyue/Documents/note/demo.js:2:9)
//    at Object.<anonymous> (/Users/shanyue/Documents/note/demo.js:5:1)
//    at Module._compile (internal/modules/cjs/loader.js:701:30)
//    at Object.Module._extensions..js (internal/modules/cjs/loader.js:712:10)
```

从一个比较底层的角度来说，两者的 `exit code` 不一样，那 `exit code` 是什么东西？

## exit code

那 exit code 到底是什么呢？

**`exit code` 代表一个进程的返回码，通过系统调用 `exit_group` 来触发。在 `POSIX` 中，`0` 代表正常的返回码，而 `1-255` 代表异常返回码，不过一般错误码都是 `1`。这里有一张附表 [Appendix E. Exit Codes With Special Meanings](http://www.tldp.org/LDP/abs/html/exitcodes.html)**

所以，在 node 的应用中经常会有 `process.exit(1)` 来代表因为不期望的异常而中断。

现在看一个关于 `cat` 的异常以及它的 `exit code` 与系统调用

```shell
$ cat a
cat: a: No such file or directory

# -e 代表只显示 write 与 exit_group 的系统调用
$ strace -e write,exit_group cat a
write(2, "cat: ", 5cat: )                    = 5
write(2, "a", 1a)                        = 1
write(2, ": No such file or directory", 27: No such file or directory) = 27
write(2, "\n", 1
)                       = 1
exit_group(1)                           = ?
+++ exited with 1 +++
```

可以看出，它的 `exit code` 是 1，并且把错误信息写到 `stderr` (标准错误的 fd 为2) 中了

## 如何查看 exit code

其实从上边的内容可以看出，可以使用 `strace` 来判断进程的 `exit code`。但是这样实在太不方便了，特别是在 shell 编程环境中。

**有一种简单的方法，通过 `echo $?` 来输出返回码**

```shell
$ cat a
cat: a: No such file or directory

$ echo $?
1
```

**在对上述两个测试用例查看 exit code，我们会发现 `throw new Error()` 的 `exit code` 为 1，而 `Promise.reject()` 的为 0。**

## Dockerfile 在 node 中的注意点

node 中的异常与 `exit code` 都说完了，接下来该说与 `Dockerfile` 的关联了。

当使用 `Dockerfile` 构建镜像时，如果其中 `RUN` 的进程返回非0的返回码，则构建就会失败。

**而在 `Node` 中的错误处理中，我们倾向于所有的异常都交由 `async/await` 来处理，而当发生异常时，由于此时 exit code 为 0 并不会导致镜像构建失败。** 如下所示

```Dockerfile
FROM node:alpine

RUN node -e "Promise.reject('hello, world')"
```

```shell
$ docker build -t demo .
Sending build context to Docker daemon  14.85kB
Step 1/2 : FROM node:alpine
 ---> d97a436daee9
Step 2/2 : RUN node -e "Promise.reject('hello, world')"
 ---> Running in 0281c660ab82
(node:1) UnhandledPromiseRejectionWarning: hello, world
(node:1) UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch(). (rejection id: 1)
(node:1) [DEP0018] DeprecationWarning: Unhandled promise rejections are deprecated. In the future, promise rejections that are not handled will terminate the Node.js process with a non-zero exit code.
Removing intermediate container 0281c660ab82
 ---> 2146545654d2
Successfully built 2146545654d2
Successfully tagged demo:latest
```

**而在编译时能发现的问题，绝不要放在运行时。所以，构建镜像需要执行 node 的脚本时，对异常处理需要手动指定 1 的 `exit code`：`process.exit(1)`。**

```javascript
runScript().catch(() => {
  process.exit(1)
})
```
