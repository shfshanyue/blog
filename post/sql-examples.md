# SQL 必知必会

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

## 新建数据库

我们创建一个数据库，有关学校管理系统，故命名为 `school`。

``` sql
create database school;

use school;
```

## 准备数据

新建数据库完成后，我为新建的数据库准备了几张样例表，用于以后的学习。

示例中有两个表，分为 student 学生表与 class 班级表，具体班级以及学生的字段如下：

> 在接下来的 SQL 语法学习中，将使用这两张表作为样例表。

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

## 检索数据

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

## 排序

默认排序是 `ASC`，所以一般升序的时候不需指定，降序的关键字是 `DESC`。
使用 `B-Tree` 索引可以提高排序性能，但只限最左匹配。关于索引可以查看以下 [FAQ](#FAQ)。

```sql
-- 根据学号降序排列
select * from student order by number desc;

-- 添加索引 (score, name) 可以提高排序性能
-- 但是索引 (name, score) 对性能毫无帮助，此谓最左匹配，可以根据 B+Tree 进行理解
select * from student order by score desc, name;
```

## 数据过滤

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

## 计算字段

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

## 数据聚合 (aggregation)

聚合函数，一些对数据进行汇总的函数，常见有 `COUNT`，`MIN`，`MAX`，`AVG`，`SUM` 五种。

```sql
-- 统计1班人数
select count(*) from student where class_id = 1;
```

## 数据分组

使用 `group by` 进行数据分组，可以使用聚合函数对分组数据进行汇总，使用 `having` 对分组数据进行筛选。

```sql
-- 按照班级进行分组并统计各班人数
select class_id, count(*) from student group by class_id;

-- 列出大于三个学生的班级
select class_id, count(*) as cnt from student group by class_id having cnt > 3;
```

## 子查询

```sql
-- 列出软件工程班级中的学生
select * from student where class_id in (
  select id from class where name = '软件工程'
);
```

## 联接

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

## 插入数据

使用 `insert into` 向表中插入数据，也可以插入多行。

插入时可以不指定列名，不过严重依赖表中列的顺序关系，推荐指定列名插入数据，并且可以插入部分列。

```sql
-- 插入一条数据
insert into student values(8, '陆小凤', 24, 1, 3);

insert into student(name, age, sex, class_id) values(9, '花无缺', 25, 1, 3);
```

## 修改数据

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

## 创建表与更新表

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

## 视图

视图是一种虚拟的表，便于更好地在多个表中检索数据，视图也可以作写操作，不过最好作为只读。在需要多个表联接的时候可以使用视图。

```sql
create view v_student_with_classname as
select student.name name, class.name class_name
from student left join class
where student.class_id = class.id;

select * from v_student_with_classname; 
```

## 约束及索引

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

## 触发器

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

## 存储过程

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
