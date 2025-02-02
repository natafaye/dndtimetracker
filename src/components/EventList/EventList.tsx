import { useDispatch, useSelector } from 'react-redux';
import { deleteEvent, selectEventList } from '../../redux';
import EventRow from './EventRow';
import { TrackerEvent } from '../../shared/types';
import { ConfirmModal, useConfirm } from '../ConfirmModal';

type Props = {
    onEdit: (id: TrackerEvent['id']) => void
}

export default function EventList({ onEdit }: Props) {
    const eventList = useSelector(selectEventList)

    const [confirm, confirmProps] = useConfirm()

    const dispatch = useDispatch()

    const handleDelete = (event: TrackerEvent) => {
        confirm({
            message: <span>Are you sure you want to delete <b>{event.label}</b>? This cannot be undone.</span>,
            buttonLabel: "Delete",
            callback: () => dispatch(deleteEvent(event.id))
        })
    }

    return (
        <div className="mt-2 striped">
            {eventList.map(event => (
                <EventRow
                    key={event.id}
                    event={event}
                    onDelete={handleDelete}
                    onEdit={onEdit}
                />)
            )}
            <ConfirmModal {...confirmProps} />
        </div>
    );
}