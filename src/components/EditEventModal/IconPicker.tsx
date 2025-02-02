import { ChangeEvent } from "react"
import { FieldHookConfig, useField } from "formik"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { EventIcon } from "../../shared/constants"

type EventIconKey = keyof typeof EventIcon
const iconKeys = Object.keys(EventIcon) as EventIconKey[]

type Props = {} & FieldHookConfig<typeof EventIcon>

export default function IconPicker({ ...props }: Props) {
    const [field, _, helper] = useField(props)

    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
        helper.setValue(EventIcon[event.target.value as EventIconKey])
        helper.setTouched(true)
    }

    return (
        <div className="mb-3">
            {iconKeys.map((iconKey, index) => (
                <div className="form-check form-check-inline me-3" key={index}>
                    <input
                        type="radio"
                        name="icon"
                        id={"eventIcon" + iconKey}
                        className="form-check-input"
                        value={iconKey}
                        checked={field.value.iconName === EventIcon[iconKey].iconName}
                        onChange={handleChange}
                    />
                    <label htmlFor={"eventIcon" + iconKey} className="form-check-label">
                        <FontAwesomeIcon icon={EventIcon[iconKey]} size="lg" />
                    </label>
                </div>
            ))}
        </div>
    )
}