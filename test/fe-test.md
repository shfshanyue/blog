# 浅谈 2022 前端工作流中全流程多层次的四款测试工具

在应届生找工作的时候，我们经常会见到一条招聘要求：**要求实习经历**。或者 **有实习经历者优先**。

为什么大部分公司在招聘时，都要求你必须有实习经历？

商业项目与个人项目不同，一段实习经历，能够熟悉公司中成熟的**规范化**的整个开发流程。

在大学中，当你编写网站时，你大概率编写的是一个复杂度较低的网站，几乎是一人搞定所有工作。设计，开发，测试，上线，等等，一人全包。

但是在实际工作中，商业产品的高复杂度意味着几乎不可能一个人完成整个项目从立项，到开发测试，以及上线的整个流程。

因此对于应届生，实习经历是无可比拟的一个加分项。从而也可以看出前端规范化的工作流的重要性。

仅仅对于前端来说，工作流一般包括以下几部分：

+ 产品对接。产品交与 PRD（产品需求文档），通过 PRD 了解自己开发的基本需求。
+ 设计对接。设计交与设计稿。通过设计稿进行一比一像素级还原。
+ 开发(前端主工作流)。主要是编码开发部分。
+ 后端对接。后端交与 API，与后端进行数据联调，为页面注入真实数据。
+ 测试对接。
+ 上线。

## 前端开发

在前端开发的所有工作流中，占用时间最多也是最为重要的环节是开发环节，也就是敲代码环节，开发前设计与各种人员对接也是为开发做准备。

针对前端开发，也可以根据工作内容大致分为几个层次。了解前端开发工作的各个层次，对自身定义以及作为前端人的个人职业规划拥有重要意义。

+ 前端运维化基建：为前端服务的 npm 私有仓库搭建，以及同样也为后端服务的 Gitlab 私有仓库，Docker 镜像仓库搭建，CI Pipeline 工具搭建等。这将决定你能否很舒服地去迭代，测试以及上线前端项目。如果这一步不完善，你很可能经常在公司加班，甚至熬夜。前端基础设施建设，但并不一定由前端开发者搭建完成。
+ 前端基建：组件库，脚手架，打点系统，异常系统（打点系统和异常系统也可以看做特殊的业务开发），以及一系列 npm 私有仓库。基本是技术占比比较大，因此深受诸多程序员的青睐。
+ 前端引擎：自研渲染引擎与 Javascript 引擎，一般用于跨端。比如基于 electron 的桌面引擎开发，基于 RN 的移动端引擎开发，以及一些公司自研浏览器的开发，比如许多手机自带的各各家厂商的浏览器。一般需要了解 C++ 层，占比很少。
+ 业务开发：上对产品及设计，下接后端与运维。占所有前端工作的比例大概 90%。

相对于广义的业务开发而言，在开发中，除了真正的业务逻辑功能实现的开发，还包含针对保障项目质量所做的测试开发。而这种开发测试模式，又可以分为两类：

+ BDD：Behavior Driven Development，行为驱动开发，先开发再测试。
+ TDD：Test-Driven Development，测试驱动开发，先测试再开发。

## 前端开发工作流中的测试环节

在前端开发甚至所有类型开发中的每一个细小模块，都需要随后的测试环节进行代码质量的检测。

我们以一个简单的段子，浅显易懂地看看测试做些什么。以下每句话，可看做是一系列针对酒吧喝酒功能的测试用例。

+ 一个侧试工程师走进一家酒吧，要了一杯啤酒；
+ 一个测试工程师走进一家酒吧，要了一杯咖啡；
+ 一个侧试工程师走进一家酒吧，要了 0 . 7 杯啤酒；
+ 一个侧试工程师走进一家酒吧，要了 -1 杯啤酒；
+ 一个测试工程师走进一家酒吧，要了 232 杯啤酒；
+ 一个测试工程师走进一家酒吧，要了一杯洗脚水；
+ 一个测试工程师走进一家酒吧，要了一杯晰蝎；
+ 一个测试工程师走进一家酒吧，要了一份 asdfas0fas8fasdf
+ 一个测试工程师走进一家酒吧，什么也没要；

在前端开发的工作流中，可简单分为以下几个阶段的测试。以下逐一分析。

+ 单元测试
+ Component 测试
+ 端对端测试
+ API 接口测试
+ API 压力测试

在我们项目中进行了测试后，每次业务迭代以及各依赖版本升级，都可以无风险无压力进行。

当业务迭代完成后进行测试，即可**确认新上线的代码不会影响以前的业务逻辑**。当项目依赖升级后，可通过测试可发现隐藏的 Breaking Change。

## 单元测试

在前端开发中，单元测试是必不可少的，在了解单元测试之前，我们先了解一个术语：**断言（assertion）**。

断言是**判断一个结果为真或假的逻辑**，目的为了表示程序的实际计算结果与预期结果是否一致。在测试中，断言是最为重要的概念。

我们以一个简单的示例了解下是什么是断言，在 JavaScript 语言中，我们可以使用专业的断言库 [chai](https://github.com/chaijs/chai)。

![](https://static.shanyue.tech/images/23-02-02/clipboard-8573.f8492c.webp)

以下是为了测试 `sum` 求和函数的断言。

``` js
// 断言 sum(10,11) === 21
expect(sum(10, 11)).to.equal(21)

// 断言 sum(-10,11) === 1
expect(sum(-10, 12)).to.equal(1)
```

而我们的测试，是基于每一个断言而完成的，我们将测试同一功能的断言集合起来，使用测试框架维护所有断言进行测试。

而单元测试应用于项目基于断言用来测试某单一模块的最小可测单元。见维基百科解释。

> 在计算机编程中，单元测试（Unit Testing）又称为模块测试，是针对程序模块（软件设计的最小单位）来进行正确性检验的测试工作。程序单元是应用的最小可测试部件。在过程化编程中，一个单元就是单个程序、函数、过程等；对于面向对象编程，最小单元就是方法，包括基类（超类）、抽象类、或者派生类（子类）中的方法。

我们可以使用 mocha 等测试框架用以维护项目的所有单元测试。以下是一个来自于 mocha 官方的测试套件，用来测试 `Array.prototype.indexOf()` 函数。

![](https://static.shanyue.tech/images/23-02-02/clipboard-5789.b21b3d.webp)

``` js
// 用以测试 Array 的一系列测试用例
describe('Array', function () {
  // 用以测试 Array.prototype.indexOf 的一系列测试用例
  describe('#indexOf()', function () {
    // 某一测试用例
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
```

执行测试脚本，我们可以得到关于该项目的所有单元测试的测试结果。

``` bash
$ ./node_modules/mocha/bin/mocha

  Array
    #indexOf()
      ✓ should return -1 when the value is not present


  1 passing (9ms)
```

## 端对端测试 (end to end)

在通过对前端的组件进行测试后，我们仍然无法保证整个页面没有问题。此时，可以通过点点点来保证页面之间的跳转没有问题。

但是人工点点点效率太低，此时可以通过自动化的点点点来使测试简单化，称为 UI 自动化测试，也称为端对端测试，而它的**工作原理就是模拟人工进行点点点**。

针对一个商场项目而言，它会模拟用户进行登录、查找、购买、下单整个流程。

此时，可推荐 [playwright](https://github.com/microsoft/playwright) 进行自动化测试，它支持 Chromium、Firefox 等浏览器或浏览器底层。

## 组件测试

基于组件的前端系统开发，像是搭建积木一样搭建页面。如果想测试某一页面是否可以正常工作，可查看搭建页面的积木，即单一组件是否正常运行。

![](https://static.shanyue.tech/images/23-02-02/clipboard-3315.3b6909.webp)

以 React 为例，在 React 中，可以使用 `React Testing Library` 对 React Component 进行测试。

![](https://static.shanyue.tech/images/23-02-02/clipboard-8736.b39dfd.webp)

``` js
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import Fetch from './fetch'

test('loads and displays greeting', async () => {
  // ARRANGE
  render(<Fetch url="/greeting" />)

  // ACT
  await userEvent.click(screen.getByText('Load Greeting'))
  await screen.findByRole('heading')

  // ASSERT
  expect(screen.getByRole('heading')).toHaveTextContent('hello there')
  expect(screen.getByRole('button')).toBeDisabled()
})
```

## API 测试

API 是介于前后端间的沟通桥梁，前端项目中的数据几乎全部通过 API 获取数据。而在前端的异常中，因 API 导致的数据异常占比很大部分，因此，保障 API 中的数据准确性，是保障前端项目质量极为重要的一环。

API 测试，推荐最近较为流行的 API 工具：[Apifox](https://www.apifox.cn/a1shanyue)，Apifox 是一款集成于 API 设计/开发/测试工具，最重要的是它的测试极其简单，近乎开箱即用。

![](https://static.shanyue.tech/images/23-02-02/clipboard-3051.59cf3d.webp)

当你在 Apifox 设计好 API 及其数据类型时，你的 API 文档与测试就自动完成了，几乎零配置，当然，你也可以添加更为精细的测试。它可以自动测试你的 API 每个字段的数据类型，API 的状态码等等。

![](https://static.shanyue.tech/images/23-02-02/clipboard-6737.51980a.webp)

## 小结

从本篇文章中，我们知道了前端工作中的各个分层以及职责，最重要的是对于代码开发所做的测试以及几款工具软件的推荐，如下所示：

+ 单元测试：mocha/chai
+ Component 测试：react-testing-library
+ 端对端测试：playwright
+ API 接口测试：apifox
