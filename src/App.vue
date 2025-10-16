<template>
  <div class="h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
      <h1 class="text-2xl font-bold text-gray-800">BackOnTrack 💬</h1>
      <p class="text-sm text-gray-600">Conversational State Manager</p>
    </header>

    <!-- Main Content Area -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Outline Sidebar -->
      <OutlineSidebar 
        :class="{'hidden': !sidebarVisible, 'block': sidebarVisible}"
        class="w-80 border-r border-gray-200 bg-white lg:block"
      />

      <!-- Chat Window -->
      <main class="flex-1 flex flex-col">
        <ChatWindow />
      </main>

      <!-- Detail Tabs Container (initially hidden, shown when detailed info is requested) -->
      <DetailTabs 
        v-if="hasDetailTabs"
        class="w-96 border-l border-gray-200 bg-white"
      />
    </div>

    <!-- Mobile Sidebar Toggle -->
    <button
      @click="toggleSidebar"
      class="lg:hidden fixed bottom-4 left-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
    >
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useConversationStore } from './stores/conversationStore'
import OutlineSidebar from './components/OutlineSidebar.vue'
import ChatWindow from './components/ChatWindow.vue'
import DetailTabs from './components/DetailTabs.vue'

const conversationStore = useConversationStore()
const sidebarVisible = ref(false)
const hasDetailTabs = ref(false) // Will be controlled by store when detail info is requested

const toggleSidebar = () => {
  sidebarVisible.value = !sidebarVisible.value
}
</script>
