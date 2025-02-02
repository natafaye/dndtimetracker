import { useSelector } from "react-redux"
import { selectCalendar, selectHoursInTimeTrack, selectNow } from "../../redux"
import { getTimeBetween, hourToString } from "../../utilities"
import styles from "./TimeTrack.module.css"
import classNames from "classnames"

type Props = {
    hour: number
}

export default function HourMarker({ hour }: Props) {
    const now = useSelector(selectNow)
    const calendar = useSelector(selectCalendar)
    const hoursInTimeTrack = useSelector(selectHoursInTimeTrack)

    const hourDate = { ...now, minutes: 0, hour: now.hour - Math.floor(hoursInTimeTrack / 2) + hour }
    if (hourDate.hour > 23) {
        hourDate.hour = hourDate.hour % 24;
        hourDate.day++;
    }
    else if (hourDate.hour < 0) {
        hourDate.hour = (hourDate.hour + 24) % 24;
        hourDate.day--;
    }
    const timeBetween = getTimeBetween(now, hourDate, calendar.months);
    const minutesBetween = timeBetween.minutes + (timeBetween.hours * 60);
    const minuteMarkFromLeft = minutesBetween + (hoursInTimeTrack * 30);
    const minutePercentageFromLeft = (minuteMarkFromLeft / (hoursInTimeTrack * 60)) * 100;

    return (
        <div
            className={classNames(
                styles.hourMarker,
                minutesBetween <= 0 && styles.pastTimeEvent)
            }
            style={{ left: minutePercentageFromLeft + "%" }}>
            {hourToString(hourDate.hour, true)}
        </div>
    );
}