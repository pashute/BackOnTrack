<template>
  <aside class="flex flex-col h-full bg-white">
    <!-- Sidebar Header -->
    <div class="p-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-gray-800">Discussion Outline</h2>
      <p class="text-xs text-gray-500 mt-1">Track your conversation flow</p>
    </div>

    <!-- Branches and Highlights Tree -->
    <div class="flex-1 overflow-y-auto p-4">
      <div v-if="conversation.branchHistory.length === 0" class="text-center text-gray-400 mt-10">
        <p class="text-sm">No conversation started yet</p>
      </div>

      <!-- Branch Tree -->
      <div v-for="branch in conversation.branchHistory" :key="branch.id" class="mb-4">
        <BranchNode 
          :branch="branch" 
          :isActive="branch.id === conversation.activeBranchId"
          @switch-branch="switchToBranch"
        />
      </div>
    </div>

  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useConversationStore } from '../stores/conversationStore'
import BranchNode from './BranchNode.vue'

const conversationStore = useConversationStore()
const conversation = computed(() => conversationStore.conversation)

const switchToBranch = (branchId) => {
  conversationStore.switchBranch(branchId)
}
</script>
