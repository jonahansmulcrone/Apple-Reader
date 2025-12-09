import Subtitles from './components/Subtitles/Subtitles.vue'
import { createApp } from 'vue'
import store from './store'

console.log('Apple Reader Content Script Loaded!')

let appMounted = false

chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "PARSE_SUBTITLES") {    
    store.dispatch("subtitles/getSubtitlesForId", msg.videoId)
  }
})

const injectVueComponent = () => {
    if (appMounted) {
        return
    }

    const subsParentNode = document.querySelector('.ytp-caption-window-container')
    if (!subsParentNode) {
        console.log('Captions Container Not Found')
        return
    }
    
    try {
        const youtubeCaption = document.querySelector('#caption-window-1')
        if (youtubeCaption) {
            youtubeCaption.remove()
            console.log('Removed YouTube Captions')
        }
        
        if (document.querySelector('#my-vue-extension-app')) {
            return
        }
        
        const container = document.createElement('div')
        container.id = 'custom-subtitles'
        
        subsParentNode.appendChild(container)
    
        const app = createApp(Subtitles)
        app.use(store)
        app.mount(container)
        
        appMounted = true
        console.log('Vue component mounted!')
    } catch (error) {
        console.error('Error:', error)
    }
}

const observer = new MutationObserver(() => {
    const youtubeCaption = document.querySelector('#caption-window-1')
    if (youtubeCaption && appMounted) {
        youtubeCaption.remove()
    }
    
    if (!appMounted) {
        injectVueComponent()
    }
})

const startObserving = () => {
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        })
        
        injectVueComponent()
        setTimeout(injectVueComponent, 2000)
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startObserving)
} else {
    startObserving()
}

console.log('Apple Reader Successfully Setup!')