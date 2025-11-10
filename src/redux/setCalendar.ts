import { Draft, PayloadAction } from "@reduxjs/toolkit";
import { DateFormat, TrackerCalendar, TrackerDateTime } from "../shared/types";
import {
  addTime,
  compareChronologically,
  fixDate,
  getTimeBetween,
} from "../utilities";
import { type TimeTrackerState } from "./initialState";

/**
 * Reducer for setting the calendar that also updates the settings, now, and eventList
 * to make sure they are compatible with the new calendar
 */
export const setCalendarReducer = (
  state: Draft<TimeTrackerState>,
  action: PayloadAction<TrackerCalendar>
) => {
  const oldCalendar = state.calendar;
  const newCalendar = action.payload;

  // If you're turning the calendar off
  if (!newCalendar.useCalendar && oldCalendar.useCalendar) {
    // Fix date format
    state.settings.dateFormat =
      state.settings.dateFormat === DateFormat.None
        ? DateFormat.None
        : DateFormat.Day;
    state.settings.showSeasonIcon = false;
    // Get the earliest date so it can be day 1
    let firstDate: TrackerDateTime | undefined = state.eventList
      .toSorted(compareChronologically)
      .shift();
    if (
      firstDate === undefined ||
      compareChronologically(firstDate, state.now) > 0
    ) {
      firstDate = state.now;
    }
    // Fix now so its day is a number based on the first date
    const newDay =
      getTimeBetween(firstDate, state.now, oldCalendar.months).days + 1;
    state.now = {
      ...state.now,
      day: newDay,
      month: firstDate.month,
      year: firstDate.year,
    };
    // Fix all events so their day is a number based on the first date
    state.eventList = state.eventList.map((event) => ({
      ...event,
      day: getTimeBetween(firstDate, event, newCalendar.months).days + 1,
      month: firstDate.month,
      year: firstDate.year,
    }));

  // Else if you're turning the calendar on
  } else if (newCalendar.useCalendar && !oldCalendar.useCalendar) {
    // Fix date format
    state.settings.dateFormat =
      state.settings.dateFormat === DateFormat.Day
        ? DateFormat.DayOfWeek_Day_Month_Year
        : state.settings.dateFormat;
    state.settings.showSeasonIcon = true;
    // Fix Now to be a date within a calendar month, instead of just a day count
    const oldNow = state.now;
    const newNow = fixDate(state.now, oldCalendar);
    state.now = newNow;
    // Fix each event to be offset from the new now the same amount they were before
    state.eventList = state.eventList.map((event) => {
      // Get time between the old Now and the old event using the old turned off calendar
      const timeBetween = getTimeBetween(oldNow, event, oldCalendar.months);
      // Add that time to the new Now using the new turned on calendar
      const newDate = addTime(newNow, timeBetween, newCalendar);
      return {
        ...event,
        ...newDate,
      };
    });

  // Else if you're leaving the calendar on
  } else if (newCalendar.useCalendar) {
    // Make sure now and event dates are within the number of months and number of days in that month
    state.now = fixDate(state.now, newCalendar);
    state.eventList = state.eventList.map((event) => ({
      ...event,
      ...fixDate(event, newCalendar),
    }));
  }

  state.calendar = newCalendar;
};