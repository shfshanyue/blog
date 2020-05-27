#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

int main(void) {
  printf("entering main process---\n");
  execl("/usr/local/bin/node","node","",NULL);
  printf("exiting main process ----\n");
  return 0;
}
