<template>
  <div class="flex-1 p-6">
    <div class="font-bold text-center mb-6 bg-white p-4 mb-4 border border-gray-300 lg:text-[30px] sm:text-[8px]">
      หน้าจัดการฐานข้อมูลวิชา
    </div>
    <div v-if="loading" class="text-center text-gray-600">
      กำลังโหลดข้อมูล...
    </div>
    <div v-else class="p-6 bg-white text-black grid grid-cols-1 gap-6 border border-gray-300">
      <table-component
        :textHeader="subjects"
        :headers="subjectsHeaders"
        :data="subjectsData"
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
import { subjectAPI } from '@/services/api'
import TableComponent from "@/components/TableComponent.vue"

export default defineComponent({
  name: "subjectsManagement",
  
  components: {
    TableComponent,
  },

  data() {
    return {
      subjects: "ข้อมูลวิชา",
      subjectsHeaders: ["ID","รหัสวิชา", "ชื่อวิชา"],
      subjectsData: [],
      loading: false,
      error: null,
    }
  },
  async created() {
    await this.fetchSubjects()
  },

  methods: {

async fetchSubjects() {
  try {
    const { data } = await subjectAPI.getAll();
    this.subjectsData = data.map((subject) => ([
       subject.subject_id,
      subject.subject_code,
      subject.subject_name
    ]));
    console.log("subjects", this.subjectsData);
  } catch (error) {
    console.error("เกิดข้อผิดพลาดในการดึงข้อมูลวิชา:", error);
    this.error = "ไม่สามารถดึงข้อมูลวิชาได้";
  }
},
    async handleAdd(newRow) {
      const [subject_code,subject_name] = newRow
      // if ( !subject_code || !subject_name) {
      //   this.error = "กรุณากรอกข้อมูลให้ครบถ้วน"
      //   return
      // }

      try {
        await subjectAPI.create({ 
          subject_code: subject_code,
          subject_name: subject_name,
        })
        await this.fetchSubjects()
        this.error = null
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล:", error)
        this.error = error.response?.data || "ไม่สามารถเพิ่มข้อมูลได้"
      }
    },

    async handleDelete(id) {
      try {
        await subjectAPI.delete(id)
        await this.fetchSubjects()
        this.error = null
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", error)
        this.error = error.response?.data || "ไม่สามารถลบข้อมูลได้"
      }
    },

    async handleUpdate({ updatedRow }) {
      const [id, subject_code, subject_name] = updatedRow
      if (!id || !subject_code || !subject_name) {
        this.error = "กรุณากรอกข้อมูลให้ครบถ้วน"
        return
      }

      try {
        await subjectAPI.update(id, {
          subject_code: subject_code,
          subject_name: subject_name
        })
        await this.fetchSubjects()
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