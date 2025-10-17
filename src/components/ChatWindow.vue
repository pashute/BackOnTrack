<template>
  <div class="flex flex-col h-full">
    <!-- Messages Area -->
    <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4">
      <div v-if="messages.length === 0" class="text-center text-gray-500 mt-20">
        <p class="text-lg">Start a conversation...</p>
        <p class="text-sm mt-2">Type your question or request below</p>
      </div>

      <div
        v-for="message in messages"
        :key="message.id"
        :class="[
          'flex',
          message.sender === 'User' ? 'justify-end' : 'justify-start'
        ]"
      >
        <div
          :class="[
            'max-w-[70%] rounded-lg px-4 py-3 shadow-sm',
            message.sender === 'User'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-800 border border-gray-200'
          ]"
        >
          <p class="text-sm whitespace-pre-wrap">{{ message.content }}</p>
          <span class="text-xs opacity-70 mt-1 block">
            {{ formatTime(message.timestamp) }}
          </span>
        </div>
      </div>

      <!-- No typing indicator during mock verification flow -->
    </div>

    <!-- Input Area -->
    <div class="border-t border-gray-200 bg-white p-4">
      <div class="flex space-x-3">
        <input
          v-model="userInput"
          @keyup.enter="sendMessage"
          type="text"
          placeholder="Type your message..."
          class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          @click="sendMessage"
          :disabled="!userInput.trim()"
          class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          Send
        </button>
      </div>
      
      <!-- Quick Actions -->
      <div class="flex space-x-2 mt-3">
        <button
          @click="continueConversation"
          class="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
        >
          Continue
        </button>
        <button
          @click="goBack"
          class="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition"
        >
          Go Back
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, onMounted } from 'vue'
import { useConversationStore } from '../stores/conversationStore'

const conversationStore = useConversationStore()
const userInput = ref('')
const messagesContainer = ref(null)

const messages = conversationStore.messages

onMounted(() => {
  conversationStore.initializeConversation()
})

const sendMessage = async () => {
  if (!userInput.value.trim()) return

  // Add user message
  conversationStore.addMessage({
    sender: 'User',
    content: userInput.value
  })

  const userMessage = userInput.value
  userInput.value = ''

  // Scroll to bottom
  await nextTick()
  scrollToBottom()

  // Verification-first logic
  if (conversationStore.isVerifying) {
    // First time or during verification: produce/continue verification prompt
    let aiText
    if (!conversationStore.verificationConfirmed && conversationStore.proposedStages.length === 0) {
      // Initial analysis step -> propose main topic + stages (not shown), return a verification question
      aiText = conversationStore.analyzeForVerification(userMessage)
    } else {
      // Process the user's verification reply
      const result = conversationStore.processVerificationReply(userMessage)
      aiText = result.aiMessage
    }
    conversationStore.addMessage({ sender: 'AI', content: aiText })
    await nextTick()
    scrollToBottom()
    return
  }

  // Post-verification: staged responses
  const current = conversationStore.highlights.find(h => h.status === 'Current')
  if (current) {
    // Respond for the current stage (mock placeholder)
    conversationStore.addMessage({
      sender: 'AI',
      content: `Answer for stage: ${current.text}. (mock content)`
    })
    await nextTick(); scrollToBottom()
  }
}

const continueConversation = () => {
  // During verification, continue prompts
  if (conversationStore.isVerifying) {
    conversationStore.addMessage({ sender: 'User', content: '[Continue Verification]' })
    const result = conversationStore.processVerificationReply('')
    conversationStore.addMessage({ sender: 'AI', content: result.aiMessage })
    return
  }
  // After verification, advance to next stage and answer it
  const next = conversationStore.advanceNextStage()
  if (next) {
    conversationStore.addMessage({ sender: 'AI', content: `Stage: ${next.text}. (mock content)` })
  }
}

const goBack = () => {
  conversationStore.addMessage({
    sender: 'User',
    content: '[Go Back]'
  })
  // Will trigger branch navigation
}

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}
</script>
