import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import TimeTrack from '../TimeTrack';
import DaysTrack from '../DaysTrack/DaysTrack';
import { timeToString, dateToString, getTimeBetween, getSeasonIcon, getColorForTime } from '../../utilities';
import { useSelector } from 'react-redux';
import { selectCalendar, selectNow, selectSettings } from '../../redux';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import styles from "./TimeDisplay.module.css"

export default function TimeDisplay() {
    const now = useSelector(selectNow)
    const calendar = useSelector(selectCalendar)
    const { 
        hoursInTimeTrack, 
        showSeasonIcon, 
        showTimeTrack, 
        showDaysTrack, 
        timeFormat, 
        dateFormat 
    } = useSelector(selectSettings)
    
    let seasonIcon = getSeasonIcon(calendar.months[now.month].season);

    // Generate background gradient
    const leftTime = {
        hour: (now.hour - Math.floor(hoursInTimeTrack / 2) + 24) % 24,
        minutes: (hoursInTimeTrack % 2 === 0) ? now.minutes : (now.minutes + 30) % 60
    };
    if (hoursInTimeTrack % 2 === 1 && now.minutes < 30)
        leftTime.hour = (leftTime.hour - 1 + 24) % 24;
    const leftColor = getColorForTime(leftTime);
    const hourMarkers = [...Array(hoursInTimeTrack)].map((_, index) => {
        let hour = (now.hour + index - Math.floor(hoursInTimeTrack / 2) + 1 + 24) % 24;
        if (hoursInTimeTrack % 2 === 1 && now.minutes < 30)
            hour = (hour - 1 + 24) % 24;
        const time = { hour: hour, minutes: 0 };
        const color = getColorForTime(time);
        const timeBetween = getTimeBetween(now, { ...now, ...time }, calendar.months);
        const minutesBetween = timeBetween.minutes + (timeBetween.hours * 60);
        const minuteMarkFromLeft = minutesBetween + (hoursInTimeTrack * 30);
        const position = (minuteMarkFromLeft / (hoursInTimeTrack * 60)) * 100;
        return `${color} ${position}%`;
    }).join(", ");
    const rightColor = getColorForTime({
        hour: (leftTime.hour + hoursInTimeTrack) % 24,
        minutes: leftTime.minutes
    });
    let timeBackgroundStyle = {
        background: `linear-gradient(90deg, ${leftColor} 0%, ${hourMarkers}, ${rightColor} 100%)`
    }

    return (
        <div className={styles.timeDisplay} style={timeBackgroundStyle}>
            <p>{timeToString(now, calendar, timeFormat)}</p>
            <p className="date-text">
                {dateToString(now, calendar, dateFormat)}&nbsp;&nbsp;
                {showSeasonIcon && <FontAwesomeIcon icon={seasonIcon as IconProp} />}
            </p>
            {showTimeTrack && <TimeTrack />}
            {showDaysTrack && <DaysTrack />}
        </div>
    );
}