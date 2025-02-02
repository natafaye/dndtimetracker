import { useSelector } from 'react-redux';
import EventMarker from './EventMarker';
import HourMarker from './HourMarker';
import { selectCalendar, selectEventList, selectHoursInTimeTrack, selectNow } from '../../redux';
import { areWithinTime, compareChronologically } from '../../utilities';
import styles from "./TimeTrack.module.css"

export default function TimeTrack() {
    const now = useSelector(selectNow)
    const calendar = useSelector(selectCalendar)
    const eventList = useSelector(selectEventList)
    const hoursInTimeTrack = useSelector(selectHoursInTimeTrack)

    const timeToShow = {
        hours: Math.floor(hoursInTimeTrack / 2),
        minutes: (hoursInTimeTrack * 30) % 60
    }

    return (
        <div className={styles.timeEventsDisplay}>
            {[...Array(hoursInTimeTrack + 1)].map((_, index) => (
                <HourMarker
                    key={index}
                    hour={index}
                />
            ))}
            {eventList
                .toSorted(compareChronologically)
                .filter(event => areWithinTime(now, event, calendar.months, timeToShow))
                .map(event => (
                    <EventMarker
                        key={event.id}
                        event={event}
                    />
                ))}
            <div className={styles.timeCurrentMarker}></div>
        </div>
    );
}