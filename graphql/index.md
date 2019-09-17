# 使用 graphql 开发 web

## hello, world

我们先写一个关于 `graphql.js` 的 `hello, world` 示例，并且围绕它展开对 `graphql` 的学习

``` javascript
const {
  graphql,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
} = require('graphql')

// schema，由 web 框架实现时，这部分放在后端里
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'hello, world'
        }
      }
    }
  })
})

// query，由 web 框架实现时，这部分放在前端里
const query = '{ hello }'

// 查询，这部分放在服务端里
graphql(schema, query).then(result => {
  // {
  //   data: { hello: "hello, world" }
  // }
  console.log(result)
})
```

由上，也可以看出 `graphql` 很关键的两个要素：`schema` 和 `query`。而当我们开发 web 应用时，`schema` 将会是服务端的主体，而 `query` 存在于前端中，类似 REST 中的 API。

## schema & query

我们先抽出 `schema` 的代码部分，这里有 `GraphQLSchema`，`GraphQLObjectType` 和 `GraphQLString` 等诸多 API。

``` javascript
const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
      hello: {
        type: GraphQLString,
        resolve() {
          return 'hello, world'
        }
      }
    }
  })
})
```

正如在 `React` 中，`jsx` 简化了 `React.createElement` 的写法。`graphql` 对于 schema 也有一套它自己的 `DSL (Domain Specified Language)`，更为简单，易懂。使用 graphql 表示 schema 与 query 如下所示

``` graphql
# schama
type Query {
  hello: String
}

# query
{
  hello
}
```

以及结果

``` javascript
{
  hello: 'hello, world'
}
```

你看到这里，想必有两个疑问：

1. 以上的 `graphql` 代表什么，以及我们如何书写 `graphql` 呢？
1. 相比 js 代码，`DSL` 少了一个 `resolve` 函数，而它是什么

### Object Type 与 Field

这里引入 graphql 中的两个基本术语，`object type` 与 `field`，它们是组成 graphql 最基本的组件，如同细胞组成了生物体，是生物体的基本单位。

这里来一个更复杂的 `schema`，如下所示

``` graphql
# schema
schema {
  query: Query
}

type Query {
  hello: String
  todos: [Todo!]!
}

type Todo {
  id: ID!
  title: String!
}

# query
{
  # 只能查询 Query 下的字段
  todos {
    id 
    title
  }
  hello
}
```

如果说 graphql 是数据库的进一步抽象，则 `object type` 类似于 sql 中的 `table`，`field` 类似于 sql 中的 `column`。

那我们仔细审视以上示例，能从其中得到一些信息：

+ `type` 标注为 `graphql.js` 中的类型： `GraphQLObjectType`
+ `{}` 代表一个 `query` (查询)，其中由若干字段组成，用以查你所需要的数据
+ `Query` 是一个特殊的 `object type`，表示为 `RootQueryType`，它会放到 `schema` 中。如同C语言中的 `main` 函数，可以理解为 `graphql` 的入口查询。正因如此，它所包含的 `field` 没有紧密的内关联关系。
+ `hello` 与 `todos` 是 Query 下的两个 `field`，一切前端的查询均要从 `Query` 的 `field` 查起。如在以上的 query 示例中，只能查询 `todos` 与 `hello`。
+ `Todo` 是一个自定义名称的 `object type`，可以理解为对应数据库中的一个 todo 的表。
+ `id` 与 `title` 是 Todo 下的 `field`，可以理解他们为 Todo 的属性，它们往往由一些基本属性以及聚合属性 (count, sum) 组成。
+ `[Todo!]!` 代表返回结果将是一个 `Todo` 的数组。`[]` 代表返回为数组，`!` 代表返回不能为空，`[!]` 代表数组中的每一项都不能为空。
+ `id: ID!` 代表 Todo 的 id 全局唯一
+ `title: String!` 代表 Todo 的 title 是不为空的字符串

到了这里，你会发现，对于 graphql schema 的认识还有一些信息尚未涉及：`ID` 与 `String`，它们成为 `scalar type`

### Query: query everyting

由上所述，`Query` 为 `graphql` 的入口查询处，我们可以查询 `Query` 下的任意字段 (field)。因此，他组成了 `graphql` 最核心的功能： **查你所想要的任何数据**。你可以通过在前端书写 `query`，对 `Query` 下的任意字段进行查询。

``` graphql
# schema
type Query {
  hello: String
  todos: [Todo!]!
}

# query 1
{
  hello
}

# query 2
{
  todos {
    id 
  }
}

# query 3
{
  hello
  todos {
    title 
  }
}
```

在前端我们根据 `Query` 组合成各种查询，而我们为了在 `graphql` 文件中方便辨认，可以添加 `operationName`：

``` graphql
query HELLO {
  hello
}

query TODOS {
  todos {
    id 
  }
}

query HELLO_AND_TODOS {
  hello
  todos {
    title 
  }
}
```

### Scalar Type

在 `graphql` 中有一些内置的 `scalar` 类型，用以表示 graphql 中 `field` 的数据类型，这也是 graphql 为强类型语言的基础。如下所示

+ `Int`，代表32位有符号型整数
+ `Float`
+ `String`
+ `Boolean`
+ `ID`，唯一标识符，一般可视为数据库中的主键。在 `object type` 中，一般会把 id 设置为 `ID` 类型，依赖它做一些缓存的操作。

正因为 `scalar` 与 `!`，来保证了 graphql 的 query 是强类型的。所以当我们看到如下的 query 时，可以在前端大胆放心的使用: `data.todos.map(todo => todo.title.replace('#'))`。既不用担心 `data.todos` 突然报错 `Cannot read property 'map' of null`，也不用担心 `Cannot read property 'title' of null`

``` graphql
# schema
type Query {
  hello: String
  todos: [Todo!]!
}

type Todo {
  id: ID!
  title: String!
}

# query
{
  todos {
    id 
    title
  }
}
```

当在数据库中，一个字段除了整型，浮点型等基本类型外，还会有更多而且比较重要和常用的数据类型：`json` 和 `datetime`。既然 `scalar` 用以表示 `field` 的数据类型，那么它如何表示 `json` 与 `datetime` 呢。

这时，可以使用 `graphql.js` 的如下 API

`graphql.GraphqlQLScalarType`

### resolve

再回到刚开始的 `hello, world` 的示例，用 `graphql` 表示如下

``` graphql
# schema
type Query {
  hello: String
}

# query
{
  hello
}
```

对以上章节的内容再梳理一遍：

1. 可以对 `hello` 进行查询，因为该字段在 `Query` 下
1. 查询所得到的 `data.hello` 是一个字符串

恩？我们好像把最重要的内容给漏了，`hello` 中的内容到底是什么？！而 `resolve` 函数就是做这个事的

``` javascript
// 使用 graphql.js 的写法，把 schema 与 resolve 写在一起
new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    hello: {
      type: GraphQLString,
      resolve() {
        return 'hello, world'
      }
    }
  }
})


// 单独把 resolve 函数给写出来
function Query_hello_resolve () {
  return 'hello, world'
}
```

于是我们再补齐以上内容 

``` graphql
# schema
type Query {
  hello: String
}

# query
{
  hello
}
```

由此得到的数据示例

``` javascript
{
  hello: 'hello, world'
}
```

### context 与 args

查看一个很典型的 REST 服务端的一段逻辑：抽取用户ID以及读取参数(querystring/body)

``` javascript
app.use('/', (ctx, next) {
  ctx.user.id = getUserIdByToken(ctx.headers.authorization)
  next()
})

app.get('/todos', (ctx) => {
  const userId = ctx.user.id
  const status = args.status
  return db.Todo.findAll({})
})
```

而在 graphql 中，使用 `resolve` 函数为 `field` 提供数据，而 context，args 都会作为 `resolve` 函数的参数

``` graphql
# schema
type Query {
  # 如同 REST 一般，可以携带参数，并显式声明
  todos (status: String): [Todo!]!
}

type Todo {
  id: ID!
  title: String!
}

# query
{
  # 查询时，在这里指定参数 (args)
  todos (status: "TODO") {
    id 
    title
  }
  # 同时也可以指定别名，特别是当有 args 时
  done: todos (status: "DONE") {
    id
    title
  }
}

# query with variables
query TODOS ($status: String) {
  done: todos (status: $status) {
    id 
    title
  }
}
```

返回数据示例

``` javascript
{
  todos: [{ id: 1, title: '松风吹解带' }],
  done: [{ id: 2, title: '山月照弹琴' }],
}
```

当然，我们也是通过 `Query` 以及 Todo 的 resolve 函数来确定内容，对于如何获取以上数据如下所示

``` javascript
// Query 的 resolve 函数
const Query = {
  todos (obj, args, ctx, info) {
    // 从 ctx 中取一些上下文信息，如最常见的 user
    const userId = ctx.user.id

    const status = args.status
    return db.Todo.findAll({})
  }
}

// Todo 的 resolve 函数
const Todo = {
  title (obj) {
    return obj.title 
  }
}
```

+ obj，代表该字段所属的 `object type`，如 `Todo.title` 中 `obj` 表示 `todo`
+ args，代表所传过来的参数
+ ctx，上下文
+ info, `GraphQLResolveInfo`，关于本次查询的元信息，比如 AST，你可以对它进行解析

> 从这里可以看出来：graphql 的参数都是显式声明，并且强类型。这一点比 REST 要好一些

``` graphql
# query with variables
query TODOS ($status: String) {
  done: todos (status: $status) {
    id 
    title
  }
}
```

### Mutation

`graphql` 能够简化一切的查询，或者说它是简化了服务端开发人员 `CRUD` 中的 `Read`。那么，如何对资源进行修改呢？这里就提到了 `Mutation`。

``` graphql
# 在后端的 schema
schema {
  query: Query
  mutation: Mutation
}

type Mutation {
  addTodo (title: String!): Todo
}

# 在前端的 query
mutation ADD_TODO {
  addTodo (title: "学习 React") {
    id 
    title
  }
}
```

``` javascript
// 以上示例返回结果
{
  addTodo: { id: 128, title: '学习React' }
}
```

以上是一个添加 Todo 的例子，从这里可以注意到几点

1. `Mutation` 与 `Query` 同样属于特殊的 `object type`，同样，所有关于数据的更改操作都要从 `Mutation` 中找起，也需要放到 `schema` 中
1. `Mutation` 与 `Query` 分别为 graphql 的两大类操作，在前端进行 `Mutation` 查询时，需要添加 `mutation` 字段 (`Query` 查询时，在前端添加 `query` 字段，但这不是必选的)

### input type & variables

``` graphql
type Mutation {
  addTodo (title: String!): Todo
}

mutation ADD_TODO {
  addTodo (title: "学习 React") {
    id 
    title
  }
}
```

以上是一个关于添加 Todo 的 mutation，在我们添加一个 Todo 时，它仅有一个属性: title。如果它拥有更多个属性呢？这时，可以使用 `input type`，把某一资源的所有属性聚合起来。并且配合 `variables` 一起使用传递数据

``` javascript
input InputTodo {
  title: String!
}

type Mutation {
  addTodo (todo: InputTodo!): Todo
}

mutation ADD_TODO ($todo: InputTodo!) {
  addTodo (todo: $todo) {
    id 
    title
  }
}
```

``` javascript
// $todo 的值，在前端获取数据时，使用 variables 传入
{
  title: '学习 React'
}
```

## graphql 与 http

`graphql` 仅仅提供了 schema 与 query 的用法，当我们在 web 中使用 `graphql` 时，就需要使用 `http` 把 `graphql` 隔离为 `client` 与 `server` 两端。想象一个流程：

1. 前端发送 query 到后端
1. 后端维护一个 schema
1. 后端根据前端的 query 对照自己的 schema，查询出数据返回给前端

### request/response

前端需要根据自己构造的 query 去后端请求数据，而一个 query 可以由以下几个元素构成，通过 get/post 传递数据。而目前流行的框架比如 [apollo-server](https://github.com/apollographql/apollo-server)，也是这样处理

+ query
+ operationName
+ variables

``` javascript
// url 统一入口，但可以使用 operationName 作为 querystring 方便 debug
const url = '/graphql?HELLO'

// 如果是 POST 请求，构造以下 body 数据
const body = {
  query: 'query HELLO { hello }',
  operationName: 'HELLO',
  variables: {}
}

// 如果是 GET 请求，构造 query string
const qs = querystring.encode(body)

// 响应
const response = {
  data: {
    hello: 'hello, world' 
  },
  errors: null
}
```

## graphql 与前端性能优化

## graphql 在前端中应用

## 服务端渲染

``` graphql
query POEMS {
  poems {
    id 
    title
    userIsStar
    author {
      id 
      name
    }
  }
}

query POEMS_NO_AUTH {
  poems {
    id
    title
    author {
      id 
      name
    }
  }
}

query POEMS_AUTH {
  poems {
    id 
    userIsStar
  }
}
```

## graphql 存在的问题

## graphql 与后端性能优化

## 异常监控

### level

异常级别



### 异常与 http 状态码

## 异常监控

在一个后端服务设计中，异常捕获是必不可少需要考虑的因素

**而当异常发生时，能够第一时间捕捉到并且能够获得足够的信息定位到问题至关重要** 

刚开始，先抛出两个问题

1. 在生产环境中后端连接的数据库挂了，是否能够第一时间收到通知并定位到问题，而非期待用户反馈
1. 在生产环境中有一条 API 出了问题，能否衡量该错误的紧急重要程度，并根据报告解决问题

### 异常收集

异常一般发生在以下几个位置

1. API/GraphQL 层，在 API 层的最外层使用一个中间件 (middleware) 对错误集中进行处理，并进行上报。在具体逻辑层往往不需要主动捕捉异常，除非针对异常有特殊处理，如数据库事务失败后的回退。处理异常的伪代码如下

    ``` javascript
    function formatError (error) {
      // 代表上报异常到 sentry 
      Sentry.captureException(error)
      return {
        code,
        message,
        info,
        originalError
      }
    }

    // 在中间件中集中处理异常
    app.use(async (ctx, next) => {
      try {
        await next();
      } catch (error) {
        ctx.body = formatError(error)
      }
    })

    // graphql 中使用 formatError 统一收集异常
    new ApolloServer({
      typeDefs,
      resolvers,
      formatError
    })
    ```

    > 当在逻辑层捕捉到异常再手动抛出时，不要丢失上下文信息，此时可以使用添加字段 originalError 来保持上下文信息

1. script 等非 API 层，如拉取配置，数据库迁移脚本以及计划任务等

另外除了主动捕捉到的异常，还有一些可能漏掉的异常，可能导致程序退出。捕捉 `uncaughtException` 与 `unhandledRejection` 事件，另外视情况决定程序是否手动退出: `process.exit`

``` javascript
process.on('uncaughtException', (err) => {
  console.error('uncaught', err)
  Sentry.captureException(err)
  process.exit(1)
})

process.on('unhandledRejection', (reason, p) => {
  console.error('unhandle', reason, p)
  Sentry.captureException(err)
})
```

关于 exit code，可以参考本篇文章 [Node 中异常，exit code 与 docker](https://shanyue.tech/post/exit-code-node-and-docker.html)

### 异常结构化

当 API 层发生异常时，传输数据至客户端时需要对异常进行结构化，有两个好处

1. 方便下一步的异常上报
1. 方便前端对结构化信息的解析以及对应的展示

以下使用 `FormatError` 表示当发生异常时， **API 应该返回的结构化的信息** 。而当异常发生时，可以使用一个函数 `formatError` 在中间件中统一结构化异常信息

在 REST 中 `FormatError` 可以使用 `typescript` 标识为以下格式的数据信息

``` typescript
interface FormatError {
  // 表明状态码
  readonly code: string;
  // human readable 信息
  readonly message: string;
  // 表明附属信息
  readonly info?: Record<string, any>;
  // 表明原始错误
  readonly originalError?: Error;
}

function formatError (error: Error): FormatError;
```

在 GraphQL 中，`FormatError` 可以继承 `GraphQLFormattedError`，用以表示以下信息

``` typescript
interface FormatError {
  readonly message: string;
  readonly locations?: ReadonlyArray<SourceLocation>;
  readonly path?: ReadonlyArray<string | number>;
  readonly extensions?: {
    // 表明错误码
    readonly code: string;
    // 表明附属信息
    readonly info?: Record<string, any>;
    // 表明原始错误
    readonly exception?: Error;
  }
}

// 异常格式化后的一个示例
{
  "message": "column User.a does not exist",
  "locations": [
    {
      "line": 2,
      "column": 3
    }
  ],
  "path": [
    "dbError"
  ],
  "extensions": {
    "code": "SequelizeDatabaseError",
    "exception": {
      "name": "SequelizeDatabaseError",
      "sql": "SELECT count(*) AS \"count\" FROM \"users\" AS \"User\" WHERE \"User\".\"a\" = 3;",
      "error@context": {
        "_ns_name": "hello, world",
        "id": 1814,
        "requestId": "532271c5-10cc-46f1-b628-a46bcc4981a0"
      },
      "stacktrace": [
        "SequelizeDatabaseError: column User.a does not exist",
        "    at Query.formatError (/Users/shanyue/Documents/apollo-server-quick/node_modules/sequelize/lib/dialects/postgres/query.js:366:16)"
      ]
    }
  }
}

function formatError (error: Error): FormatError;
```

#### code

表示错误标识码，用以对错误进行归类，如用户输入数据不合法 (ValidationError)，数据库异常 (DatabaseError)，外部服务请求失败 (RequestError)

根据经验我把 code 分为以下几类

+ ValidationError，用户输入不合法
+ DatabaseError，数据库问题
    + DatabaseUniqueError
    + DatabaseConnectionError
    + ...
+ RequestError，外部服务
    + RequestTimeoutError
+ ForbiddenError
+ AuthError，未授权请求授权资源
+ AppError，业务问题
    + AppBadRequest
    + ...
+ ...

对于数据校验，数据库异常与请求失败，我们通常会使用第三方库。 **此时可以根据第三方库的 Error 来定制 code**

#### message

**表示 human-readable 的错误信息，但不一定代表它可以展示在前端。这里的 human 代表的是开发人员，而非用户**，如以下两个 message 就不适宜展示在前端

1. connect ECONNREFUSED postgres.xiange.tech. 不需要把数据库断连的消息展示在前端
1. email is required. 输入数据校验，虽然可以展示给用户，但是需要展示中文 (国际化)

**你可以根据 code，来决定前端是否可以展示后端期待它展示的信息，而在前端也可以根据 code 与 message 来进行全局集中处理**

#### info

表示一些针对 code 的更为详细的信息

+ 当发送请求失败的时候，你至少需要知道失败的这个请求长什么样子: method，params/body 以及 headers
+ 当用户输入数据校验失败时，至少得知道是那几个字段

#### originalError

originalError 表示由该异常引发的错误 API，它往往会包含更加详细的上下文信息

`originalError.stacktrace` 表示当前错误的堆栈，当异常发生时可以快速定位问题发生的位置 (虽然 node 有时候抛出的堆栈信息都是自己从未见过的文件)

当在开发和测试环境时，把 originalError 附到 API 中可以快速定位问题， **当在生产环境时，不要把你的 originalError 也放到 API 里**，你可以在监控系统中找到完整的错误信息

**你可以使用以下两个 API 来优化你的 `stacktrace`**

``` typescript
Error.captureStackTrace(error, constructorOpt)
Error.prepareStackTrace(error, structuredStackTrace)
```

具体使用方法可以参考 [v8 stack trace api](https://v8.dev/docs/stack-trace-api)

#### http status

当API处理过程中发生错误时，应该返回 400+ 的 status code

+ HTTP/1.1 400 Bad Request
+ HTTP/1.1 401 Unauthorized
+ HTTP/1.1 403 Forbidden
+ HTTP/1.1 429 Too Many Requests

### 监控系统

异常上报需要有一个监控系统，我这里比较推荐 `Sentry`，具体如何部署可以参考我的一篇文章：[如何部署 Sentry](https://shanyue.tech/post/sentry-docker-install/)。

你也可以直接在官方注册使用 SaaS 版本: [Sentry 付费](https://sentry.io/pricing/)。个人免费版每个月有 5K 的报错限额，也足够个人使用。

#### 监控指标

异常监控除了异常本身以外，还要采集更多一些的指标。

> 异常监控最重要的目标就是还原异常抛出场景

1. 异常级别: Fatel, Error 以及 Warn。这决定你周日收到报警邮件或报警短信是继续浪还是打开笔记本改 Bug。可以通过 code 来标记

    ``` typescript
    const codeLevelMap = {
      ValidationError: 'warn',
      DatabaseError: 'error'
    }
    ```
1. 环境: 生产环境还是测试环境，早于用户及测试发现问题，可以直接读取应用服务的环境变量
1. 上下文: 如哪一条 API 请求，哪一个用户，以及更详细的 http 报文信息。可以直接利用 Sentry 的API上报上下文信息

    ``` typescript
    Sentry.configureScope(scope => {
      scope.addEventProcessor(event => Sentry.Handlers.parseRequest(event, ctx.request))
    })
    ```
1. 用户: API 错误是由那个用户触发的
1. code: 便于对错误进行分类
1. request_id: 便于 tracing，也方便获取更多的调试信息：在 elk 中查找当前 API 执行的 SQL 语句

    ``` typescript
    const requestId = ctx.header['x-request-id'] || Math.random().toString(36).substr(2, 9)
    Sentry.configureScope(scope => {
      scope.setTag('requestId', requestId)
    })
    ```

由上可见，对于采集指标的数据一般来源于两个方面，http 报文以及环境变量

#### 异常过滤

在本地开发时，往往不需要把异常上报到 `Sentry`。`Sentry` 也提供了 hook 再上报之前对异常进行过滤

``` typescript
beforeSend?(event: Event, hint?: EventHint): Promise<Event | null> | Event | null;
```

## 利用 hash/query 键值对优化网络性能 (APQ)

在 `apollo-server` 中，这种技术叫 `APQ(Automatic persisted queries)`。

``` javascript
const queryMap = {
  'hash1': `{ user { id, phone } }`,
  'hash2': `{ todos { id, name } }`
}
```

![Apollo APQ](https://www.apollographql.com/docs/apollo-server/d500b543a6ad2a7d64ed7f190d40bd8c/persistedQueries.newPath.png)

### 前端 APQ

### APQ 与 缓存

### APQ 与 service worker

### APQ 与 cors

## GraphQL plugin，GraphQL middleware 与 Node middleware

## 结构化日志

在一个健壮的项目中，日志是必不可少的。而格式化的日志更有助于我们快速检索日志，更快的找到性能瓶颈，更快的解决线上故障。

如果在 nodejs 环境中，推荐 [winston](https://github.com/winstonjs/winston) 作为日志库

### level

在所有关于日志的组件/函数库中都会有 level 的属性。它表示日志的紧急程度。一般会分为以下几个等级

+ `error`: 线上第一时间需要解决的问题
+ `warn`: 预料中的问题，如登录失败，数据库唯一性检查没有通过
+ `info`: 一些辅助信息，如 sql，request，response 
+ `log`
+ `debug`

在平常使用中，还是 `error`，`warn`，`info` 三者较多。另外，`error` 与 `warn` 一般会接入异常监控系统，如 Sentry

``` javascript
const winston = require('winston')

const logger = createLogger()

logger.info('hello, world');
logger.warn('hello, warn');
logger.error('hello, error');
```

### label

日志会在不同的地方产生，如 db，redis，function，request, response。在不同地方产生的日志，则含有不同的信息

如在数据库产生的日志会有以下信息

``` javascript
{
  label: 'db',
  sql: 'select * from todo',
  timing: 180,
  tables: ['todo'],
  type: 'SELECT',
  timestamp: '2019-09-13T12:55:16.061Z',
  requestId: '1a83de48-6b80-4558-a587-5be4c87449c2'
}
```

如在一个 graphql 的 query 中产生的日志会有以下信息

``` javascript
{
  label: 'query',
  query: 'query TODOS { todos { id, title } }',
  operationName: 'TODOS'
  variables: {},
  user: {
    id: 10086, 
    role: 'ADMIN'
  },
  ip: '::1',
  timestamp: '2019-09-13T12:55:16.061Z',
  requestId: '1a83de48-6b80-4558-a587-5be4c87449c2'
}
```

### 生成结构化与易读的日志

一般来说，关于日志

1. 生产环境的日志需要 `machine readable`，使用 json 进行数据结构化，方便在 ELK 或其它日志系统进行检索
1. 本地环境的日志需要 `human readable`，方便开发人员在本地开发时阅读

那如何设计一个简单的 logger，既能够 `machine readable`，又 `human readable` 呢

1. 把日志存储为 jsonl 格式文件，即每行都是一个 json，来满足 `machine readable`
1. 使用 `jq` 来做 `human readable`，可以对日志进行筛选，并展示所需字段

``` javascript
// 把日志存储使用 jsonl 格式存到文件中
const logger = winston.createLogger({
  transports: [
    new winston.transports.File({
      dirname: './logs',
      filename: `db.log`,
    })
  ]
})
```

``` shell
$ tail -f -n 2 logs/db.log | jq '{ message, requestId }'
{
  "message": "Executing (default): SELECT \"id\", \"name\" FROM \"todo\" AS \"Todo\";",
  "requestId": "4ab7525d-dbae-4243-b833-490a9b7268b5"
}
{
  "message": "Executing (default): SELECT \"id\" FROM \"todo\" AS \"Todo\";",
  "requestId": "390b158b-23aa-443d-9dc9-03abfc56e750"
}
```

## 

## 日志与 ELK


## 监控

