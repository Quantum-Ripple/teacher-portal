import api from './axios';

const NOTES_BASE = '/notes/';


export const createNote = async (payload) => {
  const response = await api.post(NOTES_BASE, payload);
  console.log("Create Note Response:", response);
  return response.data;
};

export const getNote = async (noteId) => {
  const response = await api.get(`${NOTES_BASE}${noteId}/`);
  return response.data;
};


export const listNotes = async () => {
  const response = await api.get(NOTES_BASE);

  return response.data;
};

export const deleteNote = async (noteId) => {
  const response = await api.delete(`${NOTES_BASE}${noteId}/`);
  return response.data;
};



const API_URL = '/assignments/'

export const postAssignment = async (assignment) => {
  try {
    const response = await api.post('/assignments/', assignment)
    return response.data
  } catch (error) {
    console.error('Error saving assignment:', error)
    throw error
  }
}

export const listAssignments = async () => {
  const response = await api.get(API_URL)
  return response.data
}

export const deleteAssignment = async (id) => {
  const response = await api.delete(`${API_URL}${id}/`)
  return response.data
}
export const getAssignmentResults = async (assignmentId) => {
   const response = await api.get(`/assignments/${assignmentId}/results/`)
    return response.data
}

export const getStudentAssignmentResponse = async (assignmentId, studentId) => {
  const response = await api.get(
    `/assignments/${assignmentId}/students/${studentId}/responses/`
  )
  return response.data
}


export const saveGrades = async (assignmentId, studentId, answersInput) => {
  try {
  
    const answers = Array.isArray(answersInput)
      ? answersInput
      : answersInput?.answers || []

    if (!answers.length) {
      console.warn('No answers to save')
    }

    const payload = {
      answers: answers.map(a => ({
        question_id: a.question_id,
        points_awarded: a.points_awarded ?? 0
      }))
    }

    console.log('Saving grades payload:', payload)

    const res = await api.patch(
      `/assignments/${assignmentId}/students/${studentId}/grade/`,
      payload
    )

    console.log('Save grades response:', res.data)
    return res.data
  } catch (err) {
    console.error('Error saving grades:', err)
    throw err
  }
}
