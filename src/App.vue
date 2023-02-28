<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { routingIntercept } from '@/utils/interceptor'
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app"

const userStore = useUserStore()
onLaunch(() => {
  userStore.getCurrentUser()
  routingIntercept()
  console.log("App Launch")
})

onShow(() => {
  console.log("App Show")
})

onHide(() => {
  console.log("App Hide")
})
</script>

<style lang="scss">
@import '@/uni_modules/uni-scss/index.scss';
@import '@/style/index.scss';
</style>
