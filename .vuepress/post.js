module.exports = [
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
  }
]
