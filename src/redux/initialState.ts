import {
  DateFormat,
  TimeFormat,
  TrackerButton,
  TrackerCalendar,
  TrackerDateTime,
  TrackerEvent,
  TrackerSettings,
} from "../shared/types";
import {
  EXAMPLE_BUTTONS,
  EXAMPLE_EVENTS,
  HARPTOS_CALENDAR,
} from "./starterData";

export type TimeTrackerState = {
  now: TrackerDateTime;
  calendar: TrackerCalendar;
  buttonList: TrackerButton[];
  eventList: TrackerEvent[];
  settings: TrackerSettings;
};

export const timeTrackerInitialState: TimeTrackerState = {
  now: {
    hour: 18,
    minutes: 30,
    day: 3,
    month: 6,
    year: 12,
  },
  calendar: HARPTOS_CALENDAR,
  buttonList: EXAMPLE_BUTTONS,
  eventList: EXAMPLE_EVENTS,
  settings: {
    timeFormat: TimeFormat.Hour_Minutes_Period,
    dateFormat: DateFormat.DayOfWeek_Day_Month_Year,
    showSeasonIcon: true,
    showTimeTrack: true,
    showDaysTrack: true,
    hoursInTimeTrack: 3,
    daysInDaysTrack: 9,
  },
};
