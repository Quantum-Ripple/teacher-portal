<template>
  <div class="p-6 space-y-8">
    
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-400">Performance Dashboard</h2>

      <div>
        <label class="font-semibold mr-2">Select Exam:</label>
        <select
          v-model="selectedExam"
          @change="loadPerformance"
          class="border px-2 py-1 rounded"
        >
          <option disabled value="">-- Choose Exam --</option>
          <option v-for="exam in exams" :key="exam.id" :value="exam.id">
            {{ exam.name }} ({{ exam.term }}, {{ exam.academic_year }})
          </option>
        </select>
      </div>
    </div>

    
    <div v-if="error" class="text-red-600">{{ error }}</div>
    <div v-else-if="isLoading" class="text-gray-500">Loading performance data...</div>

    <div v-else>
      <div v-if="noGrades" class="text-center text-gray-500">
        No grades recorded for this exam yet.
      </div>

      <div v-else class="grid gap-6">
        
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-xl font-semibold mb-4">Score Distribution (Student Averages)</h3>
          <table class="min-w-full border border-gray-300 text-center">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-4 py-2 border">Range</th>
                <th class="px-4 py-2 border">Number of Students</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="range in sortedRanges" :key="range">
                <td class="px-4 py-2 border">{{ range }}</td>
                <td class="px-4 py-2 border">{{ scoreDistribution[range] }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getExams, getExamGrades } from "../../api/Grades";

const exams = ref([]);
const selectedExam = ref("");
const isLoading = ref(false);
const error = ref("");
const scoreDistribution = ref({});
const noGrades = ref(true);


const sortedRanges = computed(() => {
  const ranges = Object.keys(scoreDistribution.value).filter(k => k.includes("-"));
  return ranges.sort((a, b) => {
    const [amin] = a.split("-").map(Number);
    const [bmin] = b.split("-").map(Number);
    return bmin - amin;
  });
});

const toNum = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};


const computeStudentDistributions = (grades) => {
  const byStudent = {};
  grades.forEach((g) => {
    const id = g.student_obj?.id;
    if (!id) return;
    if (!byStudent[id]) byStudent[id] = [];
    byStudent[id].push(toNum(g.score));
  });

  const averages = Object.values(byStudent).map(scores => {
    const sum = scores.reduce((a, b) => a + b, 0);
    return scores.length ? sum / scores.length : 0;
  });

  const dist = {};
  for (let i = 0; i < 10; i++) {
    const min = i * 10;
    const max = (i + 1) * 10;
    const label = `${min}-${max}`;
    dist[label] = averages.filter(avg => avg >= min && avg < max).length;
  }

  
  dist["90-100"] += dist["100"] || 0;
  delete dist["100"];

  scoreDistribution.value = dist;
};


const loadPerformance = async () => {
  if (!selectedExam.value) return;
  isLoading.value = true;
  error.value = "";
  noGrades.value = true;

  try {
    const grades = await getExamGrades(selectedExam.value);
    const rows = Array.isArray(grades) ? grades : (grades.results || grades.data || []);
    if (!rows.length) {
      noGrades.value = true;
      return;
    }

    noGrades.value = false;
    computeStudentDistributions(rows);
  } catch (err) {
    console.error(err);
    error.value = "Failed to load grades";
  } finally {
    isLoading.value = false;
  }
};


const loadExams = async () => {
  try {
    const res = await getExams();
    const list = Array.isArray(res) ? res : (res.results ?? []);
    exams.value = list;
    if (list.length) {
      selectedExam.value = list[list.length - 1].id;
      await loadPerformance();
    }
  } catch (err) {
    error.value = "Failed to load exams";
  }
};

onMounted(loadExams);
</script>