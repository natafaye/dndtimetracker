import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  DateTimeAmount,
  TrackerButton,
  TrackerDateTime,
  TrackerEvent,
  TrackerSettings,
} from "../shared/types";
import { addTime } from "../utilities";
import { timeTrackerInitialState } from "./initialState";
import { setCalendarReducer } from "./setCalendar";

const timeTrackerSlice = createSlice({
  name: "timeTracker",
  initialState: timeTrackerInitialState,
  reducers: {
    // Now
    addTimeToNow: (state, action: PayloadAction<DateTimeAmount>) => {
      state.now = addTime(state.now, action.payload, state.calendar);
    },
    setNow: (state, action: PayloadAction<TrackerDateTime>) => {
      state.now = action.payload;
    },

    // Event List
    addEvent: (state, action: PayloadAction<TrackerEvent>) => {
      state.eventList.push(action.payload);
    },
    deleteEvent: (state, action: PayloadAction<number>) => {
      state.eventList = state.eventList.filter(
        (event) => event.id !== action.payload
      );
    },
    updateEvent: (state, action: PayloadAction<TrackerEvent>) => {
      state.eventList = state.eventList.map((event) =>
        event.id === action.payload.id ? { ...event, ...action.payload } : event
      );
    },
    setEventList: (state, action: PayloadAction<TrackerEvent[]>) => {
      state.eventList = action.payload;
    },

    // Settings, Buttons, Calendar
    updateSettings: (
      state,
      action: PayloadAction<Partial<TrackerSettings>>
    ) => {
      state.settings = { ...state.settings, ...action.payload };
    },
    setButtonList: (state, action: PayloadAction<TrackerButton[]>) => {
      state.buttonList = action.payload;
    },
    setCalendar: setCalendarReducer,
  },
});

export const {
  addTimeToNow,
  setNow,
  addEvent,
  deleteEvent,
  updateEvent,
  setEventList,
  updateSettings,
  setButtonList,
  setCalendar,
} = timeTrackerSlice.actions;

export const timeTrackerReducer = timeTrackerSlice.reducer;
