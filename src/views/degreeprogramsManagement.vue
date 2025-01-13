// src/views/coursesManagement.vue
<template>
  <div class="flex-1 p-6">
    <div class="font-bold text-center mb-6 bg-white p-4 mb-4 border border-gray-300 lg:text-[30px] sm:text-[8px]">
      หน้าจัดการฐานข้อมูลสาขา
    </div>
    <div v-if="loading" class="text-center text-gray-600">
      กำลังโหลดข้อมูล...
    </div>
    <div v-else class="p-6 bg-white text-black grid grid-cols-1 gap-6 border border-gray-300">
      <TableComponent
        :textHeader="textdegreeprograms"
        :headers="degreeprogramsHeaders"
        :data="degreeprogramsData"
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
import { DegreeProgramAPI } from "@/services/api";
import TableComponent from "@/components/TableComponent.vue";

export default {
  name: "degreeprogramsManagement",
  components: {
    TableComponent,
  },

  data() {
    return {
      textdegreeprograms: "ข้อมูลสาขา",
      degreeprogramsHeaders: [
        "ID",
        "ชื่อสาขา(ชื่อเต็ม)",
        "ชื่อสาขา(ชื่อย่อ)",
        "ค่าเทอม",
        "หลักสูตร",
      ],
      degreeprogramsData: [],
      loading: false,
      error: null,
    };
  },

  created() {
    this.fetchDegreeProgramsData();
  },

  methods: {
    async fetchDegreeProgramsData() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await DegreeProgramAPI.getAll();
        console.log(data);

        this.degreeprogramsData = data.map((program) => [
          program.program_id,
          program.full_name,
          program.abbreviation,
          program.tuition_fee,
          program.Bachelor_Programs,
        ]);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูลหลักสูตร:", error);
        this.error = "ไม่สามารถดึงข้อมูลหลักสูตรได้";
      } finally {
        this.loading = false;
      }
    },

    async handleAdd(newRow) {
      const [full_name, abbreviation, tuition_fee, Bachelor_Programs] = newRow;
      if (!full_name) {
        this.error = "กรุณากรอกชื่อสาขา";
        return;
      }
      if (!abbreviation) {
        this.error = "กรุณากรอกชื่อย่อสาขา";
        return;
      }
      const tuitionFeeDecimal = !isNaN(parseFloat(tuition_fee))
    ? parseFloat(tuition_fee).toFixed(2)
    : null;
      try {
        await DegreeProgramAPI.create({
          full_name,
          abbreviation,
          tuition_fee : tuitionFeeDecimal,
          Bachelor_Programs,
        });
        await this.fetchDegreeProgramsData();
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล:", error);
        this.error = error.response?.data || "ไม่สามารถเพิ่มข้อมูลได้";
      }
    },

    async handleDelete(id) {
      try {
        await DegreeProgramAPI.delete(id);
        await this.fetchDegreeProgramsData();
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", error);
        this.error = error.response?.data || "ไม่สามารถลบข้อมูลได้";
      }
    },

    async handleUpdate({ updatedRow }) {
      const [id, full_name, abbreviation, tuition_fee, Bachelor_Programs] =
        updatedRow;
      if (!full_name) {
        this.error = "กรุณากรอกชื่อสาขา";
        return;
      }
      if (!abbreviation) {
        this.error = "กรุณากรอกชื่อย่อสาขา";
        return;
      }

      try {
        await DegreeProgramAPI.update(id, {
          full_name,
          abbreviation,
          tuition_fee,
          Bachelor_Programs,
        });
        await this.fetchDegreeProgramsData();
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล:", error);
        this.error = error.response?.data || "ไม่สามารถอัปเดตข้อมูลได้";
      }
    },
  },
};
</script>

<style scoped>
.colorBG {
  background-color: #f4f6ff;
}
</style>
