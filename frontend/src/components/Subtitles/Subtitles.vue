<template>
  <div :style="captionContainerStyle">
    <div :style="captionTextStyle" v-if="subtitles.length">
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
import { computed, onMounted, ref, type CSSProperties } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

// *********** Computed ***********
const subtitles: any = computed(() => {
  const subs = store.getters['subtitles/subtitles']
  return subs
})

// *********** Variables ***********
const captionText = computed(() => {
  if (!subtitles.value || subtitles.value.length === 0) {
    return []
  }
  
  const firstValidSubtitle = subtitles.value.find((sub: any) => sub.subtitle !== null)
  
  if (!firstValidSubtitle || !firstValidSubtitle.subtitle) {
    console.log('No valid subtitle found')
    return []
  }
  
  return firstValidSubtitle.subtitle.split(' ')
})
// *********** Life Cycle Hooks ***********


// *********** Methods ***********
const processWord = (word: string) => {
  console.log('Processing word: ', word)
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
  gap: '1rem',
}

const captionWordStyle: CSSProperties = {
  cursor: 'pointer',
  pointerEvents: 'auto',
}

</script>