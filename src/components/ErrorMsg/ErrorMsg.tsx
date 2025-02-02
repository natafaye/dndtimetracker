import { ErrorMessage } from "formik"

type Props = {
    name: string
}

export default function ErrorMsg({ name }: Props) {
    return (
        <p className="text-danger error-text">
            <small><ErrorMessage name={name} /></small>
        </p>
    )
}