# 谈谈 redis 在项目中的常见使用场景

最近写了一个关于 graphql 的[脚手架](https://github.com/shfshanyue/apollo-server-starter)，其中 `redis` 的使用场景还挺多，于是总结下它的常见使用场景。

<!--more-->

+ 本文链接: <https://shanyue.tech/post/redis-case/>
+ github 备份: <https://github.com/shfshanyue/blog>

## 缓存

```shell
> set User:1:name shanyue EX 100 NX
OK
> get User:1:name
"shanyue"
```

缓存是 `redis` 出镜率最高的一种使用场景，仅仅使用 `set/get` 就可以实现，不过也有一些需要考虑的点

+ 如何更好地设置缓存
+ 如何保持缓存与上游数据的一致性
+ 如何解决缓存血崩，缓存击穿问题

## session: 用户登录及验证码

```shell
> set 5d27e60e6fb9a07f03576687 '{"id": 10086, role: "ADMIN"}' EX 7200
OK
> get 5d27e60e6fb9a07f03576687
"{\"id\": 10086, role: \"ADMIN\"}"
```

这也是很常用的一种场景，不过相对于有状态的 session，也可以考虑使用 JWT，各有利弊

+ [json web token 实践登录以及校验码验证](https://juejin.im/post/5cc459976fb9a032212cc73b)

## 消息队列

```shell
> lpush UserEmailQueue 1 2 3 4
lpop UserEmailQueue
> rpop UserEmailQueue
1
> rpop UserEmailQueue
2
```

可以把 `redis` 的队列视为分布式队列，作为消息队列时，生产者在一头塞数据，消费者在另一头出数据: (lpush/rpop, rpush/lpop)。不过也有一些不足，而这些不足有可能是致命的，不过对于一些丢几条消息也没关系的场景还是可以考虑的

1. 没有 ack，有可能丢消息
1. 需要做 `redis` 的持久化配置

## 过滤器 (dupefilter)

```shell
> sadd UrlSet http://1
(integer) 1
> sadd UrlSet http://2
(integer) 1
> sadd UrlSet http://2
(integer) 0
> smembers UrlSet
1) "http://1"
2) "http://2"
```

[scrapy-redis](https://github.com/rmax/scrapy-redis) 作为分布式的爬虫框架，便是使用了 `redis` 的 `Set` 这个数据结构来对将要爬取的 url 进行去重处理。

```python
# https://github.com/rmax/scrapy-redis/blob/master/src/scrapy_redis/dupefilter.py
def request_seen(self, request):
    """Returns True if request was already seen.
    Parameters
    ----------
    request : scrapy.http.Request
    Returns
    -------
    bool
    """
    fp = self.request_fingerprint(request)
    added = self.server.sadd(self.key, fp)
    return added == 0
```

不过当 `url` 过多时，会有内存占用过大的问题

## 分布式锁

```shell
set Lock:User:10086 06be97fc-f258-4202-b60b-8d5412dd5605 EX 60 NX

# 释放锁，一段 LUA 脚本
if redis.call("get",KEYS[1]) == ARGV[1] then
    return redis.call("del",KEYS[1])
else
    return 0
end
```

这是一个最简单的单机版的分布式锁，有以下要点

+ `EX` 表示锁会过期释放
+ `NX` 保证原子性
+ 解锁时对比资源对应产生的 UUID，避免误解锁

当你使用分布式锁是为了解决一些性能问题，如分布式定时任务防止执行多次 (做好幂等性)，而且鉴于单点 `redis` 挂掉的可能性很小，可以使用这种单机版的分布式锁。

## Rate Limit

限流即在单位时间内只允许通过特定数量的请求，有两个关键参数

+ window，单位时间
+ max，最大请求数量

最常见的场景: 短信验证码一分钟只能发送两次

```shell
FUNCTION LIMIT_API_CALL(ip):
current = GET(ip)
IF current != NULL AND current > 10 THEN
    ERROR "too many requests per second"
ELSE
    value = INCR(ip)
    IF value == 1 THEN
        EXPIRE(ip,1)
    END
    PERFORM_API_CALL()
END
```

可以使用计数器对 API 的请求进行限流处理，但是要注意几个问题

1. 在平滑的滑动窗口时间内在极限情况下会有两倍数量的请求数
1. 条件竞争 (Race Condition)

这时候可以通过编程，根据 `TTL key` 进行进一步限制，或者使用一个 `LIST` 来维护每次请求打来的时间戳进行实时过滤。以下是 `node` 实现的一个 `Rate Limter`。参考源码 [node-rate-limiter-flexible](https://github.com/animir/node-rate-limiter-flexible)

```javascript
this.client
  .multi()
  .set(rlKey, 0, 'EX', secDuration, 'NX')
  .incrby(rlKey, points)
  .pttl(rlKey)
  .exec((err, res) => {
    if (err) {
      return reject(err);
    }

    return resolve(res);
  })

if (res.consumedPoints > this.points) {
  // ...
} else if (this.execEvenly && res.msBeforeNext > 0 && !res.isFirstInDuration) {
  // ...
  setTimeout(resolve, delay, res);
} else {
  resolve(res);
}
```

+ [node-rate-limiter-flexible](https://github.com/animir/node-rate-limiter-flexible)
+ [邮件发送，限流，漏桶与令牌桶](https://juejin.im/post/5cceafe5f265da039d32966d)

## 分布式 websocket

可以通过 redis 的 `PUB/SUB` 来在 websocket server 间进行交流。可以参考以下项目

+ [socket.io-redis](https://github.com/socketio/socket.io-redis)
