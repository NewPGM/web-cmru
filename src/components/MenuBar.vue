<template>
  <div class="menu-bar bg-white w-70">
    <div
      class="flex items-center menu-item text-[#3260a5]"
      :class="{ active: $route.path === '/instructors' }"
    >
      <font-awesome-icon icon="user" />
      <router-link to="/instructors" class="m-2">
        จัดการข้อมูลอาจารย์
      </router-link>
    </div>
    <div
      class="flex items-center menu-item text-[#3260a5]"
      :class="{ active: $route.path === '/rooms' }"
    >
      <font-awesome-icon icon="building" />
      <router-link to="/rooms" class="m-2"> จัดการข้อมูลห้อง </router-link>
    </div>
    <div
      class="flex items-center menu-item text-[#3260a5]"
      :class="{ active: $route.path === '/locations' }"
    >
      <font-awesome-icon icon="map" />
      <router-link to="/locations" class="m-2">
        จัดการข้อมูลที่อยู่
      </router-link>
    </div>
    <div
      class="flex items-center menu-item text-[#3260a5]"
      :class="{ active: $route.path === '/philosophy' }"
    >
      <font-awesome-icon icon="lightbulb" />
      <router-link to="/philosophy" class="m-2">
        จัดการข้อมูลปรัชญาและวิสัยทัศน์
      </router-link>
    </div>
    <div
      class="flex items-center menu-item text-[#3260a5]"
      :class="{ active: $route.path === '/degree_programs' }"
    >
      <font-awesome-icon icon="graduation-cap" />
      <router-link to="/degree_programs" class="m-2">
        จัดการข้อมูลหลักสูตรสาขา
      </router-link>
    </div>
    <div
      class="flex items-center menu-item text-[#3260a5]"
      :class="{ active: $route.path === '/subjects' }"
    >
      <font-awesome-icon icon="laptop-code" />
      <router-link to="/subjects" class="m-2">
        จัดการข้อมูลวิชา
      </router-link>
    </div>
    <div
      class="flex items-center menu-item text-[#3260a5]"
      :class="{ active: $route.path === '/instructor_sj' }"
    >
      <font-awesome-icon icon="chalkboard-teacher" />
      <router-link to="/instructor_sj" class="m-2">
        จัดการข้อมูลวิชากับอาจารย์
      </router-link>
    </div>
    <div
      class="flex items-center menu-item text-[#3260a5]"
      :class="{ active: $route.path === '/program_subjects' }"
    >
    <font-awesome-icon icon="book" />
    <router-link to="/program_subjects" class="m-2">
      จัดการข้อมูลวิชากับสาขา
    </router-link>
  </div>
  <div class="flex items-center menu-item text-[#3260a5]" :class="{ active: $route.path === '/training_phrases' }">
    <font-awesome-icon icon="question-circle" />
    <router-link
      to="/training_phrases"
      class="m-2"
      
    >
      จัดการข้อมูลคำถาม
    </router-link>
  </div>
  <div class="flex items-center menu-item text-[#3260a5]" :class="{ active: $route.path === '/admin' }">
    <font-awesome-icon icon="user-shield" />
    <router-link
      to="/admin"
      class="m-2"
      
    >
      จัดการข้อมูล Admin
    </router-link>
  </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const isActive = (path) => {
  console.log(route.path);
  return route.path === path;
};

const active = ref("0");
console.log("active", active.value);
console.log("isActive", isActive);
</script>

<style scoped>
.menu-bar {
  width: 315px;
  min-height: calc(100vh - 64px); /* ปรับตามความสูงของ HeaderBar */

  padding: 1rem;
}

.menu-item {
  display: block;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  text-decoration: none;
  border-radius: 0.375rem;
  transition: all 0.2s;
}

.menu-item.active {
  background-color: #3260a5;
  color: #ffffff;
}

.menu-item:hover {
  background-color: #e0e0e0;
  color: #000;
}
</style>
