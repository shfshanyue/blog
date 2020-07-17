date: 2020-07-16 16:30

---

# 在线教育中技术与业务疑难问题之考试系统中的时间控制

直接说需求吧

## 服务端实现

``` js
async function getTimeLeft (sheetId, sectionId) {
  // 如果求学生做整套试卷的剩余时间
  if (!sectionId) {
    const sheet = await Sheet.findById(sheetId)
    // 计算距离开始考试时间过了多久
    return now - sheet.startTime
  }

  const key = `Sheet:${sheetId}:Section:${sectionId}:TimeLeft`
  return redis.get(key)
}

async function setTimeLeft (sheetId, sectionId, seconds) {
  const key = `Sheet:${sheetId}:Section:${sectionId}:TimeLeft`
  if (!seconds) {
    const paper = await Paper.findBySheetId(sheetId)
    const section = await Section.findById(sectionId)
    seconds = section.totalTime
  }
  await redis.set(key, seconds, 'EX', '1d')
}
```