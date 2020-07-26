## 一个学生的考试操作涉及到的请求与查库频次

以下是理想情况下的答题逻辑，实际业务中更为复杂

+ 抽取试卷 (API 1次, SELECT 1次): `GET /api/papers/:id`，虽然查询涉及的表很多，但仍视作一次查询
  + 抽取该试卷
  + 抽取该试卷的大题 (Section、Group，如高考英语的听力部分为 Section，听力部分的每一道大题是 Group)
  + 抽取每道答题包含的小题及若干材料
+ 提交答案 (API n次, SELECT 2n次, UPDATE n次): `PUT /api/sheets/:id/submit` 及 body `{ questionId: 10010, answer: ['A'], timestamp }`
  + 查询该答题卡是否为本人所有及本次考试是否结束 SELECT
  + 查询该行答案记录 SELECT
  + 对比时间，插入新的答案 UPDATE
+ 计算时间 (API n次, SELECT n次, UPDATE n次): `PUT /api/sheets/:id/duration`
  + 查询该答题卡是否为本人所有及本次考试是否结束 SELECT
  + 更新答题卡的已考试时间 UPDATE
+ 完成考试 (API 1次, SELECT 1次, UPDATE 1次): `PUT /api/sheets/:id/complete`
  + 更新该答题卡为已完成状态
  + 扔到消息队列中通知批改

| 操作    | API 频次 | SELECT 频次 | UPDATE 频次 |
| ------ | ------ | ------       | ----- |
| 抽取试卷 | 1      | 1            | 0     |
| 提交答案 | n      | 2n           | n     |
| 计算时间 | n      | n            | n     |
| 完成考试 | 1      | 1            | 1     |

## 关于机构的考试操作涉及到的请求与查库频次

假设一个考试系统同时有 10000 人参加考试，计算此时的频率如下

| 操作    | API 频次 | SELECT 频次 | UPDATE 频次 |
| ------ | ------ | ------       | ----- |
| 抽取试卷 | 10000  | 10000        | 0     |
| 提交答案 | 10000n | 20000n       | 10000n|
| 计算时间 | 10000n | 10000n       | 10000n|
| 完成考试 | 10000  | 10000        | 10000 |

假设学生在写作时会每秒保存一次、并恰好此时进行了考试进度计算时间的保存，则此时关于请求的 `RPS` 为 20000，`QPS` 为 50000

显然，此时对于服务器及数据库的压力过大，需要进行优化

## 服务端读缓存优化

高并发的读操作是最容易进行优化的地方，特别是对于试卷这种一次写入后不再更改的数据。

### 抽取试卷

+ 抽取该试卷
+ 抽取该试卷的大题 (Section、Group，如高考英语的听力部分为 Section，听力部分的每一道大题是 Group)
+ 抽取每道答题包含的小题及若干材料

``` js
function getPaperFromCache(id) {
  return cacheBehind(id, models.Paper)
}

function cacheBehind(id, model) {
  const key = `${model.name}:${id}`
  const value = await redis.get(key)
  if (value) {
    return value
  }
  const data = await model.findById(id)
  await redis.set(key, value, 'EX', '7d')
  return data
}
```

### 提交答案

+ 查询该答题卡是否为本人所有及本次考试是否结束 `SELECT 10000n 次`
+ 查询该行答案记录 `SELECT 10000n 次`
+ 对比时间，插入新的答案 `UPDATE 10000n 次`

在提交答案时，先存储到 `redis` 中，此时可以避免考试时大量的并发写库操作

``` js
function submitAnser({ sheetId, questionId, answer, timestamp }) {
  const sheet = getSheetFromCache(sheetId)
  // ...省去一系列无关查库的关于是否能插入答案的逻辑操作
  const key = `Sheet:${sheetId}:Question:${questionId}:answer`
  const prevAnswer = await redis.get(key)
  // ...省去一系列关于比较时间戳能否插入答案的逻辑操作
  await redis.set(key, { answer, timestamp }, 'EX', '7d')
}
```

那如何落盘到数据库中呢，此时可以采用 `Write Behind Caching` 策略，

1. 针对已提交答题卡：当提交答题卡时、扔到消息队列，通知同步答案并做批改
1. 针对未提交答题卡：每次提交答案时，把该条答案 ID 存入 `reids set` 中，每日凌晨两点同步数据库并删除 `Set`

此时经过优化，一万人同时考试，其关于提交答案的查库频次为

+ 查询该答题卡是否为本人所有及本次考试是否结束 `SELECT 10000 次`
+ 查询该行答案记录 `SELECT 0 次`
+ 对比时间，插入新的答案 `UPDATE 0 次`

假设：

1. 一万人参加一百场不同科目考试，共有一百张试卷

| 操作    | API 频次 | SELECT 频次 | UPDATE 频次 |
| ------ | ------ | ------       | ----- |
| 抽取试卷 | 10000  | 100         | 0     |
| 提交答案 | 10000n | 1           | 1     |
| 计算时间 | 10000n | 1           | 1     |
| 完成考试 | 10000  | 1           | 1     |

## 前端缓存优化

### 提交答案

``` js
// 关于应用的全局状态管理 store
const answers = {
  100: {
    questionId: 100,
    answer: ['A'],
    lastModified: new Date('2020-07-31T03:04:04.273Z')
    isSync: true
  },
  101: {
    questionId: 101,
    answer: ['B'],
    lastModified: new Date('2020-07-31T03:04:04.273Z')
    isSync: false
  }
}

// 更新答案
function updateAnswer (id, answer) {
  const now = new Date()
  const prevAnswer = answers[id]
  // ...省去一系列关于比较时间戳能否插入答案的逻辑操作

  answers[id] = {
    questionId: id,
    answer,
    lastModified: now,
    isSync: false
  }
}

// 使用节流、一分钟同步一次 store
function syncAnswer () {
  const answersToCommit = Object.values(answers).filter(answer => !answer.isSync)
  for (const answer of answersToCommit) {
    await submitAnswer(answer)
  }
  // 更新 answers 的同步状态
}
```

## 优化前后对比

**优化前**

> n 根据经验在 `1000-3000`

| 操作    | API 频次 | SELECT 频次 | UPDATE 频次 |
| ------ | ------ | ------       | ----- |
| 抽取试卷 | 10000  | 10000        | 0     |
| 提交答案 | 10000n | 20000n       | 10000n|
| 计算时间 | 10000 * 120 | 10000n       | 10000n|
| 完成考试 | 10000  | 10000        | 10000 |

**优化后**

| 操作    | API 频次 | SELECT 频次 | UPDATE 频次 |
| ------ | ------ | ------       | ----- |
| 抽取试卷 | 10000  | 100          | 0     |
| 提交答案 | 10000 * 120 | 10000       | 0 |
| 计算时间 | 10000 * 120 | 0 | 0 |
| 完成考试 | 10000  | 10000        | 10000 |