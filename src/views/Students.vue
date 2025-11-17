<template>
  <div class="p-4 sm:p-6 bg-gray-50 min-h-screen">
    
    <div
      class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 space-y-3 sm:space-y-0"
    >
      <h2 class="text-2xl font-semibold text-gray-800">Students 
        <span v-if="class_level && stream">
          {{ class_level }} {{ stream }}
          </span>
        </h2>

      
    </div>

    
    <div class="mb-6 flex justify-center sm:justify-start">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search students by name..."
        class="w-full sm:w-2/3 md:w-1/3 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>

    
    <div class="hidden sm:block overflow-x-auto bg-white rounded-lg shadow-md">
      <table
        class="w-full text-left border-collapse min-w-[600px] text-sm md:text-base"
      >
        <thead class="bg-gray-100">
          <tr>
            <th class="py-3 px-4 text-gray-700 font-medium border-b">Full Name</th>
            <th class="py-3 px-4 text-gray-700 font-medium border-b">
              Admission No.
            </th>
            <th class="py-3 px-4 text-gray-700 font-medium border-b">
              Class Level
            </th>
            <th class="py-3 px-4 text-gray-700 font-medium border-b">Stream</th>
            <th class="py-3 px-4 text-gray-700 font-medium border-b">Gender</th>
            <th class="py-3 px-4 text-gray-700 font-medium border-b text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="student in filteredStudents"
            :key="student.id"
            class="hover:bg-gray-50 transition cursor-pointer"
            @click="viewStudent(student)"
          >
            <td class="py-3 px-4 border-b">{{ student.full_name }}</td>
            <td class="py-3 px-4 border-b">{{ student.admission_number }}</td>
            <td class="py-3 px-4 border-b">{{ student.class_level }}</td>
            <td class="py-3 px-4 border-b">{{ student.stream }}</td>
            <td class="py-3 px-4 border-b">{{ student.gender }}</td>
            <td class="py-3 px-4 border-b text-center">
              <button
                @click.stop="viewStudent(student)"
                class="bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm px-3 py-1 rounded transition"
              >
                View
              </button>
            </td>
          </tr>
          <tr v-if="filteredStudents.length === 0">
            <td colspan="6" class="text-center py-4 text-gray-500">
              No students found.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    
    <div class="sm:hidden space-y-4">
      <div
        v-for="student in filteredStudents"
        :key="student.id"
        class="bg-white rounded-lg shadow border p-4 hover:shadow-md transition"
      >
        <div class="flex justify-between items-center">
          <h3 class="font-semibold text-gray-800">{{ student.full_name }}</h3>
          <span
            class="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md"
          >
            {{ student.gender }}
          </span>
        </div>
        <div class="mt-2 text-sm text-gray-600 space-y-1">
          <p><strong>Adm No:</strong> {{ student.admission_number }}</p>
          <p>
            <strong>Class:</strong> {{ student.class_level }} - {{ student.stream }}
          </p>
        </div>
        <button
          @click="viewStudent(student)"
          class="mt-3 bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-1.5 rounded transition w-full"
        >
          View
        </button>
      </div>

      <div
        v-if="filteredStudents.length === 0"
        class="text-center text-gray-500 py-8"
      >
        No students found.
      </div>
    </div>

    
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import studentsApi from '../api/Students.js'

const router = useRouter()

const students = ref([])
const searchQuery = ref('')

const userData = JSON.parse(localStorage.getItem("user") || "{}")
const class_level = ref(`${userData.class_level || ""}`)
const stream = ref(`${userData.stream || ""}`)


onMounted(() => {
  fetchStudents()
})

async function fetchStudents() {
  try {
    students.value = await studentsApi.filter(
      class_level.value,
      stream.value
    )
  } catch (error) {
    console.error('Failed to fetch students:', error)
  }
}

const filteredStudents = computed(() =>
  students.value.filter((s) =>
    s.full_name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

function viewStudent(student) {
  router.push({ name: 'StudentsDetail', params: { id: student.id } })
}
</script>

<style scoped>

::-webkit-scrollbar {
  height: 8px;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(100, 100, 100, 0.3);
  border-radius: 4px;
}
</style>