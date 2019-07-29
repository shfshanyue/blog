module.exports = {
  base: '/',
  title: '山月行',
  description: '东坡云：事如春梦了无痕，技术积累也是如此，于是在此略作整理。浮生六记中有一句：见藐小微物，必细查其纹理，其中对技术不仅要如琢如磨如切如磋，也记录一些物外之趣。',
  themeConfig: {
    repo: 'shfshanyue/blog',
    nav: [
      { text: '主页', link: '/' },
      { text: '博客', link: '/post/' },
      // { text: '博客', link: '/post/' },
      {
        text: '笔记', items: [
          { text: 'SQL', link: '/post/sql-guide/' },
          { text: 'spark', link: '/post/learning-spark/' },
          { text: 'flutter', link: '/post/flutter-guide/' },
        ]
      },
      { text: '关于我', link: '/about' },
    ],
    lastUpdated: 'Last Updated',
    displayAllHeaders: true
  },
  plugins: [
    [ 
      '@vuepress/google-analytics',
      {
        'ga': 'UA-102193749-2'
      }
    ], 
    (options, ctx) => {
      return {
        name: 'archive',
        async additionalPages () {
          return [
            {
              path: '/post/',
              frontmatter: {
                layout: 'Archive' 
              }
            }
          ]
        },
        extendPageData ($page) {
          if (/^\/post\/.+?$/.test($page.path)) {
            $page.frontmatter.sidebar = 'auto'
          }
        }
      }
    }
  ]
}
