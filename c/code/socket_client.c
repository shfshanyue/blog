#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

int main(){
  // socket()
  int sock = socket(AF_INET, SOCK_STREAM, 0);

  // struct sockaddr_in client_addr;
  // memset(&client_addr, 0, sizeof(client_addr));
  // client_addr.sin_family = AF_INET;
  // client_addr.sin_addr.s_addr = inet_addr("127.0.0.1");
  // client_addr.sin_port = htons(22222);

  // bind()
  // bind(sock, (struct sockaddr *)&client_addr, sizeof(client_addr));

  // 准备 IP:PORT
  struct sockaddr_in serv_addr;
  memset(&serv_addr, 0, sizeof(serv_addr));
  serv_addr.sin_family = AF_INET;
  serv_addr.sin_addr.s_addr = inet_addr("127.0.0.1");
  serv_addr.sin_port = htons(9090);

  // connect
  connect(sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr));

  //读取服务器传回的数据
  char buffer[40];
  read(sock, buffer, sizeof(buffer) - 1);

  printf("Message form server: %s\n", buffer);

  //关闭套接字
  close(sock);
  return 0;
}
