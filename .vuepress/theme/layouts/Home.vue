<template>
  <div
    class="theme-container no-sidebar"
  >
    <Navbar />
    <div class="container">
      <main class="main-page">
        <h3>最新文章</h3>
        <hr>
        <div v-for="post in recentPosts" class="archive-post">
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
        <div v-for="post in hotPosts" class="archive-post">
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
        <Bar/>
        <QR/> 
      </aside>
    </div>
  </div>
</template>

<script>
import Navbar from '@parent-theme/components/Navbar.vue'
import QR from '@theme/components/QR.vue'
import Bar from '@theme/components/Bar.vue'
import dayjs from 'dayjs'

export default {
  components: { Navbar, QR, Bar },
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
    },
    recentPosts () {
      return this.$site.pages
        .filter(page => page.title && page.frontmatter.date)
        .sort((x, y) => dayjs(y.frontmatter.date) - dayjs(x.frontmatter.date))
        .slice(0, 6)
    }
  }
}
</script>

<style>
.container {
  padding: 6rem 2rem 1rem;
  margin: 0 auto;
  width: 100%;
  display: flex;
}

@media (min-width: 576px) {
  .container {
    max-width: 540px;
  }
}

@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}

@media (min-width: 992px) {
  .container {
    max-width: 960px;
  }
}

@media (min-width: 1200px) {
  .container {
    max-width: 1140px;
  }
}

.main-page {
  flex: 1;
  padding-right: 3rem;
}

.aside-page {
  flex-basis: 360px;
}

.archive-post-date {
  font-family: 'Ubuntu Mono', monospace;
  font-weight: 500;
  margin-right: 2rem;
}

.archive-post {
  line-height: 1.6; 
}

</style>
