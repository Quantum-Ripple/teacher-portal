import api from './Axios'

export default {
  
  async list(params = {}) {
    const res = await api.get('/students/', { params })
    return res.data
  },
  async filter(class_level, stream) {
    const res = await api.get('/students/filter/', {
      params: { class_level, stream }
    })
    return res.data
  },

  
  async get(id) {
    const res = await api.get(`/students/${id}/`)
    return res.data
  },
}