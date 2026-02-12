import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import { parse, startOfWeek, format, getDay } from 'date-fns';
import enUS from 'date-fns/locale/en-US';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useState } from 'react';

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
    if (event.difficulty === 'Hard') backgroundColor = 'red';
    else if (event.difficulty === 'Medium') backgroundColor = 'orange';
    else if (event.difficulty === 'Easy') backgroundColor = 'green';

    return { style: { backgroundColor, color: 'white', borderRadius: '5px', padding: '2px' } };
  };

  return (
    <div style={{ height: 600 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventStyleGetter}
        // views={['month', 'week', 'day']}
        views={['month']}
        defaultView="month"
        date={date}               // 👈 controlled date
        onNavigate={newDate => setDate(newDate)}  // 👈 update on nav
      />
    </div>
  );
};

// const WorkoutCalendar = ({ workouts }) => {
//   // Map workouts to calendar events using workout_date
//   const events = workouts.map(w => ({
//     title: w.name,
//     start: new Date(w.workout_date),
//     end: new Date(w.workout_date),
//     allDay: true,
//     id: w.id,
//     difficulty: w.difficulty
//   }));

//   console.log(events)
  

//   const eventStyleGetter = (event) => {
//     let backgroundColor = 'lightblue';
//     if (event.difficulty === 'Hard') backgroundColor = 'red';
//     else if (event.difficulty === 'Medium') backgroundColor = 'orange';
//     else if (event.difficulty === 'Easy') backgroundColor = 'green';

//     return { style: { backgroundColor, color: 'white', borderRadius: '5px', padding: '2px' } };
//   };

//   return (
//     <div style={{ height: 600 }}>
//       <Calendar
//         localizer={localizer}
//         events={events}
//         startAccessor="start"
//         endAccessor="end"
//         eventPropGetter={eventStyleGetter}
//         views={['month', 'week', 'day']}
//         defaultView="month"
//       />
//     </div>
//   );
// };

export default WorkoutCalendar;



