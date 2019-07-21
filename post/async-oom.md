# 关于 async/await 的两个 OOM 的示例

两个在开发过程中因为使用 async/await 而导致的 OOM 示例，简单记录一下

## 01 Promise.map 与 并发控制

```javascript
const CONCURRENCY = 100

async function populatePoemsPage (page) {
  const poems = await models.poem.findAll({})
  await Promise.map(poems, async poem => {
    // 原因: 在于这里忘记了点 await
    Promise.map(poem.raw_paragraphs.match(/[\u4e00-\u9fa5]/g) || [], async char => {
      const key = normarlize(poem, char)
      await redis.incr(key)
      await redis.sadd(
        'CharCloudList',
        JSON.stringify({
          poemKind: poem.kind,
          authorId: poem.author.star > 10 ? poem.author.id : 0,
          dynasty: poem.author.dynasty,
          char,
          key
        })
      )
    })
  }, {
    concurrency: CONCURRENCY
  })
}
```

这个原因在于使用 `Promise.map` 控制并发数时，其中的 `async` 函数中的 `Promise` 立即 `resolve` 掉，导致实际并发数暴增。

## 02 递归调用

```javascript
const cache = new DataLoader(keys => redis.mget(keys))

async function scan (cursor) {
  const [nextCursor, list] = await redis.sscan('CharCloudList', cursor, 'MATCH', '*', 'COUNT', 10000)
  const chars = await Promise.map(list, async x => {
    const data = JSON.parse(x)
    return {
      ...data,
      author_id: /,0,/.test(data.key) ? 0 : data.authorId,
      poem_kind: map[data.poemKind],
      count: await cache.load(data.key)
    }
  })
  await models.char_cloud.bulkCreate(chars)
  if (Number(nextCursor)) {
    // 原因，这里多了一个 await
    await scan(nextCursor)
  } else {
    console.log('ok')
  }
}
```
