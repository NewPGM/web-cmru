import { createApp } from 'vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import App from './App.vue'
import router from './router'
import './main.css'



// เพิ่มไอคอนที่ต้องการลงใน library
import { faUser, faHome, faSignOutAlt, faBuilding, faDoorOpen, faMap ,faLightbulb,faGraduationCap , faChalkboardTeacher ,faBook,faQuestionCircle,faEdit, faTrash,faPlus,faUserShield,faLaptopCode} from '@fortawesome/free-solid-svg-icons'
library.add(faUser, faHome, faSignOutAlt, faBuilding, faDoorOpen, faMap,faLightbulb ,faGraduationCap,faChalkboardTeacher,faBook,faQuestionCircle,faEdit,faTrash,faPlus,faUserShield,faLaptopCode)

// สร้าง Vue instance
const app = createApp(App)

// กำหนด component FontAwesomeIcon
app.component('font-awesome-icon', FontAwesomeIcon)

// เพิ่ม router
app.use(router)

// ตั้งค่า feature flags (กรณีใช้ custom elements เช่น ion-)
app.config.compilerOptions.isCustomElement = (tag) => {
  return tag.startsWith('ion-') // หรือเงื่อนไขอื่น ๆ ที่เหมาะสม
}

app.mount('#app')
