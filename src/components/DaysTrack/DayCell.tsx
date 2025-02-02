import { useSelector } from 'react-redux';
import { selectCalendar, selectEventList, selectNow, selectSettings } from '../../redux';
import { SKY_COLORS } from '../../shared/constants';
import DayEventIcon from './DayEventIcon';

type Props = {
    index: number
}

export default function DayCell({ index }: Props) {
    const calendar = useSelector(selectCalendar)
    const now = useSelector(selectNow)
    const eventList = useSelector(selectEventList)
    const { daysInDaysTrack } = useSelector(selectSettings)

    let currentDayIndex = Math.floor(daysInDaysTrack / 2);
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

    const currentDayStyle = {
        color: (now.minutes <= 30) ? SKY_COLORS[now.hour] : SKY_COLORS[now.hour + 1]
    }

    return (
        <td
            className={dayNumber < now.day ? "past-day" : dayNumber === now.day ? "current-day" : ""}
            style={dayNumber === now.day ? currentDayStyle : undefined}
        >
            {dayEvents.length > 0 ? <DayEventIcon dayEvents={dayEvents} calendar={calendar}/> : dayDisplay}
        </td>
    )
}