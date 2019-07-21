# 网站运营常见数据

自从到了一条 toC 的业务线，听得最多的三个词就是拉新，留存，转化了。为了不使自己太过跟不上队伍，来总结下一些关于运营网站的指标。

## PV/UV/DAU

> 在这里说一下打点的原理：一般打点脚本会随机产生一个唯一ID (或者 UUID) 存入 cookie/local-storage 中来唯一标识一个用户，如果使用两个浏览器打开就算是两个用户了。
> 但是这里又有一个问题：cookie/local-storage 可能被用户清除，造成计算误差。所以有一种根据设备以及浏览器信息生成指纹的算法，具体可以参照这个库 <https://github.com/Valve/fingerprintjs2>
> 另外，以上是网站环境中的 ID 生成方式，在 android/ios/小程序 中计算方式会有所变化。

UV: Unique Visitor。即单位时间内网站的访问人数
PV: Page View。即单位时间内网站的访问次数
DAU: Daily Active User。日活跃用户数，按我理解，就是单日 UV

## 会话数

> GA 的文档里有详细解释: <https://support.google.com/analytics/answer/2731565>

## 新增用户数

显而易见

+ 新增用户数
    + 日新增用户数
    + 日新增用户数同比/环比
    + 周新增用户数
    + 周新增用户数同比/环比
    + 月新增用户数
    + 月新增用户数同比/环比
+ 累计用户数

## 留存
