import { useUserStore } from '@/stores/user'

const options = ['navigateTo', 'redirectTo', 'reLaunch', 'switchTab']

const guardPages = [
  '/sub-pages/gallery/index'
]

const loginPage = '/sub-pages/login/index'

export function routingIntercept() {
  const userStore = useUserStore()  
  options.forEach(option => {
    uni.addInterceptor(option, {
      invoke(config) {
        if (config === loginPage || userStore.id) return

        if (guardPages.includes(config.url)) {
          // uni.navigateTo({ url: loginPage, animationDuration: 0 })
          config.url = loginPage
        }
      }
    })
  })
}