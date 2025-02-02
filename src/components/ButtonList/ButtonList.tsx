import { Button } from 'react-bootstrap';
import type { DateTimeAmount } from '../../shared/types';
import { useDispatch, useSelector } from 'react-redux';
import { selectButtonList, addTimeToNow } from '../../redux';

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
                {button.label}
            </Button>
        ))}
    </div>
}