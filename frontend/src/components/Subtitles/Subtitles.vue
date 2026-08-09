<template>
  <div :style="captionContainerStyle">
    <div :style="captionTextStyle" v-if="captionText.length">
      <div
        :style="captionWordStyle"
        v-for="(word, index) in captionText"
        :key="index"
        @click="processWord(word)"
        >
        {{ word }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// *********** Components ***********

// *********** Libraries ***********
import { computed, onUnmounted, ref, watch, type CSSProperties } from 'vue'
import { useStore } from 'vuex'

interface Subtitle {
  start: number
  duration: number
  subtitle: string
}

const store = useStore()
let syncInterval: number | null = null
let videoSearchAttempts = 0
const MAX_VIDEO_SEARCH_ATTEMPTS = 10

// *********** Variables ***********
const currentTime = ref(0)

// *********** Computed ***********
const subtitles = computed<Subtitle[]>(() => store.getters['subtitles/subtitles'] ?? [])

// The subtitle whose time range contains the video's current playback time.
const currentSubtitle = computed<Subtitle | null>(() => {
  return (
    subtitles.value.find(
      (sub) => currentTime.value >= sub.start && currentTime.value < sub.start + sub.duration
    ) ?? null
  )
})

const captionText = computed(() => {
  if (!currentSubtitle.value?.subtitle) {
    return []
  }

  return currentSubtitle.value.subtitle.split(/\s+/).filter(Boolean)
})

// *********** Life Cycle Hooks ***********

watch(subtitles, (newSubs) => {
  if (newSubs && newSubs.length > 0) {
    startVideoSync()
  }
})

onUnmounted(() => {
  if (syncInterval) clearInterval(syncInterval)
})

// *********** Methods ***********
const processWord = (word: string) => {
  console.log('Processing word: ', word)
}

const startVideoSync = () => {
  if (syncInterval) {
    clearInterval(syncInterval)
    syncInterval = null
  }

  const video: HTMLVideoElement | null = document.querySelector('video')

  if (!video) {
    // The captions can arrive before YouTube's video element has been
    // inserted into the DOM, so retry a few times before giving up.
    videoSearchAttempts++
    if (videoSearchAttempts <= MAX_VIDEO_SEARCH_ATTEMPTS) {
      setTimeout(startVideoSync, 500)
    } else {
      console.error('YouTube video element not found.')
    }
    return
  }

  syncInterval = window.setInterval(() => {
    currentTime.value = video.currentTime
  }, 200)
}

// *********** Styles ***********
const captionContainerStyle: CSSProperties = {
  position: 'absolute',
  bottom: '100px',
  left: '50%',
  transform: 'translateX(-50%)',
  zIndex: 99999,
  width: '80%',
  maxWidth: '1200px',
  pointerEvents: 'none',
}

const captionTextStyle: CSSProperties = {
  backgroundColor: 'rgba(0, 0, 0, 0.9)',
  color: 'white',
  padding: '20px 40px',
  fontSize: '24px',
  textAlign: 'center',
  borderRadius: '8px',
  lineHeight: '1.4',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'center',
  gap: '1rem',
}

const captionWordStyle: CSSProperties = {
  cursor: 'pointer',
  pointerEvents: 'auto',
}

</script>
