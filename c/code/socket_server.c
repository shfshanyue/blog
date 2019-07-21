#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
#include <netinet/in.h>

int main(){
  // socket
  int serv_sock = socket(AF_INET, SOCK_STREAM, IPPROTO_TCP);

  // 准备 IP:PORT
  struct sockaddr_in serv_addr;
  memset(&serv_addr, 0, sizeof(serv_addr));
  serv_addr.sin_family = AF_INET;
  serv_addr.sin_addr.s_addr = inet_addr("127.0.0.1");
  serv_addr.sin_port = htons(9090);

  // bind()
  bind(serv_sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr));

  // listen()
  listen(serv_sock, 20);

  for (;;) {
    struct sockaddr_in clnt_addr;
    socklen_t clnt_addr_size = sizeof(clnt_addr);
    int clnt_sock = accept(serv_sock, (struct sockaddr *)&clnt_addr, &clnt_addr_size);

    sleep(10);
    char *str = "echo";
    write(clnt_sock, str, sizeof(str));

    //关闭套接字
    close(clnt_sock);
  }

  // accept()
  close(serv_sock);
  return 0;
}