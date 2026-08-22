<!-- 500页面 -->
<template>
  <ArtException
    :data="{
      title: '500',
      desc: $t('exceptionPage.500'),
      btnText: $t('exceptionPage.gohome')
    }"
  />
</template>

<script setup lang="ts">
  defineOptions({ name: 'Exception500' })
</script>
