# 关于统计诗词字云中的解决方案

周末写了两个脚本，用以统计诗词中的高频字，并抽取其中意象作为飞花令的令字。这两个脚本的地址以及所做如下

1. [bin/charCloud.js](https://github.com/shfshanyue/shici-server/blob/master/bin/charCloud.js): 把50万诗词按字、作者朝代、高频作者做关键字，使用 `redis.incr` 计数，存入 `redis` 中
1. [bin/charCloudStat.js](https://github.com/shfshanyue/shici-server/blob/master/bin/charCloudStat.js): 根据以上脚本的计数结果，再把 `redis` 中的数据迁移到 `postgres` 中

## why redis

那为什么不直接存到 `postgres` 中，非要在 `redis` 中走一遭呢？

1. 原子性: `incr` 保证原子性 (postgres 需要设置事务和隔离级 RR/ 或者 select for update / 或者加一个分布式锁)
1. 性能: 快速定位 key (postgres 虽然也可以设置索引，但会在插入数据过程中大大降低速度)

以下是两种方案的伪代码对比:

+ `key` 根据字、朝代、作者生成
+ `count` 代表该 `key` 出现的次数

```javascript
// 使用 redis
redis.incr(key, 1)

// 使用 postgres
// 不仅需要额外保证原子性，而且代码也更复杂一些
const id = lock(key)
const cloud = models.cloud.findOne({ key })
if (cloud) {
  cloud.increment('count', 1)
} else {
  models.cloud.create({ key, count: 1 })
}
unlock(id)
```

## postgres 的原子性与隔离级

**虽然在我脚本中并没有使用 `postgres`，但我也把它拿出来分析一下**

当每来一个关键字时，所要执行的 `SQL` 如下

```sql
begin;

select key, count from cloud where key = $key;

-- 如果存在
-- Question 2: 此时的 count 如果在 R/W 之间刚好改变呢
update cloud set count = $count + 1 where key = $key;

-- 如果不存在
-- Question 1: 在判断为不存在的时候，此时确实不存在吗？如果恰好在 R/W 之间插入一条数据呢
insert into cloud (key, value) value ($key, 1);

commit;
```

使用 `select for update` 加一个悲观锁解决问题

```sql
begin;

-- 锁住该行，知道 commit/rollback
select key, count from cloud where key = $key for update;

update cloud set count = $count + 1 where key = $key;

insert into cloud (key, value) value ($key, 1);

commit;
```

## 数据完整性重要吗

不一定，特别是在这种求 TOP 的情况下，他只需要得出相对排序即可。也就是说，你即使不对 `postgres` 做一些原子性保证的处理，最后得到的数据也会差不了多少。

## TOP 500 

```sql
select array_to_string(array(select char from char_cloud GROUP BY char ORDER BY sum(count) desc limit 500), '')
```

写一个 SQL 查出来数据如下

> 不人一风山无有天云日来何花春中年生月如时自水上为相心此长我清江秋知君未雨归白得子千高三今空见青行里去明老下万是夜事寒谁玉在家可酒南客与声处东飞金已落流多门前新欲西烟成书道深更海古香出看诗开地重石作黄头光梦之能朝草尽世入几色游十同林城远从还当情气间回树名思意亦马红雪大愁平犹百难将然尘龙路似公过独阳旧身小到满衣歌莫华复好仙望应闻向分方后楼非起五笑问故安外岁文别真竹神醉须言初孤发阴留以坐边台幽霜松叶北吾岂影两半溪少所绿四语双传又晚先其正翠物湖随碧王野馀共九柳波枝惊吹露曾怀浮国河断轻乐鸟吟微暮芳堂舟残对眼离画手经苍关逢寻只久若尚数兮儿却居梅照怜听才木二兴曲窗临忽堪鱼汉星峰泉终官宫近疏且足者凉萧于闲喜绝乡鸣车太苦士依庭紫亭夕首鹤燕使往转连登丹常忆期动园遥灵节晴胜爱垂昔穷载至容倚学虚和晓送横泪寄度池识休雁沙州田桃病凤忘散隐夫群恨早尔悲六元斜荒觉遗女合静都珠解便灯易亲乱说信许待杯閒隔但功通火冷丝惟定令斗寂死论因会霞兰贤用立而细纷笔奇径景陵争颜面屋带翁吴罗锦力郎主结舞著观化佳点疑冰浪迹川阁岩虽楚赋迟薄交尺直帘目飘章欢食愿船忧桥鼓卧钟字魂念村消乃宁破本底图帝乘异悠那谷移饮翻步啼劳诸原端想皇素息蓬冠朱民尊

只保留一些关于表意向的词，保留前~~一百~~20个表意向的字。春花秋月齐了，春江花月夜也齐了

> 人风山天云日花春月水心江秋君雨夜玉酒客声

