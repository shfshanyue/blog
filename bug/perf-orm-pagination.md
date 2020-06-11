date: 2020-04-10 14:00

---

# ORM 层分页查询过慢优化

这是山月修改的第七百六十五个bug

## 情景再现

今天产品在生产环境例行巡视并且与往常一样点点点时，发现某一页数据加载过慢，于是照例找到了我。

借助于山月我自己搭建的高效率的性能查询平台，很快就根据慢接口的 API 与 requestId 定位到了瓶颈相关 SQL，并分析如下。

相关 API 是关于请求数据库某资源的分页数据，但并不是 offset 过大问题，而问题出现在 ORM 生成的 SQL 上。

## 捉虫

### 该请求做了什么

``` js
Practice.findAndCountAll({
  where: {
    status: 'Visible',
    column_a_id: 1,
    column_b_id: 1
  },
  include: [{
    model: PracticeRefA
  }, {
    model: PracticeRefB
  }, {
    model: PracticeRefC
  }, {
    model: PracticeSchedule
  }],
  limit: 0,
  offset: 10
})
```

``` sql
SELECT count(DISTINCT("Practice"."id")) AS "count" FROM "practice" AS "Practice"
LEFT OUTER JOIN "practive_ref_a" AS "ref_a" ON "Practice"."id" = "ref_a"."practice_id"
LEFT OUTER JOIN "practive_ref_b" AS "ref_b" ON "Practice"."id" = "ref_b"."practice_id"
LEFT OUTER JOIN "practice_schedule" AS "schedules" ON "Practice"."id" = "schedules"."practice_id" AND "schedules"."user_id" = 10086
WHERE "Practice"."status" = 'Visible' AND "Practice"."column_a_id" = 1 AND "Practice"."column_b_id" = 1;
```

## 解决

``` js
const records = await Practice.findAll()
const count = await Practice.count()
```

``` sql
SELECT count(DISTINCT("Practice"."id")) AS "count" FROM "practice" AS "Practice"
WHERE "Practice"."status" = 'Visible' AND "Practice"."column_a_id" = 1 AND "Practice"."column_b_id" = 1;
```
