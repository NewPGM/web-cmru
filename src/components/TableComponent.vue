<!-- src/components/TableComponent.vue -->
<template>
  <div>
    <div class="flex justify-between">
    <h2 class="text-2xl font-bold mt-4">{{ textHeader }}</h2>
    <button @click="openAddDialog" class="add-button">เพิ่มข้อมูล</button>
  </div>
    <table>
      <thead>
        <tr class="h-color text-center">
          <th v-for="header in headers" :key="header">{{ header }}</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in displayedData" :key="rowIndex">
          <td v-for="(cell, cellIndex) in row" :key="cellIndex">
            {{ getDisplayName(headers[cellIndex], cell) }}
          </td>
          <td width="100px">
            <div class="flex">
            <button class="bg-[#228B22]" @click="openEditDialog(row, rowIndex)"><font-awesome-icon icon="edit" /></button>
            <button class="bg-red-500" @click="deleteRow(rowIndex)"><font-awesome-icon icon="trash" /></button>
          </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
    <!-- Button to open Add Dialog -->
    

    <!-- Add Dialog -->
    <div v-if="showAddDialog" class="modal-overlay">
      <div class="modal-content">
        <div class="bg-[#3260a5] p-4 border border-[#3260a5] rounded-t-md">
        <p class="text-2xl text-white">เพิ่มข้อมูลใหม่</p>
      </div>
      <div class="m-4">
        <div v-for="(header, index) in headers.slice(1)" :key="index" class="flex flex-col mt-4">
          <div class="flex">
          <label>{{ header }}</label>
          <p class="text-red-500">*</p>
        </div>
          <template v-if="isSelectionField(header)">
            <select v-model="newRow[index]">
              <option value="" disabled>เลือก{{ header }}</option>
              <option v-for="option in getOptionsForField(header)" :key="option.id" :value="option.id">
                {{ option.name }}
              </option>
            </select>
          </template>
          <template v-else>
            <textarea class="border border-gray-300 mt-1 p-2 rounded" v-model="newRow[index]" :placeholder="'กรอก ' + header" />
          </template>
        </div>
        <div class="flex justify-center mt-4 w-full">
        <button class="bg-[#3260a5] w-full "  @click="addRow">เพิ่ม</button>
        <button class="bg-[#3260a5] w-full" @click="closeAddDialog">ยกเลิก</button>
      </div>
      </div>
    </div>

   
  </div>
   <!-- Edit Dialog -->
   <div v-if="showEditDialog" class="modal-overlay">
      <div class="modal-content">
        <div class="bg-[#3260a5] p-4 border border-[#3260a5] rounded-t-md">
        <p class="text-2xl text-white">แก้ไขข้อมูล</p>
        </div>
      <div class="m-4 ">
      <div v-for="(header, index) in headers.slice(1)" :key="index" class="flex flex-col mt-4">
          <div class="flex">
          <label>{{ header }}</label>
          <p class="text-red-500">*</p>
        </div>
          <template v-if="isSelectionField(header) ">
            <select v-model="editRow[index + 1]">
              <option value="" disabled>เลือก{{ header }}</option>
              <option v-for="option in getOptionsForField(header)" :key="option.id" :value="option.id">
                {{ option.name }}
              </option>
            </select>
          </template>
          <template v-else>
            <textarea class="border border-gray-300 mt-1 p-2 rounded" v-model="editRow[index + 1]" :placeholder="'แก้ไข ' + header" />
          </template>
        </div>
        <div class="flex justify-center mt-4 w-full">
        <button class="bg-[#3260a5] mt-4 w-full" @click="saveRow">บันทึก</button>
        <button class="bg-[#3260a5] mt-4 w-full" @click="closeEditDialog">ยกเลิก</button>
      </div>
      </div>
    </div>
    </div>
</template>


<script>
export default {
  props: {
    textHeader: String,
    headers: Array,
    data: Array,
    roomOptions: {
      type: Array,
      default: () => []
    },
    instructorOptions: {
      type: Array,
      default: () => []
    },
    subjectOptions: {
      type: Array,
      default: () => []
    },
    trainingPhraseOptions: {
      type: Array,
      default: () => []
    },
    intentOptions: {
      type: Array,
      default: () => []
    },

  },
  
  data() {
    return {
      internalData: [...this.data],
      editRowIndex: null,
      editRow: [],
      showAddForm: false,
      newRow: Array(this.headers.length - 1).fill(""),
      errorMessage: "",
      showAddDialog: false,
      showEditDialog: false,
      indexs: 1
    };
  },

  watch: {
    data(newData) {
      this.internalData = [...newData];
    }
  },

  methods: {
    isSelectionField(header) {
      return ['ห้องพัก', 'ข้อมูลอาจารย์', 'ข้อมูลวิชา','Intent (หมวดหมู่)'].includes(header);
    },

    getOptionsForField(header) {
      switch (header) {
        case 'ห้องพัก':
          return this.roomOptions.map(room => ({
            id: room.room_id,
            name: room.room_name
          }));
        case 'ข้อมูลอาจารย์':
          return this.instructorOptions.map(instructor => ({
            id: instructor.instructor_id,
            name: instructor.name
          }));
        case 'ข้อมูลวิชา':
          return this.subjectOptions.map(subject => ({
            id: subject.subject_id,
            name: subject.subject_code
          }));
        case 'Intent (หมวดหมู่)':
          return this.intentOptions.map(intent  => ({
            id: intent .intent_id,
            name: intent .description
        }))
        default:
          return [];
      }
    },

    getDisplayName(header, value) {
      if (!value) return "ไม่ระบุ";
      const options = this.getOptionsForField(header);
      const option = options.find(opt => opt.id === parseInt(value));
      return option ? option.name : value;
    },

    toggleAddRow() {
      this.showAddForm = !this.showAddForm;
      this.newRow = Array(this.headers.length - 1).fill("");
      this.errorMessage = "";
      
    },

    openAddDialog() {
      this.showAddDialog = true;
      this.newRow = Array(this.headers.length - 1).fill("");
    },
    closeAddDialog() {
      this.showAddDialog = false;
    },

    addRow() {
      if (this.newRow.some(field => !field)) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }
      this.$emit("add", this.newRow);
      this.closeAddDialog();
    },

    openEditDialog(row, index) {
      this.showEditDialog = true;
      this.editRowIndex = index;
      this.editRow = [...row];
      console.log("editRow",this.editRow);
      
    },
    closeEditDialog() {
      this.showEditDialog = false;
    },
    saveRow() {
      if (this.editRow.some(field => !field)) {
        alert("กรุณากรอกข้อมูลให้ครบถ้วน");
        return;
      }
      this.$emit("update", { updatedRow: this.editRow });
      this.closeEditDialog();
    },

    deleteRow(index) {
      const id = this.internalData[index][0];
      this.$emit("delete", id);
    },

    cancelAddRow() {
      this.showAddForm = false;
      this.errorMessage = "";
    },
  },

  computed: {
    displayedData() {
      return this.internalData.slice().sort((a, b) => a[0] - b[0]);
    }
  }
};
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* เพิ่มบรรทัดนี้ */
}

.modal-content {
  background: white;
  /* padding: 20px; */
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  z-index: 10000; /* เพิ่มบรรทัดนี้ */
  position: relative; /* เพิ่มบรรทัดนี้ */
}

button {
  margin: 5px;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

th, td {
  border: 1px solid #3260a5;
  padding: 8px;
  text-align: left;
  
}

th {
  background-color: #3260a5;
}

button {
  /* background-color: #3260a5; */
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  border-radius: 4px;
  margin-right: 4px;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #1976d2;
}

.add-button {
  margin-top: 1rem;
  background-color: #3260a5;
  padding: 10px;
  margin-right:10px ;
}

.add-button:hover {
  background-color: #1976d2;
}

.add-form {
  width: 30%;
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid #3260a5;
  border-radius: 8px;
  background-color: #f9f9f9;
}

select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 4px;
}

.error-message {
  color: red;
  margin-top: 1rem;
}

.h-color {
  color: #ffffff;
}
</style>