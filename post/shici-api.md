---
title: 关于诗词的 graphql API 记录
date: 2019-07-04
categories:
  - 后端
tags:
  - graphql
---

+ [诗词 graphql 文档](https://graphql.xiange.tech/playground)
+ [前端展现](https://shici.xiange.tech)

打开 [graphql playground](https://graphql.xiange.tech/playground)，可以进行测试

<!--more-->

## 诗词

```gql
query POEMS {
  poems {
    id
    uuid
    # 标题
    title

    # 诗词曲赋文
    kind

    # 简介
    intro

    # 诗词内容
    paragraphs

    # 赏析
    appreciation

    translation
    annotations

    # 名句
    phrases {
      id
    }

    # 标签
    tags {
      id
    }

    # 作者
    author {
      id
    }
  }
}
```

## 作者

```gql
query AUTHORS {
  authors {
    id
    uuid
    name
    intro
    birthYear
    deathYear

    # 朝代
    dynasty
    baikeUrl

    # 该作者的诗词
    poems {
      id
    }
  }
}
```

## 名句

```gql
# 名句
query PHRASES {
  phrases {
    id
    # 所在的诗词
    poem {
      id
    }
  }
}
```

## 标签

```gql
query TAGS {
  tags {
    id
    name
  }
}
```
