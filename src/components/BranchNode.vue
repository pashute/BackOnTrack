<template>
  <div class="branch-node">
    <!-- Branch Header -->
    <div
      @click="toggleCollapse"
      :class="[
        'flex items-center justify-between p-2 rounded cursor-pointer hover:bg-gray-100 transition',
        isActive ? 'bg-blue-50 border-l-4 border-blue-600' : ''
      ]"
    >
      <div class="flex items-center space-x-2 flex-1">
        <!-- Collapse/Expand Icon -->
        <svg
          :class="['w-4 h-4 transition-transform', collapsed ? '' : 'rotate-90']"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        
        <!-- Branch Name -->
        <span :class="['text-sm font-medium', isActive ? 'text-blue-700' : 'text-gray-700']">
          {{ branch.name }}
        </span>
      </div>

      <!-- Highlight Count Badge -->
      <span class="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded-full">
        {{ branch.highlights.length }}
      </span>
    </div>

    <!-- Highlights List (collapsible) -->
    <div v-if="!collapsed" class="ml-6 mt-2 space-y-1">
      <HighlightItem
        v-for="highlight in branch.highlights"
        :key="highlight.id"
        :highlight="highlight"
      />
      
      <div v-if="branch.highlights.length === 0" class="text-xs text-gray-400 italic py-2">
        No highlights yet
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import HighlightItem from './HighlightItem.vue'

const props = defineProps({
  branch: {
    type: Object,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['switch-branch'])

const collapsed = ref(false)

const toggleCollapse = () => {
  collapsed.value = !collapsed.value
  if (!collapsed.value && !props.isActive) {
    emit('switch-branch', props.branch.id)
  }
}
</script>
