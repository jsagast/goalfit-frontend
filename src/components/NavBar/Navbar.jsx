import { useContext } from 'react'
import { Link } from 'react-router'
import { UserContext } from '../../contexts/UserContext'
import styles from './NavBar.module.css'

const NavBar = () => {
    const { user } = useContext(UserContext)
    const handleSignOut = () => {
        localStorage.removeItem('token')
        setUser(null)
    }
    return (
        <nav className={styles.navbar}>
            {user ? (
                <ul className={styles.navList}>
                    <li>
                        <Link to='/'>My Dashboard</Link>
                    </li>
                    <li>
                        <Link to='/workouts/new'>New Workout</Link>
                    </li>
                    <li>
                        <Link to='/workouts/calendar'>My Calendar</Link>
                    </li>
                    <li className={styles.signOut}>
                        <Link to='/' onClick={handleSignOut}>Sign Out</Link>
                    </li>
                </ul>
            ) : (
                <ul className={styles.navList}>
                    <li>
                        <Link to='/'>Home</Link>
                    </li>
                    <li>
                        <Link to='/sign-up'>Sign Up</Link>
                    </li>
                    <li>
                        <Link to='/sign-in'>Sign In</Link>
                    </li>
                </ul>
            )}
        </nav>
    )
}

export default NavBar
