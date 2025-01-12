<!-- src/views/AdminLogin.vue -->
<template>
          <div class="min-h-screen bg-gray-100 flex items-center justify-center">
            <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
              <div class="text-center mb-8">
                <h2 class="text-3xl font-bold text-gray-800">Admin Login</h2>
                <p class="text-gray-600">Please login to access the system</p>
              </div>
        
              <form @submit.prevent="handleLogin" class="space-y-6">
                <!-- Show any error messages -->
                <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {{ error }}
                </div>
        
                <div>
                  <label class="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    v-model="username"
                    type="text"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
        
                <div>
                  <label class="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    v-model="password"
                    type="password"
                    required
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
        
                <button
                  type="submit"
                  :disabled="loading"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {{ loading ? 'Logging in...' : 'Login' }}
                </button>
              </form>
            </div>
          </div>
        </template>
        
        <script>
        import { authService } from '@/services/auth' // นำเข้า authService
        export default {
          name: 'AdminLogin',
          data() {
            return {
              username: '',
              password: '',
              loading: false,
              error: null
            }
          },
          methods: {
    async handleLogin() {
      this.loading = true
      this.error = null

      try {
        // เรียก authService เพื่อเช็ค login กับ API
        const token = await authService.login(this.username, this.password)

        // เก็บ token และเปลี่ยนเส้นทางไปหน้า /app
        localStorage.setItem('admin-token', token)
        localStorage.setItem('admin-user', JSON.stringify({ username: this.username }))
        console.log('Authenticated:', localStorage.getItem('admin-token'));
        console.log('Authenticated:', localStorage.getItem('admin-user'));
        
        
        this.$router.push('/app')
      } catch (err) {
        this.error = 'Invalid username or password'
        console.error('Login error:', err)
      } finally {
        this.loading = false
      }
    }
  }
}
        </script>