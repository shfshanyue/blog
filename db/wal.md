## 什么是 WAL (Write Ahead Logging)

**简而言之，postgres 会对每次写操作记一次日志，日志的集合。** 

WAL 用于保证数据的完整性 (Integrity)，根据它的完整性特点，它可以用作以下方面

+ 备份恢复
+ 主机

## 开启 WAL

wal_level=archive
archive_mode=on

## 查看 WAL

WAL 日志位于 postgres 数据文件的

```shell
$ cd /var/lib/postgresql/data
$ cat pg_wal
total 225M
drwx------  3 polkitd ssh_keys 4.0K Apr  6 19:27 .
drwx------ 19 polkitd ssh_keys 4.0K Jan 22 14:22 ..
-rw-------  1 polkitd ssh_keys  16M Apr  9 16:56 0000000100000001000000DC
-rw-------  1 polkitd ssh_keys  16M Dec 19 15:57 0000000100000001000000DD
-rw-------  1 polkitd ssh_keys  16M Dec 19 15:57 0000000100000001000000DE
-rw-------  1 polkitd ssh_keys  16M Dec 19 15:57 0000000100000001000000DF
-rw-------  1 polkitd ssh_keys  16M Dec 19 15:57 0000000100000001000000E0
-rw-------  1 polkitd ssh_keys  16M Dec 19 15:57 0000000100000001000000E1
-rw-------  1 polkitd ssh_keys  16M Dec 19 15:57 0000000100000001000000E2
-rw-------  1 polkitd ssh_keys  16M Dec 19 15:57 0000000100000001000000E3
-rw-------  1 polkitd ssh_keys  16M Dec 19 15:57 0000000100000001000000E4
-rw-------  1 polkitd ssh_keys  16M Dec 19 15:59 0000000100000001000000E5
-rw-------  1 polkitd ssh_keys  16M Dec 19 15:57 0000000100000001000000E6
-rw-------  1 polkitd ssh_keys  16M Dec 19 15:57 0000000100000001000000E7
-rw-------  1 polkitd ssh_keys  16M Dec 19 15:57 0000000100000001000000E8
-rw-------  1 polkitd ssh_keys  16M Dec 19 15:57 0000000100000001000000E9
drwx------  2 polkitd ssh_keys 4.0K Sep 25  2018 archive_status
```

## 参考

+ [24.3. Continuous Archiving and Point-in-Time Recovery (PITR)](https://www.postgresql.org/docs/9.1/continuous-archiving.html)
