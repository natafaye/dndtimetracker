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
        <div key={event.id} className={classNames(inPast && "text-muted", "p-2 pe-0")}>
            <span className="d-inline-block"><FontAwesomeIcon icon={event.icon} fixedWidth />&nbsp;&nbsp;{event.label}</span>
            <Dropdown className="float-end p-0">
                <Dropdown.Toggle variant="link" size="sm">
                    <FontAwesomeIcon icon={faEllipsisH} size="lg" />
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                    <Dropdown.Item onClick={() => onEdit(event.id)}>
                        <FontAwesomeIcon icon={faEdit} fixedWidth />&nbsp;&nbsp;Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => onDelete(event)}>
                        <FontAwesomeIcon icon={faTrashAlt} fixedWidth />&nbsp;&nbsp;Delete
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <span className="d-inline-block float-end">{timeAmountToString(timeBetween, true)}</span>
        </div>
    );
}