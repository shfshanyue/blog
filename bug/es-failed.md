date: 2020-06-23 19:10

---

# 在 k8s 中部署 ES 时权限不足导致 pod CrashLoopBackOff

在 k8s 中通过 helm 来部署 ES 时，master 相关 Pod 与 data 相关 Pod 的状态为 `CrashLoopBackOff`。

部署 `ES` 选择了 `bitnami` 的 `Chart`

``` bash
$ helm install es bitnami/elasticsearch --values values.yaml
```

部署了一个 master 节点一个 data 节点 **并通过 `HostPath` 作为挂载**

``` yaml
global:
  storageClass: local-storage
master:
  replicas: 1
data:
  replicas: 1
```

关于 `HostPath` 的 PV 配置文件如下，挂载到目录 `/mnt/k8s-data/es/master`

``` yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: local-es-pv-master
  labels:
    type: local
spec:
  storageClassName: local-storage
  capacity:
    storage: 8Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/k8s-data/es/master"
```

## 捉虫

通过 `kubectl describe` 查看节点并无异常

``` bash
$ kubectl describe pod es-elasticsearch-master-0
```

继续通过 `kubectl logs`，查看 POD 日志

``` bash
$ kubectl logs es-elasticsearch-master-0
 07:41:46.42
 07:41:46.42 Welcome to the Bitnami elasticsearch container
 07:41:46.42 Subscribe to project updates by watching https://github.com/bitnami/bitnami-docker-elasticsearch
 07:41:46.42 Submit issues and feature requests at https://github.com/bitnami/bitnami-docker-elasticsearch/issues
 07:41:46.43
 07:41:46.43 INFO  ==> ** Starting Elasticsearch setup **
 07:41:46.46 INFO  ==> Configuring/Initializing Elasticsearch...
 07:41:46.49 INFO  ==> Setting default configuration
 07:41:46.51 INFO  ==> Configuring Elasticsearch cluster settings...
OpenJDK 64-Bit Server VM warning: Option UseConcMarkSweepGC was deprecated in version 9.0 and will likely be removed in a future release.

 07:41:49.32 INFO  ==> ** Elasticsearch setup finished! **
 07:41:49.34 INFO  ==> ** Starting Elasticsearch **
OpenJDK 64-Bit Server VM warning: Option UseConcMarkSweepGC was deprecated in version 9.0 and will likely be removed in a future release.
[2020-06-23T03:24:09,855][ERROR][o.e.b.ElasticsearchUncaughtExceptionHandler] [es-elasticsearch-master-0] uncaught exception in thread [main]
org.elasticsearch.bootstrap.StartupException: ElasticsearchException[failed to bind service]; nested: AccessDeniedException[/bitnami/elasticsearch/data/nodes];
```

## 原因

通过 HostPath 挂载的目录没有访问权限

## 解决

``` bash
$ cd /mnt/k8s-data/es/master

$ chmod -R 777 .
```

## 总结

当碰到 k8s pod 出现问题时，日志最为关键，找问题关键两步

1. `kubectl describe pod`
1. `kubectl logs`
