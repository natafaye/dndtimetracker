import { EventIcon } from "../shared/constants";
import { Season } from "../shared/types";
import type { TrackerButton, TrackerCalendar, TrackerEvent } from "../shared/types";

export const EXAMPLE_BUTTONS: TrackerButton[] = [
  {
    id: "af0a36f1-86f1-4c99-83e6-db0ed65e8b08",
    label: "1 Min",
    minutes: 1,
  },
  {
    id: "de18007f-e954-4593-aaa5-2fa8cc936b9c",
    label: "30 Min",
    minutes: 30,
  },
  {
    id: "0b71ded9-86dd-46e6-ae68-83d70cc9ba8e",
    label: "1 Day",
    days: 1,
  },
  {
    id: "2c44833f-c52f-40c9-ad79-bd33c1a28401",
    label: "1 Month",
    days: 30,
  },
];

export const EXAMPLE_EVENTS: TrackerEvent[] = [
  {
    id: "6cdbe2dd-1505-4acd-9f7b-2a55de094024",
    label: "Guards Arrive",
    icon: EventIcon.dice,
    hour: 18,
    minutes: 40,
    day: 3,
    month: 6,
    year: 12,
  },
  {
    id: "f774c108-eca1-4f36-a234-c0262c8a3307",
    label: "Dragon Returns",
    icon: EventIcon.dragon,
    hour: 19,
    minutes: 35,
    day: 3,
    month: 6,
    year: 12,
  },
  {
    id: "4110f92e-fdbf-48ac-8b0e-3df22f4918bc",
    label: "Portal Opens",
    icon: EventIcon.fire,
    hour: 17,
    minutes: 28,
    day: 3,
    month: 6,
    year: 12,
  },
  {
    id: "9042a547-c3dc-4afc-a3a3-0d9c7c0227a0",
    label: "Portal Closes",
    icon: EventIcon.skull,
    hour: 20,
    minutes: 0,
    day: 6,
    month: 6,
    year: 12,
  },
];

export const HARPTOS_CALENDAR: TrackerCalendar = {
  periodsInADay: 6,
  daysInAWeek: 10,
  monthsInAYear: 12,
  useCalendar: true,
  startDayOfWeekOfYear: {
    year: 10,
    dayOfWeek: 0,
  },
  periods: [
    {
      id: 0,
      name: "Late Night",
    },
    {
      id: 1,
      name: "Early Morning",
    },
    {
      id: 2,
      name: "Morning",
    },
    {
      id: 3,
      name: "Afternoon",
    },
    {
      id: 4,
      name: "Evening",
    },
    {
      id: 5,
      name: "Night",
    },
  ],
  daysOfTheWeek: [
    {
      id: 0,
      name: "Selday",
    },
    {
      id: 1,
      name: "Tyrday",
    },
    {
      id: 2,
      name: "Janday",
    },
    {
      id: 3,
      name: "Keleday",
    },
    {
      id: 4,
      name: "Mystraday",
    },
    {
      id: 5,
      name: "Lathday",
    },
    {
      id: 6,
      name: "Istiday",
    },
    {
      id: 7,
      name: "Suneday",
    },
    {
      id: 8,
      name: "Ogday",
    },
    {
      id: 9,
      name: "Akaday",
    },
  ],
  months: [
    {
      id: 0,
      name: "Hammer",
      days: 30,
      season: Season.Winter,
    },
    {
      id: 1,
      name: "Alturiak",
      days: 30,
      season: Season.Winter,
    },
    {
      id: 2,
      name: "Ches",
      days: 30,
      season: Season.Spring,
    },
    {
      id: 3,
      name: "Tarsakh",
      days: 30,
      season: Season.Spring,
    },
    {
      id: 4,
      name: "Mirtul",
      days: 30,
      season: Season.Spring,
    },
    {
      id: 5,
      name: "Kythorn",
      days: 30,
      season: Season.Summer,
    },
    {
      id: 6,
      name: "Flamerule",
      days: 30,
      season: Season.Summer,
    },
    {
      id: 7,
      name: "Eleasias",
      days: 30,
      season: Season.Summer,
    },
    {
      id: 8,
      name: "Eleint",
      days: 30,
      season: Season.Fall,
    },
    {
      id: 9,
      name: "Marpenoth",
      days: 30,
      season: Season.Fall,
    },
    {
      id: 10,
      name: "Uktar",
      days: 30,
      season: Season.Fall,
    },
    {
      id: 11,
      name: "Nightal",
      days: 30,
      season: Season.Winter,
    },
  ],
};
