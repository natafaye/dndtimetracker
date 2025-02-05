import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, FormikErrors } from "formik";
import { TrackerButton } from "../../shared/types";
import ErrorMsg from "../ErrorMsg";

type Props = {
    index: number
    remove: (index: number) => void
    errors?: FormikErrors<TrackerButton>
}

export default function ButtonEditor({ index, remove, errors }: Props) {
    return (
        <div className="row">
            <div className="col-5">
                <Field type="text" name={`buttonList.${index}.label`} id="label" minLength="2" maxLength="20"
                    className={(errors && errors.label) ? "form-control is-invalid" : "form-control"} />
            </div>
            <div className="col-2">
                <Field type="number" name={`buttonList.${index}.minutes`} id="minutes" min="0" max="100"
                    className={(errors && errors.minutes) ? "form-control is-invalid" : "form-control"} />
            </div>
            <div className="col-2">
                <Field type="number" name={`buttonList.${index}.hours`} id="hours" min="0" max="100"
                    className={(errors && errors.hours) ? "form-control is-invalid" : "form-control"} />
            </div>
            <div className="col-2">
                <Field type="number" name={`buttonList.${index}.days`} id="days" min="0" max="400"
                    className={(errors && errors.days) ? "form-control is-invalid" : "form-control"} />
            </div>
            <div className="col-1">
                <button type="button" className="btn btn-danger" onClick={() => remove(index)}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                </button>
            </div>
            <div className="col-12">
                <ErrorMsg name={`buttonList.${index}.label`}/>
                <ErrorMsg name={`buttonList.${index}.minutes`}/>
                <ErrorMsg name={`buttonList.${index}.hours`}/>
                <ErrorMsg name={`buttonList.${index}.days`}/>
            </div>
        </div>
    );
}