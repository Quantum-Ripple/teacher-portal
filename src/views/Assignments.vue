<template>
  <div class="p-6">

    <div class="flex space-x-8 border-b pb-2 mb-6">
      <button
        v-for="item in tabs"
        :key="item.key"
        @click="activeTab = item.key"
        class="text-blue-600 font-medium pb-1"
        :class="{
          'border-b-2 border-blue-600': activeTab === item.key,
          'opacity-60': activeTab !== item.key
        }"
      >
        {{ item.label }}
      </button>
    </div>

   
    <component :is="currentComponent" />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import NotesPage from '../components/lms/NotesPage.vue'
import AssignmentPage from '../components/lms/AssignmentPage.vue'
import ResultsPage from '../components/lms/ResultsPage.vue'

const tabs = [
  { key: 'notes', label: 'Notes', component: NotesPage },
  { key: 'assignments', label: 'Assignments', component: AssignmentPage },
  { key: 'results',label: 'Results',component: ResultsPage},
]

const activeTab = ref('notes')

const currentComponent = computed(() => {
  return tabs.find(t => t.key === activeTab.value).component
})
</script>
