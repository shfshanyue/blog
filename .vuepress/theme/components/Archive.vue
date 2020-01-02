<template>
  <div class="container">
    <main class="main-page">
      <div class="tip custom-block">
        <p class="custom-block-title">TIP</p>
        <p>
          本博客备份在我的仓库 <a href="https://github.com/shfshanyue/blog">shfshanyue/blog</a> 中，欢迎 Star
        </p>
      </div>
      <div v-for="tag in sortTags" :key="tag">
        <h3>{{tag}}</h3>
        <hr>
        <div v-for="post in postsByTag[tag]" class="archive-post" :key="post.path">
          <span v-text="dayjs(post.frontmatter.date).format('YYYY/MM/DD')" class="archive-post-date"></span>
          <router-link
            class="nav-link"
            :to="post.path"
          >{{ post.title }}</router-link>
        </div>
      </div>
    </main>
    <aside class="aside-page">
      <h3>友情链接</h3>
      <hr>
      <ul class="friend-link">
        <li>
          <a href="https://github.com/LuckyWinty/blog">winty 的博客</a>
        </li>
        <li>
          <a href="http://www.inode.club">程序员成长之北</a>
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
      </ul>
      <hr>
      <QR/> 
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
    tags () {
      const tempTags = this.$site.pages
        .filter(page => page.title && page.frontmatter.date && Array.isArray(page.frontmatter.tags))
        .reduce((tags, page) => {
          const pageTags = page.frontmatter.tags
          return [
            ...tags,
            ...pageTags
          ]  
        }, [])
      return [...new Set(tempTags)]
    },
    sortTags () {
      return this.tags.sort((x, y) => {
        return this.postsByTag[y].length - this.postsByTag[x].length
      })
    },
    postsByTag () {
      const pages = this.$site.pages
        .filter(page => page.title && page.frontmatter.date && Array.isArray(page.frontmatter.tags))
      const postsByTag = {}
      for (const page of pages) {
        for (const tag of page.frontmatter.tags) {
          const oldPages = postsByTag[tag] ? postsByTag[tag] : []
          postsByTag[tag] = [
            ...oldPages,
            page
          ]
        }
      }
      for (const tag of this.tags) {
        postsByTag[tag] = postsByTag[tag].sort((x, y) => dayjs(y.frontmatter.date) - dayjs(x.frontmatter.date))
      }
      return postsByTag
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

