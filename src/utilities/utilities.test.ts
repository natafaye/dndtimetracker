import {
    getDaysInYear, getDayOfYearFromDate, getDateFromDayOfYear,
    getDayOfWeekIndex, addTime,
    areWithinTime, compareChronologically, getTimeBetween
} from './datetime';
import { hourToString, timeToString, dateToString } from "./format"
import { mixColors } from "./colors"
import { DateFormat, Season, TimeFormat, TrackerCalendar, TrackerDateTime } from '../shared/types';
import { test, expect } from "vitest"

const starterDateTime: TrackerDateTime = {
    hour: 0,
    minutes: 0,
    day: 1,
    month: 0,
    year: 1
}

const getRandomMonths = (numberOfMonths: number) => [...Array(numberOfMonths)].map((_, index) => {
    const randomDays = Math.floor((Math.random() * 399) + 1);
    return { id: index, name: "m" + index, season: Season.Fall, days: randomDays };
});

const getTestCalendar = (): TrackerCalendar => ({
    useCalendar: true,
    periodsInADay: 2,
    periods: [{ id: 0, name: "p1" }, { id: 1, name: "p2" }],
    daysInAWeek: 4,
    daysOfTheWeek: [...Array(4)].map((_, index) => ({
        id: index,
        name: "d" + index
    })),
    monthsInAYear: 5,
    months: getRandomMonths(5),
    startDayOfWeekOfYear: {
        year: 1,
        dayOfWeek: Math.floor(Math.random() * 4)
    }
})
const starterCalendar = getTestCalendar()

// hourToString

test('hourToString converts 0-23 hours to 1-12 hours', () => {
    expect(hourToString(0, true)).toBe("12\xa0AM");
    expect(hourToString(0)).toBe("12");
    for (let i = 1; i < 12; i++) {
        expect(hourToString(i, true)).toBe(i + "\xa0AM");
        expect(hourToString(i)).toBe(i + "");
    }
    expect(hourToString(12, true)).toBe("12\xa0PM");
    expect(hourToString(12)).toBe("12");
    for (let i = 13; i < 23; i++) {
        expect(hourToString(i, true)).toBe(i - 12 + "\xa0PM");
        expect(hourToString(i)).toBe(i - 12 + "");
    }
})

// timeToString

test('timeToString with TimeFormat.Hour shows only the hour', () => {
    const dateTime = { ...starterDateTime }
    expect(timeToString(dateTime, starterCalendar, TimeFormat.Hour)).toBe("12 AM");
    dateTime.hour = 17
    expect(timeToString(dateTime, starterCalendar, TimeFormat.Hour)).toBe("5 PM");
})

test('timeToString with TimeFormat.Hour_Minutes shows the hour and minutes', () => {
    const dateTime = { ...starterDateTime }
    expect(timeToString(dateTime, starterCalendar, TimeFormat.Hour_Minutes)).toBe("12:00 AM");
    dateTime.minutes = 3;
    expect(timeToString(dateTime, starterCalendar, TimeFormat.Hour_Minutes)).toBe("12:03 AM");
    dateTime.hour = 17;
    dateTime.minutes = 37;
    expect(timeToString(dateTime, starterCalendar, TimeFormat.Hour_Minutes)).toBe("5:37 PM");
})

test('timeToString with TimeFormat.Hour_Period shows the hour and period', () => {
    const dateTime = { ...starterDateTime }
    expect(timeToString(dateTime, starterCalendar, TimeFormat.Hour_Period)).toBe("12 p1");
    dateTime.hour = 20;
    expect(timeToString(dateTime, starterCalendar, TimeFormat.Hour_Period)).toBe("8 p2");
})

test('timeToString shows the correct period for all numbers of periods', () => {
    const dateTime = { ...starterDateTime }
    const calendar = getTestCalendar()
    const periodsInADayList = [2, 3, 4, 6, 8, 12];
    periodsInADayList.forEach((periodsInADay) => {
        calendar.periodsInADay = periodsInADay;
        calendar.periods = [...Array(periodsInADay)].map((_, index) => ({ id: index, name: "p" + (index + 1) }));
        for (let j = 0; j < periodsInADay; j++) {
            for (let i = j * (24 / periodsInADay); i < (j + 1) * (24 / periodsInADay); i++) {
                dateTime.hour = i;
                expect(timeToString(dateTime, calendar, TimeFormat.Hour_Period)).toBe(hourToString(i) + " p" + (j + 1));
            }
        }
    });
})

test('timeToString with TIME_DISPLAY.HOUR_MINUTES_PERIOD shows the hour, minutes and period', () => {
    const dateTime = { ...starterDateTime }
    dateTime.minutes = 10;
    expect(timeToString(dateTime, starterCalendar, TimeFormat.Hour_Minutes_Period)).toBe("12:10 p1");
    dateTime.hour = 15;
    dateTime.minutes = 37;
    expect(timeToString(dateTime, starterCalendar, TimeFormat.Hour_Minutes_Period)).toBe("3:37 p2");
})

// getDaysInYear

test('getDaysInYear counts the days in the year based on the days in the months', () => {
    let totalDays = 0;
    const months = getRandomMonths(5)
    totalDays += months.reduce((total, month) => total + month.days, 0)
    expect(getDaysInYear(months)).toBe(totalDays);
})

// getDayOfYear and getDateFromDayOfYear

test('getDateFromDayOfYear can handle days beyond the end of the year', () => {
    const months = getRandomMonths(5)
    const daysInYear = getDaysInYear(months);
    const daysToAdd = Math.floor(Math.random() * (daysInYear - 2)) + 1
    const date = getDateFromDayOfYear(daysInYear + daysToAdd, 0, months);
    expect(getDayOfYearFromDate(date.day, date.month, months)).toBe(daysToAdd);
})

test('getDayOfYear and getDateFromDayOfYear turn a number back and forth from a date', () => {
    const months = getRandomMonths(5)
    for (let i = 0; i < 100; i++) {
        const randomDay = Math.floor(Math.random() * getDaysInYear(months)) + 1
        const date = getDateFromDayOfYear(randomDay, 0, months);
        expect(getDayOfYearFromDate(date.day, date.month, months)).toBe(randomDay);
    }

    const firstDay = 1;
    let date = getDateFromDayOfYear(firstDay, 0, months);
    expect(getDayOfYearFromDate(date.day, date.month, months)).toBe(firstDay);

    const lastDay = getDaysInYear(months);
    date = getDateFromDayOfYear(lastDay, 0, months);
    expect(getDayOfYearFromDate(date.day, date.month, months)).toBe(lastDay);

})

// addTime

test('addTime gives the correct new date', () => {
    const dateTime = { ...starterDateTime }

    dateTime.minutes = Math.floor(Math.random() * 49);
    dateTime.hour = Math.floor(Math.random() * 23);
    dateTime.month = Math.floor(Math.random() * (starterCalendar.months.length - 1));
    dateTime.day = Math.floor(Math.random() * (starterCalendar.months[dateTime.month].days - 1)) + 1;
    dateTime.year = Math.floor(Math.random() * 15);
    const startDate = dateTime

    // Test basic add
    expect(addTime(startDate, { minutes: 10 }, starterCalendar))
        .toEqual({ ...startDate, minutes: dateTime.minutes + 10 });

    // Test rollover to next hour
    dateTime.minutes = 40;
    startDate.minutes = dateTime.minutes;
    expect(addTime(startDate, { minutes: 27 }, starterCalendar))
        .toEqual({ ...startDate, minutes: 7, hour: dateTime.hour + 1 });

    // Test rollover to next day
    dateTime.hour = 23;
    startDate.hour = dateTime.hour;
    expect(addTime(startDate, { minutes: 27 }, starterCalendar))
        .toEqual({ ...startDate, minutes: 7, hour: 0, day: dateTime.day + 1 });

    // Test rollover to next month
    dateTime.day = starterCalendar.months[dateTime.month].days;
    startDate.day = dateTime.day;
    expect(addTime(dateTime, { minutes: 27 }, starterCalendar))
        .toEqual({ ...startDate, minutes: 7, hour: 0, day: 1, month: dateTime.month + 1 });

    // Test rollover to next year
    dateTime.month = starterCalendar.months.length - 1;
    startDate.month = dateTime.month;
    dateTime.day = starterCalendar.months[dateTime.month].days;
    startDate.day = dateTime.day;
    expect(addTime(dateTime, { minutes: 27 }, starterCalendar))
        .toEqual({ ...startDate, minutes: 7, hour: 0, day: 1, month: 0, year: dateTime.year + 1 });

    // Test multiple rollovers
    dateTime.hour = 22;
    startDate.hour = dateTime.hour;
    dateTime.day = starterCalendar.months[dateTime.month].days - 2;
    startDate.day = dateTime.day;
    expect(addTime(dateTime, { minutes: 27, hours: 3, days: 5 }, starterCalendar))
        .toEqual({ ...startDate, minutes: 7, hour: 2, day: 4, month: 0, year: dateTime.year + 1 });
})

test('addTime works with negative time', () => {
    const dateTime = { ...starterDateTime };

    dateTime.minutes = Math.floor(Math.random() * 49) + 10;
    dateTime.hour = Math.floor(Math.random() * 22) + 1;
    dateTime.month = Math.floor(Math.random() * (starterCalendar.months.length - 2)) + 1;
    dateTime.day = Math.floor(Math.random() * (starterCalendar.months[dateTime.month].days - 2)) + 2;
    dateTime.year = Math.floor(Math.random() * 15);
    const startDate = { minutes: dateTime.minutes, hour: dateTime.hour, day: dateTime.day, month: dateTime.month, year: dateTime.year };

    // Test basic add
    expect(addTime(dateTime, { minutes: -10 }, starterCalendar)).toEqual({ ...startDate, minutes: dateTime.minutes - 10 });

    // Test rollover to next hour
    dateTime.minutes = 40;
    startDate.minutes = dateTime.minutes;
    expect(addTime(dateTime, { minutes: -53 }, starterCalendar)).toEqual(
        { ...startDate, minutes: 47, hour: dateTime.hour - 1 }
    );

    // Test rollover to next day
    dateTime.hour = 0;
    startDate.hour = dateTime.hour;
    expect(addTime(dateTime, { minutes: -53 }, starterCalendar)).toEqual(
        { ...startDate, minutes: 47, hour: 23, day: dateTime.day - 1 }
    );

    // Test rollover to next month
    dateTime.day = 1;
    expect(addTime(dateTime, { minutes: -53 }, starterCalendar)).toEqual(
        { ...startDate, minutes: 47, hour: 23, day: starterCalendar.months[dateTime.month - 1].days, month: dateTime.month - 1 }
    );

    // Test rollover to next year
    dateTime.month = 0;
    dateTime.day = 1;
    let newDate = {
        minutes: 47,
        hour: 23,
        day: starterCalendar.months[starterCalendar.months.length - 1].days,
        month: starterCalendar.months.length - 1,
        year: dateTime.year - 1
    }
    expect(addTime(dateTime, { minutes: -53 }, starterCalendar)).toEqual({ ...startDate, ...newDate });

    // Test multiple rollovers
    dateTime.hour = 0;
    dateTime.day = 2;
    newDate = {
        minutes: 47,
        hour: 20,
        day: starterCalendar.months[starterCalendar.months.length - 1].days - 4,
        month: starterCalendar.months.length - 1,
        year: dateTime.year - 1
    }
    expect(addTime(dateTime, { minutes: -53, hours: -3, days: -5 }, starterCalendar)).toEqual({ ...startDate, ...newDate });
})

// getDayOfWeekIndex

test('getDayOfWeekIndex gives the correct day of week index', () => {
    const dateTime = { ...starterDateTime }
    const daysInTheWeek = starterCalendar.daysOfTheWeek.length;

    expect(getDayOfWeekIndex(dateTime, starterCalendar)).toBe(starterCalendar.startDayOfWeekOfYear.dayOfWeek);

    const testData1 = addTime(dateTime, { days: 1 }, starterCalendar)
    expect(getDayOfWeekIndex(testData1, starterCalendar)).toBe(
        (starterCalendar.startDayOfWeekOfYear.dayOfWeek + 1) % starterCalendar.daysOfTheWeek.length
    );

    const daysToAdd = Math.floor(Math.random() * 500) + getDaysInYear(starterCalendar.months);
    const testData2 = addTime(dateTime, { days: daysToAdd }, starterCalendar)
    expect(getDayOfWeekIndex(testData2, starterCalendar)).toBe(
        (starterCalendar.startDayOfWeekOfYear.dayOfWeek + (daysToAdd % daysInTheWeek)) % daysInTheWeek
    );

    dateTime.year = 1499;
    dateTime.month = 4;
    const calendar = getTestCalendar()
    calendar.months[dateTime.month].days = 100
    const daysToSubtract = Math.floor(Math.random() * 97) + 1;
    dateTime.day = calendar.months[dateTime.month].days - daysToSubtract + 1;
    calendar.startDayOfWeekOfYear = { year: 1500, dayOfWeek: 4 };
    expect(getDayOfWeekIndex(dateTime, calendar)).toBe(
        (calendar.startDayOfWeekOfYear.dayOfWeek - (daysToSubtract % daysInTheWeek)) % daysInTheWeek
    );

})

// dateToString

test('dateToString with DateFormat.None shows nothing', () => {
    expect(dateToString(starterDateTime, starterCalendar, DateFormat.None)).toBe("");
})

test('dateToString with DateFormat.Day shows the day', () => {
    const dateTime = { ...starterDateTime };
    dateTime.day = 1;
    expect(dateToString(dateTime, starterCalendar, DateFormat.Day)).toBe("Day 1");
    dateTime.day = 246;
    expect(dateToString(dateTime, starterCalendar, DateFormat.Day)).toBe("Day 246");
})

test('dateToString with DateFormat.DayOfWeek_Day_Month shows day and month', () => {
    const dateTime = { ...starterDateTime };

    dateTime.month = 4;
    dateTime.day = 1;
    let dayOfWeek = starterCalendar.daysOfTheWeek[getDayOfWeekIndex(dateTime, starterCalendar)].name;
    expect(dateToString(dateTime, starterCalendar, DateFormat.DayOfWeek_Day_Month)).toBe(`${dayOfWeek}, 1st of m4`);

    dateTime.day = 2;
    dayOfWeek = starterCalendar.daysOfTheWeek[getDayOfWeekIndex(dateTime, starterCalendar)].name;
    expect(dateToString(dateTime, starterCalendar, DateFormat.DayOfWeek_Day_Month)).toBe(`${dayOfWeek}, 2nd of m4`);

    dateTime.day = 3;
    dayOfWeek = starterCalendar.daysOfTheWeek[getDayOfWeekIndex(dateTime, starterCalendar)].name;
    expect(dateToString(dateTime, starterCalendar, DateFormat.DayOfWeek_Day_Month)).toBe(`${dayOfWeek}, 3rd of m4`);

    dateTime.month = 2;
    dateTime.day = 13;
    dayOfWeek = starterCalendar.daysOfTheWeek[getDayOfWeekIndex(dateTime, starterCalendar)].name;
    expect(dateToString(dateTime, starterCalendar, DateFormat.DayOfWeek_Day_Month)).toBe(`${dayOfWeek}, 13th of m2`);

    dateTime.day = 21;
    dayOfWeek = starterCalendar.daysOfTheWeek[getDayOfWeekIndex(dateTime, starterCalendar)].name;
    expect(dateToString(dateTime, starterCalendar, DateFormat.DayOfWeek_Day_Month)).toBe(`${dayOfWeek}, 21st of m2`);
})

test('dateToString with DateFormat.Day_Month_Year shows day, month, and year', () => {
    const dateTime = { ...starterDateTime };
    dateTime.year = 1492;
    expect(dateToString(dateTime, starterCalendar, DateFormat.Day_Month_Year)).toBe(`1st of m0, Year ${dateTime.year}`);
})

// compareChronologically

test('compareChronologically sorts lists of dates correctly', () => {
    const testDate1 = { ...starterDateTime };
    testDate1.year = 4;
    testDate1.month = 1;
    testDate1.day = 3;
    testDate1.hour = 5;
    testDate1.minutes = 43;
    const testDate2 = { ...testDate1 };
    testDate2.day = 4;
    const testDate3 = { ...testDate2 };
    testDate3.hour = 20;
    const testDate4 = { ...testDate3 };
    testDate4.minutes = 44;
    const testDate5 = { ...testDate4 };
    testDate5.month = 1;
    testDate5.year = 5;

    const dateList = [testDate5, testDate3, testDate1, testDate2, testDate4].sort(compareChronologically);
    expect(dateList[0]).toEqual(testDate1);
    expect(dateList[1]).toEqual(testDate2);
    expect(dateList[2]).toEqual(testDate3);
    expect(dateList[3]).toEqual(testDate4);
    expect(dateList[4]).toEqual(testDate5);
})

// areWithinTime

test('areWithinTime gives the correct answers when checking minutes', () => {
    const testDate1 = { ...starterDateTime };
    const months = getTestCalendar().months
    if (months[testDate1.month].days === 1)
        months[testDate1.month].days = 3;
    const testDate2 = { ...testDate1 };

    // Test same time
    expect(areWithinTime(testDate1, testDate2, months, { minutes: 0 })).toBe(true);

    // Test same day
    testDate1.day = 1;
    testDate2.day = testDate1.day;
    testDate1.hour = 5;
    testDate2.hour = 5;
    testDate1.minutes = 25;
    testDate2.minutes = 40;
    expect(areWithinTime(testDate1, testDate2, months, { minutes: 30 })).toBe(true);
    expect(areWithinTime(testDate2, testDate1, months, { minutes: 30 })).toBe(true);
    expect(areWithinTime(testDate1, testDate2, months, { minutes: 15 })).toBe(true);
    expect(areWithinTime(testDate2, testDate1, months, { minutes: 15 })).toBe(true);
    expect(areWithinTime(testDate1, testDate2, months, { minutes: 14 })).toBe(false);
    expect(areWithinTime(testDate2, testDate1, months, { minutes: 14 })).toBe(false);

    // Test adjacent days
    testDate1.day = 1;
    testDate2.day = testDate1.day + 1;
    testDate1.hour = 5;
    testDate2.hour = 5;
    testDate1.minutes = 25;
    testDate2.minutes = 40;
    expect(areWithinTime(testDate1, testDate2, months, { minutes: 30 })).toBe(false);
    expect(areWithinTime(testDate2, testDate1, months, { minutes: 30 })).toBe(false);
    testDate1.hour = 23;
    testDate2.hour = 0;
    expect(areWithinTime(testDate1, testDate2, months, { minutes: 75 })).toBe(true);
    expect(areWithinTime(testDate2, testDate1, months, { minutes: 75 })).toBe(true);
    expect(areWithinTime(testDate1, testDate2, months, { minutes: 74 })).toBe(false);
    expect(areWithinTime(testDate2, testDate1, months, { minutes: 74 })).toBe(false);
    testDate1.month = 2;
    testDate1.day = months[testDate1.month].days;
    testDate2.month = 3;
    testDate2.day = 1
    testDate1.hour = 5;
    testDate2.hour = 5;
    testDate1.minutes = 25;
    testDate2.minutes = 40;
    expect(areWithinTime(testDate1, testDate2, months, { minutes: 30 })).toBe(false);
    expect(areWithinTime(testDate2, testDate1, months, { minutes: 30 })).toBe(false);
    testDate1.hour = 23;
    testDate2.hour = 0;
    expect(areWithinTime(testDate1, testDate2, months, { minutes: 75 })).toBe(true);
    expect(areWithinTime(testDate2, testDate1, months, { minutes: 75 })).toBe(true);
    expect(areWithinTime(testDate1, testDate2, months, { minutes: 74 })).toBe(false);
    expect(areWithinTime(testDate2, testDate1, months, { minutes: 74 })).toBe(false);

    // Test non-adjacent days
    testDate1.day = 2;
    testDate2.day = 4;
    testDate1.hour = 5;
    testDate2.hour = 5;
    testDate1.minutes = 25;
    testDate2.minutes = 40;
    expect(areWithinTime(testDate1, testDate2, months, { minutes: 30 })).toBe(false);
    expect(areWithinTime(testDate2, testDate1, months, { minutes: 30 })).toBe(false);
    testDate1.hour = 23;
    testDate2.hour = 0;
    expect(areWithinTime(testDate1, testDate2, months, { minutes: 75 })).toBe(false);
    expect(areWithinTime(testDate2, testDate1, months, { minutes: 75 })).toBe(false);
})

test('areWithinTime gives the correct answers when checking hours', () => {
    const testDate1 = { ...starterDateTime };
    const months = getTestCalendar().months
    if (months[testDate1.month].days === 1)
        months[testDate1.month].days = 3;
    const testDate2 = { ...testDate1 };

    // Test same day
    testDate1.day = 1;
    testDate2.day = testDate1.day;
    testDate1.hour = 5;
    testDate2.hour = 5;
    testDate1.minutes = 25;
    testDate2.minutes = 40;
    expect(areWithinTime(testDate1, testDate2, months, { hours: 1 })).toBe(true);
    expect(areWithinTime(testDate2, testDate1, months, { hours: 1 })).toBe(true);
    testDate1.hour = 5;
    testDate2.hour = 6;
    testDate1.minutes = 25;
    testDate2.minutes = 40;
    expect(areWithinTime(testDate1, testDate2, months, { hours: 2 })).toBe(true);
    expect(areWithinTime(testDate2, testDate1, months, { hours: 2 })).toBe(true);
    expect(areWithinTime(testDate1, testDate2, months, { hours: 1 })).toBe(false);
    expect(areWithinTime(testDate2, testDate1, months, { hours: 1 })).toBe(false);
    testDate1.hour = 5;
    testDate2.hour = 9;
    testDate1.minutes = 25;
    testDate2.minutes = 40;
    expect(areWithinTime(testDate1, testDate2, months, { hours: 5 })).toBe(true);
    expect(areWithinTime(testDate2, testDate1, months, { hours: 5 })).toBe(true);
    expect(areWithinTime(testDate1, testDate2, months, { hours: 4 })).toBe(false);
    expect(areWithinTime(testDate2, testDate1, months, { hours: 4 })).toBe(false);

    // Test adjacent days
    testDate1.day = 1;
    testDate2.day = testDate1.day + 1;
    testDate1.hour = 5;
    testDate2.hour = 5;
    testDate1.minutes = 25;
    testDate2.minutes = 40;
    expect(areWithinTime(testDate1, testDate2, months, { hours: 1 })).toBe(false);
    expect(areWithinTime(testDate2, testDate1, months, { hours: 1 })).toBe(false);
    testDate1.hour = 23;
    testDate2.hour = 0;
    expect(areWithinTime(testDate1, testDate2, months, { hours: 2 })).toBe(true);
    expect(areWithinTime(testDate2, testDate1, months, { hours: 2 })).toBe(true);
    expect(areWithinTime(testDate1, testDate2, months, { hours: 1 })).toBe(false);
    expect(areWithinTime(testDate2, testDate1, months, { hours: 1 })).toBe(false);
    testDate1.month = 2;
    testDate1.day = months[testDate1.month].days;
    testDate2.month = 3;
    testDate2.day = 1
    testDate1.hour = 5;
    testDate2.hour = 5;
    testDate1.minutes = 25;
    testDate2.minutes = 40;
    expect(areWithinTime(testDate1, testDate2, months, { hours: 2 })).toBe(false);
    expect(areWithinTime(testDate2, testDate1, months, { hours: 2 })).toBe(false);
    testDate1.hour = 23;
    testDate2.hour = 0;
    expect(areWithinTime(testDate1, testDate2, months, { hours: 2 })).toBe(true);
    expect(areWithinTime(testDate2, testDate1, months, { hours: 2 })).toBe(true);
    expect(areWithinTime(testDate1, testDate2, months, { hours: 1 })).toBe(false);
    expect(areWithinTime(testDate2, testDate1, months, { hours: 1 })).toBe(false);

    // Test non-adjacent days
    testDate1.day = 2;
    testDate2.day = 4;
    testDate1.hour = 5;
    testDate2.hour = 5;
    testDate1.minutes = 25;
    testDate2.minutes = 40;
    expect(areWithinTime(testDate1, testDate2, months, { hours: 2 })).toBe(false);
    expect(areWithinTime(testDate2, testDate1, months, { hours: 2 })).toBe(false);
    testDate1.hour = 23;
    testDate2.hour = 0;
    expect(areWithinTime(testDate1, testDate2, months, { hours: 2 })).toBe(false);
    expect(areWithinTime(testDate2, testDate1, months, { hours: 2 })).toBe(false);
})

test('areWithinTime gives the correct answers when checking days', () => {
    const testDate1 = { ...starterDateTime };
    const months = getTestCalendar().months;
    if (months[testDate1.month].days === 1)
        months[testDate1.month].days = 3;
    const testDate2 = { ...testDate1 };

    // Test same month
    testDate1.day = 1;
    testDate2.day = testDate1.day;
    expect(areWithinTime(testDate1, testDate2, months, { days: 1 })).toBe(true);
    expect(areWithinTime(testDate2, testDate1, months, { days: 1 })).toBe(true);
    testDate2.day = testDate1.day + 1;
    testDate1.hour = 5;
    testDate2.hour = 5;
    testDate1.minutes = 40;
    testDate2.minutes = 25;
    expect(areWithinTime(testDate1, testDate2, months, { days: 1 })).toBe(true);
    expect(areWithinTime(testDate2, testDate1, months, { days: 1 })).toBe(true);
    testDate1.minutes = 25;
    testDate2.minutes = 40;
    expect(areWithinTime(testDate1, testDate2, months, { days: 1 })).toBe(false);
    expect(areWithinTime(testDate2, testDate1, months, { days: 1 })).toBe(false);
    expect(areWithinTime(testDate1, testDate2, months, { days: 2 })).toBe(true);
    expect(areWithinTime(testDate2, testDate1, months, { days: 2 })).toBe(true);

    // Test adjacent months
    testDate1.month = 2;
    testDate2.month = 3;
    testDate1.day = months[testDate1.month].days;
    testDate2.day = 1;
    testDate1.hour = 5;
    testDate2.hour = 5;
    testDate1.minutes = 40;
    testDate2.minutes = 25;
    expect(areWithinTime(testDate1, testDate2, months, { days: 1 })).toBe(true);
    expect(areWithinTime(testDate2, testDate1, months, { days: 1 })).toBe(true);
    testDate1.minutes = 25;
    testDate2.minutes = 40;
    expect(areWithinTime(testDate1, testDate2, months, { days: 1 })).toBe(false);
    expect(areWithinTime(testDate2, testDate1, months, { days: 1 })).toBe(false);
    expect(areWithinTime(testDate1, testDate2, months, { days: 2 })).toBe(true);
    expect(areWithinTime(testDate2, testDate1, months, { days: 2 })).toBe(true);

    // Test non-adjacent months
    testDate1.month = 2;
    testDate2.month = 4;
    testDate1.day = months[testDate1.month].days;
    testDate2.day = 1;
    testDate1.hour = 5;
    testDate2.hour = 5;
    testDate1.minutes = 40;
    testDate2.minutes = 25;
    expect(areWithinTime(testDate1, testDate2, months, { days: 1 })).toBe(false);
    expect(areWithinTime(testDate2, testDate1, months, { days: 1 })).toBe(false);
    expect(areWithinTime(testDate1, testDate2, months, { days: months[testDate1.month + 1].days })).toBe(false);
    expect(areWithinTime(testDate2, testDate1, months, { days: months[testDate1.month + 1].days })).toBe(false);
    expect(areWithinTime(testDate1, testDate2, months, { days: 1 + months[testDate1.month + 1].days })).toBe(true);
    expect(areWithinTime(testDate2, testDate1, months, { days: 1 + months[testDate1.month + 1].days })).toBe(true);
})

// getTimeBetween

test('getTimeBetween gives the correct answers', () => {
    const testDate1 = { ...starterDateTime };
    const months = getTestCalendar().months;
    if (months[testDate1.month].days === 1)
        months[testDate1.month].days = 3;
    const testDate2 = { ...testDate1 };
    const timeBetween = { minutes: 0, hours: 0, days: 0 };
    const negTimeBetween = { ...timeBetween };

    // Test same time
    expect(getTimeBetween(testDate1, testDate2, months)).toEqual(timeBetween);

    // Test same day
    testDate1.day = 1;
    testDate2.day = testDate1.day;
    testDate1.hour = 5;
    testDate2.hour = 5;
    testDate1.minutes = 25;
    testDate2.minutes = 40;
    timeBetween.minutes = 15;
    negTimeBetween.minutes = -1 * timeBetween.minutes;
    expect(getTimeBetween(testDate1, testDate2, months)).toEqual(timeBetween);
    expect(getTimeBetween(testDate2, testDate1, months)).toEqual(negTimeBetween);
    testDate1.hour = 5;
    testDate2.hour = 9;
    testDate1.minutes = 40;
    testDate2.minutes = 25;
    timeBetween.minutes = 45;
    negTimeBetween.minutes = -1 * timeBetween.minutes;
    timeBetween.hours = 3;
    negTimeBetween.hours = -1 * timeBetween.hours;
    expect(getTimeBetween(testDate1, testDate2, months)).toEqual(timeBetween);
    expect(getTimeBetween(testDate2, testDate1, months)).toEqual(negTimeBetween);

    // Test crossing day boundary
    testDate1.day = 1;
    testDate2.day = testDate1.day + 1;
    testDate1.hour = 5;
    testDate2.hour = 5;
    testDate1.minutes = 25;
    testDate2.minutes = 40;
    timeBetween.minutes = 15;
    negTimeBetween.minutes = -1 * timeBetween.minutes;
    timeBetween.hours = 0;
    negTimeBetween.hours = 0;
    timeBetween.days = 1;
    negTimeBetween.days = -1 * timeBetween.days;
    expect(getTimeBetween(testDate1, testDate2, months)).toEqual(timeBetween);
    expect(getTimeBetween(testDate2, testDate1, months)).toEqual(negTimeBetween);
    testDate1.hour = 23;
    testDate2.hour = 0;
    timeBetween.minutes = 15;
    negTimeBetween.minutes = -1 * timeBetween.minutes;
    timeBetween.hours = 1;
    negTimeBetween.hours = -1 * timeBetween.hours;
    timeBetween.days = 0;
    negTimeBetween.days = 0;
    expect(getTimeBetween(testDate1, testDate2, months)).toEqual(timeBetween);
    expect(getTimeBetween(testDate2, testDate1, months)).toEqual(negTimeBetween);
    testDate1.month = 2;
    testDate1.day = months[testDate1.month].days;
    testDate2.month = 3;
    testDate2.day = 1
    testDate1.hour = 5;
    testDate2.hour = 5;
    testDate1.minutes = 25;
    testDate2.minutes = 40;
    timeBetween.minutes = 15;
    negTimeBetween.minutes = -1 * timeBetween.minutes;
    timeBetween.hours = 0;
    negTimeBetween.hours = 0;
    timeBetween.days = 1;
    negTimeBetween.days = -1 * timeBetween.days;
    expect(getTimeBetween(testDate1, testDate2, months)).toEqual(timeBetween);
    expect(getTimeBetween(testDate2, testDate1, months)).toEqual(negTimeBetween);
    testDate1.hour = 23;
    testDate2.hour = 0;
    timeBetween.minutes = 15;
    negTimeBetween.minutes = -1 * timeBetween.minutes;
    timeBetween.hours = 1;
    negTimeBetween.hours = -1 * timeBetween.hours;
    timeBetween.days = 0;
    negTimeBetween.days = 0;
    expect(getTimeBetween(testDate1, testDate2, months)).toEqual(timeBetween);
    expect(getTimeBetween(testDate2, testDate1, months)).toEqual(negTimeBetween);

    // Test non-adjacent months
    testDate1.month = 2;
    testDate2.month = 4;
    testDate1.day = months[testDate1.month].days;
    testDate2.day = 1;
    testDate1.hour = 5;
    testDate2.hour = 5;
    testDate1.minutes = 40;
    testDate2.minutes = 25;
    timeBetween.minutes = 45;
    negTimeBetween.minutes = -1 * timeBetween.minutes;
    timeBetween.hours = 23;
    negTimeBetween.hours = -1 * timeBetween.hours;
    timeBetween.days = months[testDate1.month + 1].days;
    negTimeBetween.days = -1 * timeBetween.days;
    expect(getTimeBetween(testDate1, testDate2, months)).toEqual(timeBetween);
    expect(getTimeBetween(testDate2, testDate1, months)).toEqual(negTimeBetween);
})

// mixColors

test('mixColors mixes two colors correctly with various weights', () => {
    const color1 = "#089dba"; // blue
    const color2 = "#f2a399"; // pink
    const color25mix = "#b8a2a1"; // more pink
    const color50mix = "#7da0aa"; // half mix
    const color75mix = "#439fb2"; // more blue
    expect(mixColors(color1, color2, 25)).toBe(color25mix);
    expect(mixColors(color1, color2, 50)).toBe(color50mix);
    expect(mixColors(color1, color2, 75)).toBe(color75mix);
})