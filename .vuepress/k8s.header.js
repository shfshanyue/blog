module.exports = [
  ['', '目录'],
  {
    title: '集群搭建',
    collapsable: false,
    children: [
      ['prepare', '预备工作'],
      ['linux-command', '搭建过程中常用的 linux 命令'],
      ['install-docker', 'docker 安装与配置'],
      ['install-kubeadm', 'kubeadm 简介与安装'],
      ['install-master-node', '搭建第一个 kubernetes 集群'],
      ['install-worker-node', '为集群添加一个工作节点'],
    ]
  },
  {
    title: '部署你的第一个应用',
    collapsable: false,
    children: [
      ['pod', '部署你的第一个应用: Pod，Deployment 与 Service'],
      ['ingress', '在外网访问你的应用: Ingress'],
      ['https', '为你的应用自动生成证书'],
      ['ingress', '有状态应用: Stateful Application - TODO'],
      ['ingress', '状态管理: PV 与 PVC - TODO'],
      ['ingress', '使用 helm 部署 redis - TODO'],
      ['ingress', '使用 helm 部署 postgres - TODO']
    ]
  },
  {
    title: 'kubernetes 与微服务',
    collapsable: false,
    children: [
      ['', '服务质量: 资源分配，限额与抢占 - TODO'],
      ['', '服务发现与原理 - TODO'],
      ['', '负载均衡: 方案 - TODO'],
      ['', '负载均衡: iptables 与 IPVS - TODO'],
      ['', '链路追踪 - TODO'],
      ['', '熔断 - TODO'],
      ['', '限流 - TODO'],
    ]
  }
]
