import { Dropdown } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { selectCalendar, selectNow } from '../../redux';
import { getTimeBetween, timeAmountToString, compareChronologically } from '../../utilities';
import { TrackerEvent } from '../../shared/types';
import { faEdit, faEllipsisH, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';

type Props = {
    event: TrackerEvent
    onDelete: (event: TrackerEvent) => void
    onEdit: (id: TrackerEvent['id']) => void
}

export default function EventRow({ event, onDelete, onEdit }: Props) {
    const now = useSelector(selectNow)
    const calendar = useSelector(selectCalendar)

    const inPast = compareChronologically(event, now) < 0;
    const timeBetween = getTimeBetween(now, event, calendar.months);

    return (
        <tr className={"align-middle"}>
            <td>
                <span className={classNames("d-flex align-items-center gap-2", inPast && "text-white-50")}>
                    <FontAwesomeIcon icon={event.icon} fixedWidth />{event.label}
                </span>
            </td>
            <td className={classNames("text-end", inPast && "text-white-50")}>
                {timeAmountToString(timeBetween, true)}
            </td>
            <td className="text-end" style={{ width: "2rem" }}>
                <Dropdown>
                    <Dropdown.Toggle variant="link" size="sm" className={(inPast ? "text-white-50" : "text-white")}>
                        <FontAwesomeIcon icon={faEllipsisH} size="lg" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end" variant="dark">
                        <Dropdown.Item onClick={() => onEdit(event.id)}>
                            <FontAwesomeIcon icon={faEdit} fixedWidth />&nbsp;&nbsp;Edit
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => onDelete(event)}>
                            <FontAwesomeIcon icon={faTrashAlt} fixedWidth />&nbsp;&nbsp;Delete
                        </Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </td>
        </tr>
    );
}