import { defineStore } from 'pinia'
import { getCurrentUser } from '@/api/index'

export const useUserStore = defineStore('user', {
  state: () => {
    return {
      id: 0,
      name: '',
      token: '',
      avatar: '',
      initialized: false
    }
  },
  actions: {
    getCurrentUser() {
      if (this.initialized) {
        return Promise.resolve(this.$state)
      }
      return getCurrentUser().then(res => {
        if (!res.data.data) return null
        Object.assign(this, { ...res.data.data, initialized: true})
        return this
      })
    }
  }
})