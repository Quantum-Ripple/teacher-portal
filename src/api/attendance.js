// src/api/attendance.js
// Frontend API wrappers for the Attendance endpoints
// Assumes `api` is your axios instance with baseURL and auth interceptors set up.

import api from './Axios';

/**
 * List attendance sessions (GET /api/attendance/)
 * Optional params: { class_level, stream, date, teacher }
 */
export const listAttendanceSessions = async (params = {}) => {
  try {
    const res = await api.get('/attendance/', { params });
    return res.data;
  } catch (err) {
    console.error('Error listing attendance sessions:', err);
    throw err;
  }
};

/**
 * Create attendance session with nested student records
 * POST /api/attendance/
 *
 * payload example:
 * {
 *   class_level: "Grade 4",
 *   stream: "West",
 *   records_input: [
 *     { student: 11, status: "PRESENT" },
 *     { student: 16, status: "ABSENT" }
 *   ],
 *   // date is optional (server enforces today's date) but backend accepts it in your case
 * }
 */
export const createAttendanceSession = async (payload) => {
  try {
    const res = await api.post('/attendance/', payload);
    return res.data;
  } catch (err) {
    console.error('Error creating attendance session:', err);
    throw err;
  }
};

/**
 * Retrieve a single attendance session (GET /api/attendance/:id/)
 */
export const getAttendanceSession = async (sessionId) => {
  try {
    const res = await api.get(`/attendance/${sessionId}/`);
    return res.data;
  } catch (err) {
    console.error('Error fetching attendance session:', err);
    throw err;
  }
};

/**
 * Update (patch) a session (PATCH /api/attendance/:id/)
 * Use this to update records by sending records_input (or partial fields).
 *
 * payload example:
 * { records_input: [{ id: 4, status: "ABSENT" }, { id: 5, status: "PRESENT" }] }
 * or
 * { records_input: [{ student: 11, status: "PRESENT" }, ...] }
 */
export const updateAttendanceSession = async (sessionId, payload) => {
  try {
    const res = await api.patch(`/attendance/${sessionId}/`, payload);
    return res.data;
  } catch (err) {
    console.error('Error updating attendance session:', err);
    throw err;
  }
};

/**
 * Delete a session (DELETE /api/attendance/:id/) — may be disallowed by backend.
 */
export const deleteAttendanceSession = async (sessionId) => {
  try {
    const res = await api.delete(`/attendance/${sessionId}/`);
    return res.data;
  } catch (err) {
    console.error('Error deleting attendance session:', err);
    throw err;
  }
};

/**
 * Convenience: create session + auto-generate records from a student list
 * (Frontend helper — not calling a special backend route)
 *
 * students: array of student objects or ids, e.g. [{id:11}, 16, ...] or [{ id:11, status:'ABSENT' }, ...]
 * defaultStatus: 'PRESENT' (or 'ABSENT' / 'LATE')
 *
 * This builds records_input and calls createAttendanceSession.
 */
export const createSessionFromStudents = async (class_level, stream, students = [], defaultStatus = 'PRESENT') => {
  try {
    const records_input = students.map(s => {
      // support both numeric id or object { id / student / status }
      if (typeof s === 'number') return { student: s, status: defaultStatus };
      if (s && typeof s === 'object') {
        return {
          student: s.id ?? s.student,
          status: s.status ?? defaultStatus
        };
      }
      return null;
    }).filter(Boolean);

    const payload = { class_level, stream, records_input };
    const res = await createAttendanceSession(payload);
    return res;
  } catch (err) {
    console.error('Error creating session from students:', err);
    throw err;
  }
};



export default {
  listAttendanceSessions,
  createAttendanceSession,
  getAttendanceSession,
  updateAttendanceSession,
  deleteAttendanceSession,
  createSessionFromStudents,
};
