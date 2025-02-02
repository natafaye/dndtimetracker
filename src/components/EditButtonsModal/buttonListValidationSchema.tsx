import * as Yup from 'yup';
import { requiredError, numberError, minError, maxError, minLengthError, maxLengthError } from '../../shared/constants';

export const buttonListValidationSchema = Yup.object({
    buttonList: Yup.array().of(Yup.object().shape({
        label: Yup.string()
            .required(requiredError)
            .min(2, minLengthError)
            .max(20, maxLengthError)
            .label("Label"),
        minutes: Yup
            .number()
            .typeError(numberError)
            .integer(numberError)
            .min(0, minError)
            .max(100, maxError)
            .label("Minutes"),
        hours: Yup.number()
            .typeError(numberError)
            .integer(numberError)
            .min(0, minError)
            .max(100, maxError)
            .label("Hours"),
        days: Yup.number()
            .typeError(numberError)
            .integer(numberError)
            .min(0, minError)
            .max(400, maxError)
            .label("Days"),
    }))
});