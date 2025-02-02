import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Overlay, Tooltip } from "react-bootstrap";
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

    
    const [show, setShow] = useState(false)
    const target = useRef(null)

    return (
        <div key={event.id} className={classNames(minutesBetween <= 0 && "text-secondary" + styles.pastTimeEvent)}
            style={{ left: minutePercentageFromLeft + "%" }}>
            <button onClick={() => setShow(!show)} ref={target} type="button" className="btn btn-link p-0">
                <FontAwesomeIcon icon={event.icon} size="lg" />
            </button>
            <Overlay show={show} placement="top" target={target.current}>
                <Tooltip>
                    {timeToString(event, calendar, TimeFormat.Hour_Minutes)} - {event.label}
                </Tooltip>
            </Overlay>
        </div>
    );
}