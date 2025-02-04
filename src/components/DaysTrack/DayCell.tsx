import { useSelector } from 'react-redux';
import { selectCalendar, selectEventList, selectNow, selectSettings } from '../../redux';
import { SKY_COLORS } from '../../shared/constants';
import DayEventIcon from './DayEventIcon';
import classNames from 'classnames';

type Props = {
    index: number
}

export default function DayCell({ index }: Props) {
    const calendar = useSelector(selectCalendar)
    const now = useSelector(selectNow)
    const eventList = useSelector(selectEventList)
    const { daysInDaysTrack } = useSelector(selectSettings)

    const currentDayIndex = Math.floor(daysInDaysTrack / 2);
    const dayNumber = now.day + index - currentDayIndex

    let dayDisplay: number | string = dayNumber
    let dayEvents = [];
    if (calendar.useCalendar) {
        let monthNum = now.month;
        let month = now.month;
        let year = now.year;

        // Handle days from later months
        while (dayDisplay > calendar.months[monthNum].days) {
            dayDisplay -= calendar.months[monthNum].days;
            monthNum++;
            if (monthNum > calendar.months.length - 1) {
                monthNum = 0;
                year++;
            }
            month = monthNum;
        }
        // Handle days from previous months
        monthNum = (now.month > 0) ? now.month - 1 : calendar.months.length - 1;
        while (dayDisplay < 1) {
            dayDisplay += calendar.months[monthNum].days;
            monthNum--;
            if (monthNum < 0) {
                monthNum = calendar.months.length - 1;
                year++;
            }
            month = monthNum;
        }

        dayEvents = eventList.filter(event => event.day === dayNumber && event.month === month && event.year === year);
    }
    else {
        if (dayDisplay < 1)
            dayDisplay = "";

        dayEvents = eventList.filter(event => event.day === dayNumber);
    }

    return (
        <div
            className={classNames(
                "rounded py-1 px-2 flex-grow-1",
                dayNumber < now.day && "text-white-50",
                dayNumber === now.day && "border border-white",
            )}
            style={{ flexBasis: 0 }}
        >
            {dayEvents.length > 0 ?
                <DayEventIcon dayEvents={dayEvents} calendar={calendar} /> :
                dayDisplay
            }
        </div>
    )
}