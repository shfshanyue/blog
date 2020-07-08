# 浏览器跨域问题与服务器中的 CORS

> Access to XMLHttpRequest at 'xxx' from origin 'xxx' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.

> [什么是跨域？](https://q.shanyue.tech/fe/js/216.html)

跨域，这或许是前端面试中最常考的问题了。前端常问，这也是因为跨域问题是浏览器环境中的特有问题，**而在服务器发起 HTTP 请求时是不会有跨域问题的**。

当谈到跨域问题的解决方案时，最流行也是最简单的便是 CORS 了。

## CORS

CORS 即跨域资源共享 (Cross-Origin Resource Sharing, CORS)，简而言之，就是在服务器端的响应中加入几个 Header，使得浏览器能够跨域访问资源，听起来简单，但细节诸多。

![简单的 CORS 请求](https://mdn.mozillademos.org/files/17214/simple-req-updated.png)

先来看一个简单的 CORS 请求

``` txt
GET / HTTP/1.1
Host: shanyue.tech
Origin: http://shanyue.tech
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36
```

``` txt
HTTP/1.1 200 OK
Access-Control-Allow-Origin: *
Content-Type: text/plain; charset=utf-8
Content-Length: 12
Date: Wed, 08 Jul 2020 17:03:44 GMT
Connection: keep-alive
```

## CORS 与 Vary

## CORS 与 HSTS

```
Provisional headers are shown
```

## CORS 中间件及异常处理中间件

## 总结
