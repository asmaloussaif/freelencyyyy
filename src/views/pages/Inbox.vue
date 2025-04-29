<template>
  <CContainer fluid class="chat-container">
    <CRow class="g-0">
      <!-- Chat List Sidebar - Blue -->
      <CCol md="4" class="border-end vh-100 overflow-auto sidebar">
        <div class="p-3 border-bottom d-flex justify-content-between align-items-center sidebar-header">
          <h5 class="mb-0 text-dark">Messages</h5>
          <CButton size="sm" color="light" variant="outline" class="new-chat-btn">
            <CIcon name="cil-plus" class="me-1" /> New Chat
          </CButton>
        </div>

        <CListGroup flush class="chat-list">
          <CListGroupItem
            v-for="chat in chats"
            :key="chat.id"
            :active="selectedChat?.id === chat.id"
            @click="selectChat(chat)"
            class="d-flex align-items-center chat-item"
          >
            <CAvatar :src="chat.avatar" size="md" class="me-3" status="success" />
            <div class="chat-info">
              <div class="d-flex justify-content-between">
                <strong class="chat-name">{{ chat.name }}</strong>
                <small class="chat-time">{{ formatLastMessageTime(chat.lastMessageTime) }}</small>
              </div>
              <div class="small chat-preview">{{ chat.lastMessage }}</div>
            </div>
          </CListGroupItem>
        </CListGroup>
      </CCol>

      <!-- Message Content Area -->
      <CCol md="8" class="vh-100 d-flex flex-column chat-content">
        <div v-if="selectedChat" class="border-bottom p-3 d-flex align-items-center chat-header">
          <CAvatar :src="selectedChat.avatar" size="lg" class="me-3" status="success" />
          <div class="flex-grow-1">
            <h6 class="mb-0">{{ selectedChat.name }}</h6>
            <small class="text-muted">{{ selectedChat.status || 'Online' }}</small>
          </div>
        </div>

        <div v-if="selectedChat" class="flex-grow-1 overflow-auto p-3 messages-container">
          <div class="text-center my-3">
            <CBadge color="secondary" shape="rounded-pill">
              {{ formatMessageDate(selectedChat.messages[0].timestamp) }}
            </CBadge>
          </div>
          <div v-for="message in selectedChat.messages" :key="message.id" class="message-wrapper">
            <div
              :class="[ 
                'message-bubble',
                message.sender === currentUser ? 'sent' : 'received'
              ]"
            >
              <div class="message-content">{{ message.text }}</div>
              <div class="message-time">{{ message.timestamp }}</div>
            </div>
          </div>
        </div>

        <!-- Chat Input -->
        <div v-if="selectedChat" class="border-top p-3 chat-input-container">
          <div class="d-flex align-items-center">
            <CButton color="link" class="text-muted me-2">
              <CIcon name="cil-paperclip" />
            </CButton>
            <CFormInput
              v-model="newMessage"
              placeholder="Type a message..."
              class="flex-grow-1 message-input"
              @keyup.enter="sendMessage"
            />
            <CButton color="primary" class="ms-2 send-btn" @click="sendMessage">
              <CIcon name="cil-send" />
            </CButton>
          </div>
        </div>

        <!-- Placeholder when no chat is selected -->
        <div v-else class="flex-grow-1 d-flex flex-column justify-content-center align-items-center empty-chat">
          <div class="empty-chat-icon mb-3">
            <CIcon name="cil-chat-bubble" size="3xl" />
          </div>
          <h4 class="text-muted mb-2">Select a conversation</h4>
          <p class="text-muted text-center">Start chatting with your contacts or colleagues</p>
        </div>
      </CCol>
    </CRow>
  </CContainer>
</template>

<script setup>
import { ref } from 'vue'

const currentUser = 'You'
const chats = ref([
  {
    id: 1,
    name: 'Jungkook 💜',
    avatar: 'https://i.imgur.com/3GvwNBf.jpg',
    lastMessage: 'I purple you 💜',
    lastMessageTime: new Date(),
    status: 'Online',
    messages: [
      { id: 1, sender: 'Jungkook 💜', text: 'Annyeong Asma!', timestamp: '10:00 AM' },
      { id: 2, sender: 'You', text: 'Hey Jungkook 😭💜', timestamp: '10:01 AM' },
      { id: 3, sender: 'Jungkook 💜', text: 'How are you doing today? I was thinking about our last conversation.', timestamp: '10:02 AM' },
      { id: 4, sender: 'You', text: 'I\'m doing great! Just working on some projects. What about you?', timestamp: '10:05 AM' },
      { id: 5, sender: 'Jungkook 💜', text: 'I purple you 💜', timestamp: '10:10 AM' },
    ],
  },
  {
    id: 2,
    name: 'Client - Sarah Smith',
    avatar: 'https://i.pravatar.cc/150?img=5',
    lastMessage: 'Thank you for the delivery!',
    lastMessageTime: new Date(Date.now() - 86400000),
    status: 'Last seen today at 2:45 PM',
    messages: [
      { id: 1, sender: 'Sarah Smith', text: 'Great job on the project!', timestamp: 'Yesterday' },
      { id: 2, sender: 'You', text: 'Thank you! I appreciate your feedback.', timestamp: 'Yesterday' },
      { id: 3, sender: 'Sarah Smith', text: 'The design is exactly what we were looking for.', timestamp: 'Yesterday' },
      { id: 4, sender: 'Sarah Smith', text: 'Thank you for the delivery!', timestamp: '2:45 PM' },
    ],
  },
])

const selectedChat = ref(null)
const newMessage = ref('')

const selectChat = (chat) => {
  selectedChat.value = chat
  newMessage.value = ''
}

const sendMessage = () => {
  if (newMessage.value.trim() !== '') {
    selectedChat.value.messages.push({
      id: Date.now(),
      sender: currentUser,
      text: newMessage.value,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    })
    selectedChat.value.lastMessage = newMessage.value
    selectedChat.value.lastMessageTime = new Date()
    newMessage.value = ''
  }
}

const formatLastMessageTime = (date) => {
  if (!date) return ''
  const now = new Date()
  const diff = now - date
  const diffInHours = diff / (1000 * 60 * 60)
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  } else if (diffInHours < 48) {
    return 'Yesterday'
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }
}

const formatMessageDate = (timestamp) => {
  if (timestamp.includes('Yesterday')) return 'Yesterday'
  return 'Today'
}
</script>

<style scoped>
/* Base Styles */
.chat-container {
  background: linear-gradient(135deg, #E6F4FE 0%, #D0E7FF 100%);
  height: 100vh;
}

.vh-100 {
  height: 100vh;
}

/* Blue Sidebar Styles */
.sidebar {
  background: linear-gradient(to bottom, #F0F8FF, #E1F0FF);
  border-right: 1px solid #ADE1FB;
}

.sidebar-header {
  background: rgba(225, 240, 255, 0.8);
  border-color: #ADE1FB !important;
}

.new-chat-btn {
  border-color: #ADE1FB;
  color: #266CA9;
  background: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
}

.new-chat-btn:hover {
  background: rgba(255, 255, 255, 0.9);
  border-color: #266CA9;
}

.chat-list {
  background: transparent;
}

.chat-item {
  background: transparent;
  border-color: #E1F0FF !important;
  transition: all 0.2s ease;
}

.chat-item:hover {
  background: rgba(173, 225, 251, 0.3);
}

.chat-item.active {
  background: rgba(173, 225, 251, 0.5);
  border-left: 3px solid #266CA9;
}

.chat-name {
  color: #041D56;
}

.chat-preview {
  color: #266CA9;
}

.chat-time {
  color: #7D9FC7;
}

/* Chat Content Styles */
.chat-content {
  background: url('https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80') no-repeat center center;
  background-size: cover;
  position: relative;
}

.chat-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(240, 248, 255, 0.85);
  backdrop-filter: blur(2px);
}

.chat-header {
  background: white;
  z-index: 1;
  box-shadow: 0 2px 10px rgba(38, 108, 169, 0.1);
}

.messages-container {
  position: relative;
  z-index: 1;
  background: transparent;
  padding-bottom: 20px;
}

.message-wrapper {
  display: flex;
  margin-bottom: 12px;
}

.message-bubble {
  max-width: 70%;
  padding: 12px 15px;
  border-radius: 18px;
  position: relative;
  box-shadow: 0 2px 4px rgba(38, 108, 169, 0.1);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.message-bubble.sent {
  background: linear-gradient(to right, #266CA9 0%, #0F2573 100%);
  color: white;
  margin-left: auto;
  border-bottom-right-radius: 4px;
}

.message-bubble.received {
  background: white;
  color: #041D56;
  margin-right: auto;
  border-bottom-left-radius: 4px;
  border: 1px solid #ADE1FB;
}

.message-content {
  word-wrap: break-word;
}

.message-time {
  font-size: 0.75rem;
  opacity: 0.8;
  text-align: right;
  margin-top: 4px;
}

.message-bubble.received .message-time {
  color: #266CA9;
}

.message-bubble.sent .message-time {
  color: rgba(255, 255, 255, 0.8);
}

/* Chat Input Styles */
.chat-input-container {
  background: white;
  z-index: 1;
  box-shadow: 0 -2px 10px rgba(38, 108, 169, 0.1);
}

.message-input {
  border-radius: 20px;
  border: 1px solid #ADE1FB;
  padding: 10px 15px;
  transition: all 0.3s ease;
}

.message-input:focus {
  border-color: #266CA9;
  box-shadow: 0 0 0 0.2rem rgba(38, 108, 169, 0.25);
}

.send-btn {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: #266CA9;
  color: white;
}

.send-btn:hover {
  background: #1D5A9B;
}

/* Empty Chat State */
.empty-chat {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 20px;
}

.empty-chat-icon {
  color: #ADE1FB;
  font-size: 4rem;
}

/* Responsive Adjustments */
@media (max-width: 768px) {
  .sidebar {
    position: absolute;
    width: 100%;
    z-index: 10;
    display: none;
  }
  
  .sidebar.show {
    display: block;
  }
  
  .chat-content {
    width: 100%;
  }
}
</style>