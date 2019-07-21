#include <stdio.h>

int main() {
  void *p;

  // 使用它装一个整数
  int a = 3;
  p = &a;
  printf("%d", *(int *)p);

  // 使用它装一个字符串
  char s[] = "hello, world";
  p = s;
  printf("%s", p);
  return 0;
}
