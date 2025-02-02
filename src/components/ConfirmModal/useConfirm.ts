import { ReactNode, useState } from "react"
import { ConfirmModalProps } from "./ConfirmModal"

type ConfirmProps = {
    /** The function to call if confirmed */
    callback: () => void
    /** The message to show in the modal, default: "Are you sure?" */
    message?: ReactNode
    /** The label for the confirm button, default: "Confirm" */
    buttonLabel?: ReactNode
}

/**
 * Handles the props and opening of the ConfirmModal
 * 
 * @example
 * const [confirm, props] = useConfirm()
 * 
 * const handleClick = () => {
 *   confirm({
 *     message: "Are you sure?", 
 *     buttonLabel: "Confirm",
 *     callback: () => alert("Confirmed!")
 *   })
 * }
 * 
 * return (
 *   <button onClick={handleClick}>Click Me</button>
 *   <ConfirmModal {...props}/>
 * )
 */
export function useConfirm(): [({ callback, message, buttonLabel }: ConfirmProps) => void, ConfirmModalProps] {
    const [show, setShow] = useState(false)
    const [message, setMessage] = useState<ReactNode>("Are you sure?")
    const [buttonLabel, setButtonLabel] = useState<ReactNode>("Confirm")
    const [callback, setCallback] = useState<() => void>(() => () => console.log("No callback given"))

    const confirm = ({ 
        callback,
        message, 
        buttonLabel
    }: ConfirmProps) => {
        setShow(true)
        setCallback(() => callback)
        message && setMessage(message)
        buttonLabel && setButtonLabel(buttonLabel)
    }

    const props: ConfirmModalProps = {
        show,
        toggle: () => setShow(!show),
        message,
        buttonLabel,
        callback
    }

    return [confirm, props]
}