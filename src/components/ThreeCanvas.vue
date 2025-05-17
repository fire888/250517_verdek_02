<template>
  <div ref="threeWrapper"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { createThreeViewer } from '../threeViewer/threeViewer.ts'   // &laquo;@&raquo; – alias src/

const threeWrapper = ref<HTMLElement | null>(null)
let cleanup: (() => void) | null = null

onMounted(() => {
  if (threeWrapper.value) {
    const { deattachThreeCanvas } = createThreeViewer(threeWrapper.value)
    cleanup = deattachThreeCanvas
  }
})

onBeforeUnmount(() => {
  cleanup?.()
})
</script>

<style scoped>
div { 
  width: 100vw; 
  height: 100vh; 
  display: block; 
  margin: 0;
  padding: 0;
}
</style>