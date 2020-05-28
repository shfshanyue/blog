#include <unistd.h>  
#include <stdio.h>
#include <printf.h>
#include <stdlib.h>

int main ()   
{   
  __pid_t fpid; 
  fpid = fork();   
  if (fpid == 0) {
    printf("子进程: %d\n", getpid());   
  } else {  
    printf("父进程: %d\n", getpid());
  }
  printf("进程: %d\n", getpid());
  return 0;
}
