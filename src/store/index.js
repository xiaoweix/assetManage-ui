import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    // 存储token
    token: sessionStorage.getItem('token') ? sessionStorage.getItem('token') : '',
    userEmail: sessionStorage.getItem('userEmail'),
    userCode: sessionStorage.getItem('userCode')
  },
  mutations: {
    // 修改token，并将token存入sessionStorage
    changeLogin (state, user) {
      state.token = user.token
      state.userEmail = user.userEmail
      state.userCode = user.userCode
      sessionStorage.setItem('token', user.token)
      sessionStorage.setItem('userEmail', user.userEmail)
      sessionStorage.setItem('userCode', user.userCode)
    }
  }
})

export default store
