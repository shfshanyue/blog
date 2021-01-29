module.exports = [
  {
    title: '零基础的前端开发初学者应如何系统地学习？',
    path: 'zero-to-learn-fe',
    categories: ['前端'],
    tags: ['成长']
  },
  {
    title: 'http 缓存问题与 lm factor 算法',
    path: 'a-problem-about-http-cache',
    date: '2019-03-15',
    description: '比没有缓存更严重的问题是缓存了不该缓存的东西。前者属于性能优化，而后者可能使你不厌其烦地充当客服工作',
    keywords: 'http缓存,service worker,lm factor',
    categories: ['前端'],
    tags: ['http', 'service worker'],
  },
  {
    title: '记录一个有关 curl 和重定向的小问题',
    path: 'a-problem-with-tar-and-curl',
    date: '2019-04-12T20:35:01+08:00',
    categories: ['运维'],
    tags: ['linux']
  },
  {
    title: '由 GraphQL 来思考 API Design',
    path: 'api-design-inspire-by-graphql',
    description: 'GraphQL 一些天然的设计或者思想对设计 Rest API 有很大的借鉴或参考意义。这里总结下一些受启发的 API 设计规范',
    keywords: 'graphql,api design,graphql restful',
    date: '2019-03-14T19:07:50+08:00',
    // thumbnail: '../../assets/graphql-logo.jpg',
    categories: ['后端'],
    tags: ['graphql', 'node']
  },
  {
    title: 'vim 快速入门',
    path: 'vim-quick-start',
    description: '以下是能够在零配置下快速使用 vim 的一系列步骤，只需要多加练习，便能快速熟练使用 vim。',
    keywords: 'vim,vim快速入门,vim 配置,vim 替换',
    date: '2018-07-31',
    tags: ['linux', 'vim'],
    categories: ['工具'],
    hot: 1
  },
  {
    title: '一些实用的 git 小技巧',
    path: 'git-tips',
    description: '是谁动了我的代码？又是谁的 bug 指到了我的头上？',
    keywords: 'git,git blame,git小技巧,快速定位bug',
    date: '2017-05-25',
    categories: ['工具'],
    tags: ['linux', 'git'],
    // thumbnail: '../../assets/git.jpeg',
  },
  {
    title: 'http 响应头中的 ETag 值是如何生成的',
    date: '2019-12-10 22:00',
    keywords: 'http,http缓存',
    tags: ['http'],
  },
  {
    title: '浏览器中的二进制以及相关转换',
    path: 'binary-in-frontend',
    description: '浏览器，或者前端更多处理的是 View 层，即 `UI = f(state)`，状态至界面的转化。但是也有很多关于二进制的处理，如下载 Excel，文档生成 PDF，对多个文件打包下载。本篇文章总结了浏览器端的二进制以及之间的转化，如 ArrayBuffer 转 Blob，Base64 转 TypedArray 等等',
    keywords: 'ArrayBuffer to Blob,Blob to ArrayBuffer,String to ArrayBuffer,浏览器中的二进制',
    date: '2019-03-12 18:00',
    // thumbnail: '~@assets/git.jpeg',
    categories: ['前端'],
    tags: ['javascript'],
    top: 7
  },
  {
    title: 'Traefik 入手与简单配置',
    path: 'traefik-start',
    description: 'Traefik 与 nginx 一样，是一款反向代理的工具，接下来讲一下它的基本功能以及文件配置',
    keywords: 'traefik nginx 对比,traefik,traefik docker,traefik ingress',
    date: '2019-01-30T16:31:01+08:00',
    categories: ['运维', '后端'],
    tags: ['devops']
  },
  {
    title: 'SQL必知必会',
    path: 'sql-examples',
    description: '本篇文章是 SQL 必知必会 的读书笔记，SQL必知必会的英文名叫做 Sams Teach Yourself in 10 Minutes。',
    keywords: 'sql,sql必知必会,sql join',
    date: '2019-10-28 21:00',
    tags: ['db'],
    categories: ['后端'],
    hot: 9
  },
  {
    title: '如何实现 lodash.get 函数',
    path: 'lodash-get',
    description: 'lodash 基本上成为了 js 项目的标配，它广泛应用在各种服务端以及前端应用中，但是它的包体积略大了一些。对于服务端来说，包的体积并不是十分的重要，或者换句话说，不像前端那样对包的体积特别敏感，一分一毫都会影响页面打开的性能，从而影响用户体验。',
    keywords: 'lodash.get,lodash.get函数实现',
    tags: ['javascript'],
    categories: ['前端'],
    date: '2019-05-13 18:00'
  },
  {
    title: 'Service Worker 实践与在 create-react-app 中所遇到的问题解决方案',
    path: 'cache-for-sw',
    description: '对于静态资源，采取了所有静态资源添加hash，除部署后第一次外均不需再访问服务器。如果这里采用 workbox 的术语的话，那么静态资源则是采用了 Cache-First 的策略，当缓存不可取时才回退到网络，而对于动态 API，则采用 Network-First 的策略，只有在离线状态下才使用缓存。',
    keywords: 'service worker,PWA,service worker缓存动态API,静态资源预缓存',
    date: '2018-02-29',
    categories: ['前端'],
    tags: ['service worker'],
  },
  {
    title: '如何判断文件中换行符是 LF 还是 CRLF',
    path: 'LF-CRLF',
    description: '最近遇到了很多 \n 与 \r\n 的问题，虽然一直知道他们都是换行符，但也没有细究，今天顺手查了下。',
    keywords: 'LF,CRLF,\n与\r\n的区别,换行符,\r\n是什么意思',
    date: '2019-07-25 18:00:03',
    categories: ['运维'],
    tags: ['linux']
  },
  {
    title: '谈谈 redis 在项目中的常见使用场景',
    path: 'redis-case',
    description: '最近写了一个关于 graphql 的脚手架，其中 redis 的使用场景还挺多，于是总结下它的常见使用场景。',
    keywords: 'redis,redis分布式锁,redis集群,redis数据类型',
    date: '2019-07-17T09:39:20+08:00',
    categories: ['后端'],
    tags: ['redis']
  },
  {
    title: 'typescript 高级技巧',
    path: 'ts-tips',
    description: '用了一段时间的 typescript 之后，深感中大型项目中 typescript 的必要性，它能够提前在编译期避免许多 bug，如很恶心的拼写问题。而越来越多的 package 也开始使用 ts，学习 ts 已是势在必行。',
    keywords: 'typescript,typescript react',
    date: '2019-06-11 18:00',
    categories: ['前端'],
    tags: ['javascript'],
    hot: 7
  },
  {
    title: '邮件发送中的限流算法: 漏桶与令牌桶',
    path: 'rate-limit',
    keywords: '限流算法,redis,漏桶算法',
    description: '在短信验证码和邮箱验证码，如果不限速，被恶意攻击造成大量的 QPS，不仅拖垮了服务，也会心疼如水的资费。鉴于君子固穷的原则，在我的邮箱服务里加上限速。',
    date: '2019-05-05 18:00',
    categories: ['后端'],
    tags: ['node'],
    hot: 6
  },
  {
    title: 'You-Dont-Know-JS 疑难汇总',
    path: 'js-puzzles',
    description: '最近我看了 You-Dont-Know-JS 的两个小册，在看书的过程中，为了方便以后索引与更深入的了解，也为了避免遗忘，我对每一册的较为复杂的点做了总结，编辑如下',
    keywords: 'you dont know js,你不知道的js,javascript,前端面试汇总',
    date: '2017-05-22T21:53:28+08:00',
    categories: ['前端'],
    tags: ['javascript'],
    hot: 3
  },
  {
    title: '网站域名更换记录以及一系列衍生问题',
    path: 'domain-update-record',
    description: '拖延了半年后，我终于在最近把我的域名 <https://shanyue.tech> 通过了备案，趁此对我的域名进行更换: 由 <https://blog.xiange.tech> 更换到了 <https://shanyue.tech>，本篇文章简单介绍下其中所要注意的事项',
    keywords: '域名更换,traefik配置,域名更换与SEO,devops',
    date: '2019-04-26 18:00',
    tags: ['devops'],
    categories: ['运维']
  },
  {
    title: 'Node 中异常，exit code 与 docker',
    path: 'exit-code-node-and-docker',
    description:  '最近观察项目 CI 跑的情况如何时，会偶尔发现一两个镜像虽然构建成功但是容器跑不起来的情况。究其原因，是因为一个 EXIT CODE 的问题',
    keywords: 'node,devops,exit code是什么,异常码是什么,docker',
    date: '2019-07-29 21:00',
    categories: ['后端'],
    tags: ['node', 'devops', 'docker']
  },
  {
    title: 'sequelize V5 升级记录以及编译时与运行时问题解决方案',
    path: 'sequelize-upgrade',
    date: '2019-06-19',
    description: '最近把项目中的 sequelize 由 `4.38.0` 升级到了 `5.8.7`，不过最后事实告诉我这真是一个错误的决定，说多了全是泪，升级记录如下',
    keywords: 'sequelize v5升级',
    categories: ['后端'],
    tags: ['node']
  },
  {
    title: '关于 async/await 的两个 OOM 的示例',
    path: 'async-oom',
    description: '两个在开发过程中因为使用 async/await 而导致的 OOM 示例，简单记录一下',
    keywords: 'OOM,async await',
    date: '2019-08-17',
    tags: ['node', 'linux'],
    categories: ['后端']
  },
  {
    title: '关于统计诗词字云的解决方案',
    path: 'poem-char-frequent-stat',
    date: '2019-08-17 12:00',
    keywords: 'node,postgres,redis原子性,诗词飞花令,隔离级,悲观锁',
    tags: ['node', 'database'],
    categories: ['数据库']
  },
  {
    title: 'GraphQL 开发指南',
    path: 'graphql-guide',
    date: '2019-07-31T14:20:47+08:00',
    categories: ['后端'],
    tags: ['graphql']
  },
  {
    title: 'JS 调试问题汇总与示例',
    path: 'js-debug-examples',
    date: '2019-07-30 19:27',
    description: '在写 node 应用或者 react 应用时，经常需要看一些库的源码，而在看源码时，除了一个顺手的 IDE 外，学会调试也至关重要。因此，我把常见的调试的一些小问题记录下来。',
    categories: ['前端', '后端'],
    tags: ['javascript', 'node']
  },
  {
    title: '使用 requestId 标记全链路日志',
    path: 'requestId-and-tracing',
    description: '在微服务架构中，标记全链路日志有助于更好的解决 bug 和分析接口性能，本篇文章使用 node 来作为示例',
    keywords: '微服务架构,requestId,全链路日志',
    date: '2019-07-05T20:02:20+08:00',
    categories: ['后端'],
    tags: ['node', '监控'],
  },
  {
    title: 'Node 中异常收集，结构化与监控',
    path: 'server-structed-error',
    date: '2019-06-25T17:37:15+08:00',
    description: '在一个后端服务设计中，异常捕获是必不可少需要考虑的因素。而当异常发生时，能够第一时间捕捉到并且能够获得足够的信息定位到问题至关重要，这也是本篇文章的内容',
    keywords: '异常收集,异常上报,node,异常监控',
    categories: ['后端'],
    tags: ['node']
  },
  {
    title: '从数据库到前端，使用 enum 代替 constant number',
    path: 'constant-db-to-client',
    description: '以下展示一个简单的 TODO List。以 TODO 的三种状态 TODO，DONE 以及 DOING 来描述数据库，后端和前端应如何传输以及展示',
    keywords: 'graphql,enum,魔法数字,数据库',
    date: '2019-05-07',
    tags: ['node', 'graphql'],
    categories: ['后端'],
  },
  {
    title: 'jwt 实践应用以及不适用特殊案例思考',
    path: 'jwt-guide',
    description: 'JSON Web Token 是 [rfc7519](https://tools.ietf.org/html/rfc7519) 出的一份标准，使用 JSON 来传递数据，用于判定用户是否登录状态。jwt 之前，使用 session 来做用户认证。',
    keywords: 'json web token (JWT), jwt实践,用户认证',
    date: '2018-07-21',
    sidebarDepth: 3,
    tags: ['node', 'jwt'],
    hot: 4
  },
  {
    title: 'jwt 实践邮件验证与登录',
    path: 'jwt-and-verifyCode',
    date: '2019-04-26T19:27:38+08:00',
    keywords: 'jwt,graphql,邮件验证码,邮件激活,手机验证码',
    description: '文章指出如果没有特别的用户注销及单用户多设备登录的需求，可以使用 jwt，而 jwt 的最大的特征就是无状态，且不加密。除了用户登录方面外，还可以使用 jwt 验证邮箱验证码，其实也可以验证手机验证码，但是鉴于我囊中羞涩，只能验证邮箱了。',
    categories: ['后端'],
    tags: ['node', 'graphql', 'jwt']
  },
  // {
  //   title: '如何快速了解新业务',
  //   path: 'business-get-started',
  //   description: '最近接触新业务较多，关于了解新业务有一点感想，总结如下: 1. 比了解新业务代码更重要的是要了解新业务，比了解新业务更重要的是业务意识 2. 如果是业务开发，毕业前三年更应该关注于技术以及技术细节，三到五年技术业务并重，五年以后业务为主',
  //   date: '2019-08-08 18:00',
  //   tags: ['node'],
  //   hot: 4
  // },
  {
    title: '简述流行 CSS 框架 TailwindCSS 的优缺点',
    path: 'tailwindcss',
    tags: ['css']
  },
  {
    title: '使用纯 CSS 实现仿 Material Design 的 input 过渡效果',
    path: 'login-input-style',
    description: `至于 Material Design 是什么样的效果，如上所示。实现以上效果，可以简单把问题归结为以下两点的实现
1. 当 input 中没有值且没有获得焦点时，hint 信息灰色呈现在 input 框内
1. 当 input 获取到焦点或者有值时，hint 信息以动画形式位移到 input 上方`,
    date: '2019-04-23T18:12:38+08:00',
    categories: ['前端'],
    tags: ['css', 'react']
  },
  {
    title: '使用 Grid 进行常见布局',
    path: 'Grid-Layout-Common-Usage',
    description: 'grid 布局是W3C提出的一个二维布局系统，通过 display: grid 来设置使用，对于以前一些复杂的布局能够得到更简单的解决。本篇文章通过几个布局来对对 grid 布局进行一个简单的了解。',
    date: '2016-07-22 07:00',
    keywords: 'grid,grid布局实践,css grid,grid 常见布局',
    tags: ['css', 'grid'],
    categories: ['前端']
  },
  {
    title: '[翻译] Grid 布局完全指南',
    description: 'JSON Web Token 是 [rfc7519](https://tools.ietf.org/html/rfc7519) 出的一份标准，使用 JSON 来传递数据，用于判定用户是否登录状态。jwt 之前，使用 session 来做用户认证。',
    path: 'Grid-Guide',
    date: '2017-02-09 06:32',
    tags: ['css', 'grid'],
    categories: ['前端']
  },
  {
    title: '如果 http 响应头中 ETag 值改变了，是否意味着文件内容一定已经更改',
    path: 'http-last-modified',
    date: '2019-12-12 22:00',
    keywords: 'http,http缓存,etag',
    tags: ['http']
  },
  {
    title: 'http 常见常用状态码并附实例展示',
    path: 'http-status',
    tags: ['http']
  }
]
