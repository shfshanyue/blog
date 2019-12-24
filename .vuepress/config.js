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
      { text: '日问', link: 'https://github.com/shfshanyue/Daily-Question' },
      // { text: '使用graphql构建web应用', link: 'https://github.com/shfshanyue/graphql-guide' },
      { text: '存档', link: '/post/' },
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
            ['if-you-want-a-blog', '如果你只想搭建博客'],
            ['deploy-fe-with-netlify', 'netlify 个人网站托管与自动部署'],
            ['deploy-fe-with-alioss', '阿里云OSS 个人网站托管'],
            ['github-action-guide', 'github actions 与持续集成'],
          ]
        },
        {
          title: '初始配置',
          collapsable: false,
          children: [
            ['init', '服务器登录配置'],
            ['git', 'git 配置及安装'],
            ['ssh-setting', 'ssh key 以及 github 配置'],
            ['system-info', 'linux 基础信息查看及命令'],
            ['vim-setting', 'vim 基本操作及配置'],
            ['tmux-setting', 'tmux 与窗口管理']
          ]
        },
        {
          title: '自动化运维',
          collapsable: false,
          children: [
            ['ansible-guide', 'ansible 简易入门'],
            ['ansible-problem', 'ansible 必知必会'],
          ]
        },
        {
          title: '了解 docker',
          collapsable: false,
          children: [
            ['docker', 'docker 简易入门'],
            ['dockerfile-practice', 'Dockerfile 最佳实践'],
            ['deploy-fe-with-docker', '案例: 使用 docker 部署前端应用']
          ]
        },
        {
          title: '使用 docker compose 编排容器',
          collapsable: false,
          children: [
            ['docker-compose-arch', 'docker compose 编排架构简介'],
            ['docker-compose', 'docker-compose 简易入门'],
            ['traefik', '使用 traefik 做反向代理'],
            ['dnsmasq', '使用 dnsmasq 搭建本地 DNS 服务'],
            ['openvpn', '使用 openvpn 访问内部集群私有服务'],
            ['deploy-sentry', '使用 sentry 做异常监控'],
          ]
        },
        {
          title: '使用 kubernetes 编排容器',
          collapsable: false,
          children: [
            ['deploy-drone', '持续集成方案 drone.ci'],
            ['deploy-fe', '案例: 前端部署发展史'],
          ]
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
            ['jq-sed-case', '案例: jq 与 sed'],
          ]
        }
      ]
    },
    lastUpdated: 'Last Updated',
    // displayAllHeaders: true
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
