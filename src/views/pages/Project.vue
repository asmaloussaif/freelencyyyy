<template>
  <CContainer class="py-4">
    <h2 class="mb-4 fw-bold" style="color: #5E2B97;">List of offers</h2>

    <div class="d-flex justify-content-between mb-3 flex-wrap gap-2">
      <CFormInput
        v-model="search"
        placeholder="Search by project or client..."
        class="w-100 w-md-50"
        style="border-color: #E2C3FF; background-color: #F5E9FF;"
      />
      <CFormSelect 
        v-model="statusFilter" 
        class="w-100 w-md-25"
        style="border-color: #E2C3FF; background-color: #F5E9FF; color: #4A2C7A;"
      >
        <option value="">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="Accepted">Accepted</option>
        <option value="Rejected">Rejected</option>
        <option value="Expired">Expired</option>
      </CFormSelect>
    </div>

    <div class="row">
      <div
        v-for="offer in filteredOffers"
        :key="offer.id"
        class="col-md-6 col-lg-4 mb-4"
      >
        <CCard :class="`border-${statusColor(offer.status)} shadow-sm h-100 offer-card`">
          <CCardBody>
            <h5 class="fw-bold" style="color: #4A2C7A;">{{ offer.project_name }}</h5>
            <p class="mb-1"><strong style="color: #6E3FB4;">Description:</strong> {{ offer.description }}</p>
            <p class="mb-1"><strong style="color: #6E3FB4;">Budget:</strong> {{ formatCurrency(offer.budget) }}</p>
            <p class="mb-1"><strong style="color: #6E3FB4;">Deadline:</strong> {{ formatDate(offer.deadline) }}</p>
            <p class="mb-2"><strong style="color: #6E3FB4;">Client:</strong> {{ offer.client_name }}</p>

            <CBadge :style="statusStyle(offer.status)" class="mb-3">
              {{ offer.status }}
            </CBadge>

            <div v-if="offer.status === 'Pending'" class="d-flex gap-2">
              <CButton 
                color="success" 
                @click="updateStatus(offer.id, 'Accepted')"
                style="background-color: #6E3FB4; border-color: #6E3FB4;"
              >Accept</CButton>
              <CButton 
                color="danger" 
                @click="updateStatus(offer.id, 'Rejected')"
                style="background-color: #8A4EBF; border-color: #8A4EBF;"
              >Reject</CButton>
            </div>

            <div v-else class="text-muted small">
              <i v-if="offer.status === 'Accepted'" class="cil-check-circle" style="color: #6E3FB4; margin-right: 4px;"></i>
              <i v-else-if="offer.status === 'Rejected'" class="cil-x-circle" style="color: #8A4EBF; margin-right: 4px;"></i>
              {{ offer.status }} offer
            </div>
          </CCardBody>
        </CCard>
      </div>
    </div>
  </CContainer>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  CContainer,
  CCard,
  CCardBody,
  CButton,
  CBadge,
  CFormInput,
  CFormSelect
} from '@coreui/vue'

import { format } from 'date-fns'

const search = ref('')
const statusFilter = ref('')
const offers = ref([])

const statusStyle = (status) => {
  switch(status) {
    case 'Pending':
      return {
        backgroundColor: '#F0D9FF',
        color: '#5E2B97',
        border: '1px solid #8A4EBF'
      }
    case 'Accepted':
      return {
        backgroundColor: '#D4EDDA',
        color: '#155724',
        border: '1px solid #28A745'
      }
    case 'Rejected':
      return {
        backgroundColor: '#F8D7DA',
        color: '#721C24',
        border: '1px solid #DC3545'
      }
    case 'Expired':
      return {
        backgroundColor: '#E2E3E5',
        color: '#383D41',
        border: '1px solid #D6D8DB'
      }
    default:
      return {
        backgroundColor: '#F5E9FF',
        color: '#6E3FB4',
        border: '1px solid #D9B3FF'
      }
  }
}

onMounted(() => {
  offers.value = [
    {
      id: 1,
      project_name: 'UI Redesign',
      description: 'Update the app UI with a new theme.',
      budget: 1000,
      deadline: '2025-05-01',
      client_name: 'Jane Doe',
      status: 'Pending'
    },
    {
      id: 2,
      project_name: 'Landing Page',
      description: 'Build a modern, responsive landing page.',
      budget: 750,
      deadline: '2025-04-25',
      client_name: 'Mark Twain',
      status: 'Accepted'
    },
    {
      id: 3,
      project_name: 'Logo Design',
      description: 'Design a logo for a new brand.',
      budget: 400,
      deadline: '2025-04-20',
      client_name: 'Emma Smith',
      status: 'Rejected'
    }
  ]
})

const formatDate = (dateStr) => {
  return format(new Date(dateStr), 'MMM dd, yyyy')
}

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}

const updateStatus = (id, newStatus) => {
  const offer = offers.value.find(o => o.id === id)
  if (offer) offer.status = newStatus
}

const statusColor = (status) => {
  switch (status) {
    case 'Accepted': return 'success'
    case 'Rejected': return 'danger'
    case 'Expired': return 'secondary'
    default: return 'warning'
  }
}

const filteredOffers = computed(() => {
  return offers.value.filter((offer) => {
    const matchStatus = !statusFilter.value || offer.status === statusFilter.value
    const matchSearch =
      offer.project_name.toLowerCase().includes(search.value.toLowerCase()) ||
      offer.client_name.toLowerCase().includes(search.value.toLowerCase())
    return matchStatus && matchSearch
  })
})
</script>

<style scoped>
.offer-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid #E2C3FF;
  background-color: white;
  border-radius: 12px;
}

.offer-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(151, 96, 208, 0.15);
  border-color: #8A4EBF;
}

.badge {
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
}

.badge::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.badge[style*="Pending"]::before {
  background-color: #5E2B97;
}

.badge[style*="Accepted"]::before {
  background-color: #155724;
}

.badge[style*="Rejected"]::before {
  background-color: #721C24;
}

.badge[style*="Expired"]::before {
  background-color: #383D41;
}

::placeholder {
  color: #A78BC9 !important;
  opacity: 1;
}

.text-muted {
  color: #8A4EBF !important;
}
</style>