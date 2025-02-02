import { ReactNode } from "react"
import { Button, Modal } from "react-bootstrap"

export type ConfirmModalProps = {
    show: boolean
    toggle: () => void
    message: ReactNode
    buttonLabel: ReactNode
    callback: () => void
}

export function ConfirmModal({ show, toggle, message, buttonLabel, callback }: ConfirmModalProps) {
    const handleConfirm = () => {
        toggle()
        callback()
    }

    return (
        <Modal show={show} onHide={toggle} size="sm">
            <Modal.Body>
                <p>{message}</p>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={toggle}>Cancel</Button>
                <Button variant="danger" onClick={handleConfirm}>{buttonLabel}</Button>
            </Modal.Footer>
        </Modal>
    );
}

