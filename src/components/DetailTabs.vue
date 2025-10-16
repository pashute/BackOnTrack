<template>
  <aside class="flex flex-col h-full bg-white">
    <!-- Tabs Header -->
    <div class="border-b border-gray-200">
      <div class="flex overflow-x-auto">
        <div
          v-for="tab in tabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'px-4 py-3 text-sm font-medium border-b-2 transition whitespace-nowrap',
            activeTab === tab.id
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-800'
          ]"
          role="tab"
          tabindex="0"
        >
          {{ tab.title }}
          <button
            @click.stop="closeTab(tab.id)"
            class="ml-2 text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="currentTabContent" v-html="currentTabContent" class="prose prose-sm max-w-none"></div>
      <div v-else class="text-center text-gray-400 mt-10">
        <p class="text-sm">No detailed information available</p>
      </div>
    </div>

    <!-- Close All Button -->
    <div class="p-4 border-t border-gray-200">
      <button
        @click="closeAllTabs"
        class="w-full px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
      >
        Close All Tabs
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'

// Mock tabs data (will be populated from store/API)
const tabs = ref([
  {
    id: '1',
    title: 'Example Detail',
    content: '<h2>Detailed Information</h2><p>This is where detailed, offline-readable information will be displayed in HTML format with links to sources.</p>'
  }
])

const activeTab = ref(tabs.value[0]?.id || null)

const currentTabContent = computed(() => {
  const tab = tabs.value.find(t => t.id === activeTab.value)
  return tab?.content || null
})

const closeTab = (tabId) => {
  const index = tabs.value.findIndex(t => t.id === tabId)
  if (index !== -1) {
    tabs.value.splice(index, 1)
    if (activeTab.value === tabId && tabs.value.length > 0) {
      activeTab.value = tabs.value[0].id
    }
  }
}

const closeAllTabs = () => {
  tabs.value = []
  activeTab.value = null
}
</script>

<style scoped>
@reference "tailwindcss";
/* Prose styling for HTML content */
.prose h2 {
  @apply text-xl font-bold text-gray-800 mb-3;
}

.prose p {
  @apply text-gray-700 mb-2;
}

.prose a {
  @apply text-blue-600 hover:underline;
}

.prose ul {
  @apply list-disc list-inside mb-2;
}
</style>
