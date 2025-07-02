import { useForm } from "react-hook-form"
import styles from "./LoginPage.module.scss"
import { Link, useNavigate } from "react-router-dom"
import { useRegisterMutation } from "../redux/articleAPIslice"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { useState, useEffect } from "react"

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  })

  const password = watch("password")
  const currentUsername = watch("username")

  const [showAuthError, setShowAuthError] = useState(false)
  const [usernameValue, setUsernameValue] = useState("")

  const [registerUser, { isLoading, error }] = useRegisterMutation()

  const regErrors = error?.data?.errors || {}

  useEffect(() => {
    if (currentUsername !== usernameValue) {
      setShowAuthError(false)
      setUsernameValue(currentUsername)
    }
  }, [currentUsername, usernameValue])

  const navigate = useNavigate()

  const onSubmit = async (data) => {
    try {
      await registerUser(data).unwrap()
      toast.success("Регистрация прошла успешно!")
      setTimeout(() => navigate("/sign-in", { replace: true }), 2000)
    } catch (err) {
      toast.error(err.data.email || "Произошла ошибка")
      console.error("Registration failed:", err)
      setShowAuthError(true)
    }
  }

  return (
    <div className={styles.loginBox}>
      <ToastContainer position="top-right" autoClose={2000} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <h1 className={styles.title}>Create new account</h1>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <label className={styles.inputLabel}>
          Username
          <input
            className={`${styles.input} ${errors.username ? styles.error : ""}`}
            type="text"
            placeholder="Username"
            {...register("username", {
              required: "Username is required",
              minLength: {
                value: 3,
                message: "Username must be at least 3 characters",
              },
              maxLength: {
                value: 20,
                message: "Username must be no more than 20 characters",
              },
            })}
          />
          {errors.username ? (
            <p className={styles.errorMessage}>{errors.username.message}</p>
          ) : showAuthError && regErrors?.username ? (
            <p className={styles.errorMessage}>{regErrors.username}</p>
          ) : null}
        </label>

        <label className={styles.inputLabel}>
          Email address
          <input
            className={`${styles.input} ${errors.email ? styles.error : ""}`}
            type="email"
            placeholder="Email address"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[a-z][a-z0-9._%+-]*@[a-z0-9.-]+\.[a-z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email ? (
            <p className={styles.errorMessage}>{errors.email.message}</p>
          ) : showAuthError && regErrors?.email ? (
            <p className={styles.errorMessage}>{regErrors.email}</p>
          ) : null}
        </label>

        <label className={styles.inputLabel}>
          Password
          <input
            className={`${styles.input} ${errors.password ? styles.error : ""}`}
            type="password"
            placeholder="Password"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Your password needs to be at least 6 characters.",
              },
              maxLength: {
                value: 40,
                message: "Your password must be no more than 40 characters.",
              },
            })}
          />
          {errors.password && <p className={styles.errorMessage}>{errors.password.message}</p>}
        </label>

        <label className={styles.inputLabel}>
          Repeat Password
          <input
            className={`${styles.input} ${errors.repeatPassword ? styles.error : ""}`}
            type="password"
            placeholder="Repeat Password"
            {...register("repeatPassword", {
              required: "Please repeat your password",
              validate: (value) => value === password || "Passwords must match",
            })}
          />
          {errors.repeatPassword && <p className={styles.errorMessage}>{errors.repeatPassword.message}</p>}
        </label>

        <div className={styles.checkboxWrapper}>
          <input
            type="checkbox"
            id="consent"
            {...register("consent", {
              required: "You must agree to the terms.",
            })}
          />
          <label htmlFor="consent" className={styles.checkboxLabel}>
            I agree to the processing of my personal
            <br />
            information
            {errors.consent && <p className={styles.errorMessage}>{errors.consent.message}</p>}
          </label>
        </div>

        <button className={styles.submit} type="submit" disabled={Object.keys(errors).length > 0}>
          {isLoading ? "Loading..." : "Create"}
        </button>
      </form>
      <div className={styles.linkBox}>
        Already have an account?
        <Link to="/sign-in" className={styles.link}>
          Sign In.
        </Link>
      </div>
    </div>
  )
}

export { LoginPage }
