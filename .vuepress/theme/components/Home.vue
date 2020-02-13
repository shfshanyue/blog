<template>
  <div class="container">
    <main class="main-page">
      <h3>系列文章</h3>
      <hr>
      <ul>
        <li><a href="https://github.com/shfshanyue/graphql-guide">使用 GraphQL 构建 web 应用</a></li>
        <li><a href="https://github.com/shfshanyue/op-note">个人服务器运维指南</a></li>
        <li><a href="https://github.com/shfshanyue/learn-k8s">k8s与微服务实践</a></li>
        <li><a href="https://github.com/shfshanyue/Daily-Question">全栈之路，日拱一卒</a></li>
      </ul>
      <h3>最新文章</h3>
      <hr>
      <div v-for="post in recentPosts" class="archive-post" :key="post.path + ':recent'">
        <span v-text="dayjs(post.frontmatter.date).format('YYYY/MM/DD')" class="archive-post-date"></span>
        <router-link
          class="nav-link"
          :to="post.path"
        >{{ post.title }}</router-link>
      </div>
      <div class="archive-post">
        <router-link
          class="nav-link"
          to="/post"
        >更多文章...</router-link>
      </div>
      <h3>热门文章</h3>
      <hr>
      <div v-for="post in hotPosts" class="archive-post" :key="post.path + ':hot'">
        <span v-text="dayjs(post.frontmatter.date).format('YYYY/MM/DD')" class="archive-post-date"></span>
        <router-link
          class="nav-link"
          :to="post.path"
        >{{ post.title }}</router-link>
      </div>
      <div class="archive-post">
        <router-link
          class="nav-link"
          to="/post"
        >更多文章...</router-link>
      </div>
    </main>
    <aside class="aside-page">
      <!-- <Bar/> -->
      <h3>友情链接</h3>
      <hr>
      <ul class="friend-link">
        <li>
          <a href="https://github.com/LuckyWinty/blog">winty 的博客</a>
        </li>
        <li>
          <a href="http://www.inode.club">程序员成长指北</a>
        </li>
        <li>
          <a href="https://biaochenxuying.cn/">夜尽天明的个人博客网站</a>
        </li>
        <li>
          <a href="https://liuxiangyang.space">刘向洋，记录工作记录生活</a>
        </li>
        <li>
          <a href="https://ouyang.wang">Ouyang's Blog</a>
        </li>
        <li>
          <a href="http://www.javadaily.cn">Java 日知录</a>
        </li>
        <li>
          <a href="https://blog.yinuxy.com/">YINUXY | 理想的生活就是生活的理想</a>
        </li>
      </ul>
      <hr>
      <h3>找到我</h3>
      <ul>
        <li>微信(shanyue94)</li>
        <li><a href="https://www.zhihu.com/people/shfshanyue/activities">知乎</a></li>
        <li><a href="https://juejin.im/user/56a34361816dfa005925a654">掘金</a></li>
        <li><a href="https://www.jianshu.com/u/f014acb0b697">简书</a></li>
      </ul>
    </aside>
  </div>
</template>

<script>
import QR from '@theme/components/QR.vue'
import Bar from '@theme/components/Bar.vue'
import dayjs from 'dayjs'

export default {
  components: { QR, Bar },
  data () {
    return {
      dayjs
    }
  },
  computed: {
    hotPosts () {
      return this.$site.pages
        .filter(page => page.title && page.frontmatter.date && page.frontmatter.hot)
        .sort((x, y) => dayjs(y.frontmatter.hot) - dayjs(x.frontmatter.hot))
        .slice(0, 10)
    },
    recentPosts () {
      return this.$site.pages
        .filter(page => page.title && page.frontmatter.date)
        .sort((x, y) => dayjs(y.frontmatter.date) - dayjs(x.frontmatter.date))
        .slice(0, 10)
    }
  }
}
</script>

