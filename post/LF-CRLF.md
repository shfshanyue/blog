# 换行符 LF(\n) 与 CRLF(\r\n)

首先，要了解 `\n` 与 `\r\n` 的区别，在 [Difference between \n and \r?](https://stackoverflow.com/questions/15433188/r-n-r-and-n-what-is-the-difference-between-them) 中有这样的示意：

+ `\r` = CR (Carriage Return) → Used as a new line character in Mac OS before X
+ `\n` = LF (Line Feed) → Used as a new line character in Unix/Mac OS X
+ `\r\n` = CR + LF → Used as a new line character in Windows

简单而言，现在除了 `Windows` 把 `\r\n` 作为换行符，其他系统都是把 `\n` 作为了换行符。

也可以在山月自制的小工具 [ASCII Table](https://devtool.tech/ascii/13) 中查看二者的 ASCII 编码。

![image.png](https://p3-juejin.byteimg.com/tos-cn-i-k3u1fbpfcp/df59d165701940c1aaa4bb8362617e2d~tplv-k3u1fbpfcp-watermark.image?)

那我们有没有一种方法可以 **把文件中的不可打印字符显示出来，来确认文件中是以什么换行的**。

## 试验

首先，先造一个包含两种换行符号的文件 `newline.txt`

```shell
$ echo -e 'LF\nCRLF\r\nEND' > newline.txt
$ cat newline.txt
LF
CRLF
END
```

使用 `cat`，它们都会按照换行符进行处理。而在浏览器中也会把它们当做换行符处理

```javascript
> const o = 'LF\nCRLF\r\nEND'
< "LF
CRLF
END"
```

## 如何判断文件中的换行符

### vim

在 `vim` 中会发现其中蹊跷，`:set list`。

```shell
$ vim newline.txt
LF$
CRLF^M$
END$
```

### cat

`cat -e` 代表显示不可打印字符与换行符。

```shell
$ cat -e newline.txt
LF$
CRLF^M$
END$
```

### bat

而在 `bat` 中，`CRLF` 都会显示为它的释义，更加清晰

``` bash
# -A：显示不可见字符
# -p：显示纯文本，不显示行号
$ bat -Ap newline.txt
LF␊
CRLF␍␊
END␊
```