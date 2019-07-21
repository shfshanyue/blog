# 记录一个有关 curl 和重定向的小问题

今天在工作时遇到一个有关解压的问题，先来还原问题

**今天在解压一个压缩包时解压失败，以下是命令以及失败提示**

``` bash
$ curl -O https://github.com/alibaba/canal/releases/download/canal-1.1.3/canal.deployer-1.1.3.tar.gz
$ tar -zxvf canal.deployer-1.1.3.tar.gz

gzip: stdin: not in gzip format
tar: Child returned status 1
tar: Error is not recoverable: exiting now
```

> 造成这个问题的原因以及解决方案很简单，对你很有可能没有借鉴意义。不过寻找原因的过程以及从这个问题上学到的东西还是有点意思的

<!--more-->

## StackOverflow

作为程序员的两大利器之一，`StackOverflow` 和 `github`。第一步就跟踪到了 `StackOverflow`，查找到了这个问题，问题描述一模一样

> [How to extract filename.tar.gz file](https://stackoverflow.com/questions/15744023/how-to-extract-filename-tar-gz-file)

首先，使用 `file` 查看文件的类型

``` bash
$ file canal.deployer-1.1.3.tar.gz
canal.deployer-1.1.3.tar.gz: HTML document, ASCII text, with very long lines, with no line terminators
```

如果没有使用 `gzip` 压缩，那需要使用 `tar` 解压的时候，去掉 `-z` 参数。

**无果。**

> 这里安利一个工具，`explainshell` 可以以图文可视化 shell 命令各个参数的意义，当参数较多，命令较长时，非常试用，强烈推荐。
> [explainshell](https://www.explainshell.com/explain?cmd=tar+-zxvf+canal.deployer-1.1.3.tar.gz)

不过，我从 `file` 命令中意识到有可能文件有问题，因为它的输出是 `HTML document`，且是纯文本类型。

## 从源头出发

当我意识到文件有问题时，觉得应该从文件源找出问题。文件是通过 `curl` 下载而来，我添加了 `-v` 参数用来查看 http 详细的报文。

``` bash
$ curl -Ov https://github.com/alibaba/canal/releases/download/canal-1.1.3/canal.deployer-1.1.3.tar.gz
...
> User-Agent: curl/7.29.0
> Host: github.com
> Accept: */*
>
< HTTP/1.1 302 Found
< Date: Fri, 12 Apr 2019 13:20:31 GMT
< Content-Type: text/html; charset=utf-8
...
```

定位到问题了，地址做了重定向，但是 `curl` 并没有跟踪重定向后的 `Location`。因此，刚才的压缩包其实是关于重定向的响应，所以文件类型是 `HTML document`。

为了验证一下，我查看了压缩包的内容。

``` bash
$ cat canal.deployer-1.1.3.tar.gz
<html><body>You are being <a href="https://github-production-release-asset-2e65be.s3.amazonaws.com/7587038/6df81900-56c6-11e9-8140-7d9ae25b1ca8?X-Amz-Algorithm=AWS4-HMAC-SHA256&amp;X-Amz-Credential=AKIAIWNJYAX4CSVEH53A%2F20190412%2Fus-east-1%2Fs3%2Faws4_request&amp;X-Amz-Date=20190412T132310Z&amp;X-Amz-Expires=300&amp;X-Amz-Signature=3cb0943449b8d86bf6292b399409fddfa9fbef1c646c20910f10ae7fe836e53e&amp;X-Amz-SignedHeaders=host&amp;actor_id=0&amp;response-content-disposition=attachment%3B%20filename%3Dcanal.deployer-1.1.3.tar.gz&amp;response-content-type=application%2Foctet-stream">redirected</a>.</body></html>
```

**果然如此，我突然意识到在刚开始 `curl` 成功后根据 `Received` 的大小就可以定位到问题了。不过我一般自动忽略 `curl` 的输出，而且当下载东西的时候，我一般就切窗口了...**

``` bash
# 接收到的文件只有 616 个字节大小
$ curl -O https://github.com/alibaba/canal/releases/download/canal-1.1.3/canal.deployer-1.1.3.tar.gz
% Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100   616    0   616    0     0    444      0 --:--:--  0:00:01 --:--:--   444
```

找到了问题就很好解决了: **没有跟踪重定向**

## 问题解决

找到 `curl` 追踪重定向的参数，重新下载问题解决。

``` bash
# 找到参数为 -L
$ curl --help | grep -e follow -e redirect
-L, --location      Follow redirects (H)
     --max-redirs NUM  Maximum number of redirects allowed (H)
     --post301       Do not switch to GET after following a 301 redirect (H)
     --post302       Do not switch to GET after following a 302 redirect (H)
     --post303       Do not switch to GET after following a 303 redirect (H)
     --proto-redir PROTOCOLS  Enable/disable specified protocols on redirect
     --stderr FILE   Where to redirect stderr. - means stdout
$ curl -OL https://github.com/alibaba/canal/releases/download/canal-1.1.3/canal.deployer-1.1.3.tar.gz
```

## 反思

如果仔细一点，刚开始 `curl` 时发现 `Received` 的大小，估计几秒钟就能解决问题。不过总的来说还是略有收获。

1. `explainshell` 解析复杂的 linux 命令
1. `curl -OL <url>` 追踪重定向并下载到本地
1. `file <file>` 查看文件类型
1. 使用 `grep` 匹配多个关键字
    1. `grep "PATTERN1\|PATTERN2" FILE`
    1. `grep -E "PATTERN1|PATTERN2" FILE`
    1. `grep -e PATTERN1 -e PATTERN2 FILE`
    1. `egrep "PATTERN1|PATTERN2" FILE`

## 参考

+ https://www.shellhacks.com/grep-or-grep-and-grep-not-match-multiple-patterns/
