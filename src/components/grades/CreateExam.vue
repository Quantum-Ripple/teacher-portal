<template>
  <div class="max-w-xl mx-auto p-6 bg-white shadow rounded space-y-4">

    <h2 class="text-2xl font-bold mb-4">Create Exam</h2>

    <form @submit.prevent="handleSubmit" class="space-y-4">

      <input v-model="form.name" type="text" placeholder="Exam Name" class="w-full border p-2 rounded" required>

      <input v-model="form.date" type="date" class="w-full border p-2 rounded" required>

      <select v-model="form.term" class="w-full border p-2 rounded" required>
        <option disabled value="">Select Term</option>
        <option>Term 1</option>
        <option>Term 2</option>
        <option>Term 3</option>
      </select>

      <input v-model="form.academic_year" type="text" placeholder="Academic Year (e.g. 2026)" class="w-full border p-2 rounded" required>

      <input v-model="form.class_level" type="text" placeholder="Class Level (e.g. Grade 4)" class="w-full border p-2 rounded" required>

      <input v-model="form.stream" type="text" placeholder="Stream (e.g. West)" class="w-full border p-2 rounded" required>

      <button 
        type="submit"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
      >
        Create Exam
      </button>
    </form>

    
    <div v-if="success" class="text-green-600 font-semibold">Exam Created ✅</div>

    
    <div v-if="error" class="text-red-600 font-semibold">{{ error }}</div>

  </div>
</template>

<script setup>
import { ref } from "vue";
import { createExam } from "../../api/Grades";

const userData = JSON.parse(localStorage.getItem('user') || '{}')
const school = ref(`${userData.school || ""}`);

const form = ref({
  name: "",
  date: "",
  term: "",
  academic_year: "",
  class_level: "",
  stream: "",
  school: ref(`${userData.school || ""}`),

  
});

const success = ref(false);
const error = ref("");

const handleSubmit = async () => {
  try {
    error.value = "";
    success.value = false;

    const res = await createExam(form.value);
    console.log("Exam created:", res);

    success.value = true;

    
    setTimeout(() => {
      window.location.href = "/dashboard/grades"; 
    }, 1000);
  } catch (err) {
    error.value = err.response?.data?.detail || "Failed to create exam";
  }
};
</script>