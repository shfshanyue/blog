---
title: 常见系统调用
date: 2019-07-11T16:31:01+08:00
categories:
  - 后端
tags:
  - C
  - linux
---

## epoll_pwait

wait for an I/O event on an epoll file descriptor.

```c
#include <sys/epoll.h>

int epoll_wait(int epfd, struct epoll_event *events, int maxevents, int timeout);
int epoll_pwait(int epfd, struct epoll_event *events, int maxevents, int timeout, const sigset_t *sigmask);

typedef union epoll_data {
    void    *ptr;
    int      fd;
    uint32_t u32;
    uint64_t u64;
} epoll_data_t;

struct epoll_event {
    uint32_t     events;    /* Epoll events */
    epoll_data_t data;      /* User data variable */
};

epoll_pwait(3, [{EPOLLIN, {u32=18, u64=18}}], 1024, 11749, NULL, 8)
```

+ [epoll_pwait](https://linux.die.net/man/2/epoll_pwait)

## epoll_ctl

control interface for an epoll descriptor

```c
#include <sys/epoll.h>

int epoll_ctl(int epfd, int op, int fd, struct epoll_event *event);

epoll_ctl(3, EPOLL_CTL_ADD, 22, {EPOLLOUT, {u32=22, u64=7575752952099373078}}) // 0
epoll_ctl(3, EPOLL_CTL_ADD, 25, {EPOLLIN, {u32=25, u64=7575752952099373081}})  // -1 EEXIST (File exists)

```

## accept_4

accept a connection on a socket.

```c
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/socket.h>
int accept4(int sockfd, struct sockaddr *addr, socklen_t *addrlen, int flags);

accept4(18, NULL, NULL, SOCK_CLOEXEC|SOCK_NONBLOCK)
```

+ [accept4](https://linux.die.net/man/2/accept4)

## write

write to a file descriptor. 

```c
#include <unistd.h>
ssize_t write(int fd, const void *buf, size_t count);

write(21, "Q\0\0\0\372SELECT \"users\".\"id\" FROM \"u"..., 251)  // 251
write(26, "HTTP/1.1 200 OK\r\nX-Powered-By: E"..., 30514)         // 30514
```

## read

read from a file descriptor.

```c
#include <unistd.h>
ssize_t read(int fd, void *buf, size_t count);

read(26, "POST /graphql?query=ME HTTP/1"..., 65536)    // 1435
```

## futex

```c
#include <linux/futex.h>
#include <sys/time.h>

int futex(int *uaddr, int op, int val, const struct timespec *timeout,
          int *uaddr2, int val3);

futex(0x7f3804ef39a4, FUTEX_WAKE_PRIVATE, 1)        // = 1
```

## mprotect

set protection on a region of memory

```c
#include <sys/mman.h>

int mprotect(void *addr, size_t len, int prot);

mprotect(0x38ae4f980000, 524288, PROT_READ|PROT_WRITE) // = 0
```

## getpid

get process identification

```c
#include <sys/types.h>
#include <unistd.h>

pid_t getpid(void);
pid_t getppid(void);
getpid()                        // 122
```

## mmap/munmap

map or unmap files or devices into memory.

`mmap` creates a new mapping in the virtual address space of the calling process. 

```c
#include <sys/mman.h>
void *mmap(void *addr, size_t lengthint, int prot, int flags,
           int fd, off_t offset);
int munmap(void *addr, size_t length);

// 如果 addr 是 NULL，将会开辟一片空间
// MAP_PRIVATE: 私有的 copy-on-write 的映射
// MAP_ANONYMOUS: The mapping is not backed by any file; its contents are initialized to zero.
mmap(NULL, 286720, PROT_READ|PROT_WRITE, MAP_PRIVATE|MAP_ANONYMOUS, -1, 0) // 0x7f38076a8000
```

## brk

change data segment size.

```c
#include <unistd.h>

int brk(void *addr);

void *sbrk(intptr_t increment);

brk(NULL)                           // 0x36df000
```

## execve

execute program.

```c
#include <unistd.h>

int execve(const char *filename, char *const argv[], char *const envp[]);

execve("/usr/bin/node", ["node", "index.js"], [/* 27 vars */]) // = 0
```

