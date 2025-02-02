import { useRef, useState } from "react"
import { OverlayTrigger, Tooltip } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { compareChronologically, dateToString, timeToString } from "../../utilities"
import { DateFormat, TimeFormat, TrackerCalendar, TrackerEvent } from "../../shared/types"
import { faSquare } from "@fortawesome/free-solid-svg-icons"

type Props = {
  dayEvents: TrackerEvent[]
  calendar: TrackerCalendar
}

export default function DayEventIcon({ dayEvents, calendar }: Props) {
  const [show, setShow] = useState(false)
  const target = useRef(null)

  return (
    <>
      <OverlayTrigger placement="top" overlay={(
        <Tooltip>
          <b>
            {dateToString(dayEvents[0], calendar, calendar.useCalendar ? DateFormat.Day_Month : DateFormat.Day)}
          </b><br />
          {dayEvents.sort(compareChronologically).map(event => (
            <div key={event.id}>
              {timeToString(event, calendar, TimeFormat.Hour_Minutes)} - {event.label}
            </div>
          ))}
        </Tooltip>
      )}>
        <button ref={target} type="button" className="btn btn-link p-0" onClick={() => setShow(!show)}>
          <FontAwesomeIcon icon={(dayEvents.length === 1) ? dayEvents[0].icon : faSquare} />
        </button>
      </OverlayTrigger>
    </>
  )
}