<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AssignmentDialog from './AssignmentDialog.vue'
import { listAssignments, deleteAssignment } from '../../api/lms' 

const assignments = ref([])
const loading = ref(false)
const showDialog = ref(false)
const assignmentToDelete = ref(null)
const router = useRouter()

const fetchAssignments = async () => {
  loading.value = true
  try {
    const data = await listAssignments()
    
    assignments.value = data.map(a => ({
      id: a.id,
      title: a.title,
      subject: a.subject,
      class_level: a.class_level,
      stream: a.stream,
      due_date: a.due_date
    }))
  } catch (err) {
    console.error('Failed to fetch assignments:', err)
    assignments.value = []
  } finally {
    loading.value = false
  }
}



const confirmDelete = (a) => (assignmentToDelete.value = a)
const cancelDelete = () => (assignmentToDelete.value = null)

const removeAssignment = async () => {
  if (!assignmentToDelete.value) return
  try {
    await deleteAssignment(assignmentToDelete.value.id)
    assignmentToDelete.value = null
    await fetchAssignments()
  } catch (err) {
    console.error('Failed to delete assignment:', err)
    alert('Failed to delete assignment')
  }
}

const openAssignmentBuilder = (metadata) => {
  router.push({
    name: 'AssignmentBuilder',
    query: { ...metadata }
  })
}

onMounted(fetchAssignments)
</script>

<template>
  <div class="p-6 relative">
    
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-semibold">Assignments</h2>
      <button
        @click="showDialog = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Add Assignment
      </button>
    </div>

    <div class="flex flex-col space-y-4">
      <div
        v-for="a in assignments"
        :key="a.id"
        class="bg-white border rounded-lg p-4 flex justify-between items-center shadow-sm hover:shadow-md transition"
      >
        <div>
          <h3 class="font-semibold">{{ a.title }}</h3>
          <p class="text-sm text-gray-600">{{ a.class_level }} · {{ a.subject }} · {{ a.stream }}</p>
          <p class="text-sm text-gray-500">Due: {{ a.due_date }}</p>
        </div>

        <button
          @click="confirmDelete(a)"
          class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>

  
    <div
      v-if="assignmentToDelete"
      class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
    >
      <div class="bg-white w-full max-w-sm rounded-lg p-6">
        <p class="mb-4">
          Delete <strong>{{ assignmentToDelete.title }}</strong>?
        </p>
        <div class="flex justify-end space-x-3">
          <button @click="cancelDelete" class="px-4 py-2 border rounded hover:bg-gray-100 transition">Cancel</button>
          <button
            @click="removeAssignment"
            class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <AssignmentDialog
      v-if="showDialog"
      @close="showDialog = false"
      @continue="openAssignmentBuilder"
    />
  </div>
</template>

