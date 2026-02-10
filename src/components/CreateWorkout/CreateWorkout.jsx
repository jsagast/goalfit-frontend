import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import * as workoutService from '../../services/workoutService'
import * as exerciseService from '../../services/exerciseService'

const CreateWorkout = () => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    workout_type: '',
    difficulty: '',
    exercises: [], //list
  })

  const [exercises, setExercises] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchExercises = async () => {
      const options = await exerciseService.index()
      setExercises(options)
    }
    fetchExercises()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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

    try {
      const payload = {
        ...formData,
        exercises: formData.exercises.map((ex) => ({
          id: Number(ex.id),
          sets: Number(ex.sets),
          reps: Number(ex.reps),
        })),
      }

      const workout = await workoutService.create(payload)
      navigate(`/workouts/${workout.id}`)
    } catch (err) {
      setError('Failed to create workout')
    }
  }

  return (
    <main>
      <h1>Create Workout</h1>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {/* check if  I want it */}

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Workout name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
        />
        <select
          name="workout_type"
          value={formData.workout_type}
          onChange={handleChange}
          required
        >
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
{/* 
            {workout_type === 'other' && (
            <input
                type="text"
                placeholder="Enter custom workout type"
            />
            )} */}
        <select
          name="difficulty"
          value={formData.difficulty}
          onChange={handleChange}
          required
        >
          <option value="">Difficulty</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        <hr/>
        <h2>Exercises</h2>

        {formData.exercises.map((exercise, index) => (
          <div key={index}>
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

            <button type="button" onClick={() => removeExercise(index)}>❌ Remove Exercise</button>
          </div>
        ))}

        <button type="button" onClick={addExercise}>➕ Add Exercise</button>

        <br />

        <button type="submit">Create Workout</button>
      </form>
    </main>
  )
}

export default CreateWorkout
