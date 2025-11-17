<template>
  <div class="p-6 space-y-6 bg-white rounded-lg shadow">
    
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-800">
        Class Statistics <span v-if="classLevel && stream">- {{ classLevel }} {{ stream }}</span>
      </h2>

      
      <div class="relative">
        <button
          @click="toggleNotification"
          class="relative bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
          title="View latest announcement"
        >
          <i class="fas fa-bell"></i>
          <span
            v-if="latestAnnouncement"
            class="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full"
            >!</span
          >
        </button>

        
        <div
          v-if="showNotification && latestAnnouncement"
          class="absolute right-0 mt-2 w-64 bg-white border rounded-lg shadow-lg p-3 z-10"
        >
          <p class="font-semibold text-gray-800">📢 {{ latestAnnouncement.title }}</p>
          <p class="text-sm text-gray-600 mt-1">{{ latestAnnouncement.message }}</p>
          <p class="text-xs text-gray-400 mt-2 text-right">
            {{ formatDate(latestAnnouncement.created_at) }}
          </p>
        </div>
      </div>
    </div>

    
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
      <div class="p-5 bg-blue-100 rounded-lg text-center shadow-sm">
        <p class="text-gray-700 font-medium">Total Students</p>
        <p class="text-3xl font-bold text-blue-800 mt-1">{{ stats.total }}</p>
      </div>
      <div class="p-5 bg-green-100 rounded-lg text-center shadow-sm">
        <p class="text-gray-700 font-medium">Boys</p>
        <p class="text-3xl font-bold text-green-800 mt-1">{{ stats.boys }}</p>
      </div>
      <div class="p-5 bg-pink-100 rounded-lg text-center shadow-sm">
        <p class="text-gray-700 font-medium">Girls</p>
        <p class="text-3xl font-bold text-pink-800 mt-1">{{ stats.girls }}</p>
      </div>
    </div>

    
    <div class="flex justify-center items-center mt-6">
      <canvas ref="genderChartRef" width="300" height="300"></canvas>
    </div>

    
    <div v-if="stats.total === 0" class="text-center text-gray-500 mt-4">
      No students found for this class.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from "vue";
import Chart from "chart.js/auto";
import studentsApi from "../../api/Students.js";
import * as eventApi from "../../api/event.js";

const genderChartRef = ref(null);
let chartInstance = null;

const stats = ref({
  total: 0,
  boys: 0,
  girls: 0,
});

const latestAnnouncement = ref(null);
const showNotification = ref(false);

const classLevel = ref("");
const stream = ref("");


const getStoredClassInfo = () => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  classLevel.value = user.class_level || "";
  stream.value = user.stream || "";
};


const createChart = () => {
  if (!genderChartRef.value) return;
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(genderChartRef.value, {
    type: "pie",
    data: {
      labels: ["Boys", "Girls"],
      datasets: [
        {
          data: [stats.value.boys, stats.value.girls],
          backgroundColor: ["#34d399", "#f472b6"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        title: {
          display: true,
          text: "Gender Distribution",
          font: { size: 16, weight: "bold" },
        },
      },
    },
  });
};


const loadStats = async () => {
  try {
    const res = await studentsApi.filter(classLevel.value, stream.value);
    const boys = res.filter((s) => s.gender === "M").length;
    const girls = res.filter((s) => s.gender === "F").length;
    stats.value = { total: boys + girls, boys, girls };

    await nextTick();
    createChart();
  } catch (err) {
    console.error("Failed to load student stats:", err);
  }
};


const loadAnnouncement = async () => {
  try {
    const res = await eventApi.fetchEvents();
    if (res.length > 0) {
      
      latestAnnouncement.value = res.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      )[0];
    }
  } catch (err) {
    console.error("Failed to load announcements:", err);
  }
};

const toggleNotification = () => {
  showNotification.value = !showNotification.value;
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleString("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};


onMounted(async () => {
  getStoredClassInfo();
  await Promise.all([loadStats(), loadAnnouncement()]);
});
</script>

<style scoped>
canvas {
  width: 100px;
  height: 320px !important;
}
</style>