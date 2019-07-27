<template>
  <div
    class="theme-container no-sidebar"
  >
    <Navbar />
    <main class="page">
      <div class="theme-default-content">
        <div v-for="post in posts" class="archive-post">
          <span v-text="dayjs(post.frontmatter.date).format('YYYY/MM/DD')" class="archive-post-date"></span>
          <a :href="post.path">
            <span v-text="post.title"></span>
          </a>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import Navbar from '@parent-theme/components/Navbar.vue'
import dayjs from 'dayjs'

export default {
  components: { Navbar },
  data () {
    return {
      dayjs
    }
  },
  computed: {
    posts () {
      return this.$site.pages
        .filter(page => page.title && page.path.startsWith('/post'))
        .sort((x, y) => dayjs(y.frontmatter.date) - dayjs(x.frontmatter.date))
    }
  }
}
</script>

<style>
.archive-post-date {
  font-family: 'Ubuntu Mono', monospace;
  font-weight: 500;
  margin-right: 60px;
}

.archive-post {
  line-height: 1.6; 
}
</style>
