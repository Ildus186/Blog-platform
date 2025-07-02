import { configureStore } from "@reduxjs/toolkit"
import { articleApi } from "./articleAPIslice"
import authReducer from "./authSlice"

export const store = configureStore({
  reducer: {
    [articleApi.reducerPath]: articleApi.reducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddlware) => getDefaultMiddlware().concat(articleApi.middleware),
})
