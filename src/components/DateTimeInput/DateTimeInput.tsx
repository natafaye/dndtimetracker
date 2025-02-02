import { Field } from "formik"
import ErrorMsg from "../ErrorMsg"
import type { TrackerCalendar, TrackerDate } from "../../shared/types"
import { FormLabel } from "react-bootstrap"
import { getDayOfWeekIndex } from "../../utilities"

const hoursList = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]

type Props = {
    date: TrackerDate
    calendar: TrackerCalendar
}

export default function DateTimeInput({ date, calendar }: Props) {
    return (
        <>
            <div className="row gy-2">
                <div className="col-4">
                    <FormLabel htmlFor="hour">Hour</FormLabel>
                    <Field as="select" id="hour" name="hour" className="form-control">
                        {hoursList.map((hour, index) => (
                            <option value={index} key={index}>{hour}</option>
                        ))}
                    </Field>
                </div>
                <div className="col-4">
                    <FormLabel htmlFor="minutes" className="form-label">Minutes</FormLabel>
                    <Field type="number" id="minutes" name="minutes" className="form-control" min="0" max="59" />
                </div>
                <div className="col-4">
                    <FormLabel htmlFor="day" className="form-label">Day</FormLabel>
                    <Field type="number" id="day" name="day" className="form-control" min="1" />
                </div>
                <div className="col-12">
                    <ErrorMsg name="hour" />
                    <ErrorMsg name="minutes" />
                    <ErrorMsg name="day" />
                </div>
            </div>
            {calendar.useCalendar &&
                <div className="row">
                    <div className="col-4">
                        <FormLabel>Day of Week</FormLabel>
                        <p className="form-text-with-label text-secondary">
                            {calendar.daysOfTheWeek[getDayOfWeekIndex(date, calendar)].name}
                        </p>
                    </div>
                    <div className="col-5">
                        <FormLabel htmlFor="month">Month</FormLabel>
                        <Field as="select" name="month" id="month" className="form-select">
                            {calendar.months.map((month) => (
                                <option key={month.id} value={month.id}>{month.name}</option>
                            ))}
                        </Field>
                    </div>
                    <div className="col-3">
                        <FormLabel htmlFor="year">Year</FormLabel>
                        <Field type="number" name="year" id="year" className="form-control" min="1" max="10000" />
                    </div>
                    <div className="col-12">
                        <ErrorMsg name="month" />
                        <ErrorMsg name="year" />
                    </div>
                </div>
            }
        </>
    )
}