import { useSelector } from 'react-redux';
import { DateFormat } from '../../shared/types';
import { selectSettings } from '../../redux';
import DayCell from './DayCell';

export default function DaysTrack() {
    const { dateFormat, daysInDaysTrack } = useSelector(selectSettings)

    if (dateFormat === DateFormat.None)
        return <div />;

    return (
        <div className="d-flex mt-4 mb-2 justify-content-around gap-3">
            {[...Array(daysInDaysTrack)].map((_, index) => (
                <DayCell key={index} index={index} />
            ))}
        </div>
    );
}