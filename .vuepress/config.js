const _ = require('lodash')
const path = require('path')
const op = require('./op.header')
const k8s = require('./k8s.header')
const posts = require('./post')

const postsByPath = _.keyBy(posts, 'path')
function getFrontMatter (path) {
  const p = path.split(/\.|\//)[2]
  return _.get(postsByPath, p)
}

module.exports = {
  configureWebpack: {
    resolve: {
      alias: {
        '@assets': path.resolve(__dirname, '../assets')
      }
    }
  },
  base: '/',
  title: '山月行',
  description: '全栈成长之路，分享前后端以及 DevOps 相关文章，使各端开发者能够突破瓶颈进一步成长。',
  head: [
    ['link', { rel: 'shortcut icon', href: '/favicon.ico', type: 'image/x-icon' }],
    ['meta', { name: 'baidu-site-verification', content: 'ZAdkE6LA10'}]
  ],
  themeConfig: {
    repo: 'shfshanyue/blog',
    nav: [
      { text: '主页', link: '/' },
      { text: '日问', link: 'https://github.com/shfshanyue/Daily-Question' },
      // { text: '使用graphql构建web应用', link: 'https://github.com/shfshanyue/graphql-guide' },
      { text: '存档', link: '/post/' },
      // { text: 'GraphQL', link: '/post/graphql-guide/' },
      // { text: '炳烛', link: '/record/' },
      { text: '个人服务器运维指南', link: '/op/' },
      // { text: 'kubernetes 实践', link: '/k8s/' },
      { text: '前端武器库', link: 'https://wuqiku.buzuosheng.com' },
      // { text: '关于我', link: '/about' },
      // {
      //   text: '笔记', items: [
      //     { text: 'flutter', link: '/post/flutter-guide/' },
      //     { text: 'Grid Layout', link: '/post/Grid-Guide/' },
      //     { text: 'spark', link: '/post/learning-spark/' },
      //     { text: 'scala', link: '/post/learning-scala/' },
      //   ]
      // },
    ],
    sidebar: {
      '/record/': [
        '',
        '2019',
        ['pre-2019', 'Pre 2019'],
        '2018',
        ['2017', 'Pre 2017'],
        ['2016', 'Pre 2016'],
        ['2015', 'Pre 2015']
      ],
      '/op/': op,
      '/k8s/': k8s,
    },
    lastUpdated: 'Last Updated'
  },
  plugins: [
    [ 'feed', {
        
    }],
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
                archive: true
              }
            },
            {
              path: '/',
              frontmatter: {
                home: true
              }
            }
          ]
        },
        extendPageData ($page) {
          if ($page.path.includes('/post')) {
            const fm = getFrontMatter($page.path)
            if (fm) {
              $page.frontmatter = {
                ...fm,
                ...$page.frontmatter
              }
            }
          }
          if ($page.frontmatter.keywords) {
            const meta = $page.frontmatter.meta
            $page.frontmatter.meta = meta ? [
              ...meta,
              {
                name: 'keywords',
                content: $page.frontmatter.keywords
              }
            ] : [
              {
                name: 'keywords',
                content: $page.frontmatter.keywords
              }
            ]
          }
          if (/^\/(code)\/.+?$/.test($page.path)) {
            $page.frontmatter.sidebar = 'auto'
          }
          if (/^\/op\/.+?$/.test($page.path)) {
            $page.frontmatter.metaTitle = `${$page.title} | 个人服务器运维指南 | 山月行`
          }
        }
      }
    }
  ]
}
