## 服务端的 socket API

### socket()

首先需要建立一个 `socket`，指定通信协议，如 `TCP`，`UDP`，`TCP6`。

通过 `socket()` 函数新建 socket，API 如下

``` c
#include <sys/socket.h>
#include <netinet/in.h>

int socket (int family, int type, int protocol);
```

+ `family`: 协议族。`AF_INET` 指 `IPv4` 协议
+ `type`: 类型。有两种 `SOCK_STREAM` 与 `SOCK_DGRAM`
+ `protocol`: 协议，有以下类型
    + `IPPROTO_IP`: 0
    + `IPPROTO_TCP`: 6
    + `IPPROTO_UDP`: 17
+ `return`: 返回一个 `socket descriptor`，类似 `fd`，非负整数。如果 -1，表明出现错误

### bind()

当在本地新起一个简单的 http 服务时，我们需要指定 host 及 port，如 `0.0.0.0:3000` 或者 `localhost:8080`。

http 基于 TCP，新建一个 TCP 服务时也需要指定一个 IP 地址及端口号

当新建 `TCP server` 时，`bind` 为 `socket server` 分配一个本地地址，API 如下

``` c
#include <sys/socket.h>

int bind(int sockfd, const struct sockaddr *servaddr, socklen_t addrlen);
```

+ `sockfd`: socket descriptor，由 `socket()` 函数返回
+ `servaddr`: 一个指向 `IP:PORT` 数据的指针
+ `return`: 如果成功返回 0，否则返回 -1

### listen()

内核将入口的连接请求指定到该 socket 上，可指定最大连接数

``` c
#include <sys/socket.h>

int listen(int sockfd, int backlog);
```

+ `sockfd`
+ `backlog`: 指定最大连接数，如果超出将会拒绝多余的连接请求

### accept()

接收客户端请求，并能够解析客户端 `IP:PORT`，内核将为每一个客户端请求建立一个已连接的 socket。它将阻塞程序执行，知道接收到客户端的连接

``` c
#include <sys/socket.h>

int accept(int sockfd, struct sockaddr *cliaddr, socklen_t *addrlen);
```

+ `sockfd`
+ `cliaddr`: 客户端的 `IP:PORT` 信息
+ `addrlen`: `sliaddr` 的所占空间

## 客户端的 socket API

### socket()

### connect()

TCP 客户端建立一个连接

``` c
#include <sys/socket.h>

int connect (int sockfd, const struct sockaddr *servaddr, socklen_t addrlen);
```