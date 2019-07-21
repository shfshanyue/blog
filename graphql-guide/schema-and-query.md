---
title: "了解 graphql: schema 与 query"
date: 2019-09-07

---

从上文 [hello, world](https://shanyue.tech/graphql-guide/hello-world) 中可以看出 `graphql` 很关键的两个要素：`schema` 和 `query`。而当我们开发 web 应用时，`schema` 将会是服务端的主体，而 `query` 存在于前端中，类似 REST 中的 API。

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

正如在 `React` 中使用`jsx` 简化了 `React.createElement` 的写法。`graphql` 对于 schema 也有一套它自己的 `DSL (Domain Specified Language)`，也更为简单，易懂。在代码中以 `graphql` 或 `gql` 作为文件名后缀，用法如下

``` graphql
# schama，在后端进行维护
type Query {
  hello: String
}

# query，在前端进行管理
{
  hello
}
```

以及查询结果

``` javascript
{
  hello: 'hello, world'
}
```

> 在前端中所有查询的 gql 往往会通过 graphql/gql 后缀的文件来统一维护，这里有一份代码示例: [shfshanyue/shici:query.gql](https://github.com/shfshanyue/shici/blob/master/query/index.gql)

你看到这里，想必有两个疑问：

1. 以上的 `graphql` 代表什么，以及我们如何书写 `graphql` 
1. 相比 js 代码，`DSL` 少了一个 `resolve` 函数，而它又是什么

## Object Type 与 Field

这里引入 graphql 中的两个基本术语，`object type` 与 `field`。它们是组成 graphql 最基本的组件，如同细胞是生物体的基本单位。

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

到了这里，你会发现，对于 graphql schema 的认识还有一些信息尚未涉及：`ID` 与 `String`，它们被称作 `scalar type`，你可以理解为数据类型。 **正是因为 scalar，graphql 才成为强类型查询语言。**

## Query: query everyting

由上所述，`Query` 为 `graphql` 的入口查询处，我们可以并且只可以查询 `Query` 下的任意字段 (field)。因此，他组成了 `graphql` 最核心的功能： **查找你所需要的任何数据**。

``` graphql
# schema
type Query {
  hello: String
  todos: [Todo!]!
}

// 以下三个 query 一般会在前端进行统一管理
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
    id
    title 
  }
}
```

查询结果如下

``` javascript
{ hello: 'hello, world' }
{ todos: [{ id: 1 }] }
{ hello: 'hello, world', todos: [{ id: 1, title: 'learn react' }] }
```

在前端我们根据 `Query` 组合成各种查询，而我们为了在查询过程中方便辨认，可以为查询添加 `operationName`：

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
    id
    title 
  }
}
```

### Scalar Type

在 `graphql` 中有一些内置的 `scalar` 类型，用以表示 graphql 中 `field` 的数据类型，这也是 graphql 为强类型语言的基础。内置类型如下所示

+ `Int`，代表32位有符号型整数
+ `Float`
+ `String`
+ `Boolean`
+ `ID`，唯一标识符，一般可视为数据库中的主键。在 `object type` 中，一般会把 id 设置为 `ID` 类型，依赖它做一些缓存的操作。

正因为 `scalar` 与 `!`，来保证了 graphql 的 query 是强类型的。所以当我们看到如下的 query 时，可以在前端大胆放心的使用: `data.todos.map(todo => todo.title.replace(' ', ''))`。既不用担心 `data.todos` 突然报错 `Cannot read property 'map' of null`，也不用担心 `Cannot read property 'title' of null`

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

如果不使用 graphql，你无法保证响应中数据的类型。你可能需要使用 lodash 来做一些边界的处理

``` javascript
const data = {
  todos: [{
    id: 1, 
    title: 'learn react'
  }]
}

// 使用 graphql 后
data.todos.map(todo => todo.title.replace(' ', ''))

// 如果不使用 graphql，你无法保证返回数据类型。你可能需要使用 lodash 来做一些边界的处理
_.map(data.todos, todo => _.replace(todo.title, ' ', ''))
```

当在数据库中，一个字段除了整型，浮点型等基本类型外，还会有更多而且比较重要和常用的数据类型：`json` 和 `datetime`。既然 `scalar` 用以表示 `field` 的数据类型，那么它如何表示 `json` 与 `datetime` 或者更多的数据类型呢？

这时，可以使用 `graphql.js` 的API `graphql.GraphqlQLScalarType` 来自定义 `scalar`

+ [graphql-iso-date](https://github.com/excitement-engineer/graphql-iso-date)
+ [graphql-type-json](https://github.com/taion/graphql-type-json)

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

