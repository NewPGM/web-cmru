// src/views/coursesManagement.vue
<template>
  <div class="flex-1 p-6 bg-red">
    <div class="font-bold text-center mb-6 bg-white p-4 mb-4 border border-gray-300 lg:text-[30px] sm:text-[8px]">
      หน้าจัดการฐานข้อมูลสาขา
    </div>
    <div v-if="loading" class="text-center text-gray-600">
      กำลังโหลดข้อมูล...
    </div>
    <div v-else class="p-6 bg-white text-black grid grid-cols-1 gap-6 border border-gray-300">
      <TableComponent
        :textHeader="textcourses"
        :headers="coursesHeaders"
        :data="coursesData"
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
import { CourseAPI } from '@/services/api'
import TableComponent from "@/components/TableComponent.vue"

export default {
  name: "RoomManagement",
  components: {
    TableComponent,
  },

  data() {
    return {
      textcourses: "ข้อมูลสาขา",
      coursesHeaders: ["ID", "รายชื่อสาขา", "ชื่อย่อสาขา"],
      coursesData: [],
      loading: false,
      error: null,
    }
  },

  created() {
    this.fetchcoursesData()
  },

  methods: {
    async fetchcoursesData() {
      this.loading = true
      this.error = null
      try {
        const { data } = await CourseAPI.getAll()
        this.coursesData = data.map((courses) => [
        courses.course_id,
        courses.course_name,
        courses.abbreviation
        ])
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลสาขา:", error)
        this.error = "ไม่สามารถดึงข้อมูลห้องได้"
      } finally {
        this.loading = false
      }
    },

    async handleAdd(newRow) {
      const [course_name, abbreviation] = newRow
      if (!course_name) {
        this.error = "กรุณากรอกชื่อสาขา"
        return
      }
      if (!abbreviation) {
        this.error = "กรุณากรอกชื่อย่อสาขา"
        return
      }

      try {
        await CourseAPI.create({ course_name , abbreviation })
        await this.fetchcoursesData()
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล:", error)
        this.error = error.response?.data || "ไม่สามารถเพิ่มข้อมูลได้"
      }
      
    },

    async handleDelete(id) {
      try {
        await CourseAPI.delete(id)
        await this.fetchcoursesData()
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", error)
        this.error = error.response?.data || "ไม่สามารถลบข้อมูลได้"
      }
    },

    async handleUpdate({ updatedRow }) {
      const [id, course_name, abbreviation] = updatedRow
      if (!course_name) {
        this.error = "กรุณากรอกชื่อห้อง"
        return
      }

      if (!abbreviation) {
        this.error = "กรุณากรอกชื่อย่อสาขา"
        return
      }

      try {
        await CourseAPI.update(id, { course_name, abbreviation })
        await this.fetchcoursesData()
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