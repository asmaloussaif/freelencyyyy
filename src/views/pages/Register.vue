<template>
  <div class="auth-container">
    <div class="overlay"></div>
    <div class="loginBox">
      <div class="inner">
        <div class="signIn">
          <div class="top">
            <img class="logo" src="https://res.cloudinary.com/dc3c8nrut/image/upload/v1685298768/logo-placeholder_l3yodl.png" />
            <div class="title">Create an Account</div>
            <div class="subtitle">
              Already have an account?
              <router-link to="/pages/login" class="subtitle-action">Sign In</router-link>
            </div>
          </div>

          <form @submit.prevent="handleRegister">
            <div class="form">
              <input required type="text" class="w100" v-model="firstName" placeholder="First Name" />
              <input required type="text" class="w100" v-model="lastName" placeholder="Last Name" />
              <input required type="email" class="w100" v-model="email" placeholder="Email" />
              <input required type="password" class="w100" v-model="password" placeholder="Password" />
              <input required type="password" class="w100" v-model="confirmPassword" placeholder="Confirm Password" />

              <select v-model="role" class="w100" required>
  <option disabled value="">Select your role</option>
  <option value="client">Client</option>
  <option value="freelancer">Freelancer</option>
  <option value="admin">Admin</option>
</select>

            </div>

            <div class="forgot-password">
              <router-link to="/pages/forgot-password">Forgot password?</router-link>
            </div>

            <button type="submit" class="action" :class="{ 'action-disabled': !registerValid }">Create Account</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const role = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

const registerValid = computed(() =>
  firstName.value.trim() &&
  lastName.value.trim() &&
  email.value.trim() &&
  password.value &&
  confirmPassword.value &&
  password.value === confirmPassword.value &&
  role.value
)

const handleRegister = async () => {
  if (!registerValid.value) return

  try {
    const response = await fetch('http://127.0.0.1:8000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        name: firstName.value,
        lastName: lastName.value,
        email: email.value,
        password: password.value,
        role: role.value,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Registration failed')
    }

    const data = await response.json()
    const token = data.access_token
    const userRole = data.role

    authStore.setAuth(token, userRole)

    router.push('/dashboard') 
  } catch (error) {
    console.error('Erreur d’inscription :', error.message)
    alert('Registration failed: ' + error.message)
  }
}
</script>

<style scoped>
.auth-container {
  background: url('https://i.pinimg.com/736x/54/0c/16/540c16fe8d7c4529661b33cb6dedaea7.jpg') no-repeat center center fixed;
  background-size: cover;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}
.overlay {
  position: absolute;
  background-color: rgba(0, 0, 50, 0.4);
  width: 100%;
  height: 100%;
  z-index: 1;
}
.loginBox {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.2);
  z-index: 2;
  width: 400px;
}
.logo {
  width: 80px;
  margin-bottom: 10px;
}
.title {
  font-size: 24px;
  font-weight: bold;
}
.subtitle {
  font-size: 14px;
  margin-bottom: 20px;
}
.subtitle-action {
  color: #007bff;
  text-decoration: none;
  margin-left: 4px;
}
.w100 {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
}
.action {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  width: 100%;
  font-weight: bold;
  transition: opacity 0.3s ease;
}
.action-disabled {
  opacity: 0.5;
  pointer-events: none;
}
.forgot-password {
  text-align: right;
  margin-bottom: 12px;
}
.forgot-password a {
  font-size: 13px;
  color: #007bff;
  text-decoration: none;
}
</style>
