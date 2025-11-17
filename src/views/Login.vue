<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Auth from '../api/Auth' 

const router = useRouter()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)


const ALLOWED_ROLES = ['teacher', 'admin']

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    
    
    await Auth.login(email.value, password.value)

    
    const stored = localStorage.getItem('user')
    const user = stored ? JSON.parse(stored) : null
    const token = localStorage.getItem('token')

    
    
    
    

    if (!user || !user.role) {
      
      
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      error.value = 'Login failed (no user info). Try again.'
      loading.value = false
      return
    }

    
    if (!ALLOWED_ROLES.includes(user.role.toLowerCase())) {
      
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      error.value = 'Your account does not have access to the Teachers portal.'
      loading.value = false
      return
    }

    
    router.push('/dashboard')

  } catch (err) {
    
    if (err?.response?.status === 401) {
      error.value = 'Invalid credentials. Please try again.'
    } else if (err?.response?.status === 403) {
      error.value = 'You are not authorized to access this portal.'
    } else {
      error.value = 'Login failed. Please try again.'
      console.error('Login error:', err)
    }
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col justify-center items-center bg-gray-100">
    <div class="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
      <h2 class="text-xl font-semibold text-center mb-4">Teacher Login</h2>

      <input v-model="email" type="email" placeholder="Email"
             class="border rounded w-full p-2 mb-3" />

      <input v-model="password" type="password" placeholder="Password"
             class="border rounded w-full p-2 mb-3" />

      <button @click="handleLogin"
              :disabled="loading"
              class="bg-blue-600 text-white w-full py-2 rounded hover:bg-blue-700 disabled:opacity-60">
        <span v-if="!loading">Login</span>
        <span v-else>Signing in...</span>
      </button>

      <p v-if="error" class="text-red-500 text-sm mt-3">{{ error }}</p>
    </div>
  </div>
</template>

<style scoped>

</style>