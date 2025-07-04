import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, Link } from "react-router-dom"

import { useLoginMutation } from "../redux/articleAPIslice"

import styles from "./Forma.module.scss"

const SigninPage = () => {
  const [login, { isLoading, error }] = useLoginMutation()
  const authErrors = error?.data?.errors || {}

  const [showAuthError, setShowAuthError] = useState(false)
  const [passwordValue, setPasswordValue] = useState("")

  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
  })

  const currentPassword = watch("password")

  useEffect(() => {
    if (currentPassword !== passwordValue) {
      setShowAuthError(false)
      setPasswordValue(currentPassword)
    }
  }, [currentPassword, passwordValue])

  const onSubmit = async (formData) => {
    try {
      await login({
        email: formData.email,
        password: formData.password,
      }).unwrap()
      navigate("/")
    } catch (error) {
      console.error("Login failed:", error)
      setShowAuthError(true)
    }
  }

  return (
    <div className={`${styles.box} ${styles.smallHeight}`}>
      <h1 className={styles.title}>Sign In</h1>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
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
          {errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}
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
          {errors.password ? (
            <p className={styles.errorMessage}>{errors.password.message}</p>
          ) : showAuthError && authErrors?.["email or password"] ? (
            <p className={styles.errorMessage}>Email or password {authErrors["email or password"]}</p>
          ) : null}
        </label>

        <button className={styles.submit} type="submit" disabled={isLoading}>
          {isLoading ? "Loading..." : "Login"}
        </button>
      </form>
      <div className={styles.linkBox}>
        Don’t have an account?
        <Link to="/sign-up" className={styles.link}>
          Sign Up.
        </Link>
      </div>
    </div>
  )
}

export { SigninPage }
