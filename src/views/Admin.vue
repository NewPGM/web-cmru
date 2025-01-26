<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center ">
    <div class="max-w-md w-full bg-white rounded-lg shadow-xl p-8 ">
      <!-- Header -->
      <div class="text-center mb-8">
        <img src="@/assets/img/logo.jpg" alt="" class="w-[200px] h-[200px] mx-auto mb-4" />
        <h2 class="text-3xl font-bold text-gray-800">Admin Login</h2>
        <p class="text-gray-600">Please login to access the system</p>
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-6">
        <!-- Error Message -->
        <div
          v-if="error"
          class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
        >
          {{ error }}
        </div>

        <!-- Username Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Username</label>
          <div class="relative">
            <input
              v-model="username"
              type="text"
              required
              placeholder="Enter your username"
              class="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none p-3 pl-10 text-sm text-gray-700 transition-all hover:shadow-md"
            />
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <font-awesome-icon icon="user" />
            </span>
          </div>
        </div>

        <!-- Password Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700">Password</label>
          <div class="relative">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              placeholder="Enter your password"
              class="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none p-3 pl-10 pr-10 text-sm text-gray-700 transition-all hover:shadow-md"
            />
            <span class="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <font-awesome-icon icon="lock" />
            </span>
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-blue-500"
            >
              <font-awesome-icon :icon="showPassword ? 'eye-slash' : 'eye'" />
            </button>
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-md text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300"
        >
          <span v-if="loading" class="flex items-center">
            <svg
              class="animate-spin h-5 w-5 text-white mr-2"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            Logging in...
          </span>
          <span v-else>Login</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { authService } from "@/services/auth"; // นำเข้า authService
export default {
  name: "AdminLogin",
  data() {
    return {
      username: "",
      password: "",
      loading: false,
      error: null,
      showPassword: false,
    };
  },
  methods: {
    async handleLogin() {
      this.loading = true;
      this.error = null;

      try {
        // เรียก authService เพื่อเช็ค login กับ API
        const token = await authService.login(this.username, this.password);

        // เก็บ token และเปลี่ยนเส้นทางไปหน้า /app
        localStorage.setItem("admin-token", token);
        localStorage.setItem(
          "admin-user",
          JSON.stringify({ username: this.username })
        );

        this.$router.push("/app");
      } catch (err) {
        this.error = "Invalid username or password";
      } finally {
        this.loading = false;
      }
    },
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
  },
};
</script>