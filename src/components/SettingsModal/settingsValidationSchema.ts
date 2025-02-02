import * as Yup from 'yup';
import { requiredError, numberError, minError, maxError } from '../../shared/constants';

export const settingsValidationSchema = Yup.object({
    hoursInTimeTrack: Yup.number().typeError(numberError).required(requiredError)
    .integer(numberError).min(1, minError).max(6, maxError).label("Hours Shown in Time Track"),
    daysInDaysTrack: Yup.number().typeError(numberError).required(requiredError)
    .integer(numberError).min(5, minError).max(11, maxError).label("Days Shown in Day Track"),
});