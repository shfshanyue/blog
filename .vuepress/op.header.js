module.exports = [
  {
    title: '序',
    collapsable: false,
    children: [
      ['', '系列文章介绍'],
      ['when-server', '序·当我有一台服务器时我做了什么'],
      ['when-server-2019', '序·当我有一台服务器时我做了什么(2019)'],
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
      ['traefik-https', '使用 traefik 自动为应用生成证书'],
      ['dnsmasq', '使用 dnsmasq 搭建本地 DNS 服务'],
      ['openvpn', '使用 openvpn 访问内部集群私有服务'],
      ['deploy-postgres', '使用 postgres 做数据存储服务'],
      ['deploy-redis', '使用 redis 做缓存服务'],
      ['deploy-sentry', '使用 sentry 做异常监控'],
      // ['blog-to-wechat', '案例: 黑客增长 - 从博客向公众号引流'],
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
      ['linux-monitor', '服务器各项监控指标小记'],
      ['htop', '使用 htop 监控进程指标'],
      ['ctop', '使用 ctop 监控容器指标']
    ]
  },
  {
    title: '高频linux命令',
    collapsable: false,
    children: [
      ['linux-sed', 'sed命令及示例'],
      ['linux-awk', 'awk命令及示例'],
      ['linux-tcpdump', 'tcpdump命令及示例'],
      ['jq', 'jq命令及示例'],
      ['iptables', 'iptables命令及示例'],
      ['htop', 'htop命令及示例'],
      ['jq-sed-case', '案例: 一行命令制作掘进面试榜单'],
    ]
  }
]
