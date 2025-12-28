<template>
  <div class="p-6 space-y-6">
    
    <div class="flex justify-between items-center">
      <h2 class="text-2xl font-bold mb-4">Edit Attendance</h2>

      
      <router-link
        :to="{name: 'AttendancePage'}"
        class="text-blue-600 hover:underline text-sm"
      >
        ← Back to Attendance View
      </router-link>
    </div>

    
    <div v-if="!sessionLoaded" class="text-gray-500">
      Loading attendance...
    </div>

    
    <div v-else>
      <table class="w-full border text-sm mt-3">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-2 py-1 text-left">Student</th>
            <th class="border px-2 py-1 text-left">Admission</th>
            <th class="border px-2 py-1 text-center">Status</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="record in records" :key="record.id">
            <td class="border px-2 py-1">{{ record.student_name }}</td>
            <td class="border px-2 py-1">{{ record.admission_number }}</td>
            <td class="border px-2 py-1 text-center">
              <div class="flex justify-center space-x-2">
                <button
                  v-for="option in statusOptions"
                  :key="option.value"
                  @click="record.status = option.value"
                  :class="[
                    'p-1 rounded-full',
                    record.status === option.value
                      ? option.activeClass
                      : 'bg-gray-200'
                  ]"
                  :title="option.label"
                >
                  <component :is="option.icon" class="w-5 h-5" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      
      <button
        @click="saveAttendance"
        class="bg-blue-600 text-white px-4 py-2 rounded mt-4 hover:bg-blue-700"
        :disabled="saving"
      >
        {{ saving ? "Saving..." : "Save Attendance" }}
      </button>
    </div>
  </div>
</template>

<script>
import { getAttendanceSession, updateAttendanceSession } from "../../api/attendance";
import studentApi from "../../api/Students";


import PresentIcon from "../icons/PresentIcon.vue";
import AbsentIcon from "../icons/AbsentIcon.vue";
import LateIcon from "../icons/LateIcon.vue";
import DocumentIcon from "../icons/UnavailableIcon.vue";

export default {
  data() {
    return {
      sessionId: null,
      records: [],
      sessionLoaded: false,
      saving: false,
      classLevel: "",
      stream: "",

      
      statusOptions: [
        { value: "PRESENT", label: "Present", icon: PresentIcon, activeClass: "bg-green-500" },
        { value: "ABSENT", label: "Absent", icon: AbsentIcon, activeClass: "bg-red-500" },
        { value: "LATE", label: "Late", icon: LateIcon, activeClass: "bg-yellow-500" },
        { value: "EXCUSED", label: "Excused", icon: DocumentIcon, activeClass: "bg-blue-500" },
      ]
    };
  },

  methods: {
    getStoredClassInfo() {
      const user = JSON.parse(localStorage.getItem("user"));
      this.classLevel = user?.class_level || "";
      this.stream = user?.stream || "";
    },

    async loadSession() {
      try {
        const session = await getAttendanceSession(this.sessionId);
        const students = await studentApi.filter(this.classLevel, this.stream);

        this.records = session.records.map(r => {
          const student = students.find(s => s.id === r.student);
          return {
            id: r.id,
            student: r.student,
            student_name: student?.full_name || "Unknown",
            admission_number: student?.admission_number || "N/A",
            status: r.status,
          };
        });

        this.sessionLoaded = true;
      } catch (err) {
        console.error("Failed to load session:", err);
        alert("Failed to load attendance session.");
      }
    },

    async saveAttendance() {
      try {
        this.saving = true;

        const payload = {
          class_level: this.classLevel,
          stream: this.stream,
          records_input: this.records.map(r => ({
            id: r.id,
            student: r.student,
            status: r.status,
          })),
        };

        console.log("PATCH payload:", payload);
        const res = await updateAttendanceSession(this.sessionId, payload);
        console.log("PATCH response:", res);
        alert("Attendance saved successfully!");
      } catch (err) {
        console.error("Failed to save attendance:", err);
        alert("Failed to save attendance.");
      } finally {
        this.saving = false;
      }
    },
  },

  async mounted() {
    this.getStoredClassInfo();
    this.sessionId = this.$route.params.sessionId;
    await this.loadSession();
  },
};
</script>

<style scoped>
button:focus {
  outline: none;
}
</style>