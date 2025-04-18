<template>
  <div class="auth-container">
    <div class="overlay"></div>
    <div class="loginBox">
      <div class="inner">
        <div class="signIn">
          <div class="top">
            <img
              class="logo"
              src="https://res.cloudinary.com/dc3c8nrut/image/upload/v1685298768/logo-placeholder_l3yodl.png"
            />
            <div class="title">Sign in</div>
            <div class="subtitle">
              Don't have an account?
              <router-link to="/pages/register" class="subtitle-action">Create Account</router-link>
            </div>
          </div>
          <form @submit.prevent="handleLogin">
            <div class="form">
              <input required type="email" class="w100" v-model="email" placeholder="Email" />
              <input required type="password" class="w100" v-model="password" placeholder="Password" />
            </div>

            <div class="forgot-password">
              <router-link to="/pages/forgot-password">Forgot password?</router-link>
            </div>

            <button type="submit" class="action" :class="{ 'action-disabled': !loginValid }">Submit</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'  // Assure-toi que le chemin vers ton store est correct

const router = useRouter()
const email = ref('')
const password = ref('')
const loginValid = computed(() => email.value && password.value)

const authStore = useAuthStore()  

const handleLogin = async () => {
  if (!loginValid.value) return

  try {
    const response = await fetch('http://127.0.0.1:8000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.message || 'Login failed')
    }

    const data = await response.json()
    
    const token = data.token
    const role = data.role[0]
    const user = data.user

    authStore.setAuth(token, role,user)

   
    if (role === 'client') {
      router.push('/dashboard')
    } else if (role === 'freelancer') {
      router.push('/dashboard')
    } else {
      router.push('/dashboard')
    }
  } catch (error) {
    console.error('Erreur de connexion:', error.message)
    alert('Login failed: ' + error.message)
  }
}
</script>

<style scoped>
.auth-container {
  background: url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1470&q=80') no-repeat center center fixed;
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