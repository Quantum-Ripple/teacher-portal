<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-8 space-y-6 text-gray-800 text-sm sm:text-base">
    
    <h2 class="text-lg sm:text-2xl font-bold mb-2 text-center sm:text-left text-gray-800">
      Enter Grades
    </h2>

    
    <div class="flex flex-wrap items-center gap-3">
      <label class="font-semibold text-gray-700">Exam:</label>
      <select
        v-model="selectedExam"
        @change="loadData"
        class="border rounded px-2 py-1.5 w-full sm:w-auto focus:ring-2 focus:ring-blue-400 outline-none"
      >
        <option v-for="exam in exams" :key="exam.id" :value="exam.id">
          {{ exam.name }}
        </option>
      </select>
    </div>

    
    <div class="flex flex-wrap gap-3 items-center bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm">
      <select
        v-model="newSubject"
        class="border rounded px-2 py-1.5 w-full sm:w-auto focus:ring-2 focus:ring-green-400 outline-none"
      >
        <option value="">-- Add subject --</option>
        <option v-for="s in availableSubjects" :key="s.code" :value="s.code">
          {{ s.name }}
        </option>
      </select>
      <button
        @click="addSubject"
        class="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-md transition text-sm sm:text-base"
      >
        Add
      </button>
    </div>

    
    <div class="border border-gray-200 rounded-lg shadow-md overflow-hidden">
      
      <div class="hidden sm:block overflow-x-auto">
        <table class="min-w-full border-collapse text-sm md:text-base">
          <thead class="bg-gray-100 text-gray-700 uppercase text-sm sticky top-0">
            <tr>
              <th class="px-3 py-3 text-left w-1/4 border-b">Student</th>
              <th
                v-for="s in subjects"
                :key="s"
                class="px-3 py-3 text-center border-b whitespace-nowrap"
              >
                <div class="flex items-center justify-center gap-2">
                  <span>{{ s }}</span>
                  <button
                    @click="removeSubject(s)"
                    class="text-red-500 text-xs hover:text-red-700"
                    title="Remove subject"
                  >
                    ✕
                  </button>
                </div>
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="row in students"
              :key="row.id"
              class="hover:bg-gray-50 transition"
            >
              <td class="px-3 py-2 font-medium text-gray-800 whitespace-nowrap">
                {{ row.name }}
              </td>
              <td
                v-for="s in subjects"
                :key="s"
                class="px-3 py-2 text-center whitespace-nowrap"
              >
                <input
                  v-model="grades[row.id][s]"
                  type="number"
                  min="0"
                  max="100"
                  class="w-20 border rounded px-2 py-1 text-center focus:ring-2 focus:ring-blue-300 outline-none"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      
      <div class="sm:hidden p-3 space-y-4">
        <div
          v-for="row in students"
          :key="row.id"
          class="border rounded-lg p-3 shadow-sm bg-white"
        >
          <h3 class="font-semibold text-base mb-2 text-gray-800">
            {{ row.name }}
          </h3>
          <div class="grid grid-cols-2 gap-3">
            <div v-for="s in subjects" :key="s" class="flex flex-col">
              <label class="text-xs font-medium text-gray-600 mb-1">
                {{ s }}
              </label>
              <input
                v-model="grades[row.id][s]"
                type="number"
                min="0"
                max="100"
                class="w-full border rounded px-2 py-1.5 focus:ring-2 focus:ring-blue-300 outline-none text-center"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    
    <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-4">
      <button
        @click="saveGrades"
        class="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition text-sm sm:text-base"
      >
        Save Grades
      </button>

      <div class="flex flex-col sm:flex-row sm:gap-4 text-sm">
        <p class="text-green-600 font-medium" v-if="message">{{ message }}</p>
        <p class="text-red-600 font-medium" v-if="error">{{ error }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from "vue";
import { getExams, getExamGrades, bulkUploadGrades } from "../../api/Grades";
import StudentsApi from "../../api/Students";

export default {
  setup() {
    const exams = ref([]);
    const students = ref([]);
    const subjects = ref(["ENG", "KISW", "MATH"]);
    const grades = ref({});
    const selectedExam = ref("");
    const newSubject = ref("");
    const message = ref("");
    const error = ref("");

    const availableSubjects = [
      { code: "ENG", name: "English" },
      { code: "KISW", name: "Kiswahili" },
      { code: "MATH", name: "Math" },
      { code: "SCI", name: "Science" },
      { code: "SST", name: "Social Studies" },
      { code: "CRE", name: "CRE" },
      { code: "PHY", name: "Physics" },
      { code: "CHEM", name: "Chemistry" },
      { code: "BIO", name: "Biology" },
      { code: "HIS", name: "History" },
      { code: "GEO", name: "Geography" },
      { code: "COMP", name: "Computer Studies" },
      { code: "BUS", name: "Business Studies" },
      { code: "ART", name: "Art" },
      { code: "MUSIC", name: "Music" },
      { code: "PE", name: "Physical Education" },
      { code: "AGRI", name: "Agriculture" },
    ];

    const loadStudents = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const res = await StudentsApi.filter(user.class_level, user.stream);
      students.value = res.map((s) => ({
        id: s.id,
        name: `${s.full_name}`,
      }));

      students.value.forEach((s) => {
        grades.value[s.id] = grades.value[s.id] || {};
        subjects.value.forEach((sub) => {
          if (!(sub in grades.value[s.id])) grades.value[s.id][sub] = "";
        });
      });
    };

    const loadData = async () => {
      error.value = "";
      message.value = "";

      await loadStudents();

      const data = await getExamGrades(selectedExam.value);
      data.forEach((g) => {
        grades.value[g.student] = grades.value[g.student] || {};
        grades.value[g.student][g.subject] = g.score;
        if (!subjects.value.includes(g.subject)) subjects.value.push(g.subject);
      });
    };

    const addSubject = () => {
      if (!newSubject.value) return;
      if (!subjects.value.includes(newSubject.value)) {
        subjects.value.push(newSubject.value);
      }
      students.value.forEach(
        (s) => (grades.value[s.id][newSubject.value] = "")
      );
      newSubject.value = "";
    };

    const removeSubject = (code) => {
      subjects.value = subjects.value.filter((s) => s !== code);
      students.value.forEach((s) => delete grades.value[s.id][code]);
    };

    const saveGrades = async () => {
      const payload = [];

      Object.entries(grades.value).forEach(([studentId, subs]) => {
        Object.entries(subs).forEach(([subject, score]) => {
          if (score !== "") {
            payload.push({
              student: Number(studentId),
              subject,
              score: Number(score),
            });
          }
        });
      });

      if (!payload.length) {
        message.value = "Nothing to save";
        return;
      }

      await bulkUploadGrades(selectedExam.value, payload);
      message.value = "Saved ✅";
    };

    onMounted(async () => {
      const res = await getExams();
      exams.value = res;
      selectedExam.value = exams.value[0]?.id || "";
      await loadData();
    });

    return {
      exams,
      selectedExam,
      students,
      subjects,
      grades,
      newSubject,
      availableSubjects,
      loadData,
      addSubject,
      removeSubject,
      saveGrades,
      message,
      error,
    };
  },
};
</script>