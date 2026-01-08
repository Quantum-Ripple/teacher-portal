<template>
  <div class="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
    <div class="bg-white rounded-2xl shadow-lg w-96 p-6">
      <h3 class="text-lg font-semibold mb-4">
        {{ mode === 'create' ? 'Create Student Account' : 'Reset Student Password' }}
      </h3>

      <p class="text-gray-700 mb-3">
        Student: <span class="font-medium">{{ student.full_name }} ({{ student.admission_number }})</span>
      </p>

      <div class="mb-4">
        <label class="block text-gray-700 mb-1">Password</label>
        <input
          type="text"
          v-model="password"
          placeholder="Enter password"
          class="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-500"
        />
      </div>

      <div class="flex justify-end space-x-2">
        <button
          class="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          @click="$emit('close')"
        >
          Cancel
        </button>
        <button
          class="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          @click="submit"
          :disabled="loading || !password"
        >
          {{ mode === 'create' ? 'Create Account' : 'Reset Password' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  mode: { type: String, required: true }, // 'create' or 'reset'
  student: { type: Object, required: true },
  onSubmit: { type: Function, required: true }
})

const emit = defineEmits(['close'])
const password = ref('')
const loading = ref(false)

const submit = async () => {
  loading.value = true
  try {
    await props.onSubmit(password.value)
    emit('close')
  } catch (err) {
    console.error(err)
    alert('Operation failed')
  } finally {
    loading.value = false
  }
}
</script>
