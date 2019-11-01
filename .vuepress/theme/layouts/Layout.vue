<template>
  <Layout>
    <template #sidebar-top>
      <QR />
    </template>
    <template #page-top>
      <Bar />
    </template>
  </Layout>
</template>

<script>
import Layout from '@parent-theme/layouts/Layout.vue'
import QR from '@theme/components/QR.vue'
import Bar from '@theme/components/Bar.vue'

export default {
  components: {
    Layout,
    QR,
    Bar
  }
}
</script>
