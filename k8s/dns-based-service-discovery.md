---
title: DNS 与服务发现

---

## Service 与 DNS record

``` shell
$ kubectl get svc kube-dns -n kube-system
NAME       TYPE        CLUSTER-IP   EXTERNAL-IP   PORT(S)                  AGE
kube-dns   ClusterIP   10.96.0.10   <none>        53/UDP,53/TCP,9153/TCP   12d

$ kubectl get svc nginx-service
NAME            TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)   AGE
nginx-service   ClusterIP   10.108.9.49   <none>        80/TCP    3h

$ dig nginx-service.default.svc.cluster.local @10.96.0.10 +short
10.108.9.49
```

``` shell
$ cat /etc/resolv.conf
nameserver 10.96.0.10
search default.svc.cluster.local svc.cluster.local cluster.local
options ndots:5

$ nslookup nginx-service
nslookup: can't resolve '(null)': Name does not resolve

Name:      nginx-service
Address 1: 10.108.9.49 nginx-service.default.svc.cluster.local
```

## 使用 nginx 配置域名访问

```
```
