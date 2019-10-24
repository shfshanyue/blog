<template>
  <ParentLayout>
    <template #sidebar-top>
      <QR/>
    </template>
    <template #page-top>
      <Bar/>
    </template>
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
