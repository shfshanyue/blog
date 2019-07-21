---
title: k8s 中 docker 的安装与配置
date: 2019-09-02 22:00

---

在 k8s 支持的容器方案中除了 docker，还有其它容器方案

+ CRI-O
+ Containerd

**官方推荐的 docker 版本为: docker 18.06.2。在 k8s 的 master 与 node 节点都需要安装 docker。**

## 安装 docker

> 在 centos 上安装 docker 的官方文档: <https://docs.docker.com/install/linux/docker-ce/centos/>

``` shell
$ yum install -y yum-utils device-mapper-persistent-data lvm2

# 安装 docker 官方的镜像源
$ yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo

# 如果在国内，安装阿里云的镜像
$ yum-config-manager --add-repo http://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo

# 安装 docker
$ yum install -y docker-ce

# 安装指定版本号的 docker，以下是 k8s 官方推荐的 docker 版本号 (此时，k8s 的版本号在 v1.16)
$ yum install -y docker-ce-18.06.2.ce

$ systemctl enable docker
Created symlink from /etc/systemd/system/multi-user.target.wants/docker.service to /usr/lib/systemd/system/docker.service.

$ systemctl start docker
```

当 `docker` 安装成功后，可以使用以下命令查看版本号

``` shell
$ docker --version
Docker version 18.06.2-ce, build 6d37f41

# 查看更详细的版本号信息
$ docker version

# 查看docker的详细配置信息
$ docker info
```

### docker daemon

`dockerd` 是 `docker` 的后台进程，而 `dockerd` 可以通过配置文件进行配置，在 linux 下在 `/etc/docker/daemon.json`，详细可以参考官方文档 [](https://docs.docker.com/engine/reference/commandline/dockerd/)。

``` shell
$ mkdir /etc/docker

# 设置 docker daemon
$ cat > /etc/docker/daemon.json <<EOF
{
  "exec-opts": ["native.cgroupdriver=systemd"],
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "100m"
  },
  "storage-driver": "overlay2",
  "storage-opts": [
    "overlay2.override_kernel_check=true"
  ]
}
EOF

# 重启 docker
$ systemctl daemon-reload
$ systemctl restart docker
```
