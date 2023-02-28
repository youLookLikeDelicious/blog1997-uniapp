<template>
  <view class="flex-direction-row" hover-class="none" hover-stop-propagation="false" @click.native.stop="handleThumbUp">
    <view :animation="animationData" ref="iconRef">
      <uni-icons :type="type" color="#999" :size="isSmall ? 16 : 24" />
    </view>
    <text class="color-grey uni-ml-1" :style="{ fontSize: isSmall ? 16 : 24  }" space="false" decode="false">
      {{ (props.number || 0) + newThumbTimes }}
    </text>
  </view>
</template>


<script lang="ts" setup>
import { thumbUp } from '@/api'
import { computed, ref } from 'vue'
import { useCheckLogin } from '@/composition'

interface Props {
  size?: 'small',
  ableId: number | string,
  ableType: 'article' | 'comment',
  number?: number, // 点赞次数
  thumbed?: boolean | number // 是否点赞
}

const props = defineProps<Props>()

const isSmall = computed(() => {
  return props.size === 'small'
})

const emit = defineEmits<{
  (event: 'thumbed'): void
}>()

// 点赞的图标
const type = computed(() => {
  return props.thumbed || newThumbTimes.value ? 'hand-up-filled' : 'hand-up'
})
const animationData = ref()
const animation = uni.createAnimation({ duration: 200 })

// 点赞操作
const newThumbTimes = ref(0)
const execAnimation = () => {
  animation.scale(1.2, 1.2)
  animation.rotate(-12).step()
  animation.rotate(12).step()
  animation.rotate(0)
  animation.scale(1, 1).step()
  animationData.value = ''
  setTimeout(() => {
    animationData.value = animation.export()
    console.log(animationData.value)
  })
}
const handleThumbUp = () => {
  checkLogin().then(() => {
    execAnimation()
    thumbUp({ able_id: props.ableId, able_type: props.ableType })
      .then(() => {
        uni.showToast({ title: '点赞成功' })
        emit('thumbed')
        newThumbTimes.value += 1
      })
  })
}

// 查看用户是否登陆
const { checkLogin } = useCheckLogin()
</script>

<style lang="scss" scoped>
</style>