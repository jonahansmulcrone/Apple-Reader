<template>
  <header>
    <h1>
      Apple Reader
    </h1>
  </header>

  <main>
    <button @click="parseSubtitles">Parse Subtitles</button>
  </main>
</template>

<script setup lang="ts">

// *********** Components ***********

// *********** Libraries ***********
import { ref } from 'vue'
import { YOUTUBE_VIDEO_ID_LENGTH } from './config/constants'

// *********** Computed ***********

// *********** Variables ***********
const url = ref('')
const videoId = ref('')

// *********** Methods ***********

const parseSubtitles = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    if (tabs.length > 0 && tabs[0]?.id) { 
      url.value = tabs[0].url || ''
      videoId.value = url.value.slice(YOUTUBE_VIDEO_ID_LENGTH)

      console.log(videoId.value, 'VIDEO ID')

      chrome.tabs.sendMessage(tabs[0].id, { 
        action: 'PARSE_SUBTITLES',
        videoId: videoId.value
      })
    }
  })
}
</script>

<style scoped>
header {
  line-height: 1.5;
}
</style>
