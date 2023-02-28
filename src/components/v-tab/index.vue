<template>
  <view hover-class="none" hover-stop-propagation="false">
    <view class="position-relative" hover-class="none" hover-stop-propagation="false">
      <scroll-view class="flex-direction-row v-tab" :enable-flex="false" scroll-x="true" scroll-with-animation>
        <view 
          v-for="option in props.options" :key="option.name" :id="option.id + ''"
          @click="handleClick(option.id)"
          :class="['flex-direction-row', 'tab-item', 'uni-px-5', 'uni-py-3', { 'active-tab': option.id === modelValue }]"
        >
          <uni-icons v-if="option.icon" type="color" size="24" />
          <text space="false" decode="false">
            {{ option.name }}
          </text>
        </view>
        <view class="active-bar" :animation="animationData" hover-class="none" hover-stop-propagation="false"></view>
      </scroll-view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { nextTick } from 'vue';
import { defineProps, watch, getCurrentInstance, reactive } from 'vue'
interface TabItem {
  icon?: string,
  id: string | number,
  name: string
}

interface Props {
  stiky?: boolean,
  options: TabItem[],
  modelValue: string | number
}

let tabItemClientRects: Record<string, any> = {}

const props = defineProps<Props>()

const emit = defineEmits<{
  (event: 'update:modelValue', value: string | number): void,
  (event: 'change', value: string | number): void
}>()

const instance = getCurrentInstance()
// 监听选项
watch(
  () => props.options,
  () => {
    nextTick(() => {
      uni.createSelectorQuery().in(instance)
        .selectAll('.tab-item').boundingClientRect((data) => {
          if (!Array.isArray(data)) return
          tabItemClientRects = {}
          data.forEach(({ width, left, id }) => {
            const key = id || '0'
            tabItemClientRects[key] = { width, left }
          })
          handleAnimation()
        }).exec()
    })
  },
  { deep: true, immediate: true }
)

// 动画
const animation = uni.createAnimation({ duration: 100, delay: 0 })
const animationData = reactive({})
const handleAnimation = () => {
  const rect = tabItemClientRects[props.modelValue || 0]
  if (!rect) return
  animation.translateX(rect.left).width(rect.width).step()
  Object.assign(animationData, animation.export())
}

// 点击tab-item
const handleClick = (id: string | number) => {
  emit('update:modelValue', id)
  emit('change', id)
  nextTick(handleAnimation)
}
</script>

<style lang="scss" scoped>
.v-tab {
  white-space: nowrap;
  height: 65rpx;
}
.tab-item {
  font-size: 30rpx;
  display: inline-flex;
}
text {
  color: #f5f7fa;
}
.active-tab {
  color: $uni-color-primary;
}
.active-bar {
  width: 100rpx;
  height: 4rpx;
  bottom: 0rpx;
  background-color: $uni-color-primary;
}
</style>