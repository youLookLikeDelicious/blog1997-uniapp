<template>
  <!-- image版本 -->
  <view hover-stop-propagation="false" class="position-absolute curtain-wrapper">
    <image v-if="url" class="cover-new" :src="`${url}?t=min`" mode="scaleToFill" lazy-load="true" @load="handleLoad"></image>
    <image class="cover-new cover-mini" :class="{ 'hidden-mini': loaded}" :src="thumbnail" mode="scaleToFill" lazy-load="false">
    </image>
  </view>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface Props {
	url: string,
	thumbnail: string
}
const props = defineProps<Props>()

const loaded = ref(false)
const handleLoad = () => {
  loaded.value = true
}
</script>

<style lang="scss" scoped>
.curtain-wrapper {
  top: 0;
  left: 0;
  width: 100%;
  .cover-new {
    position: absolute;
    left: 0;
    top: 0;
    flex: 1;
    width: 100%;
    &:after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      left: 0;
      top: 0;
      background: linear-gradient(to right, rgba(255, 120, 23, 0.5), rgba(175, 0, 45, 0.7), rgba(49, 145, 151, 0.9));
    }
  }
  .cover-mini {
    transition: opacity .3s;
  }
  .hidden-mini {
    opacity: 0;
  }
}
</style>