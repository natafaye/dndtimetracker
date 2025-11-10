import { Button } from 'react-bootstrap';
import type { DateTimeAmount } from '../../shared/types';
import { useDispatch, useSelector } from 'react-redux';
import { selectButtonList, addTimeToNow } from '../../redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function ButtonList() {
    const buttonList = useSelector(selectButtonList)

    const dispatch = useDispatch()

    const addTime = (toAdd: DateTimeAmount) => {
        dispatch(addTimeToNow(toAdd))
    }

    return <div className="mt-3">
        {buttonList.map(button => (
            <Button key={button.id}
                variant="outline-secondary"
                size="sm"
                className="me-1 mb-1"
                onClick={() => addTime(button)}
            >
                <FontAwesomeIcon icon={faPlus} className="me-1"/>{button.label}
            </Button>
        ))}
    </div>
}