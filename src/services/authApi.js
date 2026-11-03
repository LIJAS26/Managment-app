import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3002',
  headers: { 'Content-Type': 'application/json' },
})

function getErrorMessage(error, fallback) {
  if (axios.isAxiosError(error)) {
    if (error.response?.status === 404) return fallback
    if (!error.response) return 'Cannot reach the account service. Make sure JSON Server is running.'
  }
  throw error
}

export async function getUsersByEmail(email) {
  try {
    const response = await api.get('/users', { params: { email } })
    if (response.data.length) return response.data
    const allUsers = await api.get('/users')
    return allUsers.data.filter((user) => user.email.toLowerCase() === email.trim().toLowerCase())
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to look up that email address.'), { cause: error })
  }
}

export async function getUserById(id) {
  try {
    const response = await api.get(`/users/${encodeURIComponent(id)}`)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Your saved account could not be found.'), { cause: error })
  }
}

export async function checkUsernameAvailability(username) {
  try {
    const response = await api.get('/users', { params: { username: username.trim() } })
    if (response.data.length) return false
    const allUsers = await api.get('/users')
    return !allUsers.data.some((user) => user.username.toLowerCase() === username.trim().toLowerCase())
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to check username availability.'), { cause: error })
  }
}

export async function createUser(userData) {
  try {
    const response = await api.post('/users', userData)
    return response.data
  } catch (error) {
    throw new Error(getErrorMessage(error, 'Unable to create your account. Please try again.'), { cause: error })
  }
}
