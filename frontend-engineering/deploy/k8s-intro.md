# 使用 k8s 部署

在前边章节中，我们了解了**如何部署容器化的前端应用**，并可通过 CICD 进行自动化部署。

1. 如何进行版本回退
1. 如何进行流量控制

在 `kubernetes` 集群中很容易做到这些事情，**本篇文章中绝大部分为运维所做工作，但前端仍需了解**。

k8s 搭建需要多台服务器，且步骤繁杂，前端开发者很难有条件购买多台服务器。因此山月推荐以下两种途径学习 k8s:

1. 在本地搭建 [minikube](https://minikube.sigs.k8s.io/docs/)
1. 在官网 [Interactive Tutorials](https://kubernetes.io/docs/tutorials/kubernetes-basics/deploy-app/deploy-interactive/) 进行学习，它提供了真实的 minikube 环境
1. Katacoda 的 [Kubernetes Playground](https://www.katacoda.com/courses/kubernetes/playground)

## 术语: Deployment、Service、Pod、RepliaSet

### Pod

Pod 是 k8s 中最小的编排单位，通常由一个容器组成。

### Deployment

Deployment 可视为 k8s 中的部署单元，如一个前端/后端项目对应一个 Deployment。

Deployment 可以更好地实现弹性扩容，负载均衡、回滚等功能。它可以管理多个 Pod，并自动对其进行扩容。

以我们开始的示例项目 `create-react-app` 为例，我们在以前章节通过 `docker-compose` 对其进行了部署。

这次编写一个 `Deployment` 的资源配置文件，在 k8s 上对其部署。

> PS: [kubernetes v1.23 Deployment](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.23/#deployment-v1-apps)

在部署我们项目之前，先通过 `docker build` 构建一个名称为 `cra-deploy-app` 的镜像。

``` bash
$ docker build -t cra-deploy-app -f router.Dockerfile .
```

我们将配置文件存为 `k8s-app.yaml`，以下是配置文件个别字段释义:

> 配置文件路径位于 [k8s-app.yaml](https://github.com/shfshanyue/cra-deploy/blob/master/k8s-app.yaml)

+ `spec.template`: 指定要部署的 Pod
+ `spec.replicas`: 指定要部署的个数
+ `spec.selector`: 定位需要管理的 Pod

``` yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
spec:
  selector:
    matchLabels:
      app: cra
  replicas: 3
  template:
    metadata:
      labels:
        app: cra
    spec:
      containers:
      - name: cra-deploy
        image: cra-deploy-app
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 80
```

我们使用 `kubectl apply` 部署生效后查看 `Pod` 以及 `Deployment` 状态。

``` bash
$ kubectl apply -f k8s-app.yaml

$ kubectl get pods --selector "app=cra" -o wide
NAME                                READY   STATUS    RESTARTS   AGE    IP
cra-deployment-555dc66769-2kk7p     1/1     Running   0          40m    172.17.0.8
cra-deployment-555dc66769-fq9gd     1/1     Running   0          40m    172.17.0.9
cra-deployment-555dc66769-zhtp9     1/1     Running   0          40m    172.17.0.10

# READY 3/3 表明全部部署成功
$ kubectl get deploy cra-deployment
NAME             READY   UP-TO-DATE   AVAILABLE   AGE
cra-deployment   3/3     3            3           42m
```

### Service



``` bash
$ kubectl get service
```

### Replica Set

