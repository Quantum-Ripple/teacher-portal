<script setup>
/**
 * NotesManager.vue
 *
 * This component handles the creation, display, and deletion of teacher notes
 * in a school LMS system. It allows teachers to:
 *  - View all their uploaded notes, grouped by subject
 *  - Upload new notes with associated metadata (subject, grade, stream, file)
 *  - Delete notes with confirmation
 *  - Open uploaded PDF files directly from the UI
 *
 * Notes are fetched from the backend API and filtered to show only notes
 * belonging to the currently logged-in teacher. The component also formats
 * timestamps for readability and provides a modal interface for note creation.
 *
 * Dependencies:
 *  - Vue 3 Composition API
 *  - API functions: listNotes, createNote, deleteNote (imported from ../../api/lms)
 *  - TailwindCSS for styling
 *
 * State Variables:
 *  - notes: list of all notes from backend
 *  - loading: boolean indicating fetch status
 *  - showDialog: boolean controlling visibility of "Add Note" modal
 *  - noteToDelete: currently selected note for deletion confirmation
 *  - form: reactive object holding input values for creating a note
 *
 * Computed Properties:
 *  - teacherNotes: filters notes to only those uploaded by the current teacher
 *  - groupedNotes: organizes teacherNotes by subject for display
 *
 * Functions:
 *  - fetchNotes(): retrieves notes from backend
 *  - onFileUpload(): handles file input changes
 *  - submitNote(): sends a new note to the backend and refreshes the list
 *  - confirmDelete(): sets noteToDelete for confirmation modal
 *  - cancelDelete(): clears noteToDelete to close modal
 *  - removeNote(): deletes the selected note and refreshes the list
 *  - formatDate(): converts ISO datetime strings to human-readable format
 */

import { ref, computed, onMounted } from 'vue';
import { listNotes, deleteNote, createNote } from '../../api/lms';

const user = JSON.parse(localStorage.getItem("user"));
const teacherId = user?.id;

const notes = ref([]);
const loading = ref(false);
const showDialog = ref(false);
const noteToDelete = ref(null);

const availableSubjects = [
  { code: "ENG", name: "English" }, { code: "KISW", name: "Kiswahili" },
  { code: "MATH", name: "Math" }, { code: "SCI", name: "Science" },
  { code: "SST", name: "Social Studies" }, { code: "CRE", name: "CRE" },
  { code: "PHY", name: "Physics" }, { code: "CHEM", name: "Chemistry" },
  { code: "BIO", name: "Biology" }, { code: "HIS", name: "History" },
  { code: "GEO", name: "Geography" }, { code: "COMP", name: "Computer Studies" },
  { code: "BUS", name: "Business Studies" }, { code: "ART", name: "Art" },
  { code: "MUSIC", name: "Music" }, { code: "PE", name: "Physical Education" },
  { code: "AGRI", name: "Agriculture" },
];

const grades = Array.from({ length: 12 }, (_, i) => `Grade ${i + 1}`);
const streams = ["North", "South", "East", "West"];

const form = ref({ subject: "", title: "", content: "", class_level: "", stream: "", file: null });

const teacherNotes = computed(() => notes.value.filter(n => n.teacher_id === teacherId));

const groupedNotes = computed(() => {
  const groups = {};
  teacherNotes.value.forEach(n => {
    if (!groups[n.subject]) groups[n.subject] = [];
    groups[n.subject].push(n);
  });
  return groups;
});

const fetchNotes = async () => {
  loading.value = true;
  notes.value = await listNotes();
  loading.value = false;
};

const onFileUpload = e => form.value.file = e.target.files[0];

const submitNote = async () => {
  const fd = new FormData();
  fd.append("subject", form.value.subject);
  fd.append("title", form.value.title);
  fd.append("content", form.value.content);
  fd.append("class_level", form.value.class_level);
  fd.append("stream", form.value.stream);
  if (form.value.file) fd.append("file", form.value.file);

  await createNote(fd);
  showDialog.value = false;
  await fetchNotes();
};

const confirmDelete = (note) => noteToDelete.value = note;
const cancelDelete = () => noteToDelete.value = null;

const removeNote = async () => {
  if (!noteToDelete.value) return;
  await deleteNote(noteToDelete.value.id);
  noteToDelete.value = null;
  await fetchNotes();
};

const formatDate = iso => {
  const d = new Date(iso);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

onMounted(fetchNotes);
</script>

<template>
  <div class="p-6 relative">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-semibold">Notes</h2>
      <button @click="showDialog = true"
              class="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition">
        Add Notes
      </button>
    </div>

    <div v-if="loading" class="text-gray-600">Loading notes...</div>

    <div v-else>
      <div v-for="(items, subject) in groupedNotes" :key="subject" class="mb-10">
        <h3 class="text-xl font-semibold mb-4 border-b pb-1">
          {{ availableSubjects.find(s => s.code === subject)?.name || subject }}
        </h3>

        <div class="space-y-4">
          <div v-for="note in items" :key="note.id"
               class="grid grid-cols-5 gap-4 items-center bg-white border rounded-lg p-4 shadow-sm hover:bg-gray-50">

            <div class="col-span-2">
              <button @click="window.open(note.file_url, '_blank')"
                      class="text-blue-600 font-semibold hover:underline">
                {{ note.title }}
              </button>
              <p class="text-gray-600 text-sm">{{ note.content }}</p>
            </div>

            <div class="text-gray-700 text-sm">{{ note.class_level }}</div>
            <div class="text-gray-700 text-sm">{{ note.stream }}</div>

            <div class="flex flex-col items-end space-y-1">
              <button @click="confirmDelete(note)"
                      class="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition">
                Delete
              </button>
              <span class="text-gray-500 text-xs">Uploaded: {{ formatDate(note.created_at) }}</span>
            </div>

          </div>
        </div>
      </div>
    </div>

    <div v-if="noteToDelete" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white w-full max-w-sm rounded-lg p-6 shadow-xl">
        <p class="mb-4 text-gray-800">Are you sure you want to delete <strong>{{ noteToDelete.title }}</strong>?</p>
        <div class="flex justify-end space-x-3">
          <button @click="cancelDelete" class="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
          <button @click="removeNote" class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Delete</button>
        </div>
      </div>
    </div>

    <div v-if="showDialog" class="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div class="bg-white w-full max-w-lg rounded-lg p-6 shadow-xl">
        <h3 class="text-xl font-semibold mb-4">Add New Note</h3>

        <label class="block text-sm font-medium mb-1">Subject</label>
        <select v-model="form.subject" class="w-full p-2 border rounded mb-3">
          <option disabled value="">Select Subject</option>
          <option v-for="s in availableSubjects" :key="s.code" :value="s.code">{{ s.name }}</option>
        </select>

        <label class="block text-sm font-medium mb-1">Title</label>
        <input type="text" v-model="form.title" class="w-full p-2 border rounded mb-3" />

        <label class="block text-sm font-medium mb-1">Description</label>
        <textarea v-model="form.content" rows="3" class="w-full p-2 border rounded mb-3"></textarea>

        <label class="block text-sm font-medium mb-1">Grade</label>
        <select v-model="form.class_level" class="w-full p-2 border rounded mb-3">
          <option disabled value="">Select Grade</option>
          <option v-for="g in grades" :key="g">{{ g }}</option>
        </select>

        <label class="block text-sm font-medium mb-1">Stream</label>
        <select v-model="form.stream" class="w-full p-2 border rounded mb-3">
          <option disabled value="">Select Stream</option>
          <option v-for="st in streams" :key="st">{{ st }}</option>
        </select>

        <label class="block text-sm font-medium mb-1">Upload File</label>
        <input type="file" @change="onFileUpload" class="mb-4" />

        <div class="flex justify-end space-x-3 mt-4">
          <button @click="showDialog = false" class="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
          <button @click="submitNote" class="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">Save</button>
        </div>
      </div>
    </div>
  </div>
</template>
