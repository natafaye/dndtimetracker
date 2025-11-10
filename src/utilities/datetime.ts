import type {
  DateTimeAmount,
  Month,
  TrackerCalendar,
  TrackerDate,
  TrackerDateTime,
} from "../shared/types";

/**
 * Gets the total number of days in a year
 */
export const getDaysInYear = (months: Month[]) =>
  months.reduce((total, month) => total + month.days, 0);

/**
 * Converts a date (day, month) into a day of the year from the beginning of the year, with 1 being the first day
 * The day in the month can be higher than the number of days in that month
 */
export const getDayOfYearFromDate = (
  dayInMonth: number,
  monthIndex: number,
  months: Month[]
) =>
  months.slice(0, monthIndex).reduce((total, month) => total + month.days, 0) +
  dayInMonth;

/**
 * Converts a day of the year from the beginning of the year (can be negative) into a date (day, month, year)
 */
export const getDateFromDayOfYear = (
  dayOfYear: number,
  year: number,
  months: Month[]
): TrackerDate => {
  const daysInYear = getDaysInYear(months);

  let newDay = dayOfYear;
  let newMonth = 0;
  let newYear = year;
  if (dayOfYear >= daysInYear) {
    newDay = dayOfYear % daysInYear;
    newYear += Math.floor(dayOfYear / daysInYear);
    if (newDay === 0) {
      newDay = daysInYear;
      newYear--;
    }
  } else if (dayOfYear < 1) {
    newDay = daysInYear - (Math.abs(dayOfYear) % daysInYear);
    newYear -= Math.floor(Math.abs(dayOfYear) / daysInYear) + 1;
  }

  months.some((month, index) => {
    if (newDay <= month.days) {
      newMonth = index;
      return true;
    }
    newDay -= month.days;
    return false;
  });

  return { day: newDay, month: newMonth, year: newYear };
};

/**
 * Adds a number of minutes, hours and days (can be negative)
 * to the date described in the data and returns the new date
 */
export const addTime = (
  dateTime: TrackerDateTime,
  toAdd: DateTimeAmount,
  calendar: TrackerCalendar
) => {
  let newMinutes = dateTime.minutes;
  let newHour = dateTime.hour;
  let newDay = dateTime.day;
  let newMonth = dateTime.month;
  let newYear = dateTime.year;
  const { minutes, hours, days } = toAdd;

  newMinutes += minutes ? minutes : 0;
  const minutesInAnHour = 60;
  if (newMinutes >= minutesInAnHour) {
    newHour += Math.floor(newMinutes / minutesInAnHour);
    newMinutes = newMinutes % minutesInAnHour;
  } else if (newMinutes < 0) {
    newHour -= Math.floor(Math.abs(newMinutes) / minutesInAnHour) + 1;
    newMinutes = 60 - (Math.abs(newMinutes) % minutesInAnHour);
  }

  newHour += hours ? hours : 0;
  const hoursInADay = 24;
  if (newHour >= hoursInADay) {
    newDay += Math.floor(newHour / hoursInADay);
    newHour = newHour % hoursInADay;
  } else if (newHour < 0) {
    newDay -= Math.floor(Math.abs(newHour) / hoursInADay) + 1;
    newHour = 24 - (Math.abs(newHour) % hoursInADay);
  }

  newDay += days ? days : 0;
  if (calendar.useCalendar && (newDay > calendar.months[newMonth].days || newDay < 1)) {
    const newDate = getDateFromDayOfYear(
      getDayOfYearFromDate(newDay, newMonth, calendar.months),
      newYear,
      calendar.months
    );
    newDay = newDate.day;
    newMonth = newDate.month;
    newYear = newDate.year;
  }

  return {
    minutes: newMinutes,
    hour: newHour,
    day: newDay,
    month: newMonth,
    year: newYear,
  };
};

/**
 * Gets the index of the day of the week for a particular date
 */
export const getDayOfWeekIndex = function (
  date: TrackerDate,
  calendar: TrackerCalendar
) {
  const { day, month, year } = date;
  const { daysOfTheWeek, months, startDayOfWeekOfYear } = calendar;
  const dayOfYear = getDayOfYearFromDate(day, month, months);
  const daysInYear = getDaysInYear(months);
  const daysBetween =
    (year - startDayOfWeekOfYear.year) * daysInYear + dayOfYear - 1;
  return (
    ((daysBetween % daysOfTheWeek.length) +
      daysOfTheWeek.length +
      startDayOfWeekOfYear.dayOfWeek) %
    daysOfTheWeek.length
  );
};

/**
 * Compares two dates and returns a number indicating which one comes first chronologically
 *
 * @param {Object} a - An object containing hour, minutes, day, month, year
 * @param {Object} b - An object containing hour, minutes, day, month, year
 * @returns {number} A negative number if a is before b, a positive number
 * if b is before a, and zero if they're the same date and time
 */
export const compareChronologically = (
  a: TrackerDateTime,
  b: TrackerDateTime
) => {
  if (a.year !== b.year) return a.year - b.year;
  else if (a.month !== b.month) return a.month - b.month;
  else if (a.day !== b.day) return a.day - b.day;
  else if (a.hour !== b.hour) return a.hour - b.hour;
  else return a.minutes - b.minutes;
};

/**
 *  Returns true if the two dates are within the specified non-zero time frame (minutes, hours, days) of each other (inclusive)
 *
 * @param {Object} firstDate - An object containing hour, minutes, day, month, year, and months
 * @param {Object} secondDate - An object containing hour, minutes, day, month, year
 * @param {Array} months - An array of month objects that each have a days property with the number of days in that month
 * @param {Object} maxTimeBetween - An amount of time from the date to check if it's within, an object containing either minutes (1-59), hours (1-23), or days (1+)
 * @returns {boolean} true if the two dates are within the non-zero time frame of each other (inclusive), false if not
 */
export const areWithinTime = (
  firstDate: TrackerDateTime,
  secondDate: TrackerDateTime,
  months: Month[],
  maxTimeBetween: DateTimeAmount
): boolean => {
  const daysInAYear = getDaysInYear(months);
  const minutesInADay = 1440;

  // Make sure first date is chronologically first
  const sortedDates = [firstDate, secondDate].sort(compareChronologically);
  firstDate = sortedDates[0];
  secondDate = sortedDates[1];

  // Convert max time between to minutes and days
  maxTimeBetween.minutes = maxTimeBetween.minutes ? maxTimeBetween.minutes : 0;
  maxTimeBetween.hours = maxTimeBetween.hours ? maxTimeBetween.hours : 0;
  maxTimeBetween.days = maxTimeBetween.days ? maxTimeBetween.days : 0;
  let maxMinutes = maxTimeBetween.minutes + maxTimeBetween.hours * 60;
  const maxDays = maxTimeBetween.days + Math.floor(maxMinutes / minutesInADay);
  maxMinutes = maxMinutes % minutesInADay;

  // Convert dates to minutes and days
  const firstDays = getDayOfYearFromDate(
    firstDate.day,
    firstDate.month,
    months
  );
  const secondDays =
    getDayOfYearFromDate(secondDate.day, secondDate.month, months) +
    (secondDate.year - firstDate.year) * daysInAYear;
  const firstMinutes = firstDate.hour * 60 + firstDate.minutes;
  const secondMinutes = secondDate.hour * 60 + secondDate.minutes;

  if (secondDays - firstDays < maxDays) return true;
  else if (secondDays - firstDays === maxDays)
    return secondMinutes - firstMinutes <= maxMinutes;
  else if (secondDays - firstDays === maxDays + 1)
    return minutesInADay + secondMinutes - firstMinutes <= maxMinutes;
  else return false;
};

/**
 * Returns the time between two dates in minutes, hours, and days (can be negative)
 *
 * @param {Object} firstDate - An object containing hour, minutes, day, month, year, and months
 * @param {Object} secondDate - An object containing hour, minutes, day, month, year
 * @param {Array} months - An array of month objects that each have a days property with the number of days in that month
 * @returns An amount of time object with minutes, hours and days (can be negative)
 */
export const getTimeBetween = (
  firstDate: TrackerDateTime,
  secondDate: TrackerDateTime,
  months: Month[]
): Required<DateTimeAmount> => {
  const daysInAYear = getDaysInYear(months);
  const minutesInADay = 1440;

  // Make first date chronologically first
  const sortedDates = [firstDate, secondDate].sort(compareChronologically);
  const isNegative = secondDate === sortedDates[0];
  firstDate = sortedDates[0];
  secondDate = sortedDates[1];

  // Convert dates to minutes and days
  const firstDays = getDayOfYearFromDate(
    firstDate.day,
    firstDate.month,
    months
  );
  const secondDays =
    getDayOfYearFromDate(secondDate.day, secondDate.month, months) +
    (secondDate.year - firstDate.year) * daysInAYear;
  const firstMinutes = firstDate.hour * 60 + firstDate.minutes;
  const secondMinutes = secondDate.hour * 60 + secondDate.minutes;

  let days = secondDays - firstDays - 1;
  let minutes = minutesInADay + secondMinutes - firstMinutes;
  days += Math.floor(minutes / minutesInADay);
  minutes = minutes % minutesInADay;
  let hours = Math.floor(minutes / 60);
  minutes = minutes % 60;
  days = isNegative && days !== 0 ? days * -1 : days;
  hours = isNegative && hours !== 0 ? hours * -1 : hours;
  minutes = isNegative && minutes !== 0 ? minutes * -1 : minutes;
  return { minutes, hours, days };
};

/**
 * Returns a fixed date to match the provided calendar,
 * making sure that it's a valid month and day in that month
 */
export const fixDate = (date: TrackerDateTime, calendar: TrackerCalendar) => {
  const newMonth =
    date.month < calendar.months.length
      ? date.month
      : calendar.months.length - 1;
  const maxDay = calendar.months[newMonth].days;
  const newDay = date.day <= maxDay ? date.day : maxDay;
  return { ...date, day: newDay, month: newMonth };
};
