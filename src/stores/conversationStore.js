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
  
  // Verification state
  const isVerifying = ref(true) // Start in verification mode
  const verificationConfirmed = ref(false)
  const proposedMainTopic = ref('')
  const proposedStages = ref([]) // array of { text }

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
    // Seed a default verification analysis (mock)
    proposedMainTopic.value = ''
    proposedStages.value = []
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
    return newHighlight
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

  // Verification API (mock)
  function analyzeForVerification(userText) {
    // Very simple mock analysis: infer a main topic and stages, not shown to user yet
    proposedMainTopic.value = 'Woodchuck question understanding'
    proposedStages.value = [
      { text: 'woodchuck info' },
      { text: 'biology' },
      { text: 'chucking ability' }
    ]
    // Return a verification prompt placeholder
    return `Verification: is this a question about the biology of the woodchuck animal? (Yes/No)`
  }

  function processVerificationReply(userText) {
    // If user confirms with a yes-like string, finalize
    const normalized = (userText || '').trim().toLowerCase()
    const yesValues = ['yes', 'y', 'correct', 'sure', 'ok', 'okay']
    if (yesValues.includes(normalized)) {
      verificationConfirmed.value = true
      isVerifying.value = false
      // Build highlights from proposed stages
      finalizeVerification()
      // Return next AI message indicating start of staged response
      const first = highlights.value[0]
      if (first) {
        updateHighlightStatus(first.id, 'Current')
        return { aiMessage: `Great, proceeding. Stage 1: ${first.text}.`, done: true }
      }
      return { aiMessage: 'Great, proceeding.', done: true }
    }
    // Otherwise continue offering clarifications (mock options)
    return { aiMessage: 'Do you mean: option1 (biology) or option2 (general info)?', done: false }
  }

  function finalizeVerification() {
    // Create highlights from proposedStages if not already
    if (highlights.value.length === 0 && proposedStages.value.length > 0) {
      proposedStages.value.forEach((s) => {
        addHighlight({ text: s.text, direction: 'Response', status: 'Planned' })
      })
    }
  }

  function advanceNextStage() {
    // Find current and planned
    const current = highlights.value.find(h => h.status === 'Current')
    if (current) {
      updateHighlightStatus(current.id, 'Discussed')
    }
    const next = highlights.value.find(h => h.status === 'Planned')
    if (next) {
      updateHighlightStatus(next.id, 'Current')
      return next
    }
    return null
  }

  return {
    conversation,
    currentBranch,
    messages,
    highlights,
    isVerifying,
    verificationConfirmed,
    proposedMainTopic,
    proposedStages,
    initializeConversation,
    addMessage,
    addHighlight,
    updateHighlightStatus,
    createBranch,
    switchBranch,
    analyzeForVerification,
    processVerificationReply,
    finalizeVerification,
    advanceNextStage
  }
})
