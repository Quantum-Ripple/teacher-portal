import api from './Axios';

// ✅ Fetch exams
export const getExams = async () => {
  try {
    const res = await api.get('/exams/');
    return Array.isArray(res.data) ? res.data : res.data.results ?? [];
  } catch (error) {
    console.error('Error fetching exams:', error);
    throw error;
  }
};

// ✅ Create exam
export const createExam = async(payload)=>{
  try{
    const response = await api.post('/exams/', payload);
    return response.data;
  }
  catch(error){
    console.error('Error creating exam:', error);
    throw error;
  }
};

// ✅ Get grades for an exam
export const getExamGrades = async (examId) => {
  try {
    const res = await api.get(`/exams/${examId}/grades/`);
    return res.data;
  } catch (error) {
    console.error('Error fetching exam grades:', error);
    throw error;
  }
};

// ✅ Create a single grade
export const createGrade = async (data) => {
  try {
    const res = await api.post('/grades/', data);
    return res.data;
  } catch (error) {
    console.error('Error creating grade:', error);
    throw error;
  }
};

// ✅ Update a single grade
export const updateGrade = async (gradeId, data) => {
  try {
    const res = await api.patch(`/grades/${gradeId}/`, data);
    return res.data;
  } catch (error) {
    console.error('Error updating grade:', error);
    throw error;
  }
};

// ✅ Bulk upload grades
export const bulkUploadGrades = async (examId, gradesArray) => {
  try {
    const payload = { grades: gradesArray };
    const res = await api.post(`/exams/${examId}/grades/bulk/`, payload);
    return res.data;
  } catch (error) {
    console.error('Error uploading bulk grades:', error);
    throw error;
  }
};
