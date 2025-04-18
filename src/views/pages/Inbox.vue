<template>
  <CContainer fluid class="mt-4">
    <CCard class="shadow">
      <CCardHeader class="d-flex justify-content-between align-items-center bg-light py-3">
        <div>
          <CIcon name="cil-inbox" class="me-2" />
          <strong class="h4">Inbox</strong>
          <CBadge color="primary" class="ms-2">{{ unreadCount }} unread</CBadge>
        </div>
        <div>
          <CButton color="primary" size="sm" @click="composeNew" class="me-2">
            <CIcon name="cil-pencil" class="me-1" />
            New Message
          </CButton>
          <CButton color="secondary" size="sm" variant="outline" @click="refreshInbox">
            <CIcon name="cil-reload" class="me-1" />
            Refresh
          </CButton>
        </div>
      </CCardHeader>
      
      <CCardBody class="p-0">
        <div class="table-responsive">
          <CTable hover striped bordered class="mb-0">
            <CTableHead class="table-light">
              <CTableRow>
                <CTableHeaderCell scope="col" width="40">
                  <CFormCheck />
                </CTableHeaderCell>
                <CTableHeaderCell scope="col" width="120">From</CTableHeaderCell>
                <CTableHeaderCell scope="col">Subject</CTableHeaderCell>
                <CTableHeaderCell scope="col" width="120">Date</CTableHeaderCell>
                <CTableHeaderCell scope="col" width="80">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow 
                v-for="message in filteredMessages" 
                :key="message.id"
                :class="{ 'table-active': message.unread }"
                @click="openMessage(message)"
                style="cursor: pointer"
              >
                <CTableDataCell @click.stop>
                  <CFormCheck />
                </CTableDataCell>
                <CTableDataCell>
                  <div class="d-flex align-items-center">
                    <CAvatar :text="message.sender.charAt(0)" size="sm" color="primary" class="me-2" />
                    <span :class="{ 'fw-bold': message.unread }">{{ message.sender }}</span>
                  </div>
                </CTableDataCell>
                <CTableDataCell>
                  <div class="d-flex">
                    <span :class="{ 'fw-bold': message.unread }">{{ message.subject }}</span>
                    <span v-if="message.attachment" class="ms-2">
                      <CIcon name="cil-paperclip" />
                    </span>
                    <CBadge v-if="message.label" :color="getLabelColor(message.label)" class="ms-2">
                      {{ message.label }}
                    </CBadge>
                  </div>
                  <div class="text-muted small text-truncate" style="max-width: 400px">
                    {{ message.preview }}
                  </div>
                </CTableDataCell>
                <CTableDataCell>
                  <div class="small text-muted">
                    {{ formatDate(message.date) }}
                  </div>
                </CTableDataCell>
                <CTableDataCell>
                  <CButtonGroup>
                    <CButton 
                      color="danger" 
                      size="sm" 
                      variant="outline"
                      @click.stop="deleteMessage(message)"
                      title="Delete"
                    >
                      <CIcon name="cil-trash" />
                    </CButton>
                    <CButton 
                      color="secondary" 
                      size="sm" 
                      variant="outline"
                      @click.stop="toggleStar(message)"
                      title="Star"
                    >
                      <CIcon :name="message.starred ? 'cil-star' : 'cil-star-outline'" />
                    </CButton>
                  </CButtonGroup>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </div>
      </CCardBody>
      
      <CCardFooter class="bg-light py-3">
        <div class="d-flex justify-content-between align-items-center">
          <div class="text-muted small">
            Showing {{ filteredMessages.length }} of {{ messages.length }} messages
          </div>
          <CPagination size="sm">
            <CPaginationItem :disabled="currentPage === 1" @click="prevPage">
              Previous
            </CPaginationItem>
            <CPaginationItem 
              v-for="page in totalPages" 
              :key="page" 
              :active="page === currentPage"
              @click="currentPage = page"
            >
              {{ page }}
            </CPaginationItem>
            <CPaginationItem :disabled="currentPage === totalPages" @click="nextPage">
              Next
            </CPaginationItem>
          </CPagination>
        </div>
      </CCardFooter>
    </CCard>

    <!-- Message View Modal -->
    <CModal :visible="showMessageModal" @close="closeMessageModal" size="lg">
      <CModalHeader closeButton>
        <CModalTitle>{{ selectedMessage?.subject }}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div v-if="selectedMessage">
          <div class="d-flex justify-content-between mb-4">
            <div class="d-flex align-items-center">
              <CAvatar :text="selectedMessage.sender.charAt(0)" size="md" color="primary" class="me-3" />
              <div>
                <div class="fw-bold">{{ selectedMessage.sender }}</div>
                <div class="text-muted small">{{ selectedMessage.email }}</div>
              </div>
            </div>
            <div class="text-muted small">
              {{ formatDateTime(selectedMessage.date) }}
            </div>
          </div>
          
          <div class="border-top pt-3 mb-3">
            <div v-html="selectedMessage.content"></div>
          </div>
          
          <div v-if="selectedMessage.attachment" class="border-top pt-3">
            <h6>Attachment:</h6>
            <CButton color="primary" variant="outline" size="sm">
              <CIcon name="cil-paperclip" class="me-2" />
              {{ selectedMessage.attachment.name }}
            </CButton>
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="closeMessageModal">
          Close
        </CButton>
        <CButton color="primary" @click="replyMessage">
          <CIcon name="cil-reply" class="me-2" />
          Reply
        </CButton>
      </CModalFooter>
    </CModal>
  </CContainer>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
  CContainer, CCard, CCardHeader, CCardBody, CCardFooter,
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CButton, CButtonGroup, CBadge, CIcon, CPagination, CPaginationItem,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter,
  CFormCheck, CAvatar
} from '@coreui/vue'

// Sample data
const messages = ref([
  {
    id: 1,
    sender: "John Smith",
    email: "john.smith@example.com",
    subject: "Project Meeting",
    preview: "Hello, I confirm our meeting tomorrow at 10am to discuss...",
    content: "<p>Hello,</p><p>I confirm our meeting tomorrow at 10am to discuss project progress.</p><p>Best regards,<br>John</p>",
    date: "2025-04-15T09:30:00",
    unread: true,
    starred: false,
    label: "Work",
    attachment: { name: "Agenda.pdf", size: "2.4MB" }
  },
  {
    id: 2,
    sender: "Mary Johnson",
    email: "mary.johnson@example.com",
    subject: "Invoice April 2025",
    preview: "Please find attached the invoice for April...",
    content: "<p>Hello,</p><p>Please find attached the invoice for April.</p><p>Thank you,<br>Mary</p>",
    date: "2025-04-14T14:15:00",
    unread: false,
    starred: true,
    label: "Invoices"
  },
  {
    id: 3,
    sender: "Technical Support",
    email: "support@example.com",
    subject: "Your ticket #45678",
    preview: "We have resolved your issue regarding access to...",
    content: "<p>Hello,</p><p>We have resolved your issue regarding system access.</p><p>Best regards,<br>Support Team</p>",
    date: "2025-04-13T11:20:00",
    unread: false,
    starred: false
  },
  {
    id: 4,
    sender: "Alex King",
    email: "alex.king@example.com",
    subject: "Collaboration Proposal",
    preview: "I'm contacting you to propose a collaboration on...",
    content: "<p>Hello,</p><p>I'm contacting you to propose a collaboration on a new project.</p><p>Alex</p>",
    date: "2025-04-12T16:45:00",
    unread: true,
    starred: false,
    label: "Opportunities"
  }
])

// State
const currentPage = ref(1)
const itemsPerPage = 5
const showMessageModal = ref(false)
const selectedMessage = ref(null)
const filter = ref('all') // 'all', 'unread', 'starred'

// Computed
const unreadCount = computed(() => messages.value.filter(m => m.unread).length)
const filteredMessages = computed(() => {
  let result = messages.value
  if (filter.value === 'unread') {
    result = result.filter(m => m.unread)
  } else if (filter.value === 'starred') {
    result = result.filter(m => m.starred)
  }
  return result
})
const totalPages = computed(() => Math.ceil(filteredMessages.value.length / itemsPerPage))

// Methods
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
}

const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getLabelColor = (label) => {
  const colors = {
    'Work': 'info',
    'Invoices': 'success',
    'Opportunities': 'warning'
  }
  return colors[label] || 'secondary'
}

const openMessage = (message) => {
  selectedMessage.value = message
  message.unread = false
  showMessageModal.value = true
}

const closeMessageModal = () => {
  showMessageModal.value = false
}

const deleteMessage = (message) => {
  messages.value = messages.value.filter(m => m.id !== message.id)
}

const toggleStar = (message) => {
  message.starred = !message.starred
}

const composeNew = () => {
  alert("Open new message editor")
}

const refreshInbox = () => {
  alert("Refreshing inbox")
}

const replyMessage = () => {
  alert(`Reply to: ${selectedMessage.value?.sender}`)
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}
</script>

<style scoped>
.table-responsive {
  border-radius: 0.375rem;
  overflow: hidden;
}

.table thead th {
  border-bottom-width: 2px;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.table tbody tr {
  transition: background-color 0.2s ease;
}

.table tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.05);
}

.table-active {
  background-color: rgba(0, 123, 255, 0.1) !important;
}

.badge {
  font-weight: 500;
  letter-spacing: 0.5px;
}

.avatar {
  font-weight: bold;
}
</style>