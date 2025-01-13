<template>
  <div class="flex-1 p-6">
    <div class="font-bold text-center mb-6 bg-white p-4 mb-4 border border-gray-300 lg:text-[30px] sm:text-[8px]">
      หน้าจัดการฐานข้อมูลคำถาม
    </div>
    <div v-if="loading" class="text-center text-gray-600">
      กำลังโหลดข้อมูล...
    </div>
    <div v-else class="p-6 bg-white text-black grid grid-cols-1 gap-6 border border-gray-300">
      <table-component
        :textHeader="textTrainingPhrases"
        :headers="trainingPhrasesHeaders"
        :data="trainingPhrasesData"
        :intentOptions="intentsData"
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
import { defineComponent } from "vue";
import { trainingPhraseAPI, intentAPI } from "@/services/api";
import TableComponent from "@/components/TableComponent.vue";

export default defineComponent({
  name: "TrainingPhrasesManagement",

  components: {
    TableComponent,
  },

  data() {
    return {
      textTrainingPhrases: "จัดการข้อมูล Training Phrases",
      trainingPhrasesHeaders: ["ID", "Intent (หมวดหมู่)", "Phrase (คำถาม)"],
      trainingPhrasesData: [],
      intentsData: [],
      loading: false,
      error: null,
    };
  },

  async created() {
    await this.fetchTrainingPhrasesData();
    await this.fetchIntentsData();
  },

  methods: {
    async fetchTrainingPhrasesData() {
      this.loading = true;
      this.error = null;
      try {
        const { data } = await trainingPhraseAPI.getAll();
        this.trainingPhrasesData = data.map((item) => [
          item.phrase_id,
          item.intent_id,
          item.phrase,
        ]);
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล Training Phrases:", error);
        this.error = "ไม่สามารถดึงข้อมูล Training Phrases ได้";
      } finally {
        this.loading = false;
      }
    },

    async fetchIntentsData() {
      try {
        const { data } = await intentAPI.getAll();
        this.intentsData = data.map(item=> ({
          intent_id: item.intent_id,
          description: item.description,
        }));
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการดึงข้อมูล Intents:", error);
        this.error = "ไม่สามารถดึงข้อมูล Intents ได้";
      } finally {
        this.loading = false;
      }
    },

    async handleAdd(newRow) {
      const [intent_id, phrase] = newRow;
      if (!intent_id || !phrase) {
        this.error = "กรุณากรอกข้อมูลให้ครบถ้วน";
        return;
      }

      try {
        await trainingPhraseAPI.create({
          intent_id: parseInt(intent_id),
          phrase,
        });
        await this.fetchTrainingPhrasesData();
        this.error = null;
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการเพิ่มข้อมูล:", error);
        this.error = error.response?.data || "ไม่สามารถเพิ่มข้อมูลได้";
      }
    },

    async handleDelete(id) {
      try {
        await trainingPhraseAPI.delete(id);
        await this.fetchTrainingPhrasesData();
        this.error = null;
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการลบข้อมูล:", error);
        this.error = error.response?.data || "ไม่สามารถลบข้อมูลได้";
      }
    },

    async handleUpdate({ updatedRow }) {
      const [id, intent_id, phrase] = updatedRow;
      if (!id || !intent_id || !phrase) {
        this.error = "กรุณากรอกข้อมูลให้ครบถ้วน";
        return;
      }

      try {
        await trainingPhraseAPI.update(id, {
          intent_id: parseInt(intent_id),
          phrase,
        });
        await this.fetchTrainingPhrasesData();
        this.error = null;
      } catch (error) {
        console.error("เกิดข้อผิดพลาดในการอัปเดตข้อมูล:", error);
        this.error = error.response?.data || "ไม่สามารถอัปเดตข้อมูลได้";
      }
    },
  },
});
</script>

<style scoped>
.colorBG {
  background-color: #f4f6ff;
}
</style>


<style scoped>
.colorBG {
  background-color: #f4f6ff;
}
</style>