import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: '',
    userName: '',
    role: '',
    isLogin: false
  }),

  getters: {
    // 로그인 여부 (보조용)
    isAuthenticated: (state) => state.isLogin,

    // 관리자 여부
    isAdmin: (state) => state.role === 'ADMIN'
  },

  actions: {
    // 로그인 성공 시 호출
    setUser(user) {
      this.userId = user.userId
      this.userName = user.userName
      this.role = user.role
      this.isLogin = true
    },

    // 로그아웃 또는 세션 만료 시 호출
    clearUser() {
      this.userId = ''
      this.userName = ''
      this.role = ''
      this.isLogin = false
    }
  }
})
