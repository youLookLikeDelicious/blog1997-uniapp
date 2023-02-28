import { useUserStore } from '@/stores/user'

export const useCheckLogin = () => {
  const userStore = useUserStore()

  const checkLogin = () => {
    if (userStore.id) {
      return Promise.resolve(true)
    }
    
    uni.navigateTo({ url: '/sub-pages/login/index' })
    return Promise.reject(false)
  }
  return { userStore, checkLogin }
}