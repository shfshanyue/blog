---
title: 带着问题学习 ansible
tags:
  - devops
  - linux

---

# ansible 中的细节问题

如何更快地学习某门技术？

+ 学习示例，比如 ansible 可以查看 [ansible/ansible-examples](https://github.com/ansible/ansible-examples)
+ 带着问题来思考

于是我总结了在我初学 ansible 时所带的一些疑问

### 当某个 task 执行错误时不中断操作

添加参数 `ignore_errors: true`

```yaml
- name: install pip
  register: pip
  yum:
    name: python-pip
  ignore_errors: true
```

### 如何根据 task 执行结果来作为分支条件

使用 `register` 监听当前任务执行结果，`when` 作为分支条件

### 使用 git，file 等模块比直接使用 shell 模块的优势在哪里

幂等性。如使用 shell 的话， `git clone` 两次会有报错，而 git，file 诸多模块很好地保证了特定操作的幂等性。

### 如何在 task 中根据 linux 的发行版不同而做不同的操作
