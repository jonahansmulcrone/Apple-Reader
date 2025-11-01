import * as t from '../mutations'
import axios from 'axios'

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
        try {
            const response = await axios.get(`http://localhost:3000/subtitles/${videoId}`)
            console.log(response, 'Rails Server Response: ', response)
            commit(t.SET_SUBTITLES, response.data)
        } catch (error) {
            console.error('An error occurred fetching subtitles: ', error)
        }
    }
  },

  mutations: {
    [t.SET_SUBTITLES](state: any, subtitles: any) {
        state.subtitles = subtitles
        console.log('Subtitles have been set in state: ', state.subtitles)
    }
  }
}