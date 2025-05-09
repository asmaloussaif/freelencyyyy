<template>
  <div class="visitor-page">
    <!-- Navbar -->
    <header class="navbar d-flex justify-between align-center px-4 py-3 shadow-sm">
      <div class="d-flex flex-column align-start logo-container">
        <img
          src="/src/assets/images/lastlogo.png"
          alt="Freelancyy Logo"
          class="img-fluid logo-img mb-1"
        />
        <h2 class="mb-0 text-primary fw-bold">Freelancyy</h2>
      </div>
      <div class="d-flex gap-3">
        <CButton color="light" @click="$router.push('/pages/login')" class="text-primary">Login</CButton>
        <CButton color="primary" @click="$router.push('/pages/register')" class="text-light">Register</CButton>
      </div>
    </header>

    <!-- Hero Section -->
    <section class="hero-section d-flex flex-column justify-center align-center text-center text-dark px-4 py-5">
      <div class="hero-content">
        <h1 class="hero-title mb-4">
          Freelancyy: Where brilliance meets opportunity,<br />
          crafting Tunisia’s digital future, one project at a time.
        </h1>
        <p class="hero-subtitle mb-4 large-text">
          Join a thriving platform connecting skilled freelancers with ambitious clients.
        </p>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features py-6 bg-white">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold text-primary-dark mb-3">Why Choose Freelancyy?</h2>
          <p class="text-muted lead">A powerful ecosystem for freelancers & clients</p>
        </div>

        <div class="row g-4">
          <!-- Freelancers -->
          <div class="col-lg-6">
            <div class="feature-box p-4 shadow-sm rounded-3 bg-white h-100">
              <div class="icon-wrapper bg-blue-light mb-4">
                <CIcon icon="cil-user" size="xl" class="text-primary" />
              </div>
              <h4 class="fw-semibold mb-3 text-primary-dark">For Freelancers</h4>
              <ul class="list-unstyled feature-list">
                <li><CIcon icon="cil-check" class="text-primary me-2" />Create a professional profile</li>
                <li><CIcon icon="cil-check" class="text-primary me-2" />Browse and apply to projects</li>
                <li><CIcon icon="cil-check" class="text-primary me-2" />Manage your portfolio & experience</li>
                <li><CIcon icon="cil-check" class="text-primary me-2" />Receive ratings and feedback</li>
                <li><CIcon icon="cil-check" class="text-primary me-2" />Secure payment tracking</li>
              </ul>
            </div>
          </div>

          <!-- Clients -->
          <div class="col-lg-6">
            <div class="feature-box p-4 shadow-sm rounded-3 bg-white h-100">
              <div class="icon-wrapper bg-blue-light mb-4">
                <CIcon icon="cil-briefcase" size="xl" class="text-primary" />
              </div>
              <h4 class="fw-semibold mb-3 text-primary-dark">For Clients</h4>
              <ul class="list-unstyled feature-list">
                <li><CIcon icon="cil-check" class="text-primary me-2" />Post projects quickly and easily</li>
                <li><CIcon icon="cil-check" class="text-primary me-2" />Browse freelancers by skills</li>
                <li><CIcon icon="cil-check" class="text-primary me-2" />Communicate and collaborate</li>
                <li><CIcon icon="cil-check" class="text-primary me-2" />Track progress and manage invoices</li>
                <li><CIcon icon="cil-check" class="text-primary me-2" />Rate and review completed work</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { CButton } from '@coreui/vue'
import { CIcon } from '@coreui/icons-vue'
</script>

<style scoped>
.visitor-page {
  min-height: 100vh;
  background-color: #ffffff;
}

.navbar {
  background-color: #ffffff;
}

.hero-section {
  min-height: 80vh;
  background: linear-gradient(135deg, #e1f0ff, #f8faff);
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #0f2573;
  line-height: 1.4;
}

.hero-subtitle {
  font-size: 1.2rem;
  color: #6c757d;
}

.large-text {
  font-size: 2rem;
  color: black;
  font-weight: 600;
}

.features {
  background-color: #ffffff;
}

.feature-box {
  transition: all 0.3s ease-in-out;
}

.feature-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.text-primary-dark {
  color: #0f2573;
}

.bg-blue-light {
  background-color: #e1f0ff;
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #e1f0ff;
}

.text-primary {
  color: #0f2573 !important;
}

.text-light {
  color: #ffffff !important;
}

/* New logo style */
.logo-container {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.logo-img {
  width: 80px;
  height: auto;
}
</style>
