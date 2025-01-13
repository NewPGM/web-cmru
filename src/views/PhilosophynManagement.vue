// src/views/PhilosophyManagement.vue
<template>
  <div class="flex-1 p-6">
    <div class="font-bold text-center mb-6 bg-white p-4 mb-4 border border-gray-300 lg:text-[30px] sm:text-[8px]">
      หน้าจัดการฐานข้อมูลปรัชญาและวิสัยทัศน์
    </div>
    <div v-if="loading" class="text-center text-gray-600">
      กำลังโหลดข้อมูล...
    </div>
    <div v-else class="p-6 bg-white text-black grid grid-cols-1 gap-6 border border-gray-300">
      <TableComponent
        :textHeader="textphilosophy"
        :headers="philosophyHeaders"
        :data="philosophyData"
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
import { PhilosophyAPI } from '@/services/api'
import TableComponent from "@/components/TableComponent.vue"

export default {
  name: "philosophynManagement",
  components: {
    TableComponent,
  },

  data() {
    return {
      textphilosophy: "ข้อมูลปรัชญาและวิสัยทัศน์",
      philosophyHeaders: ["ID", "ปรัชญาและวิสัยทัศน์"],
      philosophyData: [],
      loading: false,
      error: null,
    }
  },

  created() {
    this.fetchPhilosophyData()
  },

  methods: {
    async fetchPhilosophyData() {
      this.loading = true
      this.error = null
      try {
        const { data } = await PhilosophyAPI.getAll()
        this.philosophyData = data.map((philosophy) => [
        philosophy.Philosophy_id,
        philosophy.Philosophy_name,
        ])
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลห้อง:", error)
        this.error = "ไม่สามารถดึงข้อมูลห้องได้"
      } finally {
        this.loading = false
      }
    },

    async handleAdd(newRow) {
      const [Philosophy_name] = newRow
      if (!Philosophy_name) {
        this.error = "กรุณากรอกชื่อห้อง"
        return
      }

      try {
        await PhilosophyAPI.create({ Philosophy_name })
        await this.fetchPhilosophyData()
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล:", error)
        this.error = error.response?.data || "ไม่สามารถเพิ่มข้อมูลได้"
      }
      console.log(newRow);
    },

    async handleDelete(id) {
      try {
        await PhilosophyAPI.delete(id)
        await this.fetchPhilosophyData()
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", error)
        this.error = error.response?.data || "ไม่สามารถลบข้อมูลได้"
      }
    },

    async handleUpdate({ updatedRow }) {
      const [id, Philosophy_name] = updatedRow
      if (!Philosophy_name) {
        this.error = "กรุณากรอกชื่อห้อง"
        return
      }

      try {
        await PhilosophyAPI.update(id, { Philosophy_name })
        await this.fetchPhilosophyData()
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