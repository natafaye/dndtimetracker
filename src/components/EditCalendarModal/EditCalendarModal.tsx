import { Formik, Form, Field } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import { hourToString } from '../../utilities';
import ListEditor from './ListEditor';
import { selectCalendar, setCalendar } from '../../redux';
import { ConfirmModal, useConfirm } from '../ConfirmModal';
import { TrackerCalendar } from '../../shared/types';
import { FormLabel, Modal } from 'react-bootstrap';
import StartDayOfWeekInput from './StartDayOfWeekInput';
import { calendarValidationSchema } from './calendarValidationSchema';
import ErrorMsg from '../ErrorMsg';

type Props = {
  show: boolean
  toggle: () => void
}

export default function EditCalendarModal({ show, toggle }: Props) {
  const calendar = useSelector(selectCalendar)

  const [confirm, confirmProps] = useConfirm()

  const dispatch = useDispatch()

  // Confirm that they want to submit if they're turning the calendar on or off
  const startSubmit = (values: TrackerCalendar) => {
    if (calendar.useCalendar !== values.useCalendar) {
      const message = "Are you sure you want to turn " +
        (values.useCalendar ? "on" : "off") +
        " the calendar? This will change the current date and"
      " the dates of your events. It cannot be undone."
      confirm({ message, buttonLabel: "OK", callback: () => finishSubmit(values) })
    }
    else {
      finishSubmit(values)
    }
  }

  const finishSubmit = async (values: TrackerCalendar) => {
    dispatch(setCalendar(values))
    toggle()
  }

  // Can only be numbers that divide 24, or there would be issues
  const periodsInADayOptions = [2, 3, 4, 6, 8, 12]

  return (
    <>
      <ConfirmModal {...confirmProps} />
      <Modal isOpen={show} onHide={toggle} size="lg">
        <Modal.Header closeButton>Calendar</Modal.Header>
        <Formik
          initialValues={{ ...calendar }}
          onSubmit={startSubmit}
          validationSchema={calendarValidationSchema}>
          {({ isSubmitting, values, errors }) => (
            <Form>
              <Modal.Body className="pt-4 pl-4 pr-4 pb-0">
                <div className="row">
                  <div className="col-4">
                    <FormLabel htmlFor="periodsInADay">Periods In A Day</FormLabel>
                    <Field
                      as="select"
                      name="periodsInADay"
                      id="periodsInADay"
                      className="form-control"
                    >
                      {periodsInADayOptions.map((num) => (
                        <option value={num} key={num}>{num}</option>
                      ))}
                    </Field>
                    <ErrorMsg name="periodsInADay"/>
                  </div>
                </div>
                <ListEditor
                  title="Periods"
                  name="periods"
                  length={values.periodsInADay}
                  list={values.periods}
                  defaultName="Period"
                  renderLabel={(_, index, periods) => (
                    hourToString(index * (24 / periods.length), true) +
                    "-" +
                    hourToString(((index + 1) * (24 / periods.length)) % 24, true)
                  )}
                />
                <hr className="modal-hr" />
                <div className="row">
                  <div className="col-4">
                    <div className="form-check mt-2 mb-2">
                      <Field
                        type="checkbox"
                        name="useCalendar"
                        id="useCalendar"
                        className="form-check-input"
                      />
                      <FormLabel htmlFor="useCalendar" className="form-check-label">
                        Use Calendar
                      </FormLabel>
                    </div>
                  </div>
                </div>
                {(!values.useCalendar) ? <div /> :
                  <div>
                    <div className="row">
                      <div className="col-4">
                        <FormLabel htmlFor="monthsInAYear">Months In A Year</FormLabel>
                        <div className="form-inline">
                          <Field
                            type="number"
                            name="monthsInAYear"
                            id="monthsInAYear"
                            min="1" max="50"
                            className={(errors.monthsInAYear) ? "form-control is-invalid" : "form-control"}
                          />
                          <ErrorMsg name="monthsInAYear"/>
                        </div>
                      </div>
                    </div>
                    <ListEditor
                      title="Months"
                      name="months"
                      length={values.monthsInAYear}
                      list={values.months}
                      defaultName="Month"
                      isMonths
                    />
                    <div className="row">
                      <div className="col-4">
                        <FormLabel htmlFor="daysInAWeek">Days In A Week</FormLabel>
                        <Field
                          type="number"
                          name="daysInAWeek"
                          id="daysInAWeek"
                          min="2" max="30"
                          className={(errors.daysInAWeek) ? "form-control is-invalid" : "form-control"}
                        />
                        <ErrorMsg name="daysInAWeek"/>
                      </div>
                    </div>
                    <ListEditor
                      title="Days of the Week"
                      name="daysOfTheWeek"
                      length={values.daysInAWeek}
                      list={values.daysOfTheWeek}
                      defaultName="Day of the Week"
                    />
                    <div className="row">
                      <StartDayOfWeekInput
                        daysOfTheWeek={values.daysOfTheWeek}
                        errors={errors.startDayOfWeekOfYear}
                      />
                    </div>
                  </div>
                }
              </Modal.Body>
              <Modal.Footer>
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Save</button>
              </Modal.Footer>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}