## kubectl create secret

+ `docker-registry`: 创建一个给 Docker registry 使用的 secret
+ `generic`: 从本地 file, directory 或者 literal value 创建一个 secret
+ `tls`: 创建一个 TLS secret


``` bash
$ kubectl create secret generic drone-server-secrets --from-literal=app="hello, world"
```

### kubectl edit pvc 

`kubectl edit persistentvolumeclaims`

### kubectl get cs

`kubectl get componentstatus`

