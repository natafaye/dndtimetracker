import { useSelector } from 'react-redux';
import { DateFormat } from '../../shared/types';
import { selectSettings } from '../../redux';
import DayCell from './DayCell';
import styles from "./DaysTrack.module.css"

export default function DaysTrack() {
    const { dateFormat, daysInDaysTrack } = useSelector(selectSettings)

    if (dateFormat === DateFormat.None)
        return <div />;

    return (
        <div className={styles.daysDisplay}>
            <table className="table table-borderless">
                <tbody>
                    <tr>
                        {[...Array(daysInDaysTrack)].map((_, index) => (
                            <DayCell key={index} index={index} />
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}