## resolve function

再回到刚开始的 `hello, world` 的示例，用 `graphql` 表示如下

``` graphql
# schema
type Query {
  hello: String
}

# query
query HELLO {
  hello
}
```

对以上章节的内容再梳理一遍：

1. 可以对 `hello` 进行查询，因为该字段在 `Query` 下
1. `HELLO` 查询所得到的 `data.hello` 是一个字符串

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