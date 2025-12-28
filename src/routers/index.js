import { createRouter, createWebHistory } from 'vue-router'
import Auth from '../api/Auth'
import LoginPage from '../views/Login.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import Dashboard from '../views/Dashboard.vue'
import StudentsPage from '../views/Students.vue'
import AttendancePage from '../views/Attendance.vue'
import GradesPage from '../views/Grades.vue'
import AnnouncementsPage from '../views/Announcements.vue'
import AssignmentsPage from '../views/Assignments.vue'
import PerformancePage from '../views/Performance.vue'
import Settings from '../views/Settings.vue'
import StudentsDetail from '../components/StudentDetails.vue'
import CreateExam from '../components/grades/CreateExam.vue'
import GradeDetails from '../components/grades/GradeDetails.vue'
import ListGrades from '../components/grades/ListGrades.vue'
import AddGrades from '../components/grades/AddGrades.vue'
import EventDetail from '../components/events/EventDetail.vue'
import MarkAttendance from '../components/attendance/MarkAttendance.vue'
import EditAttendance from '../components/attendance/EditAttendance.vue'
import AssignmentPage from '../components/lms/AssignmentPage.vue'
import AssignmentBuilderPage from '../components/lms/AssignmentBuilderPage.vue'
import ResultsPage from '../components/lms/ResultsPage.vue'

const routes = [
  {
    path: '/',
    redirect: '/login', // Explicitly redirect root to login
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage,
    meta: { public: true },
  },
  {
    path: '/dashboard',
    component: DashboardLayout,
    children: [
      {
        path: '',
        name: 'Dashboard',
        component: Dashboard,
      },
      {
        path: 'students',
        name: 'StudentsPage',
        component: StudentsPage,
      },
      {
        path: 'student/:id',
        name: 'StudentsDetail',
        component: StudentsDetail,
      },
      
      {
        path: 'attendance',
        name: 'AttendancePage',
        component: AttendancePage,
      },
      {
        path: 'mark/attendance',
        name: 'MarkAttendance',
        component: MarkAttendance
      },
      {
        path: 'edit/attendance/:sessionId',
        name: 'EditAttendance',
        component: EditAttendance
      },
      
      {
        path: 'grades',
        name: 'GradesPage',
        component: GradesPage,
      },
      {
        path: 'list-grades',
        name: 'ListGrades',
        component: ListGrades
      },
      {
        path: 'exams/create',
        name: 'CreateExam',
        component: CreateExam
      },
      {
        path: 'grade-details',
        name: 'GradeDetails',
        component: GradeDetails
      },
      {
        path: 'add/grades',
        name: 'AddGrades',
        component: AddGrades,
      },
      {
        path: 'announcements/:id',
        name: 'EventDetail',
        component: EventDetail
      },
      {
        path: 'announcements',
        name: 'AnnouncementsPage',
        component: AnnouncementsPage,
      },
      {
        path: 'assignments',
        name: 'AssignmentsPage',
        component: AssignmentsPage,
      },
      {
        path: 'assignment',
        name: 'AssignmentPage',
        component: AssignmentPage,
      },
      {
        path: 'results',
        name: 'ResultsPage',
        component: ResultsPage,
      },
      {
        path: 'create-assignment',
        name: 'AssignmentBuilder',
        component: AssignmentBuilderPage
      },
       {
        path: 'performance',
        name: 'PerformancePage',
        component: PerformancePage,
      },
      {
        path: 'settings',
        name: 'Settings',
        component: Settings,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = Auth.isAuthenticated()

   if (!to.meta.public && !isAuthenticated) {
    next('/login') }

    if (to.path === '/login' && isAuthenticated) {
    next('/dashboard') 
  } else {
    next()
  }
})

export default router