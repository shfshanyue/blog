# POSIX Thread 编程

我们在日常编程中经常会听到线程这个词，无论你使用何种语言。比如 `java` 会经常说多线程，`python` 会说协程就是为了避免多线程的上下文切换，而 `js` 会经常提到单线程。

`POSIX`，指 `Portable Operating System Interface`，可移植操作系统接口。意思就是说，不同的操作系统有不同的 API，但是经过 POSIX 一层封装，你就可以使用统一的 API 在各种操作系统上进行编程。更多详情可以参考本篇文章 [POSIX标准总体分析](https://blog.csdn.net/novagx/article/details/2077561)


## 学习 Thread 的 API

如果要写一个最简单的线程，那有两个 API 是必不可少的，`pthread_create` 与 `pthread_join`

### pthread_create

``` c
#include <pthread.h>

int pthread_create (
  pthread_t *thread,
  const pthread_attr_t *attr,
  void *(*start_routine) (void *),
  void *arg
);
```

这是在当前进程中新建一个线程的 API，作为一个专业的 API 调用工程师，只需要知道了参数及其返回值即可开始工作

+ `thread`
+ `pthread_attr_t`，可为 `NULL`
+ `start_routine`，执行函数，即该线程主要用来做什么
+ `arg`，执行函数的参数，可为 `NULL`

最后还差一个返回值，如果成功返回 0，如果失败返回非零的数字。

### pthread_join

``` c
#include <pthread.h>

int pthread_join (pthread_t thread, void **retval);
```

等待线程执行结束

+ `thread`
+ `retval`，可为 NULL

## 写一个最简单的线程

``` c
#include <pthread.h>
#include <stdio.h>
#include <unistd.h>

void *thread_function(void *arg) {
  printf("hello, world\n");
  sleep(10);
}

int main() {
  pthread_t thread;

  pthread_create(&thread, NULL, thread_function, NULL);
  pthread_join(thread, NULL);
}
```

打印结果

```
Thread Start
hello, world
Thread End
```

## 参考

+ [POSIX Threads Programming in C](https://www.softprayog.in/programming/posix-threads-programming-in-c)
