<template>
  <div class="p-6 bg-gray-50 min-h-screen">
    <div class="max-w-3xl mx-auto bg-white rounded-2xl shadow p-6">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">Student Details</h2>

      <div v-if="student" class="space-y-3">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="font-medium text-gray-700">Full Name:</p>
            <p class="text-gray-800">{{ student.full_name }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-700">Admission Number:</p>
            <p class="text-gray-800">{{ student.admission_number }}</p>
          </div>

          <div>
            <p class="font-medium text-gray-700">First Name:</p>
            <p class="text-gray-800">{{ student.first_name }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-700">Middle Name:</p>
            <p class="text-gray-800">{{ student.middle_name || '-' }}</p>
          </div>

          <div>
            <p class="font-medium text-gray-700">Last Name:</p>
            <p class="text-gray-800">{{ student.last_name }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-700">Grade:</p>
            <p class="text-gray-800">{{ student.class_level }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-700">Stream</p>
            <p class="text-gray-800">{{ student.stream }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-700">Gender:</p>
            <p class="text-gray-800">{{ student.gender }}</p>
          </div>

          <div>
            <p class="font-medium text-gray-700">Date of Birth:</p>
            <p class="text-gray-800">{{ student.date_of_birth || 'N/A' }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-700">Guardian Email:</p>
            <p class="text-gray-800">{{ student.email || 'N/A' }}</p>
          </div>

          <div>
            <p class="font-medium text-gray-700">Gurdian Phone:</p>
            <p class="text-gray-800">{{ student.phone || 'N/A' }}</p>
          </div>
          <div>
            <p class="font-medium text-gray-700">Address:</p>
            <p class="text-gray-800">{{ student.address || 'N/A' }}</p>
          </div>

          
          <div>
            <p class="font-medium text-gray-700">Date Joined:</p>
            <p class="text-gray-800">{{ student.date_joined }}</p>
          </div>
        </div>
      </div>

      <div v-else class="text-gray-500 italic">Loading student...</div>

      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import studentsApi from '../api/Students.js'

const route = useRoute()
const router = useRouter()

const student = ref(null)
const editMode = ref(false)

onMounted(async () => {
  const id = route.params.id
  try {
    student.value = await studentsApi.get(id)
  } catch (error) {
    console.error('Failed to fetch student:', error)
  }
})



</script>