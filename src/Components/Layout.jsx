import { Outlet, Link } from "react-router-dom"
import styles from "./Layout.module.scss"
import Avatar from "../pages/Avatar.png"
import { useGetCurrentUserQuery } from "../redux/articleAPIslice"
import { logout, selectCurrentUser, selectInitialized } from "../redux/authSlice"
import { useSelector, useDispatch } from "react-redux"

const Layout = () => {
  const dispatch = useDispatch()
  const isInitialized = useSelector(selectInitialized)
  const user = useSelector(selectCurrentUser)

  useGetCurrentUserQuery(undefined, { skip: !isInitialized })

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <>
      <header className={styles.header}>
        <Link to="/" className={styles.header__name}>
          Realworld Blog
        </Link>

        {isInitialized && user ? (
          <nav className={styles.header__userBox}>
            <Link to="/create_article" className={styles.header__createlink}>
              Create article
            </Link>
            <div className={styles.header__userInfoBox}>
              <p className={styles.header__userName}>{user.username}</p>
              <Link to="/edit-profile">
                <img className={styles.avatar} src={user.image || Avatar} alt="Avatar" onError={(e) => (e.target.src = Avatar)} />
              </Link>
            </div>
            <button onClick={handleLogout} className={styles.header__logoutButton}>
              Log Out
            </button>
          </nav>
        ) : (
          <nav className={styles.header__linkBox}>
            <Link to="/sign-in" className={styles.header__link}>
              Sign In
            </Link>
            <Link to="/sign-up" className={`${styles.header__link} ${styles.active}`}>
              Sign Up
            </Link>
          </nav>
        )}
      </header>

      <main>
        <Outlet />
      </main>
    </>
  )
}

export { Layout }
