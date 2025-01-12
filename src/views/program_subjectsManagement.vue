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
        :textHeader="textprogram_subjects"
        :headers="program_subjectsHeaders"
        :data="program_subjectsData"
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
import { subjectAPI, programSubjectAPI } from '@/services/api'
import TableComponent from "@/components/TableComponent.vue"

export default defineComponent({
  name: "program_subjectsManagement",
  
  components: {
    TableComponent,
  },

  data() {
    return {
      textprogram_subjects: "ข้อมูลวิชาที่เปิดสอนในแต่ละหลักสูตร",
      program_subjectsHeaders: ["ID", "ข้อมูลหลักสูตร", "ข้อมูลวิชา"],
      program_subjectsData: [],
      subjectsData: [],
      loading: false,
      error: null,
    }
  },
  async created() {
    await this.fetchprogram_subjectsData()
    await this.fetchSubjects()
  },

  methods: {

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
    async fetchprogram_subjectsData() {
      this.loading = true
      this.error = null
      try {
        const { data } = await programSubjectAPI.getAll()
        this.program_subjectsData = data.map((item) => [
          item.program_id,
          item.description,
          item.subject_id
        ])
        console.log(this.program_subjectsData)
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลวิชาของอาจารย์:", error)
        this.error = "ไม่สามารถดึงข้อมูลวิชาของอาจารย์ได้"
      } finally {
        this.loading = false
      }
    },

    async handleAdd(newRow) {
      const [description, subject_id] = newRow
      if (!description || !subject_id) {
        this.error = "กรุณากรอกข้อมูลให้ครบถ้วน"
        return
      }

      try {
        await programSubjectAPI.create({ 
          description,
          subject_id: parseInt(subject_id)
        })
        await this.fetchprogram_subjectsData()
        this.error = null
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล:", error)
        this.error = error.response?.data || "ไม่สามารถเพิ่มข้อมูลได้"
      }
    },

    async handleDelete(id) {
      try {
        await programSubjectAPI.delete(id)
        await this.fetchprogram_subjectsData()
        this.error = null
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", error)
        this.error = error.response?.data || "ไม่สามารถลบข้อมูลได้"
      }
    },

    async handleUpdate({ updatedRow }) {
      const [id, description, subject_id] = updatedRow
      if (!id || !description || !subject_id) {
        this.error = "กรุณากรอกข้อมูลให้ครบถ้วน"
        return
      }

      try {
        await programSubjectAPI.update(id, {
          description,
          subject_id: parseInt(subject_id)
        })
        await this.fetchprogram_subjectsData()
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