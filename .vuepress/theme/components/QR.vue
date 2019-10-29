<template>
  <div class="qr">
    <img src="https://shanyue.tech/qrcode.jpg" alt="山月行" width="120" height="120" loading="lazy">
    <p class="we-intro">
      欢迎关注公众号<span style="color: #3eaf7c;font-weight:800;">山月行</span>，我将在这里发表我的每日回顾以及关于前后端，运维以及 devops 的文章。
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
  width: 48%;
}
</style>
