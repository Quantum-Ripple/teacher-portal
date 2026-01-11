import api from './axios';


export const listAttendanceSessions = async (params = {}) => {
  try {
    const res = await api.get('/attendance/', { params });
    return res.data;
  } catch (err) {
    console.error('Error listing attendance sessions:', err);
    throw err;
  }
};


export const createAttendanceSession = async (payload) => {
  try {
    const res = await api.post('/attendance/', payload);
    return res.data;
  } catch (err) {
    console.error('Error creating attendance session:', err);
    throw err;
  }
};


export const getAttendanceSession = async (sessionId) => {
  try {
    const res = await api.get(`/attendance/${sessionId}/`);
    return res.data;
  } catch (err) {
    console.error('Error fetching attendance session:', err);
    throw err;
  }
};


export const updateAttendanceSession = async (sessionId, payload) => {
  try {
    const res = await api.patch(`/attendance/${sessionId}/`, payload);
    return res.data;
  } catch (err) {
    console.error('Error updating attendance session:', err);
    throw err;
  }
};


export const deleteAttendanceSession = async (sessionId) => {
  try {
    const res = await api.delete(`/attendance/${sessionId}/`);
    return res.data;
  } catch (err) {
    console.error('Error deleting attendance session:', err);
    throw err;
  }
};


export const createSessionFromStudents = async (class_level, stream, students = [], defaultStatus = 'PRESENT') => {
  try {
    const records_input = students.map(s => {
      
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