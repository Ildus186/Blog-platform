import { createSlice } from "@reduxjs/toolkit"

const safeParse = (key) => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : null
  } catch (error) {
    console.error(`Failed to parse ${key} from localStorage:`, error)
    return null
  }
}

const initialState = {
  token: localStorage.getItem("token") || null,
  user: safeParse("currentUser"),
  isInitialized: !!localStorage.getItem("token"),
  isLoading: false,
  error: null,
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, token } = action.payload
      state.user = user
      state.token = token
      state.isInitialized = true
      localStorage.setItem("token", token)
      localStorage.setItem("currentUser", JSON.stringify(user))
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    logout: (state) => {
      state.user = null
      state.token = null
      state.isInitialized = false
      localStorage.removeItem("token")
      localStorage.removeItem("currentUser")
    },
    updateUser: (state, action) => {
      state.user = action.payload
      localStorage.setItem("currentUser", JSON.stringify(action.payload))
    },
  },
})

export const { setCredentials, setLoading, logout, updateUser } = authSlice.actions
export default authSlice.reducer

export const selectCurrentUser = (state) => state.auth.user
export const selectInitialized = (state) => state.auth.isInitialized
export const selectCurrentToken = (state) => state.auth.token
export const selectAuthLoading = (state) => state.auth.isLoading
