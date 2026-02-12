import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { parse, startOfWeek, format, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';

import styles from './WorkoutCalendar.module.css'

const locales = { 'en-US': enUS };

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const WorkoutCalendar = ({ workouts }) => {
  const [date, setDate] = useState(new Date());

  const events = workouts.map(w => ({
    title: w.name,
    start: new Date(w.workout_date),
    end: new Date(w.workout_date),
    allDay: true,
    id: w.id,
    difficulty: w.difficulty
  }));


  const eventStyleGetter = (event) => {
    let backgroundColor = 'lightblue';
    if (event.difficulty === 'advanced') backgroundColor = 'red';
    else if (event.difficulty === 'intermediate') backgroundColor = 'orange';
    else if (event.difficulty === 'beginner') backgroundColor = 'green';

    return {
      className: styles.event,
      style: { backgroundColor },
    };
  };

  return (
    <div className={styles.calendarContainer}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventStyleGetter}
        views={['month']}
        defaultView="month"
        date={date}              
        onNavigate={newDate => setDate(newDate)}  
        dayPropGetter={() => ({ className: styles.dayCell })}
      />
    </div>
  );
};

export default WorkoutCalendar;



