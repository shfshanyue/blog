# kubenetes 基本命令使用

随着容器技术的发展，k8s 也越来越火热。在网络上有许多关于 k8s 的文章，但大部分都是关于集群部署相关的，

而这篇文章主要讲作为应用开发者如何使用 k8s 。

+ [github](https://github.com/shfshanyue/blog/tree/master/Articles/Kubenetes-Commands)

## 准备

### 预备知识

+ Docker，学习 k8s 之前了解 Docker 是毋庸置疑的。

### 工具

``` shell
brew install kubectl
```

`kubectl` 是 k8s 的命令行工具，用于管理 k8s 集群。以上是 Mac 下的安装方法，其它操作系统参考[官方文档](https://kubernetes.io/docs/tasks/tools/install-kubectl/)。当然，你也可以使用 [Dashboard](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/) 管理容器。

### Cluster

k8s 集群，一般生产环境有一个 Cluster 集群，测试环境有一个 Cluster 集群。

### Namespace

在一个 Cluster 会有不同的 Namespace，可以区分不同的业务团队。

### Pod

Pod 是 k8s 中最小的可部署单元。一般一个 Pod 运行一个 Container，但是有时也会运行多个 Container。类似 docker-compose。

### Deployment

Deployment 用来控制 Pod，比如控制一个应用起几个 Pod。


## 配置文件

关于 k8s 的配置文件位置在 `~/.kube/config`。另外也可以使用命令 `kubectl config` 查看以及更改配置，使用命令更改配置的同时，配置文件也会改变。

配置文件可以指定 `Cluster`，`Namespace`，`User` 的配置，并设置 `Context`。以下是一个简版的配置文件。

``` yaml
# 该配置文件配置了一个用户 shanyue，一个集群 dev，并且设置了 dev 的 context
apiVersion: v1
clusters:
- cluster:
    certificate-authority: /Users/shanyue/.minikube/ca.crt
    server: https://192.168.99.100:8443
  name: dev
contexts:
- context:
    cluster: dev
    namespace: Business
    user: shanyue
  name: dev
current-context: dev
kind: Config
preferences: {}
users:
- name: shanyue
  user:
    client-certificate: /Users/shanyue/.minikube/client.crt
    client-key: /Users/shanyue/.minikube/client.key
```

其中 `current-context` 代表当前上下文，也可以通过以下命令来设置上下文。

``` shell
# 查看配置
kubectl config view

# 查看集群列表
kubectl config get-clusters

# 查看 Context 列表
kubectl config get-contexts

# 设置当前 Context
kubectl config use-context dev
```

### 创建资源

`kubectl create` 代表根据文件创建资源，可以是 Namespace, Deployment，也可以是 Pod。

`kubectl run` 代表根据镜像创建资源。

``` shell
kubectl create -f app.yaml

kubectl run --image=k8s.gcr.io/echoserver:1.10 --port=8080
```

一般在 CI 中作 deploy 时会使用 `kubectl apply` 命令，根据配置文件更新资源。

配置文件中可以写多份配置，也可以写 `Deployment`，`Service` 各种 Kind 配置。

以下示例新增了一个叫 dev 的命名空间，其中一个  `Pod`，运行着 node 服务，并通过 `Service` 暴露地址出去。代码地址在 [app.yaml](https://github.com/shfshanyue/blog/tree/master/Articles/Kubenetes-Commands/app.yaml)，可直接运行以下命令。

``` shell
# 根据以下配置文件创建资源
kubectl create -f app.yaml
```

``` yaml
apiVersion: v1
kind: Namespace
metadata:
  name: dev
  labels:
    name: dev

---

apiVersion: v1
kind: Service
metadata:
  name: app
  namespace: dev
  labels:
    name: app
spec:
  ports:
  - port: 8080
    targetPort: 8080
    protocol: TCP
  selector:
    name: app

---

apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  name: app
  namespace: dev
  labels:
    name: app
spec:
  template:
    metadata:
      labels:
        name: app
    spec:
      containers:
      - name: app
        image: node
        imagePullPolicy: Always
        ports:
        - containerPort: 8080
        command: ["node"]
        args: ["-e", "require('http').createServer((req, res) => res.end('hello, world')).listen(8080)"]
```

### 访问资源

以下 $app 代表特定 Pod 的 Name

``` shell
# 获取当前 Context 下所有的 Deployment
kubectl get deployments

# 获取当前 Context 下所有的 Pod
kubectl get pods

# 获取当前 Cluster 下所有的 Pod
kubectl get pods --all-namespaces

# 获取特定 Pod 的状态
kubectl describe pod $app

# 进入某个 Pod 容器里边的命令行
kubectl exec -it $app bash

# 查看某个 Pod 的日志
kubectl logs $app
```
