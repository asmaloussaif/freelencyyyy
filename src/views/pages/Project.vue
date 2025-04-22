<template>
  <CContainer class="py-4">
    <h2 class="mb-4 fw-bold text-primary">Offer List</h2>

    <div class="d-flex justify-content-between mb-3 flex-wrap gap-2">
      <CFormInput
        v-model="search"
        placeholder="Search by project or client..."
        class="w-100 w-md-50"
      />
      <CFormSelect v-model="statusFilter" class="w-100 w-md-25">
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
            <h5 class="fw-bold text-dark">{{ offer.project_name }}</h5>
            <p class="mb-1"><strong>Description:</strong> {{ offer.description }}</p>
            <p class="mb-1"><strong>Budget:</strong> {{ formatCurrency(offer.budget) }}</p>
            <p class="mb-1"><strong>Deadline:</strong> {{ formatDate(offer.deadline) }}</p>
            <p class="mb-2"><strong>Client:</strong> {{ offer.client_name }}</p>

            <CBadge :color="statusColor(offer.status)" class="mb-3">{{ offer.status }}</CBadge>

            <div v-if="offer.status === 'Pending'" class="d-flex gap-2">
              <CButton color="success" @click="updateStatus(offer.id, 'Accepted')">Accept</CButton>
              <CButton color="danger" @click="updateStatus(offer.id, 'Rejected')">Reject</CButton>
            </div>

            <div v-else class="text-muted small">
              <i v-if="offer.status === 'Accepted'" class="cil-check-circle text-success me-1"></i>
              <i v-else-if="offer.status === 'Rejected'" class="cil-x-circle text-danger me-1"></i>
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
  transition: transform 0.3s, box-shadow 0.3s;
}
.offer-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}
</style>
