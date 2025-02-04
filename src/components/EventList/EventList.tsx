import { useDispatch, useSelector } from 'react-redux';
import { deleteEvent, selectEventList, selectNow } from '../../redux';
import EventRow from './EventRow';
import { TrackerEvent } from '../../shared/types';
import { ConfirmModal, useConfirm } from '../ConfirmModal';
import { compareChronologically } from '../../utilities';

type Props = {
    onEdit: (id: TrackerEvent['id']) => void
}

export default function EventList({ onEdit }: Props) {
    const eventList = useSelector(selectEventList)
    const now = useSelector(selectNow)

    const dispatch = useDispatch()

    const [confirm, confirmProps] = useConfirm()

    if(eventList.length === 0) {
        return <p className="my-2 text-white-50">There are no events yet.<br/>Use the top-right menu to add an event.</p>
    }

    const pastEvents = eventList.filter(event => compareChronologically(event, now) < 0)
    const futureEvents = eventList.filter(event => compareChronologically(event, now) >= 0)
    const sortedEventList = futureEvents.toSorted(compareChronologically)
        .concat(pastEvents.toSorted((a, b) => -1 * compareChronologically(a, b)))

    const handleDelete = (event: TrackerEvent) => {
        confirm({
            message: <span>Are you sure you want to delete <b>{event.label}</b>? This cannot be undone.</span>,
            buttonLabel: "Delete",
            callback: () => dispatch(deleteEvent(event.id))
        })
    }

    return (
        <>
            <table className="table table-dark table-striped mt-2">
                <tbody>
                    {sortedEventList.map(event => (
                        <EventRow
                            key={event.id}
                            event={event}
                            onDelete={handleDelete}
                            onEdit={onEdit}
                        />)
                    )}
                </tbody>
            </table>
            <ConfirmModal {...confirmProps} />
        </>
    );
}