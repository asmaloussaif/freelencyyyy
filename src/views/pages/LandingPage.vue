<template>
 <div class="visitor-page">
  <!-- Navbar -->
  <header class="navbar d-flex justify-between align-center px-5 py-3 shadow-sm bg-white rounded-bottom">
  <!-- Centered Logo + Title -->
  <div class="d-flex align-center gap-3 mx-auto header-center">
    <img
      src="/src/assets/images/lastlogo.png"
      alt="Freelancyy Logo"
      class="logo-img"
      style="height: 48px;"
    />
<h2 class="mb-0 fw-bold welcome-title" style="color: #5E86C0;">Welcome to Freelancy</h2>

  </div>

  <!-- Auth Buttons -->
  <div class="d-flex gap-3 ms-auto">
    <CButton 
      @click="$router.push('/pages/login')" 
      class="px-4 py-2 text-white"
      style="background-color: #1b73c6e3 ; border-radius: 8px;"
    >
      Login
    </CButton>
    <CButton 
      @click="$router.push('/pages/register')" 
      class="px-4 py-2 text-white"
      style="background-color: #1b73c6e3 ; border-radius: 8px;"
    >
      Register
    </CButton>
  </div>
</header>



   <!-- Hero Section -->
<section class="hero-section d-flex flex-column flex-md-row align-center justify-center text-center text-light px-4 py-5">
  <!-- Left Image (Freelancer) -->
  <div class="hero-image d-none d-md-block me-md-4">
    <img src="/src/assets/images/freelance.png" alt="Freelancer" class="hero-img" />
  </div>

  <!-- Hero Content -->
  <div class="hero-content mx-3">
    <h1 class="hero-title mb-4">
     "Freelancy: Where talent meets opportunity,<br />
     Shaping Tunisia’s digital future, one project at a time.
    </h1>
    <p class="hero-subtitle mb-4 large-text">
    A vibrant platform connecting skilled freelancers with ambitious clients.
    </p>
  </div>

  <!-- Right Image (Client) -->
  <div class="hero-image d-none d-md-block ms-md-4">
    <img src="/src/assets/images/client.png" alt="Client" class="hero-img" />
  </div>
</section>
    <!-- Features Section -->
    <section class="features py-6 bg-light">
      <div class="container">
        <div class="text-center mb-5">
          <h2 class="fw-bold text-primary-dark mb-3">Why Choose Freelancy?</h2>
          <p class="text-muted lead">A powerful ecosystem for freelancers & clients</p>
        </div>

        <div class="row g-4">
          <!-- Freelancers -->
          <div class="col-lg-6">
            <div class="feature-box p-4 shadow-lg rounded-3 bg-white h-100">
              <div class="icon-wrapper mb-4">
                <CIcon icon="cil-user" size="xl" class="text-primary" />
              </div>
              <h4 class="fw-semibold mb-3 text-primary-dark">For Freelancers</h4>
              <ul class="list-unstyled feature-list">
                <li><CIcon icon="cil-check" class="text-primary me-2" />Create  profile</li>
                <li><CIcon icon="cil-check" class="text-primary me-2" />Browse and apply to projects</li>
                <li><CIcon icon="cil-check" class="text-primary me-2" />Manage your portfolio & experience</li>
                <li><CIcon icon="cil-check" class="text-primary me-2" />Receive ratings and feedback</li>
                <li><CIcon icon="cil-check" class="text-primary me-2" />prepare the invoices</li>
                <li><CIcon icon="cil-check" class="text-primary me-2" />Communicate and collaborate</li>
              </ul>
            </div>
          </div>

          <!-- Clients -->
          <div class="col-lg-6">
            <div class="feature-box p-4 shadow-lg rounded-3 bg-white h-100">
              <div class="icon-wrapper mb-4">
                <CIcon icon="cil-briefcase" size="xl" class="text-primary" />
              </div>
              <h4 class="fw-semibold mb-3 text-primary-dark">For Clients</h4>
              <ul class="list-unstyled feature-list">
                <li><CIcon icon="cil-check" class="text-primary me-2" />Post projects quickly and easily</li>
                <li><CIcon icon="cil-check" class="text-primary me-2" />Browse freelancers by skills</li>
                <li><CIcon icon="cil-check" class="text-primary me-2" />Communicate and collaborate</li>
                <li><CIcon icon="cil-check" class="text-primary me-2" />Track progress and manage invoices</li>
                <li><CIcon icon="cil-check" class="text-primary me-2" />Rate and review completed work</li>
                <li><CIcon icon="cil-check" class="text-primary me-2" />Manage your portfolio</li>
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
  background-color: #eef2f8; /* Light background color */
  background-image: url('/src/assets/images/your-background-image.jpg'); /* Optional: add a background image */
  background-size: cover;
  background-position: center center;
  min-height: 100vh; /* Ensure the background covers the entire page */
}

.navbar {
  padding-top: 1rem !important;
  padding-bottom: 2rem !important;
   text-align: center;
}

.hero-section {
  min-height: 30vh; 
  padding: 2rem 1rem; 
  background: linear-gradient(135deg, #e1f0ff, #f8faff);
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  flex-wrap: wrap;
}

.hero-img {
  max-width: 200px;
  height: auto;
  object-fit: contain;
}

@media (max-width: 768px) {
  .hero-section {
    flex-direction: column;
  }

  .hero-img {
    display: none; /* hide images on small screens */
  }
}


.hero-title {
 font-size: 1.8rem; /* was 2.2rem */
  margin-bottom: 0.8rem;
  line-height: 1.3;
    color: #17348a;
}

.hero-subtitle,
.large-text {
   font-size: 1.5rem; /* was 1.2rem */
  margin-bottom: 0.8rem;
  color: #2248ba;}


.features {
  padding-top: 0.5rem;
  padding-bottom: 2rem;
}

.feature-box {
  padding: 1rem; /* reduce internal padding */
}

.feature-box:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.text-primary-dark {
  color: #6e94cf;
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
  color: #0d2a56 !important;
}

.text-light {
  color: #0a0e428a !important;
}


.logo-container {
  display: flex;
  flex-direction: column;
  align-items: center;       /* Centers horizontally */
  justify-content: center;   /* Centers vertically (if the parent has height) */
  text-align: center;
  margin-top: 20px;
}

.logo-img {
  height: 60px;
  object-fit: contain;
  margin-bottom: 18px; /* spacing between image and text */
}

.logo-container h2 {
  text-align: center;
  font-weight: bold;
  color: #5E548E;
}


.custom-blue-bg {
  background-color: #0F2573 !important;
  border-color: #0F2573 !important;
}

.custom-blue-bg {
  background-color: #1b73c6e3 !important;
  border-radius: 8px;
}
.header-center {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}

.welcome-title {
  font-size: 1.8rem;
  color: #3720a8;
}

.text-center.mb-5 {
 margin-bottom: 1.5rem !important; /* tighten section header */
}

.row.g-4 {
  row-gap: 2rem; /* tighter grid spacing */
}
</style>
