#include <pthread.h>
#include <stdio.h>
#include <unistd.h>

void *run(void *arg) {
  int id = *((int *) arg);
  printf("Word %d\n", id);
  sleep(10 * id);
}

int main() {
  pthread_t tid[10];
  int id[10];

  for (int i = 0; i < 10; i++) {
    id[i] = i;
    pthread_create(&tid[i], NULL, run, (void *)&id[i]);
  }
  for (int i = 0; i< 10; i++) {
    pthread_join(tid[i], NULL);
    printf("Work Finish: %d\n", i);
  }
}
