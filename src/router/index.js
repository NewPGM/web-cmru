import { createRouter, createWebHistory } from 'vue-router'
import InstructorManagement from '../views/InstructorManagement.vue'
import RoomManagement from '../views/RoomManagement.vue'
import LocationManagement from '../views/LocationManagement.vue'
import PhilosophynManagement from '../views/PhilosophynManagement.vue'
import coursesManagement from '../views/coursesManagement.vue'
import DegreeprogramsManagement from '@/views/degreeprogramsManagement.vue'
import instructor_sjManagement from '@/views/instructor_sjManagement.vue'
import program_subjectsManagement from '@/views/program_subjectsManagement.vue'
import training_phrasesManagement from '@/views/training_phrasesManagement.vue'
import AdminLogin from '@/views/Admin.vue'
// import Admin_main from '@/views/app.vue'
import adminManagement from '@/views/AdminManagement.vue'
import subjectsManagement from '@/views/subjectsManagement.vue'



const router = createRouter({
  history: createWebHistory(),
  routes : [
    {
      path: '/',
      name: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: AdminLogin,
    },
    {
      path: '/app',
      name: 'App_main',
      // component: Admin_main,
      meta: { requiresAuth: true },
    },
    {
      path: '/instructors',
      name: 'instructors',
      component: InstructorManagement,
      meta: { requiresAuth: true }, // ต้องล็อกอิน
    },
    {
      path: '/rooms',
      name: 'rooms',
      component: RoomManagement,
      meta: { requiresAuth: true }, // ต้องล็อกอิน
    },
    {
      path: '/locations',
      name: 'locations',
      component: LocationManagement,
      meta: { requiresAuth: true }, // ต้องล็อกอิน
    },
    {
      path: '/philosophy',
      name: 'philosophy',
      component: PhilosophynManagement,
      meta: { requiresAuth: true }, // ต้องล็อกอิน
    },
    {
      path: '/courses',
      name: 'courses',
      component: coursesManagement,
      meta: { requiresAuth: true }, // ต้องล็อกอิน
    },
    {
      path: '/degree_programs',
      name: 'degree_programs',
      component: DegreeprogramsManagement,
      meta: { requiresAuth: true }, // ต้องล็อกอิน
    },
    {
      path: '/instructor_sj',
      name: 'instructor_sj',
      component: instructor_sjManagement,
      meta: { requiresAuth: true }, // ต้องล็อกอิน
    },
    {
      path: '/program_subjects',
      name: 'program_subjects',
      component: program_subjectsManagement,
      meta: { requiresAuth: true }, // ต้องล็อกอิน
    },
    {
      path: '/training_phrases',
      name: 'training_phrases',
      component: training_phrasesManagement,
      meta: { requiresAuth: true }, // ต้องล็อกอิน
    },
    {
      path: '/admin',
      name: 'admin',
      component: adminManagement,
      meta: { requiresAuth: true }, // ต้องล็อกอิน
    },
    {
      path: '/subjects',
      name: 'subjects',
      component: subjectsManagement,
      meta: { requiresAuth: true }, // ต้องล็อกอิน
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   const isAuthenticated = localStorage.getItem('admin-token') !== null

//   if (to.meta.requiresAuth && !isAuthenticated) {
//     // เปลี่ยนไปหน้า Login ถ้าไม่ได้ล็อกอิน
//     next('/login')
//   } else if (to.path === '/login' && isAuthenticated) {
//     // ถ้าล็อกอินแล้ว ให้เปลี่ยนไปหน้าแรก (เช่น /app)
//     next('/app')
//   } else {
//     // อนุญาตให้เข้าถึงเส้นทางอื่น ๆ
//     next()
//   }
// })

router.beforeEach((to, from, next) => {
  const isAuthenticated = localStorage.getItem('admin-token') !== null;

  // ถ้าผู้ใช้รีหน้าและไม่มีเส้นทางที่กำหนด ให้ส่งกลับไปที่ '/'
  if (!to.matched.length) {
    next('/login');
  } else if (to.meta.requiresAuth && !isAuthenticated) {
    // เปลี่ยนไปหน้า Login ถ้าไม่ได้ล็อกอิน
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    // ถ้าล็อกอินแล้ว ให้เปลี่ยนไปหน้าแรก (เช่น /app)
    next('/app');
  } else {
    // อนุญาตให้เข้าถึงเส้นทางอื่น ๆ
    next();
  }
});


export default router;
