
<template>
  <view v-if="empty" class="empty align-item-center uni-mt-8" hover-class="none" hover-stop-propagation="false">
    <image src="/static/empty.png"></image>
		<view class="uni-mt-8">
		</view>
  </view>
</template>

<script lang="ts" setup>
const props = defineProps<{empty: boolean}>()
</script>

<style lang="scss">
</style>