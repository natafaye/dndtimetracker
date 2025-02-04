import { faLeaf, faSeedling, faSnowflake, faSun } from "@fortawesome/free-solid-svg-icons";
import { DateFormat, TimeFormat, Season } from "../shared/types";
import type { DateTimeAmount, TrackerCalendar, TrackerDate, TrackerTime } from "../shared/types";
import { getDayOfWeekIndex } from "./datetime";

/**
 * Converts an hour to a string
 */
export const hourToString = (hour: number, showAMPM = false) =>
  (hour > 12 ? hour - 12 : hour || 12) +
  (showAMPM ? (hour >= 12 ? "\xa0PM" : "\xa0AM") : "");

/**
 * Converts time to a time string (hour, minutes, period, AM/PM)
 */
export const timeToString = (
  time: TrackerTime, 
  calendar: TrackerCalendar, 
  timeFormat: TimeFormat
) => {
  const { hour, minutes } = time;
  const { periods } = calendar
  const hourString = hourToString(hour);
  const minutesString = ":" + (minutes < 10 ? "0" : "") + minutes;
  const periodString =
    " " + periods[Math.floor((hour * periods.length) / 24)].name;
  switch (timeFormat) {
    case TimeFormat.Hour:
      return hourString + (hour < 12 ? " AM" : " PM");
    case TimeFormat.Hour_Minutes:
      return hourString + minutesString + (hour < 12 ? " AM" : " PM");
    case TimeFormat.Hour_Period:
      return hourString + periodString;
    default: // TimeFormat.Hour_Minutes_Period
      return hourString + minutesString + periodString;
  }
};

/**
 * Converts date to a date string (day, day of the week, month, season, year)
 */
export const dateToString = (
  date: TrackerDate,
  calendar: TrackerCalendar,
  dateFormat: DateFormat
) => {
  const { day, month, year } = date;
  const { daysOfTheWeek, months } = calendar

  if (dateFormat === DateFormat.None) return "";

  if (dateFormat === DateFormat.Day) return "Day " + day;

  const dayOfWeek = daysOfTheWeek[getDayOfWeekIndex(date, calendar)].name;
  if (dateFormat === DateFormat.Day_DayOfWeek)
    return "Day " + day + ", " + dayOfWeek;

  let dateString = day.toString();
  if (day % 10 === 1 && day !== 11) dateString += "st of ";
  else if (day % 10 === 2 && day !== 12) dateString += "nd of ";
  else if (day % 10 === 3 && day !== 13) dateString += "rd of ";
  else dateString += "th of ";
  dateString += months[month].name;

  if (
    dateFormat === DateFormat.DayOfWeek_Day_Month ||
    dateFormat === DateFormat.DayOfWeek_Day_Month_Year
  )
    dateString = dayOfWeek + ", " + dateString;

  if (
    dateFormat === DateFormat.Day_Month_Year ||
    dateFormat === DateFormat.DayOfWeek_Day_Month_Year
  )
    dateString = dateString + ", Year " + year;

  return dateString;
};

/**
 * Gets the name of the icon for a particular season
 */
export const getSeasonIcon = (season: Season) => {
  return {
    [Season.Fall]: faLeaf,
    [Season.Winter]: faSnowflake,
    [Season.Spring]: faSeedling,
    [Season.Summer]: faSun
  }[season]
};

/**
 * Returns a string representation of an amount of time
 */
export const timeAmountToString = (
  timeAmount: DateTimeAmount,
  simplify = false
) => {
  let timeString = "";

  if(!timeAmount.minutes && !timeAmount.hours && !timeAmount.days)
    return "right now"

  if (timeAmount.days) timeString += Math.abs(timeAmount.days) + "d";
  if (timeAmount.hours && (!simplify || Math.abs(timeAmount.days || 0) < 5))
    timeString += (timeString ? ", " : "") + Math.abs(timeAmount.hours) + "h";
  if (timeAmount.minutes && (!simplify || timeAmount.days === 0))
    timeString += (timeString ? ", " : "") + Math.abs(timeAmount.minutes) + "m";

  if (
    (timeAmount.minutes && timeAmount.minutes < 0) ||
    (timeAmount.hours && timeAmount.hours < 0) ||
    (timeAmount.days && timeAmount.days < 0)
  )
    timeString += " ago";
  else timeString = "in " + timeString;

  return timeString;
};
