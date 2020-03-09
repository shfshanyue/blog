# 在 postgres 中应该为字符串类型选择什么样的数据类型



## 有哪些字符串相关数据类型

+ char
+ varchar
+ text

## 它们都有什么特点

## 只分配真正需要的空间？

## ENUM

## 性能

Different from other database systems, in PostgreSQL, there is no performance difference among three character types. In most situation, you should use text or varchar, and varchar(n) if you want PostgreSQL to check for the length limit.

## 参考

+ [](https://www.postgresqltutorial.com/postgresql-char-varchar-text/)