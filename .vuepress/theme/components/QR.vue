<template>
  <div class="qr">
    <img src="../qr.jpg" alt="山月行" width="120" height="120" loading="lazy">
    <p class="we-intro">
      如果你对全栈面试，graphql，devops，个人服务器运维以及微服务感兴趣的话，可以关注我。另外可以添加我微信 shanyue94，进群交流。
    </p>
  </div>
</template>

<script>
export default {
  name: 'QR'
}
</script>

<style>
.qr {
  margin-top: 10px;
  margin-bottom: -1rem;
  display: flex;
}

.qr .we-intro {
  color: #0006;
  font-size: .8em;
  width: 64%;
}
</style>
