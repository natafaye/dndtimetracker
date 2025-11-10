import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal } from 'react-bootstrap'
import { Formik, Form } from 'formik'
import { selectCalendar, selectNow, setNow } from '../../redux'
import { TrackerDateTime } from '../../shared/types'
import { getNowValidationSchema } from './getNowValidationSchema'
import DateTimeInput from '../DateTimeInput'

type Props = {
    show: boolean
    toggle: () => void
}

export default function SetNowModal({ show, toggle }: Props) {
    const calendar = useSelector(selectCalendar)
    const now = useSelector(selectNow)

    const dispatch = useDispatch()

    const validationSchema = getNowValidationSchema(calendar)

    const handleSubmit = async (values: TrackerDateTime) => {
        dispatch(setNow(values))
        toggle()
    }

    return (
        <Modal show={show} onHide={toggle} data-bs-theme="dark" className="text-white">
            <Modal.Header closeButton>Set Time & Date</Modal.Header>
            <Formik
                initialValues={{ ...now }}
                onSubmit={handleSubmit}
                validationSchema={validationSchema}
            >
                {(formik) => (
                    <Form>
                        <Modal.Body className="p-4 pb-3">
                            <DateTimeInput date={formik.values} calendar={calendar}/>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="primary" type="submit">Save</Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}