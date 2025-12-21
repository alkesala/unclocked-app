import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api/v1"

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor for auth headers if needed
api.interceptors.request.use((config) => {
  // Future: add auth token here
  // const token = localStorage.getItem("token")
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`
  // }
  return config
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Future: handle specific error codes (401, 403, etc.)
    return Promise.reject(error)
  }
)
