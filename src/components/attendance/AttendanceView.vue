<template>
  <div class="max-w-7xl mx-auto p-3 sm:p-6 space-y-6 text-gray-800 text-sm sm:text-base">
    <h2 class="text-lg sm:text-2xl font-bold mb-4 text-gray-600 text-center sm:text-left">
      Attendance Records
    </h2>

    
    <div class="flex flex-wrap gap-2 sm:gap-3 items-center">
      <select v-model="range" class="border px-2 py-2 rounded w-full sm:w-auto">
        <option value="daily">Daily</option>
        <option value="weekly">Weekly</option>
        <option value="monthly">Monthly</option>
        <option value="custom">Custom</option>
      </select>

      <input
        v-if="range === 'custom'"
        type="date"
        v-model="from"
        class="border px-2 py-2 rounded w-full sm:w-auto"
      />
      <input
        v-if="range === 'custom'"
        type="date"
        v-model="to"
        class="border px-2 py-2 rounded w-full sm:w-auto"
      />

      <button
        @click="loadAttendance"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full sm:w-auto transition"
      >
        Apply
      </button>

      <router-link
        :to="{ name: 'MarkAttendance' }"
        class="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded w-full sm:w-auto transition ml-auto"
      >
        Mark Attendance
      </router-link>

      <router-link
        v-if="todaysSession"
        :to="{ name: 'EditAttendance', params: { sessionId: todaysSession.id } }"
        class="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded w-full sm:w-auto transition"
      >
        Edit Attendance
      </router-link>

      <button
        @click="exportToExcel"
        class="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full sm:w-auto transition"
      >
        Export to Excel
      </button>
    </div>

    
    <input
      type="text"
      v-model="search"
      class="border px-3 py-2 w-full mt-2 rounded text-sm sm:text-base"
      placeholder="Search student or status..."
    />

    
    <div class="overflow-x-auto mt-3">
      <table class="w-full border text-xs sm:text-sm md:text-base">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-2 py-1">Student</th>
            <th class="border px-2 py-1">Admission #</th>
            <th class="border px-2 py-1" v-for="day in days" :key="day">
              {{ day }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="s in filteredStudents" :key="s.id" class="hover:bg-gray-50">
            <td class="border px-2 py-1">{{ s.full_name }}</td>
            <td class="border px-2 py-1">{{ s.admission_number }}</td>

            <td class="border px-2 py-1 text-center" v-for="day in days" :key="day">
              <component
                :is="getStatusIcon(s.id, day)"
                class="w-4 h-4 sm:w-5 sm:h-5 mx-auto"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import * as attendanceApi from "../../api/attendance";
import studentApi from "../../api/Students";
import PresentIcon from "../icons/PresentIcon.vue";
import AbsentIcon from "../icons/AbsentIcon.vue";
import DocumentIcon from "../icons/UnavailableIcon.vue";
import LateIcon from "../icons/LateIcon.vue";


import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default {
  data() {
    return {
      range: "daily",
      students: [],
      attendance: [],
      days: [],
      search: "",
      from: "",
      to: "",
      classLevel: "",
      stream: "",
      todaysSession: null,
    };
  },

  computed: {
    filteredStudents() {
      const t = this.search.toLowerCase();
      return this.students.filter(
        (s) =>
          s.full_name.toLowerCase().includes(t) ||
          s.admission_number.toLowerCase().includes(t)
      );
    },
  },

  methods: {
    getStoredClassInfo() {
      const user = JSON.parse(localStorage.getItem("user"));
      this.classLevel = user?.class_level;
      this.stream = user?.stream;
    },

    async loadStudents() {
      try {
        this.students = await studentApi.filter(this.classLevel, this.stream);
      } catch (err) {
        console.error("Failed to load students:", err);
      }
    },

    computeDateRange() {
      const today = new Date();
      let from, to;

      if (this.range === "daily") {
        from = to = today;
      } else if (this.range === "weekly") {
        const day = today.getDay();
        const diffToMon = day === 0 ? 6 : day - 1;
        from = new Date(today);
        from.setDate(today.getDate() - diffToMon);
        to = today;
      } else if (this.range === "monthly") {
        from = new Date(today.getFullYear(), today.getMonth(), 1);
        to = today;
      } else if (this.range === "custom") {
        from = new Date(this.from);
        to = new Date(this.to);
      }

      const dates = [];
      const current = new Date(from);
      while (current <= to) {
        const day = current.getDay();
        if (day !== 0 && day !== 6) {
          dates.push(current.toISOString().split("T")[0]);
        }
        current.setDate(current.getDate() + 1);
      }

      return dates;
    },

    async loadAttendance() {
      try {
        const dateRange = this.computeDateRange();

        const res = await attendanceApi.listAttendanceSessions({
          class_level: this.classLevel,
          stream: this.stream,
        });

        this.attendance = res.filter((a) => dateRange.includes(a.date));
        this.days = dateRange;

        const todayStr = new Date().toISOString().split("T")[0];
        this.todaysSession =
          this.attendance.find((a) => a.date === todayStr) || null;
      } catch (err) {
        console.error("Failed to load attendance:", err);
      }
    },

    getStatusIcon(studentId, date) {
      const session = this.attendance.find((a) => a.date === date);
      if (!session) return DocumentIcon;

      const rec = session.records.find((r) => r.student === studentId);
      if (!rec) return DocumentIcon;

      switch (rec.status) {
        case "PRESENT":
          return PresentIcon;
        case "ABSENT":
          return AbsentIcon;
        case "LATE":
          return LateIcon;
        case "EXCUSED":
          return DocumentIcon;
        default:
          return DocumentIcon;
      }
    },

    getStatusText(studentId, date) {
      const session = this.attendance.find((a) => a.date === date);
      if (!session) return "N/A";

      const rec = session.records.find((r) => r.student === studentId);
      if (!rec) return "N/A";

      return rec.status;
    },

    exportToExcel() {
      const wsData = [["Student", "Admission #", ...this.days]];

      this.filteredStudents.forEach((s) => {
        const row = [
          s.full_name,
          s.admission_number,
          ...this.days.map((d) => this.getStatusText(s.id, d)),
        ];
        wsData.push(row);
      });

      const ws = XLSX.utils.aoa_to_sheet(wsData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Attendance");

      const wbout = XLSX.write(wb, { bookType: "xlsx", type: "array" });
      saveAs(
        new Blob([wbout], { type: "application/octet-stream" }),
        "attendance.xlsx"
      );
    },
  },

  async mounted() {
    this.getStoredClassInfo();
    await this.loadStudents();
    await this.loadAttendance();
  },
};
</script>