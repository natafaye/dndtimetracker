import { RootState } from "./store";

export const selectNow = (state: RootState) => state.timeTracker.now;
export const selectCalendar = (state: RootState) => state.timeTracker.calendar;

export const selectButtonList = (state: RootState) =>
  state.timeTracker.buttonList;
export const selectEventList = (state: RootState) =>
  state.timeTracker.eventList;

export const selectHoursInTimeTrack = (state: RootState) =>
  state.timeTracker.settings.hoursInTimeTrack;
export const selectDaysInDaysTrack = (state: RootState) =>
  state.timeTracker.settings.daysInDaysTrack;
export const selectSettings = (state: RootState) => state.timeTracker.settings;
