<script setup>
import { reactive, ref } from 'vue'

const emit = defineEmits(['close', 'continue'])

const availableSubjects = [
  { code: 'MATH', name: 'Mathematics' },
  { code: 'ENG', name: 'English' },
  { code: 'SCI', name: 'Science' },
  { code: 'HIS', name: 'History' }
]

const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`)
const streams = ['North', 'South', 'East', 'West']

const form = reactive({
  title: '',
  subject: '',
  class_level: '',
  stream: '',
  due_date: ''
})

const goToBuilder = () => {
  emit('continue', {
    title: form.title,
    subject: form.subject,
    class_level: form.class_level,
    stream: form.stream,
    due_date: form.due_date
  })
  emit('close')
}
</script>

<template>
  <div class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
    <div class="bg-white w-full max-w-2xl rounded-lg p-6 max-h-[90vh] overflow-y-auto">
      <h3 class="text-xl font-semibold mb-4">Add Assignment</h3>

      <div class="space-y-3">
        <input
          v-model="form.title"
          placeholder="Title"
          class="w-full p-2 border rounded"
        />

        <select v-model="form.subject" class="w-full p-2 border rounded">
          <option disabled value="">Select Subject</option>
          <option
            v-for="s in availableSubjects"
            :key="s.code"
            :value="s.code"
          >
            {{ s.name }}
          </option>
        </select>

        <select v-model="form.class_level" class="w-full p-2 border rounded">
          <option disabled value="">Select Class</option>
          <option v-for="g in grades" :key="g">
            {{ g }}
          </option>
        </select>

        <select v-model="form.stream" class="w-full p-2 border rounded">
          <option disabled value="">Select Stream</option>
          <option v-for="s in streams" :key="s">
            {{ s }}
          </option>
        </select>

        <div>
          <label class="block text-sm font-medium mb-1">Deadline</label>
          <input
            type="date"
            v-model="form.due_date"
            class="w-full p-2 border rounded"
          />
        </div>

        <div class="flex justify-end space-x-3 mt-6">
          <button @click="emit('close')" class="px-4 py-2 border rounded">
            Cancel
          </button>
          <button
            @click="goToBuilder"
            class="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
