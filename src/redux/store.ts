import { configureStore } from '@reduxjs/toolkit'
import { timeTrackerReducer } from './timeTrackerSlice'

export const store = configureStore({
  reducer: {
    timeTracker: timeTrackerReducer
  },
})

export type RootState = ReturnType<typeof store.getState>