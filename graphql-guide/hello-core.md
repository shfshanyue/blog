# 源码分析

## 源码

1. 验证 Schema 的有效性
1. 解析 Source/Query
1. 执行

+ validateSchema
  + validateRootTypes
  + validateDirectives
  + validateTypes
+ parseSource
  + Source
  + Document
+ execute
  + rootType -> 可以从此获取到诸多 fields

## 执行 execute

+ execute
  + executeOperation
  + rootFields 获取到根路径的所有字段

## Query

``` js
executeFields(exeContext, rootType, rootValue, path, rootFields);
```

+ executeFields
  + executeField
    + source, args, contextValue, info
    + resolvFn
    + completeValue

## Mutation

``` js
executeFieldsSerially(
  exeContext,
  rootType,
  rootValue,
  path,
  rootFields,
);
```

+ executeFieldsSerially

## Schema

+ GraphQLSchema
+ GraphQLObjectType
+ GraphQLDirective


+ isObjectType

+ schema.getQueryType()
+ schema.getMutationType()
+ schema.getSubscriptionType()
+ schema.getDirectives()