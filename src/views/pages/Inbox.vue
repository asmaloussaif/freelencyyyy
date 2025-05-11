<template>
  <div class="chat-app">
    <!-- Sidebar with conversations -->
    <div class="conversation-sidebar">
      <div class="sidebar-header">
        <h3>Messages</h3>
        <button class="new-chat-btn">
          <i class="fas fa-plus"></i> New Chat
        </button>
      </div>
      
      <div class="conversation-list">
        <div
          v-for="conv in conversations"
          :key="conv?.id"
          class="conversation-item"
          :class="{ active: selectedUserId === conv.id }"
          @click="selectConversation(conv.id)"
        >
          <div class="conversation-avatar">
            <span>{{ getInitials(conv.name) }}</span>
          </div>
          <div class="conversation-details">
            <div class="conversation-header">
              <strong>{{ conv.name }}</strong>
              <span class="time">{{ formatTime(conv.last_time) }}</span>
            </div>
            <p class="last-message">{{ truncate(conv.last_message, 30) }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main chat area -->
    <div class="chat-main">
      <div v-if="selectedUserId" class="chat-window">
        <!-- Chat header -->
        <div class="chat-header">
          <div class="user-info">
            <div class="user-avatar">
              {{ getInitials(getCurrentConversation()?.name || '') }}
            </div>
            <div>
              <h4>{{ getCurrentConversation()?.name }}</h4>
              <small class="status">Online</small>
            </div>
          </div>
        </div>

        <!-- Messages container -->
        <div class="messages-container">
          <div
            v-for="(msg, index) in messages"
            :key="msg.id"
            class="message-wrapper"
            :class="{ 'sent': msg.sender_id === currentUser, 'received': msg.sender_id !== currentUser }"
          >
            <div class="message-meta" v-if="shouldShowMeta(messages, index)">
              <span class="sender-name">
                {{ msg.sender_id === currentUser ? 'You' : msg.sender_name || msg.receiver_name }}
              </span>
              <span class="message-time">{{ formatTime(msg.message.created_at) }}</span>
            </div>
            <div class="message-bubble">
              {{ msg.message.message }}
            </div>
          </div>
        </div>

        <!-- Message input -->
        <div class="message-input">
          <div class="input-group">
            <button class="attachment-btn">
              <i class="fas fa-paperclip"></i>
            </button>
            <input
              v-model="newMessage"
              @keyup.enter="sendMessage"
              placeholder="Type a message..."
              class="message-text-input"
            />
            <button @click="sendMessage" class="send-btn">
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="empty-chat">
        <div class="empty-icon">
          <i class="fas fa-comments"></i>
        </div>
        <h3>No conversation selected</h3>
        <p>Choose a conversation from the sidebar or start a new chat</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import echo from '@/js/echo.js'

const authStore = useAuthStore()
const currentUser = authStore.user.id
const messages = ref([])
const newMessage = ref('')
const selectedUserId = ref(null)
const conversations = ref([])

// Helper functions
const getInitials = (name) => {
  if (!name) return ''
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const truncate = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

const formatTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const shouldShowMeta = (messages, index) => {
  if (index === 0) return true
  const prevMsg = messages[index - 1]
  const currentMsg = messages[index]
  return prevMsg.sender_id !== currentMsg.sender_id
}

const getCurrentConversation = () => {
  return conversations.value.find(c => c.id === selectedUserId.value)
}

// API calls
const fetchConversations = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/conversations', {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    conversations.value = res.data
  } catch (err) {
    console.error('Failed to fetch conversations:', err)
    conversations.value = []
  }
}

const selectConversation = async (userId) => {
  selectedUserId.value = userId
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/messages/${userId}`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    messages.value = res.data
  } catch (err) {
    console.error('Failed to fetch messages:', err)
  }
}

const sendMessage = async () => {
  if (!newMessage.value.trim()) return

  try {
    const res = await axios.post(
      'http://127.0.0.1:8000/api/messages',
      {
        message: newMessage.value,
        receiver_id: selectedUserId.value,
      },
      { headers: { Authorization: `Bearer ${authStore.token}` } }
    )
    
    messages.value.push(res.data)
    newMessage.value = ''
    fetchConversations()
  } catch (err) {
    console.error('Failed to send message:', err)
  }
}

// Initialize
onMounted(() => {
  fetchConversations()

  echo.private(`chat.${currentUser}`).listen('MessageSent', (e) => {
    if (selectedUserId.value && 
        (e.message.sender_id === selectedUserId.value || 
         e.message.receiver_id === selectedUserId.value)) {
      messages.value.push(e.message)
    }
  })
})
</script>

<style scoped>
.chat-app {
  display: flex;
  height: 100vh;
  background-color: #f5f7fb;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.conversation-sidebar {
  width: 350px;
  background-color: white;
  border-right: 1px solid #e1e4e8;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  padding: 16px 20px;
  border-bottom: 1px solid #e1e4e8;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.new-chat-btn {
  background: none;
  border: none;
  color: #5e548e;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 5px;
}

.conversation-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  padding: 12px 16px;
  display: flex;
  gap: 12px;
  cursor: pointer;
  border-bottom: 1px solid #f0f2f5;
  transition: background-color 0.2s;
}

.conversation-item:hover {
  background-color: #f5f7fb;
}

.conversation-item.active {
  background-color: #e8f0fe;
}

.conversation-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #5e548e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.conversation-details {
  flex: 1;
  min-width: 0;
}

.conversation-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.conversation-header strong {
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.conversation-header .time {
  font-size: 12px;
  color: #666;
}

.last-message {
  font-size: 13px;
  color: #666;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chat-window {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fb;
}

.chat-header {
  padding: 12px 20px;
  background-color: white;
  border-bottom: 1px solid #e1e4e8;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #5e548e;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
}

.user-info h4 {
  margin: 0;
  font-size: 16px;
}

.status {
  color: #666;
  font-size: 12px;
}

.messages-container {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.message-wrapper {
  display: flex;
  flex-direction: column;
}

.message-wrapper.sent {
  align-items: flex-end;
}

.message-wrapper.received {
  align-items: flex-start;
}

.message-meta {
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.sender-name {
  font-size: 12px;
  font-weight: bold;
  color: #333;
}

.message-time {
  font-size: 11px;
  color: #999;
}

.message-bubble {
  max-width: 70%;
  padding: 10px 14px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.4;
  position: relative;
}

.message-wrapper.sent .message-bubble {
  background-color: #5e548e;
  color: white;
  border-top-right-radius: 4px;
}

.message-wrapper.received .message-bubble {
  background-color: white;
  color: #333;
  border-top-left-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-input {
  padding: 12px 20px;
  background-color: white;
  border-top: 1px solid #e1e4e8;
}

.input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.message-text-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #ddd;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
}

.message-text-input:focus {
  border-color: #5e548e;
}

.attachment-btn, .send-btn {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background-color: transparent;
  color: #666;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn {
  color: #5e548e;
}

.send-btn:hover {
  background-color: #f0f2f5;
}

.empty-chat {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: #666;
}

.empty-icon {
  font-size: 48px;
  color: #ccc;
  margin-bottom: 16px;
}

.empty-chat h3 {
  margin: 0 0 8px;
  font-size: 18px;
}

.empty-chat p {
  margin: 0;
  font-size: 14px;
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>