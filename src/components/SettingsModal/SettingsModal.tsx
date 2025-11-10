import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, FormLabel, Modal } from 'react-bootstrap';
import { Formik, Form, Field, useFormikContext } from 'formik';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { selectCalendar, selectNow, selectSettings, updateSettings } from '../../redux';
import { DateFormat, TimeFormat, TrackerSettings } from '../../shared/types';
import { timeToString, dateToString, getSeasonIcon } from '../../utilities';
import { settingsValidationSchema } from './settingsValidationSchema';
import ErrorMsg from '../ErrorMsg';

type Props = {
    show: boolean
    toggle: () => void
}

export default function SettingsModal({ show, toggle }: Props) {
    const settings = useSelector(selectSettings)
    const now = useSelector(selectNow)
    const calendar = useSelector(selectCalendar)

    const dispatch = useDispatch()

    // If the dateFormat is set to None, then turn off showing the season icon too
    const formik = useFormikContext<TrackerSettings>()
    useEffect(() => {
        if(formik?.values.dateFormat === DateFormat.None)
            formik?.setFieldValue("showSeasonIcon", false)
    }, [formik, formik?.values.dateFormat, formik?.setFieldValue])

    const handleSubmit = async (values: TrackerSettings) => {
        dispatch(updateSettings(values))
        toggle()
    }

    return (
        <Modal show={show} onHide={toggle} size="lg" data-bs-theme="dark" className="text-white">
            <Modal.Header closeButton>Display Settings</Modal.Header>
            <Formik
                initialValues={{ ...settings }}
                validationSchema={settingsValidationSchema}
                onSubmit={handleSubmit}>
                {(formik) => (
                    <Form>
                        <Modal.Body className="p-4">
                            <div className="row">
                                <div className="col-5">
                                    <FormLabel htmlFor="timeFormat">Time Format</FormLabel>
                                    <Field as="select" name="timeFormat" id="timeFormat" className="form-select">
                                        <option value={TimeFormat.Hour}>Only show the hour</option>
                                        <option value={TimeFormat.Hour_Minutes}>Show hour and minutes</option>
                                        <option value={TimeFormat.Hour_Period}>Show hour and period</option>
                                        <option value={TimeFormat.Hour_Minutes_Period}>Show hour, minutes, and period</option>
                                    </Field>
                                </div>
                                <div className="col">
                                    <p className="form-text-without-label text-sans-serif">
                                        {timeToString(now, calendar, formik.values.timeFormat)}
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-5">
                                    <FormLabel htmlFor="dateFormat">Date Format</FormLabel>
                                    <Field
                                        as="select"
                                        name="dateFormat"
                                        id="dateFormat"
                                        className="form-select"
                                    >
                                        <option value={DateFormat.None}>Don't show date</option>
                                        <option value={DateFormat.Day}>Show day</option>
                                        {calendar.useCalendar &&
                                            <>
                                                <option value={DateFormat.Day_DayOfWeek}>Show day and day of week</option>
                                                <option value={DateFormat.Day_Month}>Show day and month</option>
                                                <option value={DateFormat.DayOfWeek_Day_Month}>Show day of week, day, and month</option>
                                                <option value={DateFormat.Day_Month_Year}>Show day, month, and year</option>
                                                <option value={DateFormat.DayOfWeek_Day_Month_Year}>Show day of week, day, month, year</option>
                                            </>
                                        }
                                    </Field>
                                </div>
                                <div className="col">
                                    <p className="form-text-without-label text-sans-serif">
                                        {dateToString(now, calendar, formik.values.dateFormat)} &nbsp;
                                        {(formik.values.showSeasonIcon) ?
                                            <FontAwesomeIcon icon={getSeasonIcon(calendar.months[now.month].season)} /> :
                                            <span />
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <div className="form-check">
                                        <Field type="checkbox" name="showSeasonIcon" id="showSeasonIcon" className="form-check-input"
                                            disabled={!calendar.useCalendar || formik.values.dateFormat === DateFormat.None} />
                                        <FormLabel htmlFor="showSeasonIcon" className="form-check-label">Show Season Icon</FormLabel>
                                    </div>
                                </div>
                            </div>
                            <hr className="modal-hr" />
                            <div className="row">
                                <div className="col-6">
                                    <div className="form-check">
                                        <Field type="checkbox" name="showTimeTrack" id="showTimeTrack" className="form-check-input" />
                                        <FormLabel htmlFor="showTimeTrack" className="form-check-label">Show Time Track</FormLabel>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-check">
                                        <Field type="checkbox" name="showDaysTrack" id="showDaysTrack" className="form-check-input" />
                                        <FormLabel htmlFor="showDaysTrack" className="form-check-label">Show Date Track</FormLabel>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <FormLabel htmlFor="hoursInTimeTrack">Hours Shown In Time Track</FormLabel>
                                    <Field type="number" name="hoursInTimeTrack" id="hoursInTimeTrack" min="1" max="6"
                                        className={(formik.errors.hoursInTimeTrack) ? "form-control is-invalid" : "form-control"} />
                                </div>
                                <div className="col-6">
                                    <FormLabel htmlFor="hoursInTimeTrack">Days Shown In Day Track</FormLabel>
                                    <Field type="number" name="daysInDaysTrack" id="daysInDaysTrack" min="5" max="11"
                                        className={(formik.errors.daysInDaysTrack) ? "form-control is-invalid" : "form-control"} />
                                </div>
                                <div className="col-12">
                                    <ErrorMsg name="hoursInTimeTrack"/>
                                    <ErrorMsg name="daysInDaysTrack"/>
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button type="submit" variant="primary">Save</Button>
                        </Modal.Footer>
                    </Form>
                )}
            </Formik>
        </Modal>
    )
}