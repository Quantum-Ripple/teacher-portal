import api from './Axios';

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

