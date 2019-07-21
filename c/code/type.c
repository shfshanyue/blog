#include <stdio.h>

struct Point {
  int x;
  int y;
};

int main() {
  // number
  int a = 3;
  float b = 4;
  printf("a=%d, b=%f\n", a, b);

  // array
  int list[] = {1, 2, 3, 4, 5};
  printf("list[3]=%d\n", list[3]);

  // string
  char s[] = "hello, world";
  char c = 'c';
  printf("s=%s, c=%c\n", s, c);

  // pointer
  int *p = &a; 
  printf("p=%d\n", *p);

  struct Point point = {3, 4};
  printf("P(%d, %d)\n", point.x, point.y);

  struct Point *pp = &point;
  printf("P(%d, %d)\n", pp->x, pp->y);
}
