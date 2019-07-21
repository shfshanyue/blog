## 安装 network pod: flannel

网络组件用以在 pod 间进行通信，再此之前，我们会发现 coredns 组件处于 `Pending` 状态。我们使用网络组件 `flannel` 来确保 `coredns` 的正常运行。

``` shell{3,4}
$ kubectl get pods --all-namespaces
NAMESPACE     NAME                              READY   STATUS    RESTARTS   AGE
kube-system   coredns-5644d7b6d9-8l2gv          0/1     Pending   0          56m
kube-system   coredns-5644d7b6d9-l8zv5          0/1     Pending   0          56m
kube-system   etcd-shanyue                      1/1     Running   0          55m
kube-system   kube-apiserver-shanyue            1/1     Running   0          55m
kube-system   kube-controller-manager-shanyue   1/1     Running   0          55m
kube-system   kube-proxy-5drlg                  1/1     Running   0          56m
kube-system   kube-scheduler-shanyue            1/1     Running   0          55m
```

在安装网络组件要确保路是通的，使用 `sysctl` 设置内核变量 `net.bridge.bridge-nf-call-iptables` 为1

``` shell{1,3}
$ sysctl net.bridge.bridge-nf-call-iptables=1

$ kubectl apply -f https://raw.githubusercontent.com/coreos/flannel/2140ac876ef134e0ed5af15c65e414cf26827915/Documentation/kube-flannel.yml
podsecuritypolicy.policy/psp.flannel.unprivileged created
clusterrole.rbac.authorization.k8s.io/flannel created
clusterrolebinding.rbac.authorization.k8s.io/flannel created
serviceaccount/flannel created
configmap/kube-flannel-cfg created
daemonset.apps/kube-flannel-ds-amd64 created
daemonset.apps/kube-flannel-ds-arm64 created
daemonset.apps/kube-flannel-ds-arm created
daemonset.apps/kube-flannel-ds-ppc64le created
daemonset.apps/kube-flannel-ds-s390x created
```

此时，再次查看集群中所有的 pod 状态，此时 `coredn` 变为正常状态，且多了 `kube-flannel-ds-amd64` 这个 pod。

``` shell{8}
$ kubectl get pods --all-namespaces
NAMESPACE     NAME                              READY   STATUS    RESTARTS   AGE
kube-system   coredns-5644d7b6d9-8l2gv          1/1     Running   0          136m
kube-system   coredns-5644d7b6d9-l8zv5          1/1     Running   0          136m
kube-system   etcd-shanyue                      1/1     Running   0          136m
kube-system   kube-apiserver-shanyue            1/1     Running   0          135m
kube-system   kube-controller-manager-shanyue   1/1     Running   0          136m
kube-system   kube-flannel-ds-amd64-pmlnw       1/1     Running   0          9m23s
kube-system   kube-proxy-5drlg                  1/1     Running   0          136m
kube-system   kube-scheduler-shanyue            1/1     Running   0          136m
```

## 添加 worker node

在添加 worker node 时，需要在子节点也进行 `docker` 以及 `kubeadm` 的安装，按照以上章节步骤进行安装。

安装之后根据以上关于搭建主节点章节的输出指示，使用 `kubeadm join` 加入集群之中:

``` shell
$ kubeadm join 172.17.68.39:6443 --token qq8hbl.4utma949mu0p47v4 \
    --discovery-token-ca-cert-hash sha256:cce6cd7ec86cf4cd65215bea554f98c786783720b19262533cd98656ac6eb15e
[preflight] Running pre-flight checks
        [WARNING Service-Docker]: docker service is not enabled, please run 'systemctl enable docker.service'
        [WARNING Service-Kubelet]: kubelet service is not enabled, please run 'systemctl enable kubelet.service'
[preflight] Reading configuration from the cluster...
[preflight] FYI: You can look at this config file with 'kubectl -n kube-system get cm kubeadm-config -oyaml'
[kubelet-start] Downloading configuration for the kubelet from the "kubelet-config-1.16" ConfigMap in the kube-system namespace
[kubelet-start] Writing kubelet configuration to file "/var/lib/kubelet/config.yaml"
[kubelet-start] Writing kubelet environment file with flags to file "/var/lib/kubelet/kubeadm-flags.env"
[kubelet-start] Activating the kubelet service
[kubelet-start] Waiting for the kubelet to perform the TLS Bootstrap...

This node has joined the cluster:
* Certificate signing request was sent to apiserver and a response was received.
* The Kubelet was informed of the new secure connection details.

Run 'kubectl get nodes' on the control-plane to see this node join the cluster.
```

`kubeadm join` 有两个关键的参数: `token` 与 `hash`。如果你已经丢失了新建 master node 时的输出 `kubeadm join` 信息怎么办？此时可以通过以下命令来获取

``` shell
# 以下操作在 master node
# kubeadm join <control-plane-host>:<control-plane-port> --token <token> --discovery-token-ca-cert-hash sha256:<hash>

# 获取 token
$ kubectl token list

# 获取 hash
$ openssl x509 -pubkey -in /etc/kubernetes/pki/ca.crt | openssl rsa -pubin -outform der 2>/dev/null | openssl dgst -sha256 -hex | sed 's/^.* //'
```

安装完之后，再次打印节点信息

``` shell
$ kubectl get nodes
NAME       STATUS   ROLES    AGE   VERSION
shanyue    Ready    master   17m   v1.16.0
shuifeng   Ready    <none>   15m   v1.16.0

$ kubectl get pods --all-namespaces
NAMESPACE     NAME                              READY   STATUS    RESTARTS   AGE
kube-system   coredns-5644d7b6d9-845lr          1/1     Running   0          24m
kube-system   coredns-5644d7b6d9-k6dqm          1/1     Running   0          24m
kube-system   etcd-shanyue                      1/1     Running   0          23m
kube-system   kube-apiserver-shanyue            1/1     Running   0          23m
kube-system   kube-controller-manager-shanyue   1/1     Running   0          23m
kube-system   kube-flannel-ds-amd64-tdvbs       1/1     Running   0          21m
kube-system   kube-flannel-ds-amd64-vtrnh       1/1     Running   0          21m
kube-system   kube-proxy-k46l2                  1/1     Running   0          24m
kube-system   kube-proxy-rhrrg                  1/1     Running   0          22m
kube-system   kube-scheduler-shanyue            1/1     Running   0          23m
```

至此，一个拥有 master node 与 worker node 的 `kubernetes` 集群就搭建完成了。

