import * as Yup from "yup";
import {
  requiredError,
  numberError,
  minError,
  maxError,
  minLengthError,
  maxLengthError,
} from "../../shared/constants";

export const calendarValidationSchema = Yup.object({
  periodsInADay: Yup.number(),
  daysInAWeek: Yup.number()
    .typeError(numberError)
    .required(requiredError)
    .integer(numberError)
    .min(2, minError)
    .max(30, maxError)
    .label("Days In A Week"),
  monthsInAYear: Yup.number()
    .typeError(numberError)
    .required(requiredError)
    .integer(numberError)
    .min(1, minError)
    .max(50, maxError)
    .label("Months In A Year"),
  startDayOfWeekOfYear: Yup.object().shape({
    dayOfWeek: Yup.number(),
    year: Yup.number()
      .typeError(numberError)
      .required(requiredError)
      .integer(numberError)
      .min(1, minError)
      .max(10000, maxError)
      .label("Year"),
  }),
  periods: Yup.array().of(
    Yup.object().shape({
      name: Yup.string()
        .required(requiredError)
        .min(2, minLengthError)
        .max(20, maxLengthError)
        .label("Period name"),
    })
  ),
  daysOfTheWeek: Yup.array().of(
    Yup.object().shape({
      name: Yup.string()
        .required(requiredError)
        .min(2, minLengthError)
        .max(20, maxLengthError)
        .label("Day of the Week name"),
    })
  ),
  months: Yup.array().of(
    Yup.object().shape({
      name: Yup.string()
        .required(requiredError)
        .min(2, minLengthError)
        .max(20, maxLengthError)
        .label("Month name"),
      days: Yup.number()
        .typeError(numberError)
        .required(requiredError)
        .integer(numberError)
        .min(1, minError)
        .max(400, maxError)
        .label("Days in the month"),
    })
  ),
});
