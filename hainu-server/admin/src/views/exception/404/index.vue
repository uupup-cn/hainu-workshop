<!-- 404页面 -->
<template>
  <ArtException
    :data="{
      title: '404',
      desc: $t('exceptionPage.404'),
      btnText: $t('exceptionPage.gohome')
    }"
  />
</template>

<script setup lang="ts">
  defineOptions({ name: 'Exception404' })
</script>
