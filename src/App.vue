<template>
  <div
    v-if="isReady"
    :class="['h-screen flex flex-col w-full', route.path === '/app' ? 'bg-app' : 'bg-default w-full']"
  >
    <!-- Authenticated layout -->
    <template v-if="isAuthenticated">
      <HeaderBar class="fixed top-0 left-0 w-full h-28 bg-white shadow-md z-50" />
      
      <div class="flex pt-16">
        <!-- <MenuBar class="fixed top-28 left-0 w-70 bg-white shadow-md h-[calc(100vh-4rem)]"/> -->
        <main class="flex-1 p-6 mt-12 sm:ml-0  lg:ml-72">
          <router-view />
        </main>
      </div>
    </template>

    <!-- Login page -->
    <template v-else>
      <router-view />
    </template>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import HeaderBar from '@/components/HeaderBar.vue'
// import MenuBar from '@/components/MenuBar.vue'

export default {
  name: 'App',
  components: {
    HeaderBar,
    // MenuBar,
  },
  setup() {
    const isAuthenticated = ref(false)
    const isReady = ref(false)
    const router = useRouter()
    const route = useRoute()

    const checkAuth = () => {
      // ตรวจสอบ token ใน localStorage
      isAuthenticated.value = localStorage.getItem('admin-token') !== null
      console.log('Authenticated:', isAuthenticated.value)
    }

    const handleNavigation = () => {
      // ตั้งค่า isReady ให้เป็น true สำหรับทุกหน้า
      isReady.value = true

      // ตรวจสอบการล็อกอินเฉพาะสำหรับ /app
      if (!route.path === '/login') {
        console.log('route:', route.path.value);
        
      }
      {
        checkAuth()
      }
    }

    onMounted(() => {
      handleNavigation()

      // ตรวจสอบการเปลี่ยนเส้นทาง
      router.afterEach((to) => {
        // ตั้งค่า isReady เป็น true ทันทีเมื่อเปลี่ยนหน้า
        isReady.value = true

        // ตรวจสอบการล็อกอินเมื่อเข้า /app
        if (to.path === '/app') {
          checkAuth()
        }
      })
    })

    return {
      isAuthenticated,
      isReady,
      route, // ต้องใช้ route เพื่อเข้าถึง path
    }
  },
}
</script>

<style>
/* ป้องกัน scrollbar กระโดดเมื่อ content ยาว */
html {
  overflow-y: scroll;
}

/* พื้นหลังสำหรับหน้า /app */
.bg-app {
  background-image: 
    linear-gradient(to right, rgba(25, 136, 247, 1) 18%, rgba(247, 176, 24, 0.67)), /* Gradient สีฟ้า */
    url('@/assets/img/cmru_bg.jpg'); /* รูปภาพพื้นหลัง */
  background-size: cover; /* ขยายรูปให้เต็มพื้นที่ */
  background-position: center; /* จัดตำแหน่งรูปให้อยู่ตรงกลาง */
  background-repeat: no-repeat; /* ป้องกันรูปทำซ้ำ */
}

/* พื้นหลังเริ่มต้น */
.bg-default {
  background-color: #f3f4f6; /* หรือพื้นหลังสีเทา */
  background-size: cover;
  background-position: center;
  
}
</style>
