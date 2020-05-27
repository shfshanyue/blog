#include <pthread.h>
#include <stdio.h>

void * run(void *arg) {
  printf("hello, world\n");
}

int main() {
  pthread_t thread;

  pthread_create(&thread, NULL, run, NULL);
  pthread_join(thread, NULL);
}
