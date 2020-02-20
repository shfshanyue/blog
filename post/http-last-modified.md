# 如果 http 响应头中 ETag 值改变了，是否意味着文件内容一定已经更改

> 本篇文章由我的 [一日一题](https://github.com/shfshanyue/Daily-Question) 中的四个 `Issue` 组合而成
> 
> + [【Q111】http 响应头中的 ETag 值是如何生成的](https://github.com/shfshanyue/Daily-Question/issues/112)
> + [【Q112】如果 http 响应头中 ETag 值改变了，是否意味着文件内容一定已经更改](https://github.com/shfshanyue/Daily-Question/issues/113)
> + [【Q115】文件系统中 mtime 和 ctime 指什么，都有什么不同](https://github.com/shfshanyue/Daily-Question/issues/116) 
> + [【Q116】http 服务中静态文件的 Last-Modified 是根据什么生成的](https://github.com/shfshanyue/Daily-Question/issues/117) 

不一定，由服务器中 `ETag` 的生成算法决定。详见 [#112](https://github.com/shfshanyue/Daily-Question/issues/112)

比如 `nginx` 中的 `etag` 由 `last_modified` 与 `content_length` 组成，而 `last_modified` 又由 `mtime` 组成

当编辑文件却未更改文件内容时，`mtime` 也会改变，此时 `etag` 改变，但是文件内容没有更改。

## http 服务中静态文件的 Last-Modified 根据什么生成

一般会选文件的 `mtime`，表示文件内容的修改时间

`nginx` 也是这样处理的，源码见: [ngx_http_static_module.c](https://github.com/nginx/nginx/blob/4bf4650f2f10f7bbacfe7a33da744f18951d416d/src/http/modules/ngx_http_static_module.c#L217)

``` c
    r->headers_out.status = NGX_HTTP_OK;
    r->headers_out.content_length_n = of.size;
    r->headers_out.last_modified_time = of.mtime;
```

**那为什么使用 `mtime` 而非 `ctime`**

## 文件系统中 mtime 和 ctime 指什么，都有什么不同

在 `linux` 中，

+ `mtime`：`modified time` 指文件内容改变的时间戳
+ `ctime`：`change time` 指文件属性改变的时间戳，属性包括 `mtime`。而在 windows 上，它表示的是 `creation time`

所以 `ctime` 会比 `mtime` 要大一些，使用 `stat` 查看文件属性如下

``` bash
$ stat hello.txt
  File: ‘hello.txt’
  Size: 30              Blocks: 8          IO Block: 4096   regular file
Device: fd01h/64769d    Inode: 917526      Links: 1
Access: (0644/-rw-r--r--)  Uid: (    0/    root)   Gid: (    0/    root)
Access: 2019-12-10 16:15:55.253325208 +0800
Modify: 2019-12-10 16:15:52.740653330 +0800
Change: 2019-12-10 16:15:52.742653069 +0800
 Birth: -
```

而 http 服务选择 `Last_Modified` 时一般会选择 `mtime`
