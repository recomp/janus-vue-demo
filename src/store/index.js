import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersistence from 'vuex-persist'

Vue.use(Vuex)

const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  reducer: (state) => ({ RTSPServerList: state.RTSPServerList }),
})

export default new Vuex.Store({
  state: {
    logs: {
      info: [],
      error: [],
      debug: []
    },
    activeRTSPUrl: 'rtsp://camproxy.ru:8554/bars',
    RTSPServerList: []
  },
  getters: {
    logs: state => {
      return state.logs;
    },
    RTSPServerList: state => {
      return state.RTSPServerList;
    },
  },
  mutations: {
    SET_LOG(state, value) {
      state.logs[value.type].push({message: value.message, type: value.type})
    },
    SET_RTSP_SERVER_LIST(state, server) {
      state.activeRTSPUrl = server
      if (!state.RTSPServerList.includes(server)) {
        state.RTSPServerList.push(server)
      }
    },
    CLEAR_RTSP_SERVER_LIST(state, server) {
      state.RTSPServerList = []
    },
    CLEAR_LOGS(state) {
      state.logs = []
    },
  },
  actions: {
    // GET_LAST_RTSP_SERVER()
  },
  plugins: [vuexLocal.plugin]
})
