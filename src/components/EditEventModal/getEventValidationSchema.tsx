import * as Yup from 'yup'
import {
    requiredError, numberError, minError, maxError, minLengthError, maxLengthError, dayMaxError 
} from '../../shared/constants';
import type { TrackerCalendar } from '../../shared/types';

export const getEventValidationSchema = (calendar: TrackerCalendar) => Yup.object({
    label: Yup.string()
        .required(requiredError)
        .min(2, minLengthError)
        .max(20, maxLengthError),
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
        .test('max-days', dayMaxError, function (value) {
            return !calendar.useCalendar || value <= calendar.months[+this.parent['month']].days;
        }),
    month: Yup.number(),
    year: Yup.number()
        .typeError(numberError)
        .required(requiredError)
        .integer(numberError)
        .min(1, minError)
        .max(10000, maxError)
        .label("Year")
})