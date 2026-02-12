import { useEffect, useState, useContext } from 'react';
import * as workoutService from '../../services/workoutService';
import WorkoutCalendar from './WorkoutCalendar';
import { UserContext } from '../../contexts/UserContext'


const CalendarPage = () => {
    const [workouts, setWorkouts] = useState([])
    const { user } = useContext(UserContext)

    useEffect(() => {
        const fetchWorkouts = async () => {
            try {
                const fetchedWorkouts = await workoutService.index(); //all
                const userWorkouts = fetchedWorkouts.filter(
                    (w) => w.workout_author_id === user.id
                )
                setWorkouts(userWorkouts)
            } catch (err) {
                console.log(err)
            }
        }

        if (user) fetchWorkouts()
    }, [])

    return <WorkoutCalendar workouts={workouts} />;
};

export default CalendarPage;


