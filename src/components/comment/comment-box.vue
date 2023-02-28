<template>
  <view hover-class="none" hover-stop-propagation="false">
    <view class="flex-direction-row align-item-center justify-content-between" hover-class="none" hover-stop-propagation="false">
      <view class="flex-direction-row" hover-class="none" hover-stop-propagation="false">
        <v-avatar class="uni-mr-5" :avatar="comment.user.avatar" :name="comment.user.name"></v-avatar>
        <view class="" hover-class="none" hover-stop-propagation="false">
          <text style="font-size: 16px">{{ comment.user.name }}</text>
          <text style="font-size: 12px" class="color-grey">{{ comment.created_at }}</text>
        </view>
      </view>
      <thumb-up :number="comment.liked" size="small" @click.stop :able-id="comment.id" able-type="comment" :thumbed="comment.thumb_count"></thumb-up>
    </view>
    <!-- 评论内容部分 -->
    <view class="uni-mt-5 comment-content" hover-class="none" hover-stop-propagation="false">
      <rich-text @longpress="emit('longpress')" :nodes="comment.content"></rich-text>
      <slot></slot>
      <view v-if="comment.commentable" class="sub-comment flex-direction-row uni-pl-5 uni-mt-5" hover-class="none" hover-stop-propagation="false">
        <text class="uni-mr-3">{{ comment.commentable.user.name }}: </text>
        <rich-text :nodes="comment.commentable.content"></rich-text>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import ThumbUp from '@/components/thumb-up/index.vue'
import VAvatar from '@/components/v-avatar/index.nvue'

const props = defineProps<{
  comment: component.Comment
}>()

const emit = defineEmits<{
  (event: 'deleted', id: number| string, num: number): void,
  (event: 'longpress'): void
}>()

</script>

<style lang="scss" scoped>
@import './index.scss';
.sub-comment {
  border-left: 5rpx solid $uni-border-color;
  >text {
    font-size: 24rpx;
    color: $uni-color-primary;
  }
  >rich-text {
    font-size: 24rpx;
    color: $uni-text-color-grey;
  }
}
</style>