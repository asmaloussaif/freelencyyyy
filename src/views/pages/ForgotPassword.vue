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
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  
  const email = ref('');
  const successMessage = ref('');
  const errorMessage = ref('');
  
  const handleSubmit = async () => {
    try {
      await axios.post('http://127.0.0.1:8000/api/forgot-password', { email: email.value });
      successMessage.value = 'A reset link has been sent to your email.';
      errorMessage.value = '';
    } catch (error) {
      errorMessage.value = error.response?.data?.message || 'Something went wrong.';
      successMessage.value = '';
    }
  };
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
  background: linear-gradient(135deg, #5e548e, #9f86c0);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
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
  border-color: #5e548e;
  outline: none;
}

.action {
  margin-top: 1.5rem;
  width: 100%;
  padding: 0.75rem;
  background-color: #5e548e;
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.action:hover {
  background-color: #4b3f7c;
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
  