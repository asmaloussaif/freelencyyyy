<template>
  <div class="auth-container">
    <div class="overlay"></div>
    <div class="loginBox">
      <div class="inner">
        <div class="signIn">
          <div class="top">
            <img class="logo" src="/src/assets/images/lastlogo.png" />
            <div class="title">Forgot Password</div>
            <div class="subtitle">Enter your email to receive a reset link</div>
          </div>

          <form @submit.prevent="handleSubmit">
            <div class="form">
              <input
                required
                type="email"
                class="w100"
                v-model="email"
                placeholder="Email"
              />
            </div>

            <button type="submit" class="action">Send Reset Link</button>

            <div v-if="successMessage" class="success-message">{{ successMessage }}</div>
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          </form>

          <button class="return-button" @click="goToLogin">Return to Login</button>
        </div>
      </div>
    </div>
  </div>
</template>

  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import { useRouter } from 'vue-router'
  const router = useRouter()
  const email = ref('');
  const successMessage = ref('');
  const errorMessage = ref('');
  
  const handleSubmit = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/forgot-password', { email: email.value });
      successMessage.value = 'A reset link has been sent to your email.';
      errorMessage.value = '';
      setTimeout(() => {
      router.push('/pages/login')
    }, 2000)
    } catch (error) {
      errorMessage.value = error.response?.data?.message || 'Something went wrong.';
      successMessage.value = '';
    }
  };
  const goToLogin = () => {
  router.push('/pages/login')
}
  </script>
  
  <style scoped>
  .success-message {
    color: green;
    margin-top: 10px;
  }
  .error-message {
    color: red;
    margin-top: 10px;
  }
  .auth-container {
  position: relative;
  width: 100%;
  height: 100vh;
   background: url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1470&q=80') no-repeat center center fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}
.return-button {
  margin-top: 1rem;
  background-color: transparent;
  border: 1px solid #ccc;
  padding: 0.5rem 1rem;
  cursor: pointer;
  color: #444;
  border-radius: 5px;
  transition: all 0.2s ease-in-out;
}

.return-button:hover {
  background-color: #f5f5f5;
}
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(25, 22, 39, 0.5);
  z-index: 0;
}

.loginBox {
  position: relative;
  z-index: 1;
  background: white;
  padding: 2.5rem;
  border-radius: 1.25rem;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
}

.inner .top {
  text-align: center;
  margin-bottom: 1.5rem;
}

.logo {
  width: 60px;
  margin-bottom: 1rem;
}

.title {
  font-size: 1.75rem;
  font-weight: bold;
  color: #191627;
}

.subtitle {
  font-size: 0.9rem;
  color: #6b6b6b;
  margin-top: 0.25rem;
}

.form input {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  border: 1px solid #ccc;
  border-radius: 0.75rem;
  font-size: 1rem;
  transition: border 0.3s ease;
}

.form input:focus {
  border-color: #1984e1;
  outline: none;
}

.action {
  margin-top: 1.5rem;
  width: 100%;
  padding: 0.75rem;
  background-color: #080bb4;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action:hover {
  background-color: #387adc;
}

.success-message {
  margin-top: 1rem;
  color: #2f855a;
  background-color: #f0fff4;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  text-align: center;
}

.error-message {
  margin-top: 1rem;
  color: #c53030;
  background-color: #fff5f5;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  text-align: center;
}
  </style>
  