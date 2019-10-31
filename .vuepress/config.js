module.exports = {
  base: '/',
  title: '山月行',
  description: '东坡云：事如春梦了无痕，技术积累也是如此，于是在此略作整理。浮生六记中有一句：见藐小微物，必细查其纹理，其中对技术不仅要如琢如磨如切如磋，也记录一些物外之趣。',
  head: [
    ['link', { rel: 'shortcut icon', href: '/favicon.ico', type: 'image/x-icon' }]
  ],
  themeConfig: {
    repo: 'shfshanyue/blog',
    nav: [
      { text: '主页', link: '/' },
      { text: '博客', link: '/post/' },
      // { text: 'GraphQL', link: '/post/graphql-guide/' },
      { text: '炳烛', link: '/record/' },
      { text: '个人服务器运维指南', link: '/op/' },
      { text: 'SQL必知必会', link: '/post/sql-guide/' },
      { text: '关于我', link: '/about' },
      {
        text: '笔记', items: [
          { text: 'flutter', link: '/post/flutter-guide/' },
          { text: 'Grid Layout', link: '/post/Grid-Guide/' },
          { text: 'spark', link: '/post/learning-spark/' },
          { text: 'scala', link: '/post/learning-scala/' },
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
      '/op/': [
        {
          title: '序',
          collapsable: false,
          children: [
            ['', '系列文章介绍'],
            ['when-server', '序·当我有一台服务器时我做了什么'],
          ]
        },
        {
          title: '如果没有服务器',
          collapsable: false,
          children: [
            ['if-you-want-a-blog', '如果你只想搭建博客']
          ]
        },
        {
          title: '初始配置',
          collapsable: false,
          children: [
            ['init', '服务器登录配置'],
            ['ssh-setting', 'ssh key 以及 git 配置'],
            ['system-info', 'linux 基础信息查看及命令'],
            ['vim-setting', 'vim 及其熟练使用'],
            ['tmux-setting', '窗口复用与 tmux'],
            ['vpn-config', 'openvpn 配置及内网安全'],
          ]
        },
        {
          title: '自动化运维',
          collapsable: false,
          children: [
            ['ansible-guide', '使用 ansible 做自动化运维'],
            ['ansible-problem', '使用 ansible 的一些问题'],
          ]
        },
        {
          title: 'docker 与应用开发',
          collapsable: false,
          children: [
            ['deploy-fe-with-docker', '前端部署'],
            ['deploy-sentry', '部署异常监控服务 sentry']
          ]
        },
        {
          title: 'kubernetes 与应用开发',
          collapsable: false,
          children: []
        },
        {
          title: '监控',
          collapsable: false,
          children: [
            ['linux-monitor', '各项监控指标小记']
          ]
        },
        {
          title: '高频linux命令',
          collapsable: false,
          children: [
            ['linux-sed', 'sed命令及示例'],
            ['linux-awk', 'awk命令及示例'],
            ['jq', 'jq命令及示例'],
            ['iptables', 'iptables命令及示例'],
            ['htop', 'htop'],
          ]
        }
      ]
    },
    lastUpdated: 'Last Updated',
    // displayAllHeaders: true
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
            },
            {
              path: '/',
              frontmatter: {
                layout: 'Home' 
              }
            }
          ]
        },
        extendPageData ($page) {
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
          if (/^\/(post|code)\/.+?$/.test($page.path)) {
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
