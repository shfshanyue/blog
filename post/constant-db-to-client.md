# 从数据库到前端，使用 enum 代替 constant number

在我经历过几个以 node 为主的后端项目中，都有一个文件 `constant.js`。顾名思义，里边保存着各种常量，而大多是字符串与数字的对应关系。

但是在实际工作中，根据数字来调试相当费劲，比如后端代码中 `where (status === 1)`，此时 `1` 就很容易造成混淆。而在数据库中的 SQL，也会遇到这种问题。我们一般把它们称作魔法数字

<!--more-->

记得在我们数据库中，有一个用户表，其中一个字段 `user_type` 中 1 和 2 代表学生和老师，刚开始还可以轻易分清，后来文档中对该字段的注释给搞反了，自此每次查询之前我都需要反复确认。

试想一下如果此时它是一个 `enum('STUDENT', 'TEACHER')` 的值，则可以轻易分清了，不需要再记各种数字了。

以下展示一个简单的 TODO List。以 TODO 的三种状态 `TODO`，`DONE` 以及 `DOING` 来描述数据库，后端和前端应如何传输以及展示

## 使用数字

在数据库中使用数字来表示状态，有可能是 `Base 1` 的 123，也有可能是 `Base 0` 的 012。不过最重要的是要记得在数据库中对列添加注释

```sql
-- mysql 可以直接注释
create table todo (
  status smallint default 1 comment "1: TODO, 2: DOING, 3: DONE";
)

-- postgres 在 comment 中进行注释
create table todo (
  status smallint default 1;
)
comment on column todo.status is '1: TODO, 2: DOING, 3: DONE';
```

在后端为了筛选条件下避免以下情况的出现，需要维护一个 constant 的变量

```javascript
const where = {
  // 为了避免直接出现 1
  Status: 1
}
```

使用 Status 来维护一个常量，response 代表返给前端的数据

```javascript
const Status = {
  TODO: 1,
  DOING: 2,
  DONE: 3
}

const where = {
  Status: Status.TODO
}

const response = [{
  status: Status.TODO
}]
```

在前端维护一个数字至中文展示的映射

```javascript
const status_show = {
  1: '待办',
  2: '进行中',
  3: '已完成'
}

const url = '/api/todos?status=1'
```

但在这种情况下，在进行接口联调时仍会是 1/2/3，不便于调试

## 使用 enum 

在 postgres 中添加 todos_status 的 type

```sql
create type todo_status as enum ('UNDO', 'DOING', 'DONE');

create table todo (
  status todo_status default 'UNDO',
);
```

在后端可以直接在筛选条件中使用字符串

```javascript
const where = {
  Status: 'TODO'
}
```

如果为了避免使用字符串打错了字符，可以使用 typescript 的 `const enum` 在编译器发现问题

```typescript
const enum Status {
    TODO = 'TODO',
    DOING = 'DOING',
    DONE = 'DONE'
}

const where = {
  Status: Status.TODO
}
```

编译之后的 javascript 代码如下

```javascript
var where = {
    Status: "TODO" /* TODO */
};
```

在前端维护一个常量至中文展示的映射，可以看出请求的 url 对于调试与可读性已经很友好了

```javascript
const status_show = {
  TODO: '待办',
  DOING: '进行中',
  DONE: '已完成'
}

const url = '/api/todos?status=TODO'
```

## 使用 graphql

数据库依然使用 enum 来表示 TODO 的状态

在 graphql 中，使用以下 Schema 表示 TODO，TodoStatus 以及查询列表的 query。TodoStatus 可以使用 `enum` 来表示

```graphql
enum TodoStatus {
  DONE 
  DOING
  UNDO
}

type Todo {
  id: ID!
  status: TodoStatus!
}

type Query {
  todos (
    status: TodoStatus
  ): [Poem!]
}
```

使用以下 query 筛选 todos

```graphql
query TODOS ($status: TodoStatus) {
  todos (status: $status) {
    id
    status
  }
}
```
