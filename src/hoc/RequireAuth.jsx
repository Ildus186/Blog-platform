import { useLocation, Navigate } from "react-router-dom"
import { selectInitialized } from "../redux/authSlice"
import { useSelector } from "react-redux"

const RequireAuth = ({ children }) => {
  const location = useLocation()
  const isInitialized = useSelector(selectInitialized)

  if (!isInitialized) {
    return <Navigate to="/sign-in" state={{ from: location }} />
  }

  return children
}

export { RequireAuth }
