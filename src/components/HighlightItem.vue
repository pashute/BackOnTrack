<template>
  <div
    @mouseenter="showInfo = true"
    @mouseleave="showInfo = false"
    :class="[
      'relative p-2 rounded text-sm transition',
      statusClasses
    ]"
  >
    <!-- Highlight Text -->
    <div class="flex items-center space-x-2">
      <!-- Status Icon -->
      <span class="flex-shrink-0">
        <svg v-if="highlight.status === 'Discussed'" class="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <svg v-else-if="highlight.status === 'Current'" class="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clip-rule="evenodd" />
        </svg>
        <svg v-else class="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z" clip-rule="evenodd" />
        </svg>
      </span>

      <!-- Highlight Headline -->
      <span class="flex-1">{{ highlight.text }}</span>

      <!-- Direction Badge -->
      <span
        :class="[
          'text-xs px-2 py-0.5 rounded',
          highlight.direction === 'Request' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
        ]"
      >
        {{ highlight.direction }}
      </span>
    </div>

    <!-- Info Tooltip (shown on hover) -->
    <div
      v-if="showInfo && highlight.info && highlight.info.length > 0"
      class="absolute left-0 top-full mt-1 z-10 bg-gray-800 text-white text-xs rounded p-2 shadow-lg max-w-xs"
    >
      <p class="font-semibold mb-1">Reconstruction Info:</p>
      <ul class="list-disc list-inside space-y-0.5">
        <li v-for="(item, index) in highlight.info" :key="index">{{ item }}</li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  highlight: {
    type: Object,
    required: true
  }
})

const showInfo = ref(false)

const statusClasses = computed(() => {
  switch (props.highlight.status) {
    case 'Discussed':
      return 'bg-green-50 text-green-800 border-l-2 border-green-500'
    case 'Current':
      return 'bg-blue-100 text-blue-900 border-l-4 border-blue-600 font-semibold text-base'
    case 'Planned':
      return 'bg-gray-50 text-gray-600 border-l-2 border-gray-300'
    default:
      return 'bg-gray-50 text-gray-600'
  }
})
</script>
