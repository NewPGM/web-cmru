// src/views/Locations.vue
<template>
  <div class="flex-1 p-6">
    <div class="text-2xl font-bold text-center mb-6 bg-white p-4 mb-4 border border-gray-300">
      หน้าจัดการฐานข้อมูล
    </div>
    <div v-if="loading" class="text-center text-gray-600">
      กำลังโหลดข้อมูล...
    </div>
    <div v-else class="p-6 bg-white text-black grid grid-cols-1 gap-6 border border-gray-300">
      <TableComponent
        :textHeader="textLocations"
        :headers="locationHeaders"
        :data="LocationData"
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
import { LocationAPI } from '@/services/api'
import TableComponent from "@/components/TableComponent.vue"

export default {
  name: "LocationManagement",
  components: {
    TableComponent,
  },

  data() {
    return {  
      textLocations: "ข้อมูลห้อง",
      locationHeaders: ["ID", "ชื่อภาควิชา", "ชื่ออาคาร", "ที่อยู่"],
      LocationData: [],
      loading: false,
      error: null,
    }
  },

  created() {
    this.fetchLocationData()
  },

  methods: {
    async fetchLocationData() {
      this.loading = true
      this.error = null
      try {
        const { data } = await LocationAPI.getAll()
        this.LocationData = data.map((Location) => [
          Location.location_id,
          Location.location_name,
          Location.building,
          Location.address,
        ])
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลที่อยู่:", error)
        this.error = "ไม่สามารถดึงข้อมูลที่อยู่ได้"
      } finally {
        this.loading = false
      }
    },

    async handleAdd(newRow) {
      const [location_name,building,address] = newRow
      if (!location_name) {
        this.error = "กรุณากรอกชื่อภาควิชา"
        return
      }
      if (!building) {
        this.error = "กรุณากรอกอาคาร"
        return
      }
      if (!address) {
        this.error = "กรุณากรอกที่อยู่"
        return
      }

      try {
        await LocationAPI.create({ location_name,building,address })
        await this.fetchLocationData()
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล:", error)
        this.error = error.response?.data || "ไม่สามารถเพิ่มข้อมูลได้"
      }
    },

    async handleDelete(id) {
      try {
        await LocationAPI.delete(id)
        await this.fetchLocationData()
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", error)
        this.error = error.response?.data || "ไม่สามารถลบข้อมูลได้"
      }
    },

    async handleUpdate({ updatedRow }) {
      const [id, location_name , building, address] = updatedRow
      if (!location_name) {
        this.error = "กรุณากรอกชื่อภาควิชา"
        return
      }
      if (!building) {
        this.error = "กรุณากรอกอาคาร"
        return
      }
      if (!address) {
        this.error = "กรุณากรอกที่อยู่"
        return
      }

      try {
        await LocationAPI.update(id, { location_name , building, address })
        await this.fetchLocationData()
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