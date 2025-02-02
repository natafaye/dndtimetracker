import { ErrorMessage, Field, FormikErrors } from "formik";
import { FormLabel } from "react-bootstrap";
import { DayOfTheWeek, StartDayOfWeekOfYear } from "../../shared/types";

type Props = {
    daysOfTheWeek: DayOfTheWeek[],
    errors?: FormikErrors<StartDayOfWeekOfYear>
}

export default function StartDayOfWeekInput({ daysOfTheWeek, errors }: Props) {
    return (
        <div className="col">
            <FormLabel htmlFor="startDayOfWeekOfYearYear">Start Day of the Week</FormLabel>
            <div className="form-inline">
                <label className="text-secondary me-2">Year</label>
                <Field
                    type="number"
                    name="startDayOfWeekOfYear.year"
                    id="startDayOfWeekOfYearYear"
                    min="1"
                    className={(errors && errors.year) ? "form-control w-25 is-invalid" : "form-control w-25"}
                />
                <label className="text-secondary me-2 ms-2">starts on a</label>
                <Field
                    as="select"
                    className="form-control w-25"
                    name="startDayOfWeekOfYear.dayOfWeek"
                    id="startDayOfWeekOfYearDay"
                >
                    {daysOfTheWeek.map((dayOfWeek, index) => (
                        <option value={index} key={index}>{dayOfWeek.name}</option>
                    ))}
                </Field>
                <label className="text-danger error-text ms-2">
                    <small><ErrorMessage name="startDayOfWeekOfYear.year" /></small>
                </label>
            </div>
        </div>
    );
}