import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { Button, FormLabel, Modal } from 'react-bootstrap';
import { addEvent, selectCalendar, selectEventList, selectNow, updateEvent } from '../../redux';
import { EventIcon } from '../../shared/constants';
import type { TrackerEvent } from '../../shared/types';
import IconPicker from './IconPicker';
import DateTimeInput from '../DateTimeInput';
import ErrorMsg from '../ErrorMsg';
import { getEventValidationSchema } from './getEventValidationSchema';

type Props = {
    show: boolean
    toggle: () => void
    eventId?: number
}

export default function EditEventModal({ show, toggle, eventId }: Props) {
    const eventList = useSelector(selectEventList)
    const calendar = useSelector(selectCalendar)
    const now = useSelector(selectNow)

    const dispatch = useDispatch()

    let event = eventList.find(e => e.id === eventId);
    if (!event) {
        event = {
            id: eventList.slice(-1)[0].id + 1,
            label: "New Event",
            icon: EventIcon.square,
            ...now
        }
    }

    const handleSubmit = (values: TrackerEvent) => {
        if (eventId !== undefined)
            dispatch(updateEvent(values))
        else
            dispatch(addEvent(values))

        toggle()
    }

    return (
        <Modal show={show} onHide={toggle}>
            <Modal.Header closeButton>Edit Event</Modal.Header>
            <Formik
                initialValues={event}
                onSubmit={handleSubmit}
                validationSchema={getEventValidationSchema(calendar)}
            >
                {(formik) => (
                    <Form>
                        <Modal.Body className="p-4">
                            <div className="row gy-2">
                                <div className="col-12">
                                    <FormLabel htmlFor="label">Name</FormLabel>
                                    <Field
                                        type="text"
                                        id="label"
                                        name="label"
                                        className="form-control"
                                        minLength="2"
                                        maxLength="20"
                                    />
                                </div>
                                <div className="col-12">
                                    <ErrorMsg name="label" />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <FormLabel htmlFor="icon">Icon</FormLabel>
                                    <IconPicker id="icon" name="icon" />
                                </div>
                            </div>
                            <DateTimeInput date={formik.values} calendar={calendar} />
                        </Modal.Body>
                        <Modal.Footer>
                            <Button type="submit" variant="primary">Save</Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Formik>
        </Modal>
    );
}