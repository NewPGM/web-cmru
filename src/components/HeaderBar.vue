<!-- src/components/HeaderBar.vue -->
<template>
  <div class="fixed top-0 left-0 w-full h-20 bg-white shadow-md z-50">
    <div class="flex justify-between items-center px-6 h-full">
      <div class="flex items-center">
        <div class="lg:w-20 h-20 sm:w-16 h-16">
          <img src="@/assets/img/logo.jpg" alt="Logo" class="w-full h-full object-contain" />
        </div>
        <button 
          @click="toggleMenu" 
          class="px-4 py-2 text-3xl"
          aria-label="Toggle Menu"
        >
          ≡
        </button>
      </div>

      <MenuBar 
        v-if="isMenuVisible" 
        @close="closeMenu"  
        class="fixed top-20 left-0 w-72 bg-white shadow-md h-[calc(100vh-5rem)] sm:w-72"
      />
        
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-4 p-2 bg-blue-50 rounded-md shadow-md">
  <div class="flex items-center gap-2 text-blue-600">
    <!-- ไอคอนผู้ใช้งาน -->
    <font-awesome-icon icon="user-circle" class="text-2xl" />
    <!-- ข้อความต้อนรับ -->
    <div>
      <span class="font-semibold text-gray-700">ยินดีต้อนรับ : </span>
      <span class="text-gray-800">{{ userData?.username || 'Loading...' }}</span>
    </div>
  </div>
</div>

        
        
        <button
          @click="handleLogout"
          class="px-4 py-2 bg-red-500 hover:bg-red-600 text-sm rounded-md transition-all duration-300 text-white"
        >
          <font-awesome-icon icon="sign-out-alt" class="mr-2 text-white" />
          Logout
        </button>
      </div>
    </div>

    <!-- Confirmation Dialog -->
    <div v-if="showConfirmation" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl">
        <h3 class="text-lg font-medium mb-4">ยืนยันการออกจากระบบ</h3>
        <p class="mb-4">คุณต้องการออกจากระบบใช่หรือไม่?</p>
        <div class="flex justify-center gap-4">
          <button 
            @click="showConfirmation = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800 bg-gray-200 rounded-md w-full"
          >
            ยกเลิก
          </button>
          <button 
            @click="confirmLogout"
            class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 w-full"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MenuBar from '@/components/MenuBar.vue'

export default {
  name: 'HeaderBar',
  components: {
    MenuBar,
  },
  setup() {
    const router = useRouter()
    const route = useRoute()
    
    const showConfirmation = ref(false)
    const isMenuVisible = ref(false)
    const userData = ref(null)

    const handleResize = () => {
      if (window.innerWidth <= 768) {
        isMenuVisible.value = false
      }
    }

    onMounted(() => {
      const userStr = localStorage.getItem('admin-user')
      if (userStr) {
        try {
          userData.value = JSON.parse(userStr)
        } catch (e) {
          console.error('Error parsing user data:', e)
        }
      }

      window.addEventListener('resize', handleResize)
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize)
    })

    const toggleMenu = () => {
      isMenuVisible.value = !isMenuVisible.value
    }

    const closeMenu = () => {
      isMenuVisible.value = false
    }

    const handleLogout = () => {
      showConfirmation.value = true
    }

    const confirmLogout = () => {
      localStorage.removeItem('admin-token')
      showConfirmation.value = false
      router.push('/login').then(() => {
        window.location.reload()
      })
    }

    return {
      showConfirmation,
      isMenuVisible,
      userData,
      route,
      toggleMenu,
      closeMenu,
      handleLogout,
      confirmLogout
    }
  }
}
</script>