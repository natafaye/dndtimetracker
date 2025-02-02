// Date & Time

import { IconProp } from "@fortawesome/fontawesome-svg-core"

export type TrackerTime = {
    hour: number
    minutes: number
}

export type TrackerDate = {
    day: number
    month: number
    year: number
}

export type TrackerDateTime = TrackerDate & TrackerTime

export type DateTimeAmount = {
    days?: number
    hours?: number
    minutes?: number
}

// Buttons & Events

export type TrackerButton = DateTimeAmount & {
    id: string
    label: string
}

export type TrackerEvent = TrackerTime & TrackerDate & {
    id: string
    label: string
    icon: IconProp
}

// Settings

export enum TimeFormat {
    Hour = "HOUR",
    Hour_Minutes = "HOUR_MINUTES",
    Hour_Period = "HOUR_PERIOD",
    Hour_Minutes_Period = "HOUR_MINUTES_PERIOD"
}

export enum DateFormat {
    None = "NONE",
    Day = "DAY",
    Day_DayOfWeek = "DAY_DAYOFWEEK",
    Day_Month = "DAY_MONTH",
    DayOfWeek_Day_Month = "DAYOFWEEK_DAY_MONTH",
    Day_Month_Year = "DAY_MONTH_YEAR",
    DayOfWeek_Day_Month_Year = "DAYOFWEEK_DAY_MONTH_YEAR",
}

export type TrackerSettings = {
    timeFormat: TimeFormat
    dateFormat: DateFormat
    showTimeTrack: boolean
    hoursInTimeTrack: number
    showDaysTrack: boolean
    daysInDaysTrack: number
    showSeasonIcon: boolean
}

// Calendar

export type CalendarListItem = {
    id: number
    name: string
}

export type Period = CalendarListItem

export type DayOfTheWeek = CalendarListItem

export type Month = CalendarListItem & {
    days: number
    season: Season
}

export enum Season {
    Winter = "Winter",
    Spring = "Spring",
    Summer = "Summer",
    Fall = "Fall"
}

export type StartDayOfWeekOfYear = {
    year: number, 
    dayOfWeek: number
}

export type TrackerCalendar = {
    useCalendar: boolean
    periods: Period[]
    daysOfTheWeek: DayOfTheWeek[]
    periodsInADay: number
    daysInAWeek: number
    monthsInAYear: number
    months: Month[]
    startDayOfWeekOfYear: StartDayOfWeekOfYear
}