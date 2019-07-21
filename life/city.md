# 中国有多少座城市

年初，疫情爆发于湖北，诸多互联网公司及个人开发者为了使人们能够实时获取疫情信息，开发了诸多疫情地图类应用。应势，我也写了一个关于**省市分项统计**的地图应用，开源在 Github，并收获了 500+ Star，最高时流量也有50万PV: [2019-ncov](https://github.com/shfshanyue/2019-ncov)

![当初的开源项目](./assets/git-ncov.png)

在此过程中，由于对中国行政区划的了解不足，出现了许多问题，同时也获得了诸多有趣的新知：

1. 天门、仙桃、潜江是三个省直管县，即由湖北省直接管理，而却是县级行政单位。但仍然与地级行政区并列出现在地图中。这样的地方在全国总共有十几个
1. 恩施土家族苗族自治州等诸多自治州出现在视野中，另外，施恩这个名字的来历也很有意思，感兴趣的可以搜一搜
1. 山西、陕西因重音问题，陕西也会被拼成 `shaanxi`

我对诸如此类的地理知识本来也是浅尝辄止，不大做细致深入的追究。随着国内疫情的大幅好转，也很少去关注这些省市了。

然而最近又有一件事，我对此类省市县重新燃起了浓厚兴趣，那就是裸辞出游。**长期旅游是一件枯燥、无聊且过度消耗精力的事情，唯有从中找出一点兴趣，才能保持长久。**

一座城市的地理、历史及发展就是一件很有意思的事情，因此我每去一个地方，便会打开地图了解它的行政区划，维基百科了解它的地理与历史。以致于我现在已经能够背全了我走过省份的所有地级市并了解他们的相对位置：如陕西、甘肃、新疆与青海。

那中国有多少座地级市呢？

根据民政部官方统计：333

因此，我做了一个 package 来完成这件事情: [china-region](https://github.com/shfshanyue/china-region)

``` js
const cn = require('china-region')

const cities = cn.getPrefectures()

console.log(cities.length)
```

以下，我对这个包来一个简介，感兴趣可以给我提 Issue

## china-region

该包根据国家标准《中华人民共和国行政区划代码》即 GB2260 标准制定，用以查看各个省地县的行政区划代码，并支持多级联动查询

1. 丰富的 API，满足多种级联查询
1. 较小的 npm 包体积

## Install

``` bash
$ npm install china-region
```

## API

``` js
const cn = require('china-region')
```

### cn.getCodeByProvinceName(name)

根据升级行政区名称或简称获取行政区划代码

``` js
// '140000'
cn.getCodeByProvinceName('山西省')

// '140000'
cn.getCodeByProvinceName('山西')

// '140000'
cn.getCodeByProvinceName('晋')
```

### cn.info(code)

返回某个行政区号代表的行政区

``` js
// { name: '洪洞县', code: '141024', prefecture: '临汾市', province: '山西省' }
cn.get('141024')

// { name: '山西省', code: '140000', prefecture: null, province: null }
cn.get('140000')
```

### cn.getProvinces()

返回中国所有的省级行政区

``` js
cn.getProvinces()
```

### cn.getPrefectures(code)

返回中国/某省级行政区下所有的地级行政区

code 指行政区代码，code 为空时返回中国所有的地级行政区，不为空时返回该省级行政区的所有地级行政区

``` js
// 列出中国所有的地级行政区
cn.getPrefectures()

// 以下均列出 10 所代表省下辖的所有地级行政区
cn.getPrefectures('100000')
cn.getPrefectures('101000')
cn.getPrefectures('101010')
```

### cn.getCounties(code)

返回中国/某省级行政区/某地级行政区下所有的县级行政区

code 指行政区代码，code 为空时返回中国所有的县级行政区，不为空时返回该省/市级行政区的所有地级行政区

``` js
// 列出中国所有的县级行政区
cn.getCounties()

// 列出 10 所代表省下辖的所有县级行政区
cn.getCounties('100000')

// 列出 1010 所代表地下辖的所有县级行政区
cn.getCounties('101000')
```

### cn.getSpecialConties(code)

返回中国/某省级行政区下所有的省直管县。如海南省的各县和县级市、湖北省的仙桃市、潜江市、天门市、神农架林区、河南省的济源市、新疆的数个由自治区和新疆兵团双重领导的县级市等

code 指行政区代码，code 为空时返回中国所有的县级行政区，不为空时返回该省/市级行政区的所有地级行政区

``` js
// 列出中国所有的省直管县
cn.getSpecialCounties()

// 列出 10 所代表省下辖的所有省直管县
cn.getSpecialCounties('100000')
```

## 术语

> 关于行政区级别翻译参考知乎两篇关于地名翻译的文章
> 
> + [乡、镇、屯、自然村、组、生产队、自治区等名词有官方的英语翻译吗？](https://www.zhihu.com/question/30518257/answer/48380073)
> + [地名如何翻译](https://zhuanlan.zhihu.com/p/32434457)

+ `province`，省级行政区，包括直辖市、省、自治区、特别行政区。
+ `prefecture`，地级行政区，包括地级市、地区、自治州、盟。
+ `county`，县级行政区，包括市辖区、县级市、县、自治县、旗、自治旗、特区、林区。
+ `specialCounty`，省直管县级行政区，如湖北的仙桃、潜江与天门

## 数据获取

行政代码在国家标准《中华人民共和国行政区划代码》即 GB2260 的标准下制定，可以在民政部统计数据中查询。

+ [2020年中华人民共和国行政区划代码](http://www.mca.gov.cn/article/sj/xzqh/2020/)

## 相关仓库

+ [china-area-data](https://github.com/airyland/china-area-data)
+ [province-city-china](https://github.com/uiwjs/province-city-china)
+ [GB2260](https://github.com/cn/GB2260)

