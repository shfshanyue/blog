---
title: 30分钟SQL入门指南
description: 本篇文章是 SQL 必知必会 的读书笔记，SQL必知必会的英文名叫做 Sams Teach Yourself in 10 Minutes。但是，我肯定是不能够在10分钟就能学会本书所有涉及到的sql，所以就起个名字叫30分钟学会SQL语句（其实半个小时也没有学会...）。
keywords: SQL入门,SQL必知必会,SQL实践
date: 2017-10-24
tags:
  - 数据库
categories:
  - 后端

---

本篇文章是 **SQL 必知必会** 的读书笔记，SQL必知必会的英文名叫做 **Sams Teach Yourself in 10 Minutes** 。但是，我肯定是不能够在10分钟就能学会本书所有涉及到的sql，所以就起个名字叫30分钟学会SQL语句（其实半个小时也没有学会...）。

<!--more-->

目前手边的数据库是 mysql，所以以下示例均是由 mysql 演示。由于现在大部分工具都支持语法高亮，所以以下关键字都使用小写。

> 原文链接见 <https://shanyue.tech/post/sql-guide/>

## 准备

### 工具

[mycli](https://github.com/dbcli/mycli)，一个使用python编写的终端工具，支持语法高亮，自动补全，多行模式，并且如果你熟悉vi的话，可以使用vi-mode快速移动，编辑。总之，vi + mycli 简直是神器！

同样，`postgreSQL` 可以使用[pgcli](https://github.com/dbcli/pgcli)。

```shell
pip install -U mycli    # 默认你已经安装了pip
pip install -U pgcli    # 默认你已经安装了pip
```

### 数据库

在新建数据库之前，需要你有一个数据库服务，如果没有的话，可以选择使用 docker 进行安装，以下是 docker 安装的指导教程

+ [postgres docker](https://github.com/docker-library/docs/tree/master/postgres/)
+ [mysql docker](https://github.com/docker-library/docs/tree/master/mysql/)

另外，你也可以通过搜索引擎来获取如何使用命令行在裸机上安装

总之，当你有了一个数据库服务后，你可以使用 pgcli/mycli 进入 SQL 的交互式命令环境中，如下所示

至于 pgcli 以及 mysql 的用法，你可以通过 `pgcli --help` 来获取帮助

```shell
$ pgcli -U postgres -h 172.0.0.1
Server: PostgreSQL 10.5
Version: 1.10.3
Chat: https://gitter.im/dbcli/pgcli
Mail: https://groups.google.com/forum/#!forum/pgcli
Home: http://pgcli.com
postgres@172:postgres>
```

```shell
$ mycli -u root -h 172.0.0.1 -p $password
Version: 1.12.0
Chat: https://gitter.im/dbcli/mycli
Mail: https://groups.google.com/forum/#!forum/mycli-users
Home: http://mycli.net
Thanks to the contributor - Chris Anderton
(none)>
```

**在学习基本的 SQL 语句之前，先新建一个数据库作为学习 SQL 的必要条件**

以下是 `postgres` 新建数据库的流程，`mysql` 同样

```shell
postgres@172:postgres> create database demo
CREATE DATABASE
Time: 0.891s

postgres@172:postgres> use demo
You are now connected to database "demo" as user "postgres"
Time: 0.391s

postgres@172:demo>
```

### 样例表

新建数据库完成后，我为新建的数据库 `demo` 准备了几张样例表，用于以后的学习。

示例中有两个表，分为 student 学生表与 class 班级表，具体班级以及学生的字段如下。

**在接下来的 SQL 语法学习中，将使用这两张表作为样例表。**，你将使用样例表学习以下内容

+ 检索数据
+ 排序
+ 数据过滤
+ 计算字段
+ 数据聚合 (aggregation)
+ 数据分组
+ 子查询
+ 联接
+ 插入数据
+ 修改数据
+ 创建表与更新表
+ 视图
+ 约束及索引
+ 触发器
+ 存储过程

#### mysql

如果你使用的是 `mysql`，执行以下 sql 语句生成数据

```sql
create table class (
  id int(11) not null auto_increment comment '班级id',
  name varchar(50) not null comment '班级名',
  primary key (id)
) comment '班级表';

create table student (
  id int(11) not null auto_increment comment '学生id',
  name varchar(50) not null comment '学生姓名',
  age tinyint unsigned default 20 comment '学生年龄',
  sex enum('male', 'famale') comment '性别',
  score tinyint comment '入学成绩',
  class_id int(11) comment '班级',
  createTime timestamp default current_timestamp comment '创建时间',
  primary key (id),
  foreign key (class_id) references class (id)
) comment '学生表';

insert into class (name) values ('软件工程'), ('市场营销');

insert into student (name, age, sex, score, class_id) values ('张三', 21, 'male', 100, 1);
insert into student (name, age, sex, score, class_id) values ('李四', 22, 'male', 98, 1);
insert into student (name, age, sex, score, class_id) values ('王五', 22, 'male', 99, 1);
insert into student (name, age, sex, score, class_id) values ('燕七', 21, 'famale', 34, 2);
insert into student (name, age, sex, score, class_id) values ('林仙儿', 23, 'famale', 78, 2);
```

#### postgres

如果你使用的是 `postgres`，执行以下 sql 语句生成数据

```sql
create table class (
  id serial not null,
  name varchar(50) not null,
  primary key (id)
);

create type sex_type as enum('male', 'famale');

create table student (
  id serial not null,
  name varchar(50) not null,
  age smallint  default 20,
  sex sex_type,
  score smallint,
  class_id int,
  createTime timestamp default current_timestamp,
  primary key (id),
  foreign key (class_id) references class (id)
);

insert into class (name) values ('软件工程'), ('市场营销');

insert into student (name, age, sex, score, class_id) values ('张三', 21, 'male', 100, 1);
insert into student (name, age, sex, score, class_id) values ('李四', 22, 'male', 98, 1);
insert into student (name, age, sex, score, class_id) values ('王五', 22, 'male', 99, 1);
insert into student (name, age, sex, score, class_id) values ('燕七', 21, 'famale', 34, 2);
insert into student (name, age, sex, score, class_id) values ('林仙儿', 23, 'famale', 78, 2);
```

## SQL 基础

### 术语

+ DBMS

    数据库指一系列有关联数据的集合，而操作和管理这些数据的是DBMS，包括MySQL，PostgreSQL，MongoDB，Oracle，SQLite等等。
    RDBMS 是基于关系模型的数据库，使用 `SQL` 管理和操纵数据。另外也有一些 `NoSQL` 数据库，比如 MongoDB。
    因为`NoSQL`为非关系型数据库，一般不支持join操作，因此会有一些非正则化(denormalization)的数据，查询也比较快。

+ Database

    数据库指一系列有关联数据的集合，如以上通过 `create datebase demo` 新建的 `demo` 数据库。

+ Table

    具有特定属性的结构化文件。比如学生表，学生属性有学号，年龄，性别等。schema (模式) 用来描述这些信息。
    `NoSQL` 不需要固定列，一般没有 schema，同时也利于垂直扩展。

+ Column

    表中的特定属性，如学生的学号，年龄。每一列都具有数据类型。

+ Data Type

    每一列都具有数据类型，如 char, varchar，int，text，blob, datetime，timestamp。
    根据数据的粒度为列选择合适的数据类型，避免无意义的空间浪费。如下有一些类型对比

    + char, varchar
        需要存储数据的长度方差小的时候适合存储`char`，否则`varchar`。
        `varchar` 会使用额外长度存储字符串长度，占用存储空间较大。
        两者对字符串末尾的空格处理的策略不同，不同的DBMS又有不同的策略，设计数据库的时候应当注意到这个区别。

    + datetime, timestamp
        `datetime` 存储时间范围从1001年到9999年。
        `timestamp` 保存了自1970年1月1日的秒数，因为存储范围比较小，自然存储空间占用也比较小。
        日期类型可以设置更新行时自动更新日期，建议日期时间类型根据精度存储为这两个类型。
        如今 DBMS 能够存储微秒级别的精度，比如 `mysql` 默认存储精度为秒，但可以指定到微秒级别，即小数点后六位小数

    + enum
        对于一些固定，不易变动的状态码建议存储为 `enum` 类型，具有更好的可读性，更小的存储空间，并且可以保证数据有效性。

    > 插一个小问题：
    > 如何存储IP地址

+ Row

    数据表的每一行记录。如学生张三。

### 检索数据

```sql
-- 检索单列
select name from student;

-- 检索多列
select name, age, class from student;

-- 检索所有列
select * from student;

-- 对某列去重
select distinct class from student;

-- 检索列-选择区间
-- offset 基数为0，所以 `offset 1` 代表从第2行开始
select * from student limit 1, 10;
select * from student limit 10 offset 1;
```

### 排序

默认排序是 `ASC`，所以一般升序的时候不需指定，降序的关键字是 `DESC`。
使用 `B-Tree` 索引可以提高排序性能，但只限最左匹配。关于索引可以查看以下 [FAQ](#FAQ)。

```sql
-- 根据学号降序排列
select * from student order by number desc;

-- 添加索引 (score, name) 可以提高排序性能
-- 但是索引 (name, score) 对性能毫无帮助，此谓最左匹配，可以根据 B+Tree 进行理解
select * from student order by score desc, name;
```

### 数据过滤

数据筛选，或者数据过滤在 sql 中使用频率最高

```sql
-- 找到学号为1的学生
select * from student where number = 1;

-- 找到学号为在 [1, 10] 的学生(闭区间)
select * from student where number between 1 and 10;

-- 找到未设置电子邮箱的学生
-- 注意不能使用 =
select * from student where email is null;

-- 找到一班中大于23岁的学生
select * from student where class_id = 1 and age > 23;

-- 找到一班或者大于23岁的学生
select * from student where class_id = 1 or age > 22;

-- 找到一班与二班的学生
select * from student where class_id in (1, 2);

-- 找到不是一班二班的学生
select * from student where class_id not in (1, 2);
```

### 计算字段

+ CONCAT

  ```sql
  select concat(name, '(', age, ')') as nameWithAge from student;

  select concat('hello', 'world') as helloworld;
  ```

+ Math

  ```sql
  select age - 18 as relativeAge from student;

  select 3 * 4 as n;
  ```

更多函数可以查看 API 手册，同时也可以自定义函数(User Define Function)。

可以直接使用 `select` 调用函数

```sql
select now();
select concat('hello', 'world');
```

### 数据聚合 (aggregation)

聚合函数，一些对数据进行汇总的函数，常见有 `COUNT`，`MIN`，`MAX`，`AVG`，`SUM` 五种。

```sql
-- 统计1班人数
select count(*) from student where class_id = 1;
```

### 数据分组

使用 `group by` 进行数据分组，可以使用聚合函数对分组数据进行汇总，使用 `having` 对分组数据进行筛选。

```sql
-- 按照班级进行分组并统计各班人数
select class_id, count(*) from student group by class_id;

-- 列出大于三个学生的班级
select class_id, count(*) as cnt from student group by class_id having cnt > 3;
```

### 子查询

```sql
-- 列出软件工程班级中的学生
select * from student where class_id in (
  select id from class where name = '软件工程'
);
```

### 联接

虽然两个表拥有公共字段便可以创建联接，但是使用外键可以更好地保证数据完整性。比如当对一个学生插入一条不存在的班级的时候，便会插入失败。
一般来说，联接比子查询拥有更好的性能。

```sql
-- 列出软件工程班级中的学生
select * from student, class
where student.class_id = class.id and class.name = '软件工程';
```

+ 内联接

    内联接又叫等值联接。

    ```sql
    -- 列出软件工程班级中的学生
    select * from student
    inner join class on student.class_id = class.id
    where class.name = '软件工程';
    ```

+ 自联接

    自连接就是相同的表进行联接

    ```sql
    -- 列出与张三同一班级的学生
    select * from student s1
    inner join student s2 on s1.class_id = s2.class_id
    where s1.name = '张三';
    ```

+ 外联接

    外联接分为 `left join` 与 `right join`，`left join` 指左侧永不会为 null，`right join` 指右侧永不会为 null。

    ```sql
    -- 列出每个学生的班级，若没有班级则为null
    select name, class.name from student
    left join class on student.class_id = class.id;
    ```

### 插入数据

使用 `insert into` 向表中插入数据，也可以插入多行。

插入时可以不指定列名，不过严重依赖表中列的顺序关系，推荐指定列名插入数据，并且可以插入部分列。

```sql
-- 插入一条数据
insert into student values(8, '陆小凤', 24, 1, 3);

insert into student(name, age, sex, class_id) values(9, '花无缺', 25, 1, 3);
```

### 修改数据

**在修改重要数据时，务必先 select 确认是否需要操作数据，然后 `begin` 方便及时 `rollback`**


+ 更新

    ```sql
    -- 修改张三的班级
    update student set class_id = 2 where name = '张三';
    ```

+ 删除

    ```sql
    -- 删除张三的数据
    delete from student where name = '张三';
  
    -- 删除表中所有数据
    delete from student;
  
    -- 更快地删除表中所有数据
    truncate table student;
    ```

### 创建表与更新表

```sql
-- 创建学生表，注意添加必要的注释
create table student (
  id int(11) not null auto_increment comment '学生id',
  name varchar(50) not null comment '学生姓名',
  age tinyint unsigned default 20 comment '学生年龄',
  sex enum('male', 'famale') comment '性别',
  score tinyint comment '入学成绩',
  class_id int(11) comment '班级',
  createTime timestamp default current_timestamp comment '创建时间',
  primary key (id),
  foreign key (class_id) references class (id)
) comment '学生表';

-- 根据旧表创建新表
create table student_copy as select * from student;

-- 删除 age 列
alter table student drop column age;

-- 添加 age 列
alter table student add column age smallint;

-- 删除学生表
drop table student;
```

### 视图

视图是一种虚拟的表，便于更好地在多个表中检索数据，视图也可以作写操作，不过最好作为只读。在需要多个表联接的时候可以使用视图。

```sql
create view v_student_with_classname as
select student.name name, class.name class_name
from student left join class
where student.class_id = class.id;

select * from v_student_with_classname; 
```

### 约束及索引

+ primiry key

    任意两行绝对没有相同的主键，且任一行不会有两个主键且主键绝不为空。使用主键可以加快索引。
  
    ```sql
    alter table student add constraint primary key (id);
    ```

+ foreign key

    外键可以保证数据的完整性。有以下两种情况。
    + 插入张三丰5班到student表中会失败，因为5班在class表中不存在。
    + class表删除3班会失败，因为陆小凤和楚留香还在3班。

    ```sql
    alter table student add constraint foreign key (class_id) references class (id);
    ```

+ unique key

    唯一索引保证该列值是唯一的，但可以允许有null。
  
    ```sql
    alter table student add constraint unique key (name);
    ```
  
+ check

    检查约束可以使列满足特定的条件，如果学生表中所有的人的年龄都应该大于0。
  
    > 不过很可惜mysql不支持，可以使用**触发器**代替
  
    ```sql
    alter table student add constraint check (age > 0);
    ```
  
+ index

    索引可以更快地检索数据，但是降低了更新操作的性能。
  
    ```sql
    create index index_on_student_name on student (name);
  
    alter table student add constraint key(name);
    ```
  
### 触发器

> 开发过程中从来没有使用过，有可能是我经验少

可以在插入，更新，删除行的时候触发事件。

场景:
1. 数据约束，比如学生的年龄必须大于0
2. hook，提供数据库级别的 hook

```sql
-- 创建触发器
-- 比如mysql中没有check约束，可以使用创建触发器，当插入数据小于0时，置为0。
create trigger reset_age before insert on student for each row
begin
  if NEW.age < 0 then
    set NEW.age = 0;
  end if;
end;

-- 打印触发器列表
show triggers;
```

### 存储过程

> 开发过程中从来没有使用过，有可能是我经验少

存储过程可以视为一个函数，根据输入执行一系列的 sql 语句。存储过程也可以看做对一系列数据库操作的封装，一定程度上可以提高数据库的安全性。

```sql
-- 创建存储过程
create procedure create_student(name varchar(50))
begin
  insert into students(name) values (name);
end;

-- 调用存储过程
call create_student('shanyue');
```

## SQL 实践

更多练习可以查看 [leetcode](https://leetcode.com/problemset/database/)

### 1. 根据班级学生的分数进行排名，如果分数相等则为同一名次

```sql
select id, name, score, (
  select count(distinct score) from student s2 where s2.score >= s1.score
) as rank
from student s1 order by s1.score desc;
```

> 在where以及排序中经常用到的字段需要添加Btree索引，因此 score 上可以添加索引。

*Result:*

| id | name   | score | rank |
|----|--------|-------|------|
| 1  | 张三   | 100   | 1    |
| 3  | 王五   | 99    | 2    |
| 2  | 李四   | 98    | 3    |
| 5  | 林仙儿 | 78    | 4    |
| 4  | 燕七   | 34    | 5    |

> 参考 [leetcode: rank-scores](https://leetcode.com/problems/rank-scores/description/)

### 2. 写一个函数，获取第 N 高的分数

```sql
create function getNthHighestScore(N int) return int
begin
  declare M int default N-1;
  return (
    select distinct score from student order by score desc limit M, 1;
  )
end;

select getNthHighestScore(2);
```

*Result:*

| getNthHighestScore(2) |
| --------------------- |
| 99                    |

> 参考 [leetcode: nth highset salary](https://leetcode.com/problems/nth-highest-salary/description/)

### 3. 检索每个班级分数前两名学生，并显示排名

```sql
select class.id class_id, class.name class_name, s.name student_name, score, rank
from (
  select *, (
    select count(distinct score) from student s2 where s2.score >= s1.score and s2.class_id = s1.class_id
  ) as rank from student s1
) as s left join class on s.class_id = class.id where rank <= 2;

-- 如果不想在from中包含select子句，也可以像如下检索，不过不显示排名
select class.id class_id, class.name class_name, s1.name name, score
from student s1 left join class on s1.class_id = class.id
where (select count(*) from student s2 where s2.class_id = s1.class_id and s1.score <= s2.score) <= 2
order by s1.class_id, score desc;
```

*Result:*

| class_name | student_name | score | rank |
|------------|--------------|-------|------|
| 软件工程   | 张三         | 100   | 1    |
| 软件工程   | 王五         | 99    | 2    |
| 市场营销   | 燕七         | 34    | 2    |
| 市场营销   | 林仙儿       | 78    | 1    |

## FAQ

大多根据 [stackoverflow](https://stackoverflow.com/questions/tagged/sql?sort=frequent&pageSize=15) 中浏览最多的问题整理而成。

### `inner join` 与 `outer join` 的区别是什么

> 参考 StackOverflow: [what is the difference between inner join and outer join](https://stackoverflow.com/questions/38549/what-is-the-difference-between-inner-join-and-outer-join)

### 如何根据一个表的数据更新另一个表

比如以上 `student` 表保存着成绩，另有一表 `score_correct` 内存因失误而需修改的学生成绩。

在mysql中，可以使用如下语法

```sql
update student, score_correct set student.score = score_correct.score where student.id = score_correct.uid;
```

### 索引是如何工作的

简单来说，索引分为 `hash` 和　`B-Tree` 两种。
`hash` 查找的时间复杂度为O(1)。
`B-Tree` 其实是 `B+Tree`，一种自平衡多叉搜索数，自平衡代表每次插入和删除数据都会需要动态调整树高，以降低平衡因子。`B+Tree` 只有叶子节点会存储信息，并且会使用链表链接起来。因此适合范围查找以及排序，不过只能搜索最左前缀，如只能索引以`a`开头的姓名，却无法索引以`a`结尾的姓名。
另外，*Everything is trade off*。`B+Tree`的自平衡特性保证能够快速查找的同时也降低了更新的性能，需要权衡利弊。

> 参考 StackOverflow: [how dow database indexing work](https://stackoverflow.com/questions/1108/how-does-database-indexing-work)

### 如何联接多个行的字段

在mysql中，可以使用`group_concat`

```sql
select group_concat(name) from student;
```

> 参考 StackOverflow: [Concatenate many rows into a single text string](https://stackoverflow.com/questions/194852/concatenate-many-rows-into-a-single-text-string)

### 如何在一个sql语句中插入多行数据

values 使用逗号相隔，可以插入多行数据

```sql
insert into student(id, name) values (), (), ()
```

> 参考 StackOverflow: [Inserting multiple rows in a single SQL query](https://stackoverflow.com/questions/452859/inserting-multiple-rows-in-a-single-sql-query)

### 如何在`select`中使用条件表达式

示例，在student表中，查询所有人成绩，小于60则显示为0

```sql
select id, name, if(score < 60, 0, score) score from student;
```

### 如何找到重复项

姓名与班级唯一，找到姓名与班级的重复项，检索重复次数与id

```sql
select name, class_id, group_concat(id), count(*) times from student
group by name, class_id
having times > 1;
```

### 1:1 Relation 设计的必要性在哪里

> 参考 https://stackoverflow.com/questions/517417/is-there-ever-a-time-where-using-a-database-11-relationship-makes-sense

### 如何删除重复项并只保留首项

姓名与班级唯一，删除重复项，只保留首项

```sql
# mysql 就简单很多
delete s1 from student s1, student s2
where s1.name = s2.name and s1.sex = s2.sex and s1.id > s2.id;
```

> 参考 StackOverflow: [how can i remove duplicate rows](https://stackoverflow.com/questions/18932/how-can-i-remove-duplicate-rows)

### 什么是SQL注入

如有一条查询语句为

```js
"select * from (" + table + ");"
```

当table取值 `student); drop table student; --` 时，语句变为了，会删掉表，造成攻击。

```js
"select * from (student); drop table student; --);"
```

### mysql中单引号，双引号，反引号有什么区别

反引号(\`) 表示table，column 标识符。主要用在当表名或者列名为保留字的时候。在其它一些DBMS中，也用`[]`表示表名和列名。

单引号(') 表示字符串。

双引号(") 默认表示字符串，但是当sql_mode为`ANSI_QUOTES`时，双引号表示表名或者列名。

> 参考 StackOverflow: [when to use single quotes, double quotes and backticks in mysql](https://stackoverflow.com/questions/11321491/when-to-use-single-quotes-double-quotes-and-backticks-in-mysql)

