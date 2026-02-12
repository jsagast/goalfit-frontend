import { useEffect, useState } from 'react'
import { useParams } from "react-router";
import { useNavigate } from 'react-router'
import * as workoutService from '../../services/workoutService'
import * as exerciseService from '../../services/exerciseService'
import styles from './WorkoutForm.module.css'

const WorkoutForm = ({handleAddWorkout, handleUpdateWorkout}) => {
  // const navigate = useNavigate()

  const {workoutId}=useParams()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    workout_type: '',
    custom_workout_type: '',
    difficulty: '',
    exercises: [], //list
    workout_date: new Date().toISOString().slice(0, 10), // slice to get YYYY-MM-DD 
  })

  const [exercises, setExercises] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchExercises = async () => {
      const data = await exerciseService.all()
      setExercises(data)
    }
    fetchExercises()
  }, [])

  // to edit

useEffect(() => {
    const fetchWorkout = async () => {
      const workoutData = await workoutService.show(workoutId);

      // Determine if it's a custom workout type
      const isCustomType =
        workoutData.workout_type &&
        ![
          "strength",
          "hypertrophy",
          "cardio",
          "hiit",
          "circuit",
          "cross_training",
          "powerlifting",
          "olympic_lifting",
          "functional",
          "bodyweight",
          "endurance",
          "mobility",
          "stretching",
        ].includes(workoutData.workout_type);

      setFormData({
        name: workoutData.name || "",
        description: workoutData.description || "",
        workout_type: isCustomType ? "other" : workoutData.workout_type || "",
        custom_workout_type: isCustomType ? workoutData.workout_type : "",
        difficulty: workoutData.difficulty || "",
        exercises: workoutData.exercises.map((ex) => ({
          id: ex.id,
          sets: ex.sets,
          reps: ex.reps,
        })),
        workout_date: workoutData.workout_date || new Date().toISOString().slice(0, 10),
      });
    };

    if (workoutId) fetchWorkout();
  }, [workoutId]);


  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === 'workout_type' && value !== 'other') {
      setFormData({
        ...formData,
        workout_type: value,
        custom_workout_type: '', //temporary to save option not saved in db
      })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleExerciseChange = (index, field, value) => {
    const updated = [...formData.exercises]
    updated[index] = { ...updated[index], [field]: value }
    setFormData({ ...formData, exercises: updated })
  }

  const addExercise = () => {
    setFormData({
      ...formData,
      exercises: [...formData.exercises, { id: '', sets: '', reps: '' }],
    })
  }

  const removeExercise = (index) => {
    const updated = [...formData.exercises]
    updated.splice(index, 1)
    setFormData({ ...formData, exercises: updated })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (formData.exercises.length === 0) {
      setError('Add at least one exercise')
      return
    }

    try {
      const payload = {
        ...formData,
         workout_type:
          formData.workout_type === 'other'
            ? formData.custom_workout_type
            : formData.workout_type,
        exercises: formData.exercises.map((ex) => ({
          exercise_id: Number(ex.id),
          sets: Number(ex.sets),
          reps: Number(ex.reps),
        })),
      }

      delete payload.custom_workout_type
      
      if (workoutId){
        handleUpdateWorkout(workoutId, payload)
      } else {
        handleAddWorkout(payload)
      }
    } catch (err) {
      setError(workout ? 'Failed to update workout' : 'Failed to create workout')
    }
  }

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>Customize Your Workout</h1>
        
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Workout Name</label>
            <input
              type='text'
              name="name"
              placeholder="e.g Leg Day"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="description">Description</label>
            <textarea
              name="description"
              placeholder="e.g Squats & Lunges"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="workout_type">Workout Type</label>
            <select
              id="workout_type"
              name="workout_type"
              value={formData.workout_type}
              onChange={handleChange}
              required
            >
              <option value="">Select workout type</option>
              <option value="strength">Strength</option>
              <option value="hypertrophy">Hypertrophy</option>
              <option value="cardio">Cardio</option>
              <option value="hiit">HIIT</option>
              <option value="circuit">Circuit</option>
              <option value="cross_training">Cross Training</option>
              <option value="powerlifting">Powerlifting</option>
              <option value="olympic_lifting">Olympic Lifting</option>
              <option value="functional">Functional</option>
              <option value="bodyweight">Bodyweight</option>
              <option value="endurance">Endurance</option>
              <option value="mobility">Mobility</option>
              <option value="stretching">Stretching</option>
              <option value="other">Other</option>
            </select>
          </div>

          {formData.workout_type === 'other' && (
            <div>
              <label htmlFor="custom_workout_type">Custom Workout Type</label>
              <input
                type='text'
                id="custom_workout_type"
                name="custom_workout_type"
                value={formData.custom_workout_type}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="difficulty">Difficulty</label>
            <select
              id="difficulty"
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              required
            >
              <option value="">Select difficulty</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>

          <div>
            <label htmlFor="workout_date">Workout Date</label>
            <input
              type="date"
              id="workout_date"
              name="workout_date"
              value={formData.workout_date}
              onChange={handleChange}
              required
            />
          </div>

          <hr/>

          <h2>Exercises</h2>

          {formData.exercises.map((exercise, index) => (
            <div key={index} className={styles.exerciseRow}>
              <select
                value={exercise.id}
                onChange={(e) =>
                  handleExerciseChange(index, 'id', e.target.value)
                }
                required
              >
                <option value="">Select exercise</option>
                {exercises.map((exercise) => (
                  <option key={exercise.id} value={exercise.id}>
                    {exercise.name}
                </option>
                ))}
              </select>

              <input
                type="number"
                placeholder="Sets"
                value={exercise.sets}
                onChange={(e) =>
                  handleExerciseChange(index, 'sets', e.target.value)
                }
                min="1"
                required
              />

              <input
                type="number"
                placeholder="Reps"
                value={exercise.reps}
                onChange={(e) =>
                  handleExerciseChange(index, 'reps', e.target.value)
                }
                min="1"
                required
              />

              <button type="button" className={styles.removeBtn} onClick={() => removeExercise(index)}> Remove Exercise</button>
            </div>
          ))}

          <button type="button" onClick={addExercise}> Add Exercise</button>

          <br />

          <button type="submit" className={styles.submitBtn}>{workoutId ? 'Update Workout' : 'Create Workout'}</button>
        </form>
      </main>
    </div>
  )
}

export default WorkoutForm


