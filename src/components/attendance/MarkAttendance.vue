<template>
  <div class="p-6 space-y-6">
    <h2 class="text-2xl font-bold mb-4">Mark Attendance</h2>

    
    <div class="flex space-x-4 items-center mb-4">
      <span class="font-semibold">Class: {{ classLevel }}</span>
      <span class="font-semibold">Stream: {{ stream }}</span>


      <router-link
        :to="{name: 'AttendancePage'}"
        class="text-blue-600 hover:underline text-sm ml-auto"
      >
        ← Back to Attendance View
      </router-link>
    
    </div>
    
    
  

    
    <div class="overflow-x-auto">
      <table class="w-full border text-sm">
        <thead class="bg-gray-100">
          <tr>
            <th class="border px-2 py-1 text-left">Student</th>
            <th class="border px-2 py-1 text-left">Admission #</th>
            <th class="border px-2 py-1 text-center">Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="student in students" :key="student.id">
            <td class="border px-2 py-1">{{ student.full_name }}</td>
            <td class="border px-2 py-1">{{ student.admission_number }}</td>
            <td class="border px-2 py-1 text-center">
              <div class="flex justify-center space-x-2">
                <button
                  v-for="option in statusOptions"
                  :key="option.value"
                  @click="attendanceMap[student.id] = option.value"
                  :class="['p-1 rounded-full', attendanceMap[student.id] === option.value ? option.activeClass : 'bg-gray-200']"
                  :title="option.label"
                >
                  <component :is="option.icon" class="w-5 h-5"/>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    
    <div class="mt-4">
      <button @click="submitAttendance" class="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
        Submit Attendance
      </button>
    </div>
  </div>
</template>

<script>
import studentApi from "../../api/Students";
import * as attendanceApi from "../../api/attendance";


import PresentIcon from "../icons/PresentIcon.vue";
import AbsentIcon from "../icons/AbsentIcon.vue";
import LateIcon from "../icons/LateIcon.vue";
import DocumentIcon from "../icons/UnavailableIcon.vue";

export default {
  data() {
    return {
      students: [],
      classLevel: "",
      stream: "",
      attendanceMap: {},

      
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
      this.classLevel = user?.class_level;
      this.stream = user?.stream;
    },

    async loadStudents() {
      try {
        this.students = await studentApi.filter(this.classLevel, this.stream);
        
        this.students.forEach(s => {
          this.$set(this.attendanceMap, s.id, "PRESENT");
        });
      } catch (err) {
        console.error("Failed to load students:", err);
      }
    },

    async submitAttendance() {
      const records_input = this.students.map(s => ({
        student: s.id,
        status: this.attendanceMap[s.id]
      }));

      const payload = {
        class_level: this.classLevel,
        stream: this.stream,
        
        records_input
      };
      console.log(payload);

      try {
        await attendanceApi.createAttendanceSession(payload);
        alert("Attendance submitted successfully!");
      } catch (err) {
        console.error("Error submitting attendance:", err);
        alert("Attendance for today already submitted!.");
      }
    }
  },

  async mounted() {
    this.getStoredClassInfo();
    await this.loadStudents();
  }
};
</script>

<style scoped>
button:focus {
  outline: none;
}
</style>