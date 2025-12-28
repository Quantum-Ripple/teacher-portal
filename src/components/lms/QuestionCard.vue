<script setup>
const props = defineProps({
  question: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['remove'])

const questionTypes = [
  { id: 'multiple', label: 'Multiple Choice' },
  { id: 'true_false', label: 'True / False' },
  { id: 'short', label: 'Short Answer' },
  { id: 'essay', label: 'Essay' }
]

function addOption() {
  if (question.type !== 'multiple') return
  if (!Array.isArray(question.options)) question.options = []
  question.options.push({ id: Date.now(), text: '', is_correct: false })
}


</script>

<template>
  <div class="border-l-4 border-blue-500 pl-4">
   
    <div class="flex justify-between items-center mb-2">
      <h5 class="font-semibold text-gray-800">
        Question
        <span class="text-sm text-gray-500 ml-2">
          ({{ question.type }})
        </span>
      </h5>
      <button
        @click="emit('remove')"
        class="text-red-600 text-sm hover:underline"
      >
        Remove
      </button>
    </div>


    <div class="mb-3">
      <label class="block text-sm text-gray-600 mb-1">Type</label>
      <select v-model="question.type" class="border p-2 rounded w-full">
        <option v-for="t in questionTypes" :key="t.id" :value="t.id">
          {{ t.label }}
        </option>
      </select>
    </div>


    <textarea
      v-model="question.text"
      placeholder="Enter question..."
      class="w-full p-2 border rounded mb-3"
      rows="3"
    />

 
    <div v-if="question.type === 'multiple'" class="space-y-2">
      <div
        v-for="opt in question.options"
        :key="opt.id"
        class="flex items-center gap-2"
      >
        <input
          type="radio"
          :value="opt.id"
          v-model="question.correct_answer"
        />
        <input
          v-model="opt.text"
          placeholder="Option text"
          class="flex-1 p-2 border rounded"
        />
      </div>

      <button
        @click="addOption"
        class="mt-2 text-blue-600 hover:underline"
      >
        Add Option
      </button>
    </div>

    <div v-if="question.type === 'true_false'" class="flex gap-4">
      <label>
        <input type="radio" value="true" v-model="question.correct_answer" />
        True
      </label>
      <label>
        <input type="radio" value="false" v-model="question.correct_answer" />
        False
      </label>
    </div>

  
    <div v-if="question.type === 'short'">
      <input
        v-model="question.correct_answer"
        placeholder="Correct answer"
        class="w-full p-2 border rounded"
      />
    </div>

  
    <div v-if="question.type === 'essay'" class="text-sm text-gray-500">
      This question will be graded manually.
    </div>

    <div class="mt-3 flex items-center gap-2">
      <label class="text-sm text-gray-600">Points</label>
      <input
        type="number"
        min="1"
        v-model="question.points"
        class="w-20 p-1 border rounded"
      />
    </div>
  </div>
</template>
