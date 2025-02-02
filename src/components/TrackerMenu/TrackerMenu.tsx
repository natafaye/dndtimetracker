import { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock, faCog, faEllipsisH, faGripHorizontal, faPlus } from "@fortawesome/free-solid-svg-icons";
import EditButtonListModal from "../EditButtonsModal";
import SetNowModal from "../SetNowModal";
import SettingsModal from "../SettingsModal";
import EditCalendarModal from "../EditCalendarModal";

type Props = {
    onCreateEvent: () => void
}

export default function TrackerMenu({ onCreateEvent }: Props) {
    const [showEditButtons, setShowEditButtons] = useState(false)
    const [showSetTime, setShowSetTime] = useState(false)
    const [showSettings, setShowSettings] = useState(false)
    const [showCalendar, setShowCalendar] = useState(false)

    const toggleEditButtons = () => setShowEditButtons(!showEditButtons)
    const toggleSetTime = () => setShowSetTime(!showSetTime)
    const toggleSettings = () => setShowSettings(!showSettings)
    const toggleCalendar = () => setShowCalendar(!showCalendar)

    return (
        <>
            <Dropdown className="float-end">
                <Dropdown.Toggle variant="link-secondary" size="sm">
                    <FontAwesomeIcon icon={faEllipsisH} size="lg" />
                </Dropdown.Toggle>
                <Dropdown.Menu align="end">
                    <Dropdown.Item onClick={onCreateEvent}>
                        <FontAwesomeIcon icon={faPlus} />&nbsp;&nbsp;Add Event
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={toggleEditButtons}>
                        <FontAwesomeIcon icon={faGripHorizontal} />&nbsp;&nbsp;Edit Buttons
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={toggleSetTime}>
                        <FontAwesomeIcon icon={faClock} />&nbsp;&nbsp;Set Time & Date
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={toggleSettings}>
                        <FontAwesomeIcon icon={faCog} />&nbsp;&nbsp;Display Settings
                    </Dropdown.Item>
                    <Dropdown.Item onClick={toggleCalendar}>
                        <FontAwesomeIcon icon={faCalendar} />&nbsp;&nbsp;Calendar Settings
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            <EditButtonListModal show={showEditButtons} toggle={toggleEditButtons}/>
            <SetNowModal show={showSetTime} toggle={toggleSetTime} />
            <SettingsModal show={showSettings} toggle={toggleSettings} />
            <EditCalendarModal show={showCalendar} toggle={toggleCalendar}/>
        </>
    )
}