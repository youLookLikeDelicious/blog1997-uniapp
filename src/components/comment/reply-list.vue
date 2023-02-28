<template>
  <uni-popup ref="popup" type="bottom" @change="handleChangePopup">
    <view class="comment-wrapper reply-list bg-primary" hover-class="none" hover-stop-propagation="false">
      <view class="flex-direction-row uni-py-5 uni-pl-8 reply-nav bg-primary" hover-class="none" hover-stop-propagation="false">
        <uni-icons type="left" @click="popup.close()"></uni-icons>
        <text class="uni-ml-2" space="false" decode="false">
          {{ `回复(${( query.total || 0) + thisCommentNum })` }}
        </text>
      </view>
      <view v-if="thisRootComment" class="uni-mb-5 uni-py-5 uni-pl-9 uni-pr-7 bg-primary" hover-class="none" hover-stop-propagation="false">
        <comment-box :comment="thisRootComment" @longpress="handleLongPress(thisRootComment)"></comment-box>
      </view>
      <!-- 回复列表 -->
      <uni-list v-for="comment in replyList" :key="comment.id" clickable>
        <uni-list-item direction="column" class="bg-primary" clickable @click.stop="handleShowReply(comment)">
          <template #body>
            <comment-box :comment="comment" @longpress="handleLongPress(comment)"></comment-box>
          </template>
        </uni-list-item>
      </uni-list>
      <uni-load-more class="reply-load-more uni-mt-5" ref="loadMore" :status="more" />
    </view>
    <view class="footer flex-direction-row uni-py-1 uni-pl-3 align-item-center bg-primary">
      <view class="flex-direction-row flex-1 uni-py-3">
        <view class="flex-1" hover-class="none" hover-stop-propagation="false" @click.stop="handleShowReply(undefined)">
          <uni-easyinput
            prefixIcon="chat"
            :value="content"
            placeholder="可能你也想说"
            :inputBorder="false"
            disabled />
        </view>
        <button class="button-text uni-mx-3 color-ivory" plain @click="handleSubmitReply" :disabled="!content">发 送</button>
      </view>
    </view>
  </uni-popup>
  <uni-popup ref="replyPopup" type="bottom">
    <view class="reply-box bg-primary align-item-end" hover-class="none" hover-stop-propagation="false">
      <uni-easyinput v-model="content" type="textarea" :placeholder="placeholder" :inputBorder="false"></uni-easyinput>
      <button class="button-text uni-mx-3 color-ivory" plain @click="handleSubmitReply" :disabled="!content">发 送</button>
    </view>
  </uni-popup>
  <comment-menu ref="menu" @deleted="handleDeleteCommnet"></comment-menu>
</template>

<script lang="ts" setup>
import CommentMenu from './menu.vue'
import { usePage } from '@/composition/page'
import { getReply, saveComment } from '@/api'
import { useCheckLogin } from '@/composition'
import { reactive, ref, computed } from 'vue'
import { getCurrentInstance, onUnmounted } from 'vue'
import commentBox from './comment-box.vue'

const newReplies = reactive<component.Comment[]>([])
const { query, dataList, loadData, loading } = usePage<component.Comment>(() => getReply(thisRootComment.value?.id ?? '', dataList?.length || 0))

// 载入更多评论的状态
const more = computed(() => {
  if (loading.value) return 'loading'
  return dataList.length >= query.value.total ? 'no-more' : 'more'
})

const popup = ref()
const replyPopup = ref()

const emit = defineEmits<{
  (event: 'update:num', num: number): void
}>()

const props = defineProps<{
  num: number
}>()

// 用户信息
const { checkLogin, userStore } = useCheckLogin()

const replyList = computed<component.Comment[]>(() => {
  return [...newReplies, ...dataList.filter(item => !newReplies.some((newItem) => newItem.id === item.id))]
})

// 显示回复内容
const thisRootComment = ref<component.Comment>()
const open = (rootComment: component.Comment) => {
  thisRootComment.value = rootComment
  dataList.splice(0, dataList.length)
  popup.value.open()
}

defineExpose({ open })
// 禁用页面的滚动
const handleChangePopup = ({ show }: { show: boolean }) => {
  uni.$emit('set-overflow', show ? 'hidden' : 'visible')
}

// 回复
const content = ref('')
const thisComment = ref<component.Comment>()
const thisCommentNum =ref(0)
const placeholder = computed(() => {
  if (!thisComment.value) return '也许你也想说'
  return `回复${thisComment.value.user.name}:`
})

const handleShowReply = (comment?: component.Comment) => {
  thisComment.value = comment
  replyPopup.value.open()
}
const handleSubmitReply = () => {
  checkLogin().then(() => {
    if (!content.value) return
    saveComment({ able_type: 'comment', able_id: thisComment.value ? thisComment.value.id : thisRootComment.value?.id, content: content.value })
      .then((res) => {
        uni.showToast({ title: '回复成功' })
        console.log(thisRootComment.value)
        if (thisRootComment.value) {
          thisRootComment.value.commented += 1
        }
        thisComment.value = undefined
        content.value = ''
        newReplies.unshift(res.data?.data)
        replyPopup.value.close()
        thisCommentNum.value += 1
        emit('update:num', props.num + 1)
      })
  })
}

// 自动加载回复
const loadMore = ref()
const instance = getCurrentInstance()
const observer = uni.createIntersectionObserver(instance)
observer.relativeToViewport({ bottom: 30 })
  .observe('.reply-load-more', (res) => {
    if (loading.value) return
    loadData()
  })

onUnmounted(() => {
  observer.disconnect()
})

// 长按菜单
// 长按菜单
const menu = ref()
const handleLongPress = (comment?: component.Comment) => {
  if (!comment) return
  menu.value.open({ ableId: comment.id, ableType: 'comment', deletable: userStore.id === comment.user.id })
}

// 处理删除评论
const handleDeleteCommnet = (id: number | string, num: number) => {
  const findHandler = (comment: component.Comment): boolean => comment.id === id
  const newCommentIndex = newReplies.findIndex(findHandler)
  thisCommentNum.value -= num
  emit('update:num', props.num - num)
  if (newCommentIndex >= 0) {
    newReplies.splice(newCommentIndex, 1)
    return
  }

  const index = dataList.findIndex(findHandler)
  if (index >= 0) {
    dataList.splice(index, 1)
  }
}
</script>

<style lang="scss" scoped>
@import './index.scss';
.reply-list {
  height: 80vh;
  width: 100vw;
  overflow-y: auto;
  position: fixed;
  left: 0;
  bottom: 0;
}
.reply-nav {
  position: sticky !important;
  top: 0;
  z-index: 99;
  border-bottom: 1rpx solid $uni-border-color;
}

</style>