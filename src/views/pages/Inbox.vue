<template>
  <CContainer fluid class="mt-4">
    <CCard class="shadow">
      <CCardHeader class="d-flex justify-content-between align-items-center bg-light py-3">
        <div>
          <CIcon name="cil-inbox" class="me-2" />
          <strong class="h4">Boîte de réception</strong>
          <CBadge color="primary" class="ms-2">{{ unreadCount }} non lus</CBadge>
        </div>
        <div>
          <CButton color="primary" size="sm" @click="composeNew" class="me-2">
            <CIcon name="cil-pencil" class="me-1" />
            Nouveau message
          </CButton>
          <CButton color="secondary" size="sm" variant="outline" @click="refreshInbox">
            <CIcon name="cil-reload" class="me-1" />
            Actualiser
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
                <CTableHeaderCell scope="col" width="120">De</CTableHeaderCell>
                <CTableHeaderCell scope="col">Sujet</CTableHeaderCell>
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
                      title="Supprimer"
                    >
                      <CIcon name="cil-trash" />
                    </CButton>
                    <CButton 
                      color="secondary" 
                      size="sm" 
                      variant="outline"
                      @click.stop="toggleStar(message)"
                      title="Étoile"
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
            Affichage de {{ filteredMessages.length }} sur {{ messages.length }} messages
          </div>
          <CPagination size="sm">
            <CPaginationItem :disabled="currentPage === 1" @click="prevPage">
              Précédent
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
              Suivant
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
            <h6>Pièce jointe:</h6>
            <CButton color="primary" variant="outline" size="sm">
              <CIcon name="cil-paperclip" class="me-2" />
              {{ selectedMessage.attachment.name }}
            </CButton>
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="closeMessageModal">
          Fermer
        </CButton>
        <CButton color="primary" @click="replyMessage">
          <CIcon name="cil-reply" class="me-2" />
          Répondre
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
    sender: "Jean Dupont",
    email: "jean.dupont@example.com",
    subject: "Réunion de projet",
    preview: "Bonjour, je vous confirme notre réunion demain à 10h pour discuter...",
    content: "<p>Bonjour,</p><p>Je vous confirme notre réunion demain à 10h pour discuter de l'avancement du projet.</p><p>Cordialement,<br>Jean</p>",
    date: "2025-04-15T09:30:00",
    unread: true,
    starred: false,
    label: "Travail",
    attachment: { name: "Agenda.pdf", size: "2.4MB" }
  },
  {
    id: 2,
    sender: "Marie Martin",
    email: "marie.martin@example.com",
    subject: "Facture avril 2025",
    preview: "Veuillez trouver ci-joint la facture pour le mois d'avril...",
    content: "<p>Bonjour,</p><p>Veuillez trouver ci-joint la facture pour le mois d'avril.</p><p>Merci,<br>Marie</p>",
    date: "2025-04-14T14:15:00",
    unread: false,
    starred: true,
    label: "Factures"
  },
  {
    id: 3,
    sender: "Support Technique",
    email: "support@example.com",
    subject: "Votre ticket #45678",
    preview: "Nous avons résolu votre problème concernant l'accès au...",
    content: "<p>Bonjour,</p><p>Nous avons résolu votre problème concernant l'accès au système.</p><p>Cordialement,<br>L'équipe support</p>",
    date: "2025-04-13T11:20:00",
    unread: false,
    starred: false
  },
  {
    id: 4,
    sender: "Alexandre Leroy",
    email: "alex.leroy@example.com",
    subject: "Proposition de collaboration",
    preview: "Je vous contacte pour vous proposer une collaboration sur...",
    content: "<p>Bonjour,</p><p>Je vous contacte pour vous proposer une collaboration sur un nouveau projet.</p><p>Alexandre</p>",
    date: "2025-04-12T16:45:00",
    unread: true,
    starred: false,
    label: "Opportunités"
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
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('fr-FR', { 
    day: 'numeric', 
    month: 'short', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getLabelColor = (label) => {
  const colors = {
    'Travail': 'info',
    'Factures': 'success',
    'Opportunités': 'warning'
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
  alert("Ouvrir l'éditeur de nouveau message")
}

const refreshInbox = () => {
  alert("Actualisation de la boîte de réception")
}

const replyMessage = () => {
  alert(`Répondre à: ${selectedMessage.value?.sender}`)
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