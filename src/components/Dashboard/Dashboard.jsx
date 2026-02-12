import { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import * as workoutService from '../../services/workoutService'
import styles from './Dashboard.module.css'

import { Link } from 'react-router'

const Dashboard = ({handleDeleteWorkout}) => {
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

    const handleDeleteClick = async (e, workoutId) => {
    e.preventDefault();
    e.stopPropagation();

    const confirmDelete = window.confirm('Delete this workout?');
    if (!confirmDelete) return;

    await handleDeleteWorkout(workoutId);

    setWorkouts(prev =>
        prev.filter(w => w.id !== workoutId)
    );
    };


    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Welcome, {user.username}. <br/>Here are your workouts</h1>
            {workouts.length === 0 ? (
                <p className={styles.empty}>You haven’t created any workouts yet.</p>
            ) : (
                <div className={styles.grid}>
                    {workouts.map((workout) => (
                        <Link key={workout.id} to={`/workouts/${workout.id}`}>
                            <article className={styles.card}>

                                <button onClick={(e)=> handleDeleteClick(e,workout.id)} className={styles.deleteButton}>X</button>
                        

                                <header className={styles.cardHeader}>
                                    <h2>{workout.name}</h2>
                                    <p className={styles.date}>
                                        {`Added on 
                                        ${new Date(workout.created_at || Date.now()).toLocaleDateString()}`}
                                    </p>
                                </header>
                                <p className={styles.description}>{workout.description}</p>
                                <div className={styles.meta}>
                                    <span>{workout.workout_type.toUpperCase()}</span>
                                    <span>
                                        {workout.difficulty[0].toUpperCase() +
                                        workout.difficulty.slice(1)}
                                    </span>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            )}
            <Link to="/workouts/new" className={styles.createButton}>  Create New Workout</Link>
        </main>
    )
}

export default Dashboard
