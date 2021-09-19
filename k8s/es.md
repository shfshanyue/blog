# 在 k8s 集群中部署 ES

## 通过 helm 部署

### WARNING

```
Elasticsearch requires some changes in the kernel of the host machine to
work as expected. If those values are not set in the underlying operating
system, the ES containers fail to boot with ERROR messages.

More information about these requirements can be found in the links below:

  https://www.elastic.co/guide/en/elasticsearch/reference/current/file-descriptors.html
  https://www.elastic.co/guide/en/elasticsearch/reference/current/vm-max-map-count.html

This chart uses a privileged initContainer to change those settings in the Kernel
by running: sysctl -w vm.max_map_count=262144 && sysctl -w fs.file-max=65536
```

``` bash
$ sysctl -w vm.max_map_count=262144 && sysctl -w fs.file-max=65536
```

## 查看状态

``` bash
$ kubectl get pods
es-elasticsearch-coordinating-only-54d9f9698f-5mhdx   1/1       Running            0          7h26m
es-elasticsearch-coordinating-only-54d9f9698f-xgnsb   1/1       Running            0          7h26m
es-elasticsearch-data-0                               1/1       Running            79         7h26m
es-elasticsearch-master-0                             1/1       Running            79         7h26m
```

## 部署成功

``` bash
$ curl es-elasticsearch-coordinating-only:9200
{
  "name" : "es-elasticsearch-coordinating-only-54d9f9698f-5mhdx",
  "cluster_name" : "elastic",
  "cluster_uuid" : "_na_",
  "version" : {
    "number" : "7.7.1",
    "build_flavor" : "oss",
    "build_type" : "tar",
    "build_hash" : "ad56dce891c901a492bb1ee393f12dfff473a423",
    "build_date" : "2020-05-28T16:30:01.040088Z",
    "build_snapshot" : false,
    "lucene_version" : "8.5.1",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
```

