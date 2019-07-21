# sequelize V5 升级记录以及编译时与运行时问题解决方案

最近把项目中的 sequelize 由 `4.38.0` 升级到了 `5.8.7`，不过最后事实告诉我这真是一个错误的决定，说多了全是泪，升级记录如下

## 01 删包

从 package.json 中删掉 sequelize 以及 @types/sequelize

## 02 过文档

大致过一遍官方升级文档 <http://docs.sequelizejs.com/manual/upgrade-to-v5.html>

## 03 npm install

由于官方提供了 `typescript` 的支持，不需要在安装 `@types/sequelize`。

```shell
npm install sequelize
```

## 04 tsc

由于使用了 `typescript` 编译，解决问题。

```shell
$ tsc
...
Found 1361 errors.
```

## 05 new Sequelize

从数据库初始化入手，解决一些 Sequelize 实例化时的类型问题

## 06 AnyModel & AnyPropModel & Sequelize.define

由于 `sequelize` 的 `type` 此时由官方维护，重新定义了 `Model` 等类型。

虽然目前官方已经支持了对 `Model` 的 typescript 支持，但是为了更小幅度的升级，仍然使用 `Sequelize.define`。

以后将 `AnyPropModel` 逐渐替换为 `UserModel` 等真实的 Model。

根据文档，对 `Model` 以及 `Sequelize.define` 做以下更改。

```typescript
class AnyPropModel extends Model {
  [key: string]: any;
}

export type AnyModel = typeof Model & {
  new (values?: any, options?: BuildOptions): AnyPropModel;
}

export type Models = Record<string, AnyModel>;

const UserModel = <AnyModel>sequelize.define('MyDefineModel', {
  id: {
    primaryKey: true,
    type: DataTypes.INTEGER.UNSIGNED,
  }
});
```

更改之后再次编译.

```shell
$ tsc
Found 898 errors.
```

## 07 归并与分类，逐个击破

对 typescript 编译出来的错误信息进行格式化并做统计，以下为格式化数据，抽出 `{ file, code, message }`

> 本来也想抽出 lines，没有成功...

```shell
$ tsc | grep 'error TS' | jq -R -c -s 'split("\n") | map(capture("(?<file>.+): error (?<code>.+): (?<message>.+)")) | .[]' > build.jsonl
$ head -3 build.jsonl
{"file":"bin/demo.ts(278,23)","code":"TS2351","message":"Cannot use 'new' with an expression whose type lacks a call or construct signature."}
{"file":"src/helpers/one.ts(36,23)","code":"TS2576","message":"Property 'literal' is a static member of type 'Sequelize'"}
{"file":"src/helpers/two.ts(188,24)","code":"TS2576","message":"Property 'fn' is a static member of type 'Sequelize'"}

```

根据格式化信息，对相同 code 的错误进行分类，先解决错误率最高的五类

```shell
$ cat build.jsonl | jq -s 'group_by(.code) | map({count: length, code: .[0].code, message: .[0].message}) | sort_by(.count) | .[]'
{
  "count": 41,
  "code": "TS6133",
  "message": "'DataTypes' is declared but its value is never read."
}
{
  "count": 53,
  "code": "TS2339",
  "message": "Property 'id' does not exist on type 'object'."
}
{
  "count": 82,
  "code": "TS2709",
  "message": "Cannot use namespace 'DataTypes' as a type."
}
{
  "count": 94,
  "code": "TS7006",
  "message": "Parameter 'e' implicitly has an 'any' type."
}
{
  "count": 142,
  "code": "TS2576",
  "message": "Property 'col' is a static member of type 'Sequelize'"
}
{
  "count": 335,
  "code": "TS2531",
  "message": "Object is possibly 'null'."
}
```

## 08 TS2576: Sequelize.prototype -> Sequelize

```shell
"Property 'col' is a static member of type 'Sequelize'"
"Property 'literal' is a static member of type 'Sequelize'"
"Property 'or' is a static member of type 'Sequelize'"
```

根据文档 <http://docs.sequelizejs.com/manual/upgrade-to-v5.html#sequelize>

Sequelize 示例上的很多方法变成了 static method.

借助 `VS Code` 与其内置的命令行工具，输入命令 `tsc | grep 2576` 可以更快解决问题:

1. `tsc | grep 2576` 提供所有的此类问题与行号
1. `VS Code` 可以根据行号快速定位

但不管怎么说，这还是一个体力活......

## 09 TS2339 Model 的废弃方法

```shell
Property 'findById' does not exist on type 'AnyModel'.
Property 'find' does not exist on type 'AnyModel'.
Property 'id' does not exist on type 'AnyPropModel | null'.
Property 'LOCK' does not exist on type 'Transaction'.
```

这个在升级文档中也提到过 <http://docs.sequelizejs.com/manual/upgrade-to-v5.html#model>

至于替换也是一个体力活，再次编译

<!-- ```typescript
const { id } = await models.user.findOne()
`

```typescript
const users = await db.query(sql, { type: QueryTypes.SELECT })
const id = list[0].id

const users = await db.query<AnyModel>(sql, { type: QueryTypes.SELECT })
const id = list[0].id
```-->

**Found 753 errors.**

## 10 TS2531 Object is possibly 'null'

```shell
$ tsc | grep 2531 | wc
   406
```

再次统计下此问题的个数，比刚才统计时多了一百多

**我们总是在不停地解决 Bug 的过程中引入新的 Bug。在解决旧 Bug 的过程中总有产生新 Bug 的风险**

`findById` 更改之后有更多的问题显现出来，是因为没有对返回的数据做不存在断言处理，如下例所示

```typescript
const user = await models.user.findOne()
// 此时 user 可能不存在，可能报错
const id = user.id
```

在解决问题之前，我先分析下原因

使用 `rejectOnEmpty` 来修正它，他能保证数据一定存在

```typescript
const user = await models.User.findOne({
  rejectOnEmpty: true
})
```

接下来就是体力活了:

1. `tsc | grep 2531` 提供所有的此类问题与行号
1. `VS Code` 根据行号快速定位
1. `gd` vim 的 `Go to Def` 可以快速定位到出问题的变量定义处
1. `"0p` 使用 vim 把 `rejectOnEmpty` 至于0号寄存器，快速粘贴
1. `==` vim 进行格式化

再次编译:

**Found 335 errors.**

## 11 migration

```shell
TS2709: Cannot use namespace 'DataTypes' as a type
```

这都是在 migration 文件中的内容，既然数据库迁移脚本已经执行过了，它其实也没多大用处了，我觉得不改也可以了...

**另外，migration 这种数据库迁移脚本是不是可以单独从项目中抽出来，有两个原因**

1. 它是一次性脚本
1. 一个数据库有可能对应多个后端应用

```typescript
import { QueryInterface, DataTypes } from 'sequelize'

export const up = async function (queryInterface: QueryInterface, Sequelize: DataTypes) {

}
```

全局替换

`Sequelize: DataTypes -> sequelize: typeof Sequelize`

**Found 216 errors.**

## 12 implicitly any

```shell
TS7006 Parameter 'item' implicitly has an 'any' type.
```

解决后再次编译

**Found 185 errors.**

## 13 使用 sed 批量替换 Op

```typescript
// 替换前
where.count = { $lte: 10 }
where.count['$lte'] = 10
where.count.$lte = 10

// 替换后
where.count = { [Op.lte]: 10 }
where.count[Op.lte] = 10
where.count[Op.lte] = 10
```

写一段 `sed` 脚本来批量替换

再次编译

**Found 412 errors.**

## 14 补充 Op

以上错误的原因过多是因为批量替换成 `Op` 后提示 `Op` 不存在

```typescript
import { Op } from 'sequelize'
```

## 15 再次统计

```shell
$ tsc | grep 'error TS' | jq -R -s 'split("\n") | map(capture("(?<file>.+): error (?<code>.+): (?<message>.+)")) | group_by(.code) | map({count: length, code: .[0].code, message: .[0].message}) | sort_by(.count) | .[]'

{
  "count": 12,
  "code": "TS2684",
  "message": "The 'this' context of type 'typeof Model' is not assignable to method's 'this' of type '(new () => Model<{}, {}>) & typeof Model'."
}
{
  "count": 14,
  "code": "TS2322",
  "message": "Type 'true' is not assignable to type 'false'."
}
{
  "count": 18,
  "code": "TS2694",
  "message": "Namespace '\"/Users/shanyue/backend/node_modules/sequelize/types/index\"' has no exported member 'AnyFindOptions'."
}
{
  "count": 20,
  "code": "TS2532",
  "message": "Object is possibly 'undefined'."
}
{
  "count": 118,
  "code": "TS2304",
  "message": "Cannot find name 'Op'."
}
```

都是一些小问题了，逐个解决

## 16 git diff

统计下修改了多少内容

```shell
$ git diff master --shortstat
 199 files changed, 1784 insertions(+), 1411 deletions(-)
```

## 17 运行时问题: postgres range

以上编译时的问题解决了，最令人头疼的还是运行时问题了

这次碰到的是 postgres 的 `range` 这个数据类型

```typescript
// 更改前
[0, 100]

// 更改后
[{
  value: 0,
  inclusive: false
}, {
  value: 100,
  inclusive: true
}]
```

**但是如果对数据库的每个 Model 都加上 type 的话，这个问题就可以在编译时解决**

## 18 运行时问题: undefined in where

在 where 中遇到 `undefined` 会抛出异常。<https://github.com/sequelize/sequelize/pull/9548/files>

使用 `_.pickBy` 过滤掉 `undefined`

```typescript
const where = _.pickBy(data, x => x !== undefined)
```

**当然，如果 typescript 做的比较严格的话，这个问题也可以避免**

## 19 运行时问题: _.assign({ [Op.ne]: 3 })

`_.assign` 会丢失 Symbol 属性，使用 `Object.assign` 代替

<hr/>

欢迎关注我的公众号**山月行**，在这里记录着我的技术成长，欢迎交流

![欢迎关注公众号山月行，在这里记录我的技术成长，欢迎交流](https://shanyue.tech/qrcode.jpg)
