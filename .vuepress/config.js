const _ = require('lodash')
const path = require('path')
const op = require('./op.header')
const k8s = require('./k8s.header')
const postsHeader = require('./post.header')
const { fe: feHeader, node: nodeHeader, tour: tourHeader, china: chinaHeader, noVps: noVpsHeader } = require('./dir.header')

function getFrontMatter (path, metaFilePath) {
  const posts = require(metaFilePath)
  const postsByPath = _.keyBy(posts, 'path')
  const p = path.split(/\.|\//)[2]
  return _.get(postsByPath, p)
}

// 根据 meta.json 扩展 frontmatter
// 知识库：所有相关博客维护在一个文件夹，并由 meta.json 书写 frontmatter
function extendMetaByPath (page, path) {
  if (page.path.includes(`/${path}`)) {
    const fm = getFrontMatter(page.path, `../${path}/meta`)
    if (fm) {
      page.frontmatter = {
        ...fm,
        ...page.frontmatter
      }
    }
  }
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
    ['meta', { name: 'baidu-site-verification', content: 'ZAdkE6LA10'}],
    ['meta', { name: 'google-site-verification', content: '_rNB9Nt0ukzWmMfhXSSxCHUAeeMs24OiuhGm4QjdwXA'}] 
  ],
  themeConfig: {
    repo: 'shfshanyue/blog',
    nav: [
      { text: '主页', link: '/' },
      // { text: '使用graphql构建web应用', link: 'https://github.com/shfshanyue/graphql-guide' },
      // { text: '存档', link: '/post/' },
      { text: '随记博客', link: '/post/binary-in-frontend/' },
      // { text: 'GraphQL', link: '/post/graphql-guide/' },
      // { text: '关于我', link: '/about' },
      {
        text: '系列文章', items: [
          { text: 'flutter小记', link: '/flutter-guide/' },
          { text: '前端工程化', link: '/frontend-engineering/' },
          { text: 'Node实践', link: '/node/' },
          { text: '有可能你并不需要服务器', link: '/no-vps/' },
          { text: 'docker 个人服务器运维', link: '/op/' },
          { text: 'kubernetes 服务器集群运维', link: '/k8s/' },
        ]
      },
      {
        text: '无关技术', items: [
          { text: '山月的裸辞之行', link: '/tour/' },
          { text: '全国旅游攻略', link: '/note/china/'}
        ]
      },
      {
        text: '我的应用', items: [
          { text: '极客时间返利', link: 'https://geek.shanyue.tech' },
          { text: '面试每日一题', link: 'https://q.shanyue.tech' },
          { text: '诗词小站', link: 'https://shici.xiange.tech' },
          { text: '句子集', link: 'https://juzi.shanyue.tech' },
          { text: '前端武器库', link: 'https://wuqiku.buzuosheng.com' },
        ]
      },
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
      '/post/': postsHeader,
      '/frontend-engineering/': [{ title: '前端工程化', children: feHeader }],
      '/node/': nodeHeader,
      '/tour/': tourHeader,
      // '/note/': chinaHeader.map(([path, title]) => ['china/' + path, title])
      '/note/china/': chinaHeader,
      '/no-vps/': [{ title: '有可能你并不需要服务器', collapsable: false, children: noVpsHeader }],
    },
    lastUpdated: 'Last Updated'
  },
  plugins: [
    [ 'feed', {
        
    }],
    [
      'sitemap', {
        hostname: 'https://shanyue.tech'
      },
    ],
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
            // {
            //   path: '/post/',
            //   frontmatter: {
            //     archive: true
            //   }
            // },
            // {
            //   path: '/',
            //   frontmatter: {
            //     home: true
            //   }
            // }
          ]
        },
        extendPageData ($page) {
          extendMetaByPath($page, 'frontend-enginerring')
          extendMetaByPath($page, 'node')
          extendMetaByPath($page, 'post')
          extendMetaByPath($page, 'note/china')

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
