import api from './axios'

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

 
  async createAccount(payload) {
    const res = await api.post(
      '/teachers/students/create-account/',
      payload
    )
    console.log(res.data)
    return res.data
  },


  async resetPassword(payload) {
    const res = await api.post(
      '/teachers/students/reset-password/',
      payload
    )
    return res.data
  },
}
