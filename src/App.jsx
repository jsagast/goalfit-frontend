import { useContext, useEffect, useState } from 'react'
import { Routes, Route, useNavigate } from 'react-router'
import NavBar from './components/NavBar/Navbar.jsx'
import SignUpForm from './components/SignUpForm/SignUpForm.jsx'
import SignInForm from './components/SignInForm/SignInForm.jsx'
import Landing from './components/Landing/Landing.jsx'
import Dashboard from './components/Dashboard/Dashboard.jsx'
import { UserContext } from './contexts/UserContext.jsx'

import * as workoutService from './services/workoutService.js'

import CreateWorkout from './components/CreateWorkout/CreateWorkout.jsx'
// import WorkoutList from './components/WorkoutList/WorkoutList.jsx'
// import WorkoutDetails from './components/WorkoutDetails/WorkoutDetails.jsx'
// import WorkoutForm from './components/WorkoutForm/WorkoutForm.jsx'

const App = () => {
    const { user } = useContext(UserContext)
    const [workouts, setWorkouts] = useState([])
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAllWorkouts = async () => {
            const workoutsData = await workoutService.index()
            setWorkouts(workoutsData)
        }
        if (user) fetchAllWorkouts()
    }, [user])

    const handleAddWorkout = async (payload) => {
        const newWorkout = await workoutService.create(payload)
        setWorkouts([newWorkout, ...workouts])
        navigate('/workouts')
    }

    const handleDeleteWorkout = async (workoutId) => {
        const deletedWorkout = await workoutService.deleteWorkout(workoutId)
        const filteredWorkouts = workouts.filter((workout) => workout.id !== deletedWorkout.id)
        setWorkouts(filteredWorkouts)
        navigate('/workouts')
    }

    const handleUpdateWorkout = async (workoutId, workoutFormData) => {
        console.log(workoutId, workoutFormData)
        const updatedWorkout = await workoutService.updateWorkout(workoutId, workoutFormData)
        setWorkouts(
            workouts.map((workout) =>
                workout.id === updatedWorkout.id ? updatedWorkout : workout,
            ),
        )
        navigate(`/workouts/${workoutId}`)
    }

    return (
        <>
            <NavBar />
            <Routes>
                <Route path='/' element={user ? <Dashboard /> : <Landing />} />
                {user ? (
                    <>
                        <Route path='/workouts/new' element={<CreateWorkout handleAddWorkout={handleAddWorkout}/>}/>
                        {/* <Route path='/workouts'element={<WorkoutList workouts={workouts} />}/>
                        <Route path='/workouts/:workoutId' element={<WorkoutDetails handleDeleteWorkout={handleDeleteWorkout}/>}/>
                        <Route path='/workouts/new'element={<WorkoutForm handleAddWorkout={handleAddWorkout} />}/>
                        <Route path='/workouts/:workoutId/edit'element={<WorkoutForm handleUpdateWorkout={handleUpdateWorkout} />} /> */}
                    </>
                ) : (
                    <>
                        <Route path='/sign-up' element={<SignUpForm />} />
                        <Route path='/sign-in' element={<SignInForm />} />
                    </>
                )}
            </Routes>
        </>
    )
}

export default App
