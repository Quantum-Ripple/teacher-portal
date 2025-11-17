<template>
  <div class="p-6 space-y-6">
    
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
      <div class="flex flex-col sm:flex-row sm:items-center gap-2">
        <label class="text-lg font-semibold mr-2">Select Exam:</label>
        <select 
          v-model="selectedExam"
          @change="loadGrades" 
          class="border px-2 py-1 rounded w-full sm:w-auto"
        >
          <option disabled value="">-- Choose Exam --</option>
          <option 
            v-for="exam in exams" 
            :key="exam.id" 
            :value="exam.id"
          >
            {{ exam.name }} ({{ exam.term }}, {{ exam.academic_year }})
          </option>
        </select>
      </div>

      <div class="flex flex-wrap gap-2">
        <router-link 
          :to="{ name: 'AddGrades' }" 
          class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm sm:text-base"
        >
          Add Grades
        </router-link>
        <button 
          @click="exportExcel" 
          class="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded text-sm sm:text-base"
          :disabled="subjects.length === 0 || isLoading"
        >
          <span v-if="isLoading">Loading...</span>
          <span v-else>Export to Excel</span>
        </button>
        <router-link 
          :to="{ name: 'CreateExam' }" 
          class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded text-sm sm:text-base"
        >
          Create Exam
        </router-link>
      </div>
    </div>

    
    <div v-if="error" class="text-red-600">{{ error }}</div>
    <div v-if="!selectedExam" class="text-gray-600">Select an exam to view grades.</div>
    <div v-else-if="!isLoading && subjects.length === 0" class="text-gray-500">No grades recorded for this exam yet.</div>

    
    <div class="hidden sm:block border border-gray-300 rounded-lg overflow-x-auto">
      <table class="min-w-full border-collapse text-sm md:text-base">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-4 py-2 border w-1/4 text-left">Student</th>
            <th v-for="s in subjects" :key="s" class="px-4 py-2 border text-center">{{ s }}</th>
            <th class="px-4 py-2 border text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="studentName in Object.keys(tableData)" :key="studentName" class="hover:bg-gray-50">
            <td class="px-4 py-2 border font-semibold">{{ studentName }}</td>
            <td v-for="s in subjects" :key="s" class="px-4 py-2 border text-center">
              {{ tableData[studentName].grades[s] ?? '-' }}
            </td>
            <td class="px-4 py-2 border text-center">
              <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">View</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    
    <div class="sm:hidden space-y-4">
      <div v-for="studentName in Object.keys(tableData)" :key="studentName" class="border rounded-lg shadow p-3">
        <h3 class="font-semibold text-base mb-2">{{ studentName }}</h3>
        <div class="grid grid-cols-2 gap-3">
          <div v-for="s in subjects" :key="s" class="flex flex-col">
            <span class="text-xs font-medium text-gray-600">{{ s }}</span>
            <span class="text-gray-800 text-center bg-gray-100 rounded py-1">
              {{ tableData[studentName].grades[s] ?? '-' }}
            </span>
          </div>
        </div>
        <div class="mt-2 text-right">
          <button class="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm">View</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import { getExams, getExamGrades } from "../../api/Grades";
import * as XLSX from "xlsx";

export default {
  setup() {
    const exams = ref([]);
    const selectedExam = ref("");
    const tableData = ref({});
    const subjects = ref([]);
    const isLoading = ref(false);
    const error = ref("");

    const formatData = (grades) => {
      const map = {};
      const subSet = new Set();

      grades.forEach(g => {
        const name = `${g.student_obj.first_name} ${g.student_obj.last_name}`;
        const subj = g.subject_display || g.subject || "Unknown";
        subSet.add(subj);

        if (!map[name]) {
          map[name] = { _id: g.student_obj.id, grades: {} };
        }
        map[name].grades[subj] = g.score;
      });

      tableData.value = map;
      subjects.value = [...subSet];
    };

    const loadGrades = async () => {
      if (!selectedExam.value) return;

      isLoading.value = true;
      error.value = "";

      tableData.value = {};
      subjects.value = [];

      try {
        const data = await getExamGrades(selectedExam.value);
        formatData(data);
      } catch (err) {
        error.value = err.response?.data
          ? JSON.stringify(err.response.data)
          : String(err.message);
      } finally {
        isLoading.value = false;
      }
    };

    watch(selectedExam, loadGrades);

    const exportExcel = () => {
      const rows = Object.entries(tableData.value).map(([student, info]) => ({
        Student: student,
        ...info.grades
      }));

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, "Grades");

      const examLabel = exams.value.find(e => e.id === selectedExam.value)?.name ?? selectedExam.value;
      XLSX.writeFile(wb, `exam_${examLabel}_grades.xlsx`);
    };

    onMounted(async () => {
      try {
        isLoading.value = true;
        const res = await getExams();
        exams.value = Array.isArray(res) ? res : (res.results ?? []);
        if (exams.value.length) {
          selectedExam.value = exams.value[0].id;
        }
      } catch (err) {
        error.value = err.response?.data
          ? JSON.stringify(err.response.data)
          : String(err.message);
      } finally {
        isLoading.value = false;
      }
    });

    return {
      exams,
      selectedExam,
      tableData,
      subjects,
      loadGrades,
      exportExcel,
      isLoading,
      error
    };
  }
};
</script>