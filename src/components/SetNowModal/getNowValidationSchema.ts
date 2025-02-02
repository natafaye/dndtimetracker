import * as Yup from "yup";
import {
  requiredError,
  numberError,
  minError,
  maxError,
  dayMaxError,
} from "../../shared/constants";
import { TrackerCalendar } from "../../shared/types";

export const getNowValidationSchema = (calendar: TrackerCalendar) =>
  Yup.object({
    hour: Yup.number(),
    minutes: Yup.number()
      .typeError(numberError)
      .required(requiredError)
      .integer(numberError)
      .min(0, minError)
      .max(59, maxError)
      .label("Minutes"),
    day: Yup.number()
      .typeError(numberError)
      .required(requiredError)
      .integer(numberError)
      .min(1, minError)
      .label("Day")
      .test("max-days", dayMaxError, function (value) {
        return (
          !calendar.useCalendar ||
          value <= calendar.months[+this.parent["month"]].days
        );
      }),
    month: Yup.number(),
    year: Yup.number()
      .typeError(numberError)
      .required(requiredError)
      .integer(numberError)
      .min(0, minError)
      .max(10000, maxError)
      .label("Year"),
  });
