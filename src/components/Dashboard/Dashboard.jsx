import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import * as workoutService from '../../services/workoutService'

import { Link } from 'react-router'

const Dashboard = () => {
    const { user } = useContext(UserContext)
    const [workouts, setWorkouts] = useState([])

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
    }, [user])

    return (
        <main>
            <h1>Welcome, {user.username}</h1>
            {workouts.length === 0 ? (
                <p>You haven’t created any workouts yet.</p>
            ) : (
                workouts.map((workout) => (
                    <Link key={workout.id} to={`/workouts/${workout.id}`}>
                        <article>
                            <header>
                                <h2>{workout.name}</h2>
                                <p>
                                    {`Created on 
                                    ${new Date(workout.created_at || Date.now()).toLocaleDateString()}`}
                                </p>
                            </header>
                            <p>Description: {workout.description}</p>
                            <p>Type: {workout.workout_type} | Difficulty: {workout.difficulty}</p>
                        </article>
                    </Link>
                ))
            )}
            <Link to="/workouts/new">➕ Create New Workout</Link>
        </main>
    )
}

export default Dashboard
