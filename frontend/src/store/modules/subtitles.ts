import * as t from '../mutations'

export default {
  namespaced: true,
  
  state: {
    subtitles: []
  },
  
  getters: {
    subtitles: (state: any) => state.subtitles
  },

  actions: {
    async getSubtitlesForId({ commit }: any, videoId: string) {
      chrome.runtime.sendMessage(
        { action: "FETCH_SUBTITLES", videoId }, 
        (response) => {
          if (response?.success) {
            commit(t.SET_SUBTITLES, response.data.subtitles)
          } else {
            console.error("Failed to fetch subtitles:", response?.error)
          }
        }
      )
    }
  },

  mutations: {
    [t.SET_SUBTITLES](state: any, subtitles: any) {
        state.subtitles = subtitles
    }
  }
}