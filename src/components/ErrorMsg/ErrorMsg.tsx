import classNames from "classnames"
import { ErrorMessage } from "formik"

type Props = {
    name: string
    className?: string
}

export default function ErrorMsg({ name, className }: Props) {
    return (
        <p className={classNames("text-danger mt-2 mb-0", className)}>
            <small><ErrorMessage name={name} /></small>
        </p>
    )
}