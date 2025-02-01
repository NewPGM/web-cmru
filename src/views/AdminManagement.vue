// src/views/coursesManagement.vue
<template>
  <div class="flex-1 p-6 bg-red">
    <div class="font-bold text-center mb-6 bg-white p-4 mb-4 border border-gray-300 lg:text-[30px] sm:text-[8px]">
      หน้าจัดการฐานข้อมูล Admin
    </div>
    <div v-if="loading" class="text-center text-gray-600">
      กำลังโหลดข้อมูล...
    </div>
    <div v-else class="p-6 bg-white text-black grid grid-cols-1 gap-6 border border-gray-300">
      <TableComponent
        :textHeader="textcourses"
        :headers="adminHeaders"
        :data="adminData"
        @add="handleAdd"
        @delete="handleDelete"
        @update="handleUpdate"
      />
    </div>
    <div v-if="error" class="text-red-600 text-center mt-4">
      {{ error }}
    </div>
  </div>
</template>

<script>
import { adminAPI } from '@/services/api'
import TableComponent from "@/components/TableComponent.vue"

export default {
  name: "adminManagement",
  components: {
    TableComponent,
  },

  data() {
    return {
      textcourses: "ข้อมูล Admin",
      adminHeaders: ["ID", "Username", "password", "Email"],
      adminData: [],
      loading: false,
      error: null,
    }
  },

  created() {
    this.fetchadminData()
  },

  methods: {
    async fetchadminData() {
      this.loading = true
      this.error = null
      try {
        const { data } = await adminAPI.getAll()
        this.adminData = data.map((admin) => [
        admin.admin_id,
        admin.username,
        admin.password,
        admin.email_admin
        ])
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสาขา:", error)
        this.error = "ไม่สามารถดึงข้อมูลห้องได้"
      } finally {
        this.loading = false
      }
    },

    async handleAdd(newRow) {
      const [username, password, email_admin] = newRow
      if (!username) {
        this.error = "กรุณากรอกชื่อสาขา"
        return
      }
      if (!password) {
        this.error = "กรุณากรอกชื่อย่อสาขา"
        return
      }

      if (!email_admin) {
        this.error = "กรุณากรอกชื่อย่อสาขา"
        return
      }

      try {
        await adminAPI.create({ username , password , email_admin })
        await this.fetchadminData()
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล:", error)
        this.error = error.response?.data || "ไม่สามารถเพิ่มข้อมูลได้"
      }
      
    },

    async handleDelete(id) {
      try {
        await adminAPI.delete(id)
        await this.fetchadminData()
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", error)
        this.error = error.response?.data || "ไม่สามารถลบข้อมูลได้"
      }
    },

    async handleUpdate({ updatedRow }) {
      const [id, username, password, email_admin] = updatedRow
      if (!username) {
        this.error = "กรุณากรอกชื่อห้อง"
        return
      }

      if (!password) {
        this.error = "กรุณากรอกชื่อย่อสาขา"
        return
      }

      if (!email_admin) {
        this.error = "กรุณากรอกชื่อย่อสาขา"
        return
      }

      try {
        await adminAPI.update(id, { username, password, email_admin })
        await this.fetchadminData()
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล:", error)
        this.error = error.response?.data || "ไม่สามารถอัปเดตข้อมูลได้"
      }
    },
  },
}
</script>

<style scoped>
.colorBG {
  background-color: #f4f6ff;
}
</style>