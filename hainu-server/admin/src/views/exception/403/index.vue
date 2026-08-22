<!-- 403页面 -->
<template>
  <ArtException
    :data="{
      title: '403',
      desc: $t('exceptionPage.403'),
      btnText: $t('exceptionPage.gohome')
    }"
  />
</template>

<script setup lang="ts">
  defineOptions({ name: 'Exception403' })
</script>
