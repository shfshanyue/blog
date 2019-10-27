<template>
  <ParentLayout>
    <QR #sidebar-top/>
    <Bar #page-top/>
  </ParentLayout>
</template>

<script>
import ParentLayout from '@parent-theme/layouts/Layout.vue'
import QR from '@theme/components/QR.vue'
import Bar from '@theme/components/Bar.vue'

export default {
  components: {
    ParentLayout,
    QR,
    Bar
  }
}
</script>
