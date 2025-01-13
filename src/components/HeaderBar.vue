<!-- src/components/HeaderBar.vue -->
<template>
  <div class="fixed top-0 left-0 w-full h-30 bg-white shadow-md z-50">
    <div class="flex justify-between items-center px-6 h-full">
      <!-- ส่วนอื่นๆ ของ HeaderBar -->
      
      
        <!-- <div class="w-28 h-30">
        <img src="@/assets/img/logo.jpg" class="w-full h-full">
      </div> -->
      <div class="flex items-center">
      <div  class="lg:w-28 h-24 ">
    <img src="@/assets/img/logo.jpg" class="w-full h-full" />
  </div>
  <button 
        @click="toggleMenu" 
        class="px-4 py-2  rounded-md   text-3xl"
      >
      ≡
      </button>
  <!-- ปุ่มเมนู -->
</div>

      <!-- เมนู -->
      <MenuBar v-if="isMenuVisible" @close="closeMenu"  class="fixed top-28 left-0 w-70 bg-white shadow-md h-[calc(100vh-4rem)] sm:w-70"/>
        
        <!-- เพิ่มส่วนแสดงข้อมูล user -->
      <div class="flex items-center gap-4">
        <div class="text-gray-700">
          <span class="font-medium">ยินดีต้อนรับ: </span>
          <span>{{ user ? user.username : 'Loading...' }}</span>
        </div>
        
        <button
          @click="handleLogout"
          class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
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
        <div class="flex justify-end gap-4">
          <button 
            @click="showConfirmation = false"
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            ยกเลิก
          </button>
          <button 
            @click="confirmLogout"
            class="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            ยืนยัน
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRoute, useRouter } from 'vue-router'
import MenuBar from '@/components/MenuBar.vue'
export default {
  name: 'HeaderBar',
  components: {
    MenuBar,
  },
  data() {
    return {
      showConfirmation: false,
      isMenuVisible: false,
      user: null
    }
  },
 created() {
    const user = localStorage.getItem('admin-user');
    if (user) {
      this.user = JSON.parse(user);
    }
 },
 setup() {
    const route = useRoute() // เข้าถึงข้อมูลเส้นทางปัจจุบัน
    const router = useRouter();

    router.afterEach(() => {
      if (window.innerWidth <= 768) {
        this.isMenuVisible = false;
      }
    });
    return {
      route, // ส่งต่อ route ไปใช้งานใน template
    }
  },
  methods: {
    toggleMenu() {
      this.isMenuVisible = !this.isMenuVisible
    },
    closeMenu() {
      this.isMenuVisible = false
    },
    handleLogout() {
      this.showConfirmation = true
    },
    confirmLogout() {
      // ลบ token
      localStorage.removeItem('admin-token')
      
      // ปิด dialog
      this.showConfirmation = false
      
      // redirect ไปหน้า login และรีเฟรชหน้า
      this.$router.push('/login').then(() => {
        window.location.reload()
      })
    }
  }
}
</script>