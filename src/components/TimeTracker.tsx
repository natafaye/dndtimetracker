import { useState } from 'react';
import TrackerMenu from './TrackerMenu';
import TimeDisplay from './TimeDisplay';
import ButtonList from './ButtonList';
import EventList from './EventList'
import EditEventModal from './EditEventModal';
import { Card } from 'react-bootstrap';

export default function TimeTracker() {
    const [showEditEventModal, setShowEditEventModal] = useState(false)
    const [editEventId, setEditEventId] = useState<number | undefined>()
    const toggleEditEventModal = () => setShowEditEventModal(!showEditEventModal)

    const startEditEvent = (id?: number) => {
        setEditEventId(id)
        setShowEditEventModal(true)
    }

    return (
        <Card>
            <Card.Header>
                <span>Time Tracker</span>
                <TrackerMenu onCreateEvent={startEditEvent} />
            </Card.Header>
            <Card.Body>
                <TimeDisplay />
                <ButtonList />
                <EventList onEdit={startEditEvent} />
            </Card.Body>
            <EditEventModal
                show={showEditEventModal}
                toggle={toggleEditEventModal}
                eventId={editEventId}
            />
        </Card>
    );
}