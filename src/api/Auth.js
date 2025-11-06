import api from './Axios'

export default {
  async login(email, password) {
    // 1️⃣ Login and get tokens
    const response = await api.post('token/', { email, password })
    const { access, refresh } = response.data

    // 2️⃣ Save tokens
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)

    // 3️⃣ Fetch user info
    const userResponse = await api.get('users/me/')
    const userData = userResponse.data

    // 4️⃣ Store user info locally
    localStorage.setItem('user', JSON.stringify(userData))

    return userData
  },

  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('user')
  },

  isAuthenticated() {
    const token = localStorage.getItem('access_token')
    return !!token
  },

  getUser() {
    return JSON.parse(localStorage.getItem('user'))
  },
}