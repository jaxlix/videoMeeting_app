import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    identity: "", // 警种
    status: "",  // 状态
    checked: {},  // 选中列表，id为键名
    meetingWsConnected: false,

  },
  getters: {
    identity (state) {
      return state.identity
    },
    status (state) {
      return state.status
    },
    checked (state) {
      return state.checked
    },
    meetingWsConnected(state) {
      return state.meetingWsConnected
    },
  },
  mutations: {
    setIdentity(state, res){
      state.identity = res
    },
    setStatus(state, res){
      state.status = res
    },
    setChecked(state, res) {
      state.checked = res
    },
    setMeetingWsConnected(state, res) {
      state.meetingWsConnected = res
    },
  }
})
