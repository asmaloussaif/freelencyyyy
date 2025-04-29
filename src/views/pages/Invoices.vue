<template>
  <div class="payment-page">
    <h2 class="page-title">Secure Payment Management</h2>

    <!-- Payment Methods -->
    <div class="card-grid">
      <CRow>
        <CCol v-for="(method, index) in paymentMethods" :key="index" md="6" xl="4">
          <CCard class="payment-card">
            <CCardBody>
              <h5 class="card-title">{{ method.type }} **** {{ method.last4 }}</h5>
              <p class="card-text">Expiry: {{ method.expiry }}</p>
              <p class="card-text">Amount: {{ formatCurrency(method.amount) }}</p>
              <CButton color="danger" variant="outline" @click="removeMethod(index)">
                Remove
              </CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>

    <!-- Add New Method Form -->
    <div class="add-method-form">
      <CCard>
        <CCardHeader>
          <strong>Add New Payment Method</strong>
        </CCardHeader>
        <CCardBody>
          <CForm @submit.prevent="addPaymentMethod">
            <CRow>
              <CCol md="6">
                <CFormInput v-model="newMethod.type" label="Card Type" placeholder="e.g. Visa" required />
              </CCol>
              <CCol md="6">
                <CFormInput v-model="newMethod.last4" label="Last 4 Digits" placeholder="1234" required maxlength="4" />
              </CCol>
            </CRow>
            <CRow>
              <CCol md="6">
                <CFormInput v-model="newMethod.expiry" label="Expiry Date" placeholder="MM/YY" required />
              </CCol>
              <CCol md="6">
                <CFormInput
                  v-model.number="newMethod.amount"
                  label="Amount (TND)"
                  type="number"
                  min="1"
                  placeholder="100"
                  required
                />
              </CCol>
            </CRow>
            <CButton type="submit" color="primary" class="mt-3">Add Method</CButton>
          </CForm>
        </CCardBody>
      </CCard>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const paymentMethods = ref([
  { type: 'Visa', last4: '4242', expiry: '12/26', amount: 150.0 },
  { type: 'MasterCard', last4: '1234', expiry: '09/25', amount: 75.5 }
])

const newMethod = ref({
  type: '',
  last4: '',
  expiry: '',
  amount: null
})

function addPaymentMethod() {
  if (newMethod.value.type && newMethod.value.last4 && newMethod.value.expiry && newMethod.value.amount > 0) {
    paymentMethods.value.push({ ...newMethod.value })
    newMethod.value = { type: '', last4: '', expiry: '', amount: null }
  }
}

function removeMethod(index) {
  paymentMethods.value.splice(index, 1)
}

function formatCurrency(amount) {
  return amount.toLocaleString('fr-TN', { style: 'currency', currency: 'TND' })
}
</script>

<style scoped>
.payment-page {
  background-color: #F8FAFF;
  padding: 2rem;
  min-height: 100vh;
}

.page-title {
  color: #0F2573;
  margin-bottom: 1.5rem;
  font-size: 1.8rem;
  font-weight: bold;
}

.payment-card {
  background-color: #E1F0FF;
  border: none;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border-radius: 1rem;
}

.payment-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 15px rgba(15, 37, 115, 0.2);
}

.card-title {
  color: #0F2573;
  font-weight: 600;
}

.card-text {
  color: #5E548E;
  margin-bottom: 1rem;
}

.add-method-form {
  margin-top: 2rem;
}

.add-method-form .card {
  border-radius: 1rem;
  border: 1px solid #D6BEDA;
}

.add-method-form .card-header {
  background-color: #0F2573;
  color: white;
  font-weight: bold;
}

.add-method-form .btn-primary {
  background-color: #0F2573;
  border: none;
  transition: background-color 0.3s ease;
}

.add-method-form .btn-primary:hover {
  background-color: #5E548E;
}
</style>
