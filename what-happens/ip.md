当通过 DNS 解析查找到域名对应的 IP 地址后，就会进行 IP 寻址。

使用 `ping` 命令发送

``` shell
$ ping -c 3 shici.xiange.tech
PING shici.xiange.tech (59.110.216.155): 56 data bytes
64 bytes from 59.110.216.155: icmp_seq=0 ttl=50 time=9.547 ms
64 bytes from 59.110.216.155: icmp_seq=1 ttl=50 time=9.175 ms
64 bytes from 59.110.216.155: icmp_seq=2 ttl=50 time=15.694 ms

--- shici.xiange.tech ping statistics ---
3 packets transmitted, 3 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 9.175/11.472/15.694/2.989 ms

$ ping -c 3 shanyue.tech
PING shanyue.netlify.com (206.189.89.118): 56 data bytes
64 bytes from 206.189.89.118: icmp_seq=0 ttl=39 time=278.805 ms
64 bytes from 206.189.89.118: icmp_seq=1 ttl=39 time=322.390 ms
64 bytes from 206.189.89.118: icmp_seq=2 ttl=39 time=262.476 ms

--- shanyue.netlify.com ping statistics ---
3 packets transmitted, 3 packets received, 0.0% packet loss
round-trip min/avg/max/stddev = 262.476/287.890/322.390/25.289 ms
```
