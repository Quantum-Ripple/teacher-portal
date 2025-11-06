<template>
  <div class="p-6 space-y-6 bg-white rounded-lg shadow">
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold text-gray-800">
        Attendance Overview - {{ today }}
      </h2>

      <button
        @click="refreshData"
        class="text-sm bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md"
      >
        Refresh
      </button>
    </div>

    <div v-if="isLoading" class="text-center text-gray-500">
      Loading attendance...
    </div>

    <div v-else>
      <!-- Show message if no attendance records -->
      <div
        v-if="noRecords"
        class="text-center text-gray-500 italic mt-6"
      >
        No attendance records found for today
      </div>

      <div v-else>
        <div class="flex justify-center items-center">
          <canvas ref="attendanceChartRef" width="300" height="300"></canvas>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 text-center">
          <div
            v-for="(count, key) in attendanceSummary"
            :key="key"
            class="p-4 bg-gray-50 rounded-lg shadow-sm"
          >
            <p class="text-gray-600 capitalize">{{ key }}</p>
            <p class="text-xl font-semibold text-gray-900">{{ count }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, computed } from "vue";
import Chart from "chart.js/auto";
import * as attendanceApi from "../../api/attendance";

const attendanceChartRef = ref(null);
const attendanceSummary = ref({
  present: 0,
  late: 0,
  absent: 0,
  excused: 0,
});
const isLoading = ref(false);
let chartInstance = null;

const today = new Date().toISOString().split("T")[0];
const classLevel = ref("");
const stream = ref("");

// ✅ Computed property to check if all values are 0
const noRecords = computed(() =>
  Object.values(attendanceSummary.value).every((v) => v === 0)
);

const getStoredClassInfo = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  classLevel.value = user?.class_level;
  stream.value = user?.stream;
};

const createChart = () => {
  if (!attendanceChartRef.value) return;
  if (chartInstance) chartInstance.destroy();

  chartInstance = new Chart(attendanceChartRef.value, {
    type: "pie",
    data: {
      labels: ["Present", "Late", "Absent", "Excused"],
      datasets: [
        {
          data: Object.values(attendanceSummary.value),
          backgroundColor: ["#34d399", "#fbbf24", "#f87171", "#60a5fa"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "bottom" },
        title: {
          display: true,
          text: `Attendance for ${today}`,
          font: { size: 16, weight: "bold" },
        },
      },
    },
  });
};

const calculateSummary = (attendance) => {
  const todaySession = attendance.find((a) => a.date === today);
  if (!todaySession) {
    attendanceSummary.value = { present: 0, late: 0, absent: 0, excused: 0 };
    return;
  }

  const summary = { present: 0, late: 0, absent: 0, excused: 0 };

  for (const record of todaySession.records) {
    switch (record.status) {
      case "PRESENT":
        summary.present++;
        break;
      case "LATE":
        summary.late++;
        break;
      case "ABSENT":
        summary.absent++;
        break;
      case "EXCUSED":
        summary.excused++;
        break;
    }
  }

  attendanceSummary.value = summary;
};

const loadAttendance = async () => {
  isLoading.value = true;
  try {
    const res = await attendanceApi.listAttendanceSessions({
      class_level: classLevel.value,
      stream: stream.value,
    });
    calculateSummary(res);

    // 🟢 wait for DOM to fully update before creating chart
    await nextTick();
    setTimeout(createChart, 100); // short delay ensures <canvas> is ready
  } catch (err) {
    console.error("Failed to load attendance summary:", err);
  } finally {
    isLoading.value = false;
  }
};


const refreshData = async () => {
  await loadAttendance();
};

onMounted(async () => {
  getStoredClassInfo();
  await loadAttendance();
});
</script>

<style scoped>
canvas {
  width: 200px;
  height: 320px !important;
}
</style>
