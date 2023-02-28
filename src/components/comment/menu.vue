<template>
  <uni-popup ref="popup" type="bottom">
    <uni-list>
      <uni-list-item
        show-extra-icon="true"
        :extra-icon="{ type: 'notification', size: 22 }"
        title="举报"
        :to="`/sub-pages/report/index?type=${data.ableType}&reported_id=${encodeURIComponent(data.ableId)}`"
      ></uni-list-item>
      <uni-list-item v-if="data.deletable" @click="handleDelete" clickable show-extra-icon="true" :extra-icon="{ type: 'trash-filled', size: 22 }" title="删除"></uni-list-item>
      <uni-list-item clickable @click="popup.close()">
        <template #body>
          <view class="align-item-center flex-1 uni-mt-3" hover-class="none" hover-stop-propagation="false">
            <text>取消</text>
          </view>
        </template>
      </uni-list-item>
    </uni-list>
  </uni-popup>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { deleteComment } from '@/api'

interface MenuData {
  ableId: string | number,
  deletable: boolean,
  ableType: 'article' | 'comment' // 举报类型
}

const emit = defineEmits<{
  (event: 'deleted', value: number | string, number: number): void
}>()

const data = reactive({
  ableId: '',
  deletable: '',
  ableType: ''
})

// 删除评论
const handleDelete = () => {
  if (!data.ableId) return
  deleteComment(data.ableId)
    .then((res) => {
      popup.value.close()
      uni.showToast({ title: '删除成功' })
      emit('deleted', data.ableId, res.data.data.rows)
    })
}

// 打开弹出层
const popup = ref()
const open = (menuData: MenuData) => {
  if (!popup.value) return
  Object.assign(data, menuData)
  popup.value.open()
}
defineExpose({ open })

</script>

<style lang="scss">
</style>