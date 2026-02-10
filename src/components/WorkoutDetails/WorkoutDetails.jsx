import { useParams, Link } from 'react-router'
import { useState, useEffect, useContext } from 'react'

import * as workoutService from '../../services/workoutService'
import { UserContext } from '../../contexts/UserContext'

import CommentForm from '../CommentForm/CommentForm'

const WorkoutDetails = ({ handleDeleteWorkout }) => {
    const { workoutId } = useParams()
    const [workout, setWorkout] = useState(null)
    const { user } = useContext(UserContext)

    useEffect(() => {
        const fetchWorkout = async () => {
            const workoutData = await workoutService.show(workoutId)
            setWorkout(workoutData)
        }
        fetchWorkout()
    }, [workoutId])

    const handleAddComment = async (commentFormData) => {
        const newComment = await workoutService.createComment(
            workoutId,
            commentFormData,
        )
        setWorkout({ ...workout, comments: [newComment, ...workout.comments] })
        console.log('commentFormData -->', commentFormData)
    }

    if (!workout) return <main>Loading...</main>
    console.log(workout)

    return (
        <main>
        <section>
            <header>
            <h1>{workout.name}</h1>
            <p>Type: {workout.workout_type.toUpperCase()}</p>
            <p>
                {`Created on ${
                workout.created_at ? new Date(workout.created_at).toLocaleDateString() : "Unknown date"
                }`}
            </p>
            <p>Description: {workout.description}</p>
            {workout.workout_author_id === user.id && (
                <>
                <Link to={`/workouts/${workoutId}/edit`}>Edit</Link>
                <button onClick={() => handleDeleteWorkout(workoutId)}>Delete</button>
                </>
            )}
            </header>
            

            <h2>Exercises</h2>
            {workout.exercises.length ? (
            <ul>
                {workout.exercises.map((ex) => (
                <li key={ex.id}>
                    {ex.name} - {ex.sets} sets x {ex.reps} reps <br/> Muscle Group: {ex.muscle_group}, Equipment: {ex.equipment}
                </li>
                ))}
            </ul>
            ) : (
            <p>No exercises added</p>
            )}
        </section>

        <section>
            <h2>Comments</h2>
            <CommentForm handleAddComment={handleAddComment} />
            {!workout.comments.length && <p>There are no comments.</p>}
            {workout.comments.map((comment) => (
            <article key={comment.comment_id}>
                <header>
                <p>{`${comment.comment_author_username} posted on ${
                    comment.created_at ? new Date(comment.created_at).toLocaleDateString() : "Unknown date"
                }`}</p>
                </header>
                <p>{comment.comment_text}</p>
            </article>
            ))}
        </section>
        </main>
    )
}

export default WorkoutDetails



