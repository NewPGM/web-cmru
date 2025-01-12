<template>
  <div class="flex-1 p-6">
    <div class="text-2xl font-bold text-center mb-6 bg-white p-4 mb-4 border border-gray-300">
      หน้าจัดการฐานข้อมูล
    </div>
    <div v-if="loading" class="text-center text-gray-600">
      กำลังโหลดข้อมูล...
    </div>
    <div v-else class="p-6 bg-white text-black grid grid-cols-1 gap-6 border border-gray-300">
      <table-component
        :textHeader="textinstructor_sj"
        :headers="instructor_sjHeaders"
        :data="instructor_sjData"
        :room-options="subjectsData"
        :instructorOptions="instructorsData"
        :subjectOptions="subjectsData"
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
import { defineComponent } from 'vue'
import { instructorAPI, subjectAPI, instructorSjAPI } from '@/services/api'
import TableComponent from "@/components/TableComponent.vue"

export default defineComponent({
  name: "instructor_sjManagement",
  
  components: {
    TableComponent,
  },

  data() {
    return {
      textinstructor_sj: "ข้อมูลวิชาของอาจารย์",
      instructor_sjHeaders: ["ID", "ข้อมูลอาจารย์", "ข้อมูลวิชา"],
      instructor_sjData: [],
      subjectsData: [],
      instructorsData: [],
      loading: false,
      error: null,
    }
  },
  async created() {
    await this.fetchInstructorSjData()
    await this.fetchSubjects()
    await this.fetchInstructors()
  },

  methods: {
    async fetchInstructors() {
  try {
    const { data } = await instructorAPI.getAll();
    this.instructorsData = data.map((instructor) => ({
      instructor_id: instructor.instructor_id,
      name: instructor.name,
    }));
    console.log("instructors", this.instructorsData);
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลอาจารย์:", error);
    this.error = "ไม่สามารถดึงข้อมูลอาจารย์ได้";
  }
},

async fetchSubjects() {
  try {
    const { data } = await subjectAPI.getAll();
    this.subjectsData = data.map((subject) => ({
      subject_id: subject.subject_id,
      subject_code: subject.subject_code,
    }));
    console.log("subjects", this.subjectsData);
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลวิชา:", error);
    this.error = "ไม่สามารถดึงข้อมูลวิชาได้";
  }
},
    async fetchInstructorSjData() {
      this.loading = true
      this.error = null
      try {
        const { data } = await instructorSjAPI.getAll()
        this.instructor_sjData = data.map((item) => [
          item.instructor_sj_id,
          item.instructor_id,
          item.subject_id
        ])
        console.log(this.instructor_sjData)
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลวิชาของอาจารย์:", error)
        this.error = "ไม่สามารถดึงข้อมูลวิชาของอาจารย์ได้"
      } finally {
        this.loading = false
      }
    },

    async handleAdd(newRow) {
      const [instructor_id, subject_id] = newRow
      if (!instructor_id || !subject_id) {
        this.error = "กรุณากรอกข้อมูลให้ครบถ้วน"
        return
      }

      try {
        await instructorSjAPI.create({ 
          instructor_id: parseInt(instructor_id),
          subject_id: parseInt(subject_id)
        })
        await this.fetchInstructorSjData()
        this.error = null
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล:", error)
        this.error = error.response?.data || "ไม่สามารถเพิ่มข้อมูลได้"
      }
    },

    async handleDelete(id) {
      try {
        await instructorSjAPI.delete(id)
        await this.fetchInstructorSjData()
        this.error = null
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", error)
        this.error = error.response?.data || "ไม่สามารถลบข้อมูลได้"
      }
    },

    async handleUpdate({ updatedRow }) {
      const [id, instructor_id, subject_id] = updatedRow
      if (!id || !instructor_id || !subject_id) {
        this.error = "กรุณากรอกข้อมูลให้ครบถ้วน"
        return
      }

      try {
        await instructorSjAPI.update(id, {
          instructor_id: parseInt(instructor_id),
          subject_id: parseInt(subject_id)
        })
        await this.fetchInstructorSjData()
        this.error = null
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล:", error)
        this.error = error.response?.data || "ไม่สามารถอัปเดตข้อมูลได้"
      }
    },
  },
})
</script>

<style scoped>
.colorBG {
  background-color: #f4f6ff;
}
</style>