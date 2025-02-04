import { useSelector } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { selectCalendar, selectHoursInTimeTrack, selectNow } from "../../redux";
import { getTimeBetween, timeToString } from "../../utilities";
import { TimeFormat, type TrackerEvent } from "../../shared/types";
import styles from "./TimeTrack.module.css"
import classNames from "classnames";

type Props = {
    event: TrackerEvent
}

export default function EventMarker({ event }: Props) {
    const now = useSelector(selectNow)
    const calendar = useSelector(selectCalendar)
    const hoursInTimeTrack = useSelector(selectHoursInTimeTrack)

    const timeBetween = getTimeBetween(now, event, calendar.months);
    const minutesBetween = timeBetween.minutes + (timeBetween.hours * 60);
    const minuteMarkFromLeft = minutesBetween + (hoursInTimeTrack * 30);
    const minutePercentageFromLeft = (minuteMarkFromLeft / (hoursInTimeTrack * 60)) * 100;

    return (
        <div
            key={event.id}
            className={classNames(
                styles.eventMarker,
                minutesBetween <= 0 && styles.pastTimeEvent,
                "position-absolute mt-1"
            )}
            style={{ left: minutePercentageFromLeft + "%" }}
        >
            <OverlayTrigger
                overlay={
                    <Tooltip>
                        {timeToString(event, calendar, TimeFormat.Hour_Minutes)} - {event.label}
                    </Tooltip>
                }
            >
                <FontAwesomeIcon icon={event.icon} size="xl" />
            </OverlayTrigger>
        </div>
    );
}