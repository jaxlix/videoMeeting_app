import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    identity: "", // 警种
    status: ""  // 状态
  },
  getters: {
    identity (state) {
      return state.identity
    },
    status (state) {
      return state.status
    }
  },
  mutations: {
    setIdentity(state, res){
      state.identity = res
    },
    setStatus(state, res){
      state.status = res
    }
  }
})
