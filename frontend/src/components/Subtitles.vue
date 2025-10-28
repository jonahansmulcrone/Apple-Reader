<template>
  <div :style="captionContainerStyle">
    <div :style="captionTextStyle">
      {{ captionText }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type CSSProperties } from 'vue'

const captionText = ref('Lorem Ipsum')

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
  cursor: 'pointer',
  pointerEvents: 'auto',
  padding: '20px 40px',
  fontSize: '24px',
  textAlign: 'center',
  borderRadius: '8px',
  lineHeight: '1.4',
}
</script>