import { useParams, Link } from 'react-router'
import { useState, useEffect, useContext } from 'react'

import * as workoutService from '../../services/workoutService'
import { UserContext } from '../../contexts/UserContext'

import CommentForm from '../CommentForm/CommentForm'

const WorkoutDetails = ({ handleDeleteWorkout }) => {
    const { workoutId } = useParams()
    const [workout, setWorkout] = useState(null)
    const { user } = useContext(UserContext)
    const [editingComment, setEditingComment] = useState(null)

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

    const handleDeleteComment = async (commentId) => {
        if (!window.confirm('Delete this comment?')) return

        await workoutService.deleteComment(workoutId, commentId)

        setWorkout({
            ...workout,
            comments: workout.comments.filter(
            (comment) => comment.comment_id !== commentId
            ),
        })

        if (editingComment?.comment_id === commentId) {
            setEditingComment(null)
        }
    }

    const handleUpdateComment = async (updatedCommentForm) => {
        const { comment_id, comment_text } = updatedCommentForm

        const updated = await workoutService.updateComment(
            workoutId,
            comment_id,
            comment_text
        )

        const safeUpdated = {
            ...updated,
            comment_id,
            comment_text: updated?.comment_text || comment_text,
        }

        setWorkout({
            ...workout,
            comments: workout.comments.map((c) =>
            c.comment_id === comment_id ? safeUpdated : c
            ),
        })

        setEditingComment(null)
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
                <p>
                    {`Workout Date: ${
                        workout.workout_date
                        ? new Date(workout.workout_date).toLocaleDateString()
                        : "Unknown"
                    }`}
                </p>
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
            <h2>Track your Sessions</h2>
            <CommentForm 
                handleAddComment={handleAddComment} 
                editingComment={editingComment}
                setEditingComment={setEditingComment}
                handleUpdateComment={handleUpdateComment}
            />
            {!workout.comments.length && <p>There are no comments.</p>}

            {workout.comments.map((comment) => {
                const isYou = user?.username === comment.comment_author_username
                const who = isYou? "You": comment.comment_author_username || "Unknown"
                const when = comment.comment_created_at ? new Date(comment.comment_created_at).toLocaleDateString(): "Unknown date"

                return (
                    <article key={comment.comment_id}>
                        <header>
                            <p>{`${who} posted on ${when}`}</p>
                        </header>

                        <p>{comment.comment_text}</p>

                        {isYou && (
                            <div>
                                <button onClick={() => setEditingComment(comment)}> Edit</button>
                                <button onClick={() =>handleDeleteComment(comment.comment_id)}>Delete</button>
                            </div>
                        )}
                    </article>
                )
            })}
        </section>
        </main>
    )
}

export default WorkoutDetails



