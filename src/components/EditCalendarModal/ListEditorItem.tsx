import { ErrorMessage, Field, FormikErrors } from "formik";
import { ReactNode, useId } from "react"
import { FormLabel } from "react-bootstrap";
import { type Month, Season, type CalendarListItem } from "../../shared/types";

type Props = {
    item: CalendarListItem
    label?: ReactNode
    name: string
    isMonth: boolean
    errors?: FormikErrors<CalendarListItem>
}
export default function ListEditorItem({ label, name, isMonth, errors }: Props) {
    const nameId = useId()

    return (
        <li className="row">
            {label &&
                <div className="col-2">
                    <FormLabel htmlFor={nameId} className="col-form-label">{label}</FormLabel>
                </div>
            }
            <div className="col-3">
                <Field type="text" name={`${name}.name`} id={nameId} minLength="2" maxLength="20"
                    className={errors?.name ? "form-control is-invalid" : "form-control"} />
            </div>
            {isMonth &&
                <>
                    <div className="col-2">
                        <Field type="number" name={`${name}.days`} min="1" max="400"
                            className={(errors as FormikErrors<Month>).days ? "form-control is-invalid" : "form-control"} />
                    </div>
                    <div className="col-2">
                        <Field as="select" name={`${name}.season`} className="form-control">
                            <option value={Season.Winter}>{Season.Winter}</option>
                            <option value={Season.Spring}>{Season.Spring}</option>
                            <option value={Season.Summer}>{Season.Summer}</option>
                            <option value={Season.Fall}>{Season.Fall}</option>
                        </Field>
                    </div>
                </>
            }
            <div className="col-12">
                <p className="text-danger error-text">
                    <small><ErrorMessage name={`${name}.name`} /></small>
                </p>
                <p className="text-danger error-text">
                    <small><ErrorMessage name={`${name}.days`} /></small>
                </p>
            </div>
        </li>
    )
}