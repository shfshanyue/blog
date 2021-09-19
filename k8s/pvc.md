# k8s 存储：PV 与 PVC

在 Docker 的容器中，使用 volumes 作为存储，但是它仅仅只是本地存储系统中的一个目录，且没有生命周期的管理。

在 k8s 中通过使用 PV 及 PVC 来对 volume 做进一步抽象。

## PV

`PV` 是 k8s 集群中提供存储能力的资源，类似于 `node`。由运维人员 (administrator) 调配，也可以通过 `storage class` 来自动调配。通常可以由 `nfs` 等云存储资源提供实现


``` yaml
apiVersion: v1
kind: PersistentVolume
metadata:
  name: local-redis-pv
  labels:
    type: local
spec:
  storageClassName: local-storage
  capacity:
    storage: 10Gi
  accessModes:
    - ReadWriteOnce
  hostPath:
    path: "/mnt/k8s-data/redis"
```

## PVC

`PVC` 由用户请求 `PV` 指定大小资源及模式 (`ReadWriteOnce` 或)，如同 `pod` 向 `node` 请求 cpu/memory 资源。


## Hostpath

1. 指定当前 Host 下的磁盘
1. 没法自动调配，每次需要手动申明 PV，并指定 storageClassName
1. 每一个 PV 只能够关联一个 PVC
1. 当pod退出之后，pv/pvc 的清理也挺头疼
