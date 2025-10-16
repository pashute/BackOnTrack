import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useConversationStore = defineStore('conversation', () => {
  // State
  const conversation = ref({
    id: null,
    startDate: null,
    activeBranchId: null,
    branchHistory: []
  })

  const currentBranch = ref(null)
  const messages = ref([])
  const highlights = ref([])

  // Actions
  function initializeConversation() {
    conversation.value = {
      id: Date.now().toString(),
      startDate: new Date().toISOString(),
      activeBranchId: 'main',
      branchHistory: [{
        id: 'main',
        name: 'Main Discussion',
        parentBranchId: null,
        messages: [],
        highlights: []
      }]
    }
    currentBranch.value = conversation.value.branchHistory[0]
  }

  function addMessage(message) {
    const newMessage = {
      id: Date.now().toString(),
      sender: message.sender,
      content: message.content,
      highlightRefId: message.highlightRefId || null,
      timestamp: new Date().toISOString()
    }
    messages.value.push(newMessage)
    currentBranch.value?.messages.push(newMessage)
  }

  function addHighlight(highlight) {
    const newHighlight = {
      id: Date.now().toString(),
      text: highlight.text,
      direction: highlight.direction, // 'Request' or 'Response'
      status: highlight.status || 'Planned', // 'Planned', 'Discussed', 'Current'
      info: highlight.info || [],
      orderIndex: highlights.value.length
    }
    highlights.value.push(newHighlight)
    currentBranch.value?.highlights.push(newHighlight)
  }

  function updateHighlightStatus(highlightId, status) {
    const highlight = highlights.value.find(h => h.id === highlightId)
    if (highlight) {
      highlight.status = status
    }
  }

  function createBranch(name, parentBranchId) {
    const newBranch = {
      id: Date.now().toString(),
      name,
      parentBranchId,
      messages: [],
      highlights: []
    }
    conversation.value.branchHistory.push(newBranch)
    conversation.value.activeBranchId = newBranch.id
    currentBranch.value = newBranch
    return newBranch
  }

  function switchBranch(branchId) {
    const branch = conversation.value.branchHistory.find(b => b.id === branchId)
    if (branch) {
      currentBranch.value = branch
      conversation.value.activeBranchId = branchId
      messages.value = [...branch.messages]
      highlights.value = [...branch.highlights]
    }
  }

  return {
    conversation,
    currentBranch,
    messages,
    highlights,
    initializeConversation,
    addMessage,
    addHighlight,
    updateHighlightStatus,
    createBranch,
    switchBranch
  }
})
