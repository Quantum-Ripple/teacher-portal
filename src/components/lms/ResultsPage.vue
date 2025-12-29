<template>
  <div class="p-6">
    <h1 class="text-2xl font-semibold mb-4">Results</h1>

    <div class="mb-4">
      <label class="block mb-1 font-medium">Select Assignment:</label>
      <select
        v-model="selectedAssignment"
        @change="onAssignmentChange"
        class="border rounded p-2 w-full max-w-md"
      >
        <option value="" disabled>Select an assignment</option>
        <option
          v-for="assignment in assignments"
          :key="assignment.id"
          :value="assignment"
        >
          {{ assignment.title }} - {{ assignment.class_level }} / {{ assignment.stream }}
        </option>
      </select>
    </div>

  
    <table class="w-full table-auto border-collapse">
      <thead>
        <tr class="bg-gray-100">
          <th class="border px-4 py-2 text-left">Student</th>
          <th class="border px-4 py-2 text-left">Result</th>
          <th class="border px-4 py-2 text-center">Actions</th>
        </tr>
      </thead>

      <tbody>
        <tr
          v-for="student in students"
          :key="student.student_id"
          class="hover:bg-gray-50"
        >
          <td class="border px-4 py-2">
            {{ student.full_name }}
          </td>

          <td class="border px-4 py-2">
            {{ student.total_score ?? 0 }} / {{ maxPoints }}
          </td>

          <td class="border px-4 py-2 text-center">
            <button
              class="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              @click="viewStudentResponse(student)"
            >
              View
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { listAssignments, getAssignmentResults } from '../../api/lms'

const router = useRouter()

const assignments = ref([])
const selectedAssignment = ref(null)
const students = ref([])
const maxPoints = ref(0)

onMounted(async () => {
  assignments.value = await listAssignments()
})

const onAssignmentChange = async () => {
  if (!selectedAssignment.value) return

  const results = await getAssignmentResults(selectedAssignment.value.id)

  students.value = results
  maxPoints.value = selectedAssignment.value.total_points || 100
}

const viewStudentResponse = (student) => {
  router.push({
    name: 'StudentAssignmentResponse',
    params: {
      assignmentId: selectedAssignment.value.id,
      studentId: student.student_id
    }
  })
}
</script>
