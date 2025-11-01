<template>
  <header>
    <h1>
      Apple Reader
    </h1>
  </header>

  <main>
    <button @click="getVideoId">Parse Video</button>

    <div v-if="url">{{ url }}</div>
    <div v-if="videoId">{{ videoId }}</div>
  </main>
</template>

<script setup lang="ts">

// *********** Components ***********

// *********** Libraries ***********
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

import { YOUTUBE_VIDEO_ID_LENGTH } from './config/constants'

// *********** Variables ***********
const store = useStore()

const url = ref('')
const videoId = ref('')

// *********** Methods ***********

const subtitles = computed(() => store.getters['subtitles/subtitles'])
const getSubtitlesForId = (videoId: string) => store.dispatch('subtitles/getSubtitlesForId', videoId)

const getVideoId = () => {
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    if (tabs.length > 0 && tabs[0]?.id) { 
      url.value = tabs[0].url || ''
      videoId.value = url.value.slice(YOUTUBE_VIDEO_ID_LENGTH)

      await getSubtitlesForId(videoId.value)

      chrome.tabs.sendMessage(tabs[0].id, { 
        action: 'setSubtitles',
        subtitles: subtitles.value
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
