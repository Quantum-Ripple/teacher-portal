<template>
  <div class="p-6 max-w-5xl mx-auto">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-semibold">Student Assignment Review</h1>
      <p class="text-gray-600 mt-1">
        {{ response?.student?.name }} — {{ response?.assignment }}
      </p>
    </div>

    <!-- Answers -->
    <div v-if="response" class="space-y-6">
      <div
        v-for="(answer, index) in response.answers"
        :key="answer.question_id"
        class="border rounded-lg p-4 bg-white shadow-sm"
      >
        <div class="flex justify-between items-start mb-2">
          <h3 class="font-medium">
            Q{{ index + 1 }}. {{ answer.question }}
          </h3>
          <span class="text-sm text-gray-500">
            / {{ answer.max_points }} pts
          </span>
        </div>

        <div class="bg-gray-50 p-3 rounded text-sm mb-3">
          <strong>Student Answer:</strong>
          <div class="mt-1 text-gray-800">
            {{ answer.answer ?? '—' }}
          </div>
        </div>

        <!-- Grading -->
        <div class="flex items-center gap-3">
          <label class="text-sm font-medium">Points Awarded</label>
          <input
            type="number"
            min="0"
            :max="answer.max_points"
            v-model.number="answer.points_awarded"
            class="border rounded px-3 py-1 w-24"
          />
        </div>
      </div>

      <!-- Save Button -->
      <div class="flex justify-end mt-6">
        <button
          @click="saveGrades"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          Save Grades
        </button>
      </div>
    </div>

    <div v-else class="text-gray-500">Loading responses...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { getStudentAssignmentResponse } from '../../api/lms'
import { saveGrades as saveGradesApi } from '../../api/lms'

const route = useRoute()

const response = ref(null)

onMounted(async () => {
  const assignmentId = route.params.assignmentId
  const studentId = route.params.studentId

  response.value = await getStudentAssignmentResponse(
    assignmentId,
    studentId
  )
})

const saveGrades = async () => {
  try {
    const assignmentId = route.params.assignmentId
    const studentId = route.params.studentId

    const res = await saveGradesApi(assignmentId, studentId, response.value.answers)

    alert(`Grades saved! Total score: ${res.total_score}`)
  } catch (err) {
    alert("Failed to save grades")
  }
}
</script>

<style scoped>
/* Optional refinements */
</style>
