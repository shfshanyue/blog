Prerequisites
Kubernetes 1.12+
Helm 2.12+ or Helm 3.0-beta3+
PV provisioner support in the underlying infrastructure
Installing the Chart
To install the chart with the release name my-release:

``` bash
$ helm repo add bitnami https://charts.bitnami.com/bitnami
$ helm install es bitnami/elasticsearch
```
