<!-- <template>
  <CContainer fluid class="chat-container">
    <CRow class="g-0">
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
</template> -->
<template>
  <div class="chat-container">
    <!-- Conversation List -->
    <div class="conversation-list">
  <div
    v-for="conv in conversations"
    :key="conv?.id"
    class="conversation-item"
    @click="selectConversation(conv.id)"
  >
    <p><strong>{{ conv.name }}</strong></p>
    <p class="last-message">{{ conv.last_message }}</p>
    <small>{{ new Date(conv.last_time).toLocaleString() }}</small>
  </div>
</div>


    <!-- Chat Window -->
    <div class="chat-window" v-if="selectedUserId">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="message"
        :class="{ 'own-message': msg.sender_id === currentUser }"
      >
        <div class="message-bubble">
          <p class="message-sender">
            {{ msg.sender_id === currentUser ? 'You' : msg.sender_name || msg.receiver_name }}
          </p>
          <p class="message-text">{{ msg.message.message }}</p>
          <p class="message-receiver">
            {{ msg.receiver_name }}
          </p>
        </div>
      </div>

      <!-- Input -->
      <div class="input-bar">
        <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Type a message..." />
        <button @click="sendMessage">Send</button>
      </div>
    </div>

    <div v-else class="chat-placeholder">
      <p>Select a conversation to start chatting.</p>
    </div>
  </div>
</template>

<script setup>
import echo from '@/js/echo.js'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const currentUser = authStore.user.id
const messages = ref([])
const newMessage = ref('')
const selectedUserId = ref(null)
const conversations = ref([])

onMounted(() => {
  fetchConversations()
  console.log(selectedUserId.value)

  echo.private(`chat.${currentUser}`).listen('MessageSent', (e) => {
    if (
      selectedUserId.value &&
      (e.message.sender_id === selectedUserId.value ||
        e.message.receiver_id === selectedUserId.value)
    ) {
      messages.value.push(e.message)
    }
  })
})

const fetchConversations = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/conversations', {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    console.log('CONVERSATIONS API RESPONSE:', res.data)
    conversations.value =  res.data 
  } catch (err) {
    console.error('Failed to fetch conversations:', err)
    conversations.value = []
  }
}

const selectConversation = async (userId) => {
  selectedUserId.value = userId
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/messages/${userId}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    messages.value = res.data
    console.log(messages.value)
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
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    )
    console.log(res.data)

    const message = res.data
    messages.value.push(message)
    newMessage.value = ''
    fetchConversations()
  } catch (err) {
    console.error('Failed to send message:', err)
  }
}
const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(date).toLocaleDateString(undefined, options)
}
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: 500px;
  max-width: 600px;
  margin: auto;
  border: 1px solid #ccc;
  border-radius: 12px;
  overflow: hidden;
  background-color: #f8faff;
}

.chat-window {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message {
  display: flex;
}

.message.own-message {
  justify-content: flex-end;
}

.message-bubble {
  max-width: 70%;
  background-color: #e1f0ff;
  padding: 10px 14px;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.message.own-message .message-bubble {
  background-color: #d6beda;
  text-align: right;
}

.message-sender {
  font-size: 12px;
  font-weight: bold;
  margin-bottom: 4px;
  color: #333;
}

.message-text {
  font-size: 14px;
  margin: 0;
  color: #222;
}

.input-bar {
  display: flex;
  padding: 12px;
  border-top: 1px solid #ccc;
  background-color: #fff;
}

.input-bar input {
  flex: 1;
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 20px;
  margin-right: 10px;
  outline: none;
}

.input-bar button {
  padding: 10px 20px;
  background-color: #5e548e;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.input-bar button:hover {
  background-color: #4a3b86;
}
</style>
