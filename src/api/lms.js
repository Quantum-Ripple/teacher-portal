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
  console.log("List Notes Response:", response);
  return response.data;
};

export const deleteNote = async (noteId) => {
  const response = await api.delete(`${NOTES_BASE}${noteId}/`);
  return response.data;
};
