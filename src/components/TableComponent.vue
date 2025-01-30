<!-- src/components/TableComponent.vue -->
<template>
  <div class="relative">
    <!-- Header -->
    <div class="flex justify-between">
      <h2 class="font-bold mt-4 sm:text-[10px] lg:text-[25px]">
        {{ textHeader }}
      </h2>
      <button
        @click="openAddDialog"
        class="add-button flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
      >
        <font-awesome-icon icon="plus" />
        <span class="ml-2">เพิ่มข้อมูล</span>
      </button>
    </div>

    <!-- Table Container -->
    <div
      class="overflow-hidden border border-gray-300 rounded-md mt-4 relative"
    >
      <div class="max-h-96 overflow-y-auto">
        <table class="w-full border-collapse">
          <!-- Sticky Header -->
          <thead class="bg-blue-600 text-white sticky top-0 z-10">
            <tr>
              <th
                v-for="header in headers"
                :key="header"
                class="px-4 py-2 text-left"
              >
                {{ header }}
              </th>
              <th class="px-4 py-2 text-left w-32">Actions</th>
            </tr>
          </thead>

          <!-- Table Body -->
          <tbody>
            <tr
              v-for="(row, rowIndex) in displayedData"
              :key="rowIndex"
              class="border-b"
            >
              <td
                v-for="(cell, cellIndex) in row"
                :key="cellIndex"
                class="px-4 py-2"
              >
                {{ getDisplayName(headers[cellIndex], cell) }}
              </td>
              <td class="px-4 py-2">
                <div class="flex space-x-2">
                  <button
                    class="bg-green-500 text-white px-2 py-1 rounded-md hover:bg-green-600"
                    @click="openEditDialog(row, rowIndex)"
                  >
                    <font-awesome-icon icon="edit" />
                  </button>
                  <button
                    class="bg-red-500 text-white px-2 py-1 rounded-md hover:bg-red-600"
                    @click="deleteRow(rowIndex)"
                  >
                    <font-awesome-icon icon="trash" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Sticky Footer -->
  </div>
  <!-- Button to open Add Dialog -->

  <!-- Add Dialog -->
  <div v-if="showAddDialog" class="modal-overlay">
    <div class="modal-content">
      <div class="bg-[#3260a5] p-4 border border-[#3260a5] rounded-t-md">
        <p class="text-2xl text-white">เพิ่มข้อมูลใหม่</p>
      </div>
      <div class="m-4">
        <div
          v-for="(header, index) in headers.slice(1)"
          :key="index"
          class="flex flex-col mt-4"
        >
          <div class="flex">
            <label>{{ header }}</label>
            <p class="text-red-500">*</p>
          </div>
          <template v-if="isSelectionField(header)">
            <select v-model="newRow[index]">
              <option value="" disabled>เลือก{{ header }}</option>
              <option
                v-for="option in getOptionsForField(header)"
                :key="option.id"
                :value="option.id"
              >
                {{ option.name }}
              </option>
            </select>
          </template>
          <template v-else>
            <textarea
              class="border border-gray-300 mt-1 p-2 rounded"
              v-model="newRow[index]"
              :placeholder="'กรอก ' + header"
            />
          </template>
        </div>
        <div class="flex justify-center mt-4 w-full">
          <button class="bg-[#3260a5] w-full hover:bg-blue-700" @click="addRow">
            เพิ่ม
          </button>
          <button
            class="bg-[#3260a5] w-full hover:bg-blue-700"
            @click="closeAddDialog"
          >
            ยกเลิก
          </button>
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
      <div class="m-4">
        <div
          v-for="(header, index) in headers.slice(1)"
          :key="index"
          class="flex flex-col mt-4"
        >
          <div class="flex">
            <label>{{ header }}</label>
            <p class="text-red-500">*</p>
          </div>
          <template v-if="isSelectionField(header)">
            <select v-model="editRow[index + 1]">
              <option value="" disabled>เลือก{{ header }}</option>
              <option
                v-for="option in getOptionsForField(header)"
                :key="option.id"
                :value="option.id"
              >
                {{ option.name }}
              </option>
            </select>
          </template>
          <template v-else>
            <textarea
              class="border border-gray-300 mt-1 p-2 rounded"
              v-model="editRow[index + 1]"
              :placeholder="'แก้ไข ' + header"
            />
          </template>
        </div>
        <div class="flex justify-center mt-4 w-full">
          <button
            class="bg-[#3260a5] mt-4 w-full hover:bg-blue-700"
            @click="saveRow"
          >
            บันทึก
          </button>
          <button
            class="bg-[#3260a5] mt-4 w-full hover:bg-blue-700"
            @click="closeEditDialog"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </div>
  <!-- Delete Confirmation Dialog -->
  <div v-if="showDeleteDialog" class="modal-overlay">
    <div class="modal-content">
      <div class="bg-red-500 p-4 border border-red-500 rounded-t-md">
        <p class="text-2xl text-white">ยืนยันการลบ</p>
      </div>
      <div class="m-4">
        <p>คุณต้องการลบข้อมูลนี้หรือไม่?</p>
        <div class="flex justify-center mt-4 space-x-4">
          <button
            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 active:bg-red-700 w-full"
            @click="confirmDelete"
          >
            ยืนยัน
          </button>
          <button
            class="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 w-full"
            @click="cancelDelete"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { z } from "zod";

export default {
  props: {
    textHeader: String,
    headers: Array,
    data: Array,
    roomOptions: {
      type: Array,
      default: () => [],
    },
    instructorOptions: {
      type: Array,
      default: () => [],
    },
    subjectOptions: {
      type: Array,
      default: () => [],
    },
    trainingPhraseOptions: {
      type: Array,
      default: () => [],
    },
    intentOptions: {
      type: Array,
      default: () => [],
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
      indexs: 1,
      showDeleteDialog: false,
      deleteRowIndex: null,
    };
  },

  watch: {
    data(newData) {
      this.internalData = [...newData];
    },
  },

  methods: {
    isSelectionField(header) {
      return [
        "ห้องพัก",
        "ข้อมูลอาจารย์",
        "ข้อมูลวิชา",
        "Intent (หมวดหมู่)",
      ].includes(header);
    },

    getOptionsForField(header) {
      switch (header) {
        case "ห้องพัก":
          return this.roomOptions.map((room) => ({
            id: room.room_id,
            name: room.room_name,
          }));
        case "ข้อมูลอาจารย์":
          return this.instructorOptions.map((instructor) => ({
            id: instructor.instructor_id,
            name: instructor.name,
          }));
        case "ข้อมูลวิชา":
          return this.subjectOptions.map((subject) => ({
            id: subject.subject_id,
            name: subject.subject_code,
          }));
        case "Intent (หมวดหมู่)":
          return this.intentOptions.map((intent) => ({
            id: intent.intent_id,
            name: intent.description,
          }));
        default:
          return [];
      }
    },

    getDisplayName(header, value) {
     
      if (header === "password") return "********";
      if (!value) return "ไม่ระบุ";
      const options = this.getOptionsForField(header);
      const option = options.find((opt) => opt.id === parseInt(value));
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
      const emailSchema = z
        .string()
        .min(1, "กรุณากรอกอีเมล")
        .email("กรุณากรอกอีเมลให้ถูกต้อง A-Z, a-z, 0-9, ., _, - @ เท่านั้น")
        .refine((email) => email.includes("@"), {
          message: "กรุณากรอกอีเมลที่มีเครื่องหมาย @",
        })
        .refine(
          (email) =>
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
          {
            message: "กรุณากรอกอีเมลที่มีอักษรพิเศษที่ถูกต้อง",
          }
        );
      const phoneSchema = z
        .string()
        .regex(/^[0-9]+$/, "กรุณากรอกเบอร์โทรให้ถูกต้อง 0-9 เท่านั้น")
        .min(10, "กรุณากรอกเบอร์โทรศัพท์อย่างน้อย 10 หลัก");
      const requiredField = z.string().min(1, "กรุณากรอกข้อมูลให้ครบถ้วน");

      const roomSchema = z.union([
        z.string().refine((value) => value.trim().length > 0, {
          message: "กรุณาเลือกห้องพัก",
        }),
        z.number().refine((value) => value.toString().trim().length > 0, {
          message: "กรุณาเลือกห้องพัก",
        }),
      ]);


      const validationResults = [];

      // ตรวจสอบข้อมูลที่กรอกในแถวใหม่
      this.newRow.forEach((field, index) => {
        const header = this.headers[index + 1]; // สมมติว่า headers เริ่มจาก index 1
        let result;

        if (header === "Email") {
          result = emailSchema.safeParse(field);
        } else if (header === "เบอร์โทรศัพท์") {
          result = phoneSchema.safeParse(field);
        } else if (header === "ห้องพัก") {
          result = roomSchema.safeParse(field);
        } else {
          result = requiredField.safeParse(field);
        }

        if (!result.success) {
          validationResults.push({
            header,
            message: result.error.errors[0].message,
          });
        }
      });

      if (validationResults.length > 0) {
        // แสดงข้อความผิดพลาด
        alert(
          validationResults
            .map((err) => `${err.header}: ${err.message}`)
            .join("\n")
        );
        return;
      }

      this.$emit("add", this.newRow);
      this.closeAddDialog();
    },

    openEditDialog(row, index) {
      this.showEditDialog = true;
      this.editRowIndex = index;
      this.editRow = [...row];
      console.log("editRow", this.editRow);
    },
    closeEditDialog() {
      this.showEditDialog = false;
    },
    saveRow() {
      const emailSchema = z
        .string()
        .min(1, "กรุณากรอกอีเมล")
        .email("กรุณากรอกอีเมลให้ถูกต้อง")
        .refine((email) => email.includes("@"), {
          message: "กรุณากรอกอีเมลที่มีเครื่องหมาย @",
        })
        .refine(
          (email) =>
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email),
          {
            message: "กรุณากรอกอีเมลที่มีอักษรพิเศษที่ถูกต้อง",
          }
        );
      const phoneSchema = z
        .string()
        .regex(/^[0-9]+$/, "กรุณากรอกเบอร์โทรให้ถูกต้อง")
        .min(10, "กรุณากรอกเบอร์โทรศัพท์อย่างน้อย 10 หลัก");
      const requiredField = z.string().min(1, "กรุณากรอกข้อมูลให้ครบถ้วน");

      const roomSchema = z.union([
        z.string().refine((value) => value.trim().length > 0, {
          message: "กรุณาเลือกห้องพัก",
        }),
        z.number().refine((value) => value.toString().trim().length > 0, {
          message: "กรุณาเลือกห้องพัก",
        }),
      ]);

      const urlSchema = z.string("กรุณากรอก Url ให้ถูกต้อง");

      const idSchema = z
        .union([z.string(), z.number()])
        .refine((value) => value.toString().trim().length > 0, {
          message: "กรุณาระบุ ID",
        });

      const validationResults = [];


      this.editRow.forEach((field, index) => {
        const header = this.headers[index + 1]; 


        if (header === "ID") {
          let result = idSchema.safeParse(field);
          if (!result.success) {
            validationResults.push({
              header,
              message: result.error.errors[0].message,
            });
          }
          return;
        }


        if (typeof field === "number") {
          field = field.toString();
        }

        let result;

        if (header === "ชื่ออาจารย์") {
          result = requiredField.safeParse(field);
        }
        if (header === "Email") {
          result = emailSchema.safeParse(field);
          console.log("result", field);
        }

        if (header === "ห้องพัก") {
          result = roomSchema.safeParse(field);
        }

        if (header === "เบอร์โทรศัพท์") {
          result = phoneSchema.safeParse(field);
        }

        if (header === "Url") {
          result = urlSchema.safeParse(field);
        } else {
          result = requiredField.safeParse(field);
        }

        if (!result.success) {
          validationResults.push({
            header,
            message: result.error.errors[0].message,
          });
        }
      });

      if (validationResults.length > 0) {
        // แสดงข้อความผิดพลาด
        alert(
          validationResults
            .map((err) => `${err.header}: ${err.message}`)
            .join("\n")
        );
        return;
      }

      this.$emit("update", { updatedRow: this.editRow });
      this.closeEditDialog();
    },

    deleteRow(index) {
      // const id = this.internalData[index][0];
      this.deleteRowIndex = index;
      this.showDeleteDialog = true;
    },

    confirmDelete() {
      const id = this.internalData[this.deleteRowIndex][0];
      this.$emit("delete", id);
      this.internalData.splice(this.deleteRowIndex, 1); // ลบแถวจาก internalData
      this.showDeleteDialog = false; // ปิดไดอะล็อก
      this.deleteRowIndex = null; // รีเซ็ต index ที่ต้องการลบ
    },

    cancelDelete() {
      this.showDeleteDialog = false; // ปิดไดอะล็อก
      this.deleteRowIndex = null; // รีเซ็ต index ที่ต้องการลบ
    },

    cancelAddRow() {
      this.showAddForm = false;
      this.errorMessage = "";
    },
  },

  computed: {
    displayedData() {
      return this.internalData.slice().sort((a, b) => a[0] - b[0]);
    },
  },
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
/* table {
  width: 100%;
  height: 400px;
  border-collapse: collapse;
  overflow-y: auto;
  margin-bottom: 1rem;
} */

th,
td {
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

/* button:hover {
  background-color: #1976d2;
} */

.add-button {
  margin-top: 1rem;
  background-color: #3260a5;
  padding: 10px;
  margin-right: 10px;
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
