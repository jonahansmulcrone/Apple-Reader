import { createStore } from 'vuex'
import subtitles from './modules/subtitles'

export default createStore({
  modules: {
    subtitles
  }
})