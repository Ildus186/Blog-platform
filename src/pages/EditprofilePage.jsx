import { Alert } from "antd"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

import { useUpdateCurrentUserMutation, useGetCurrentUserQuery } from "../redux/articleAPIslice"

import styles from "./EditprofilePage.module.scss"

const EditprofilePage = () => {
  const [updateProfile, { isLoading, error }] = useUpdateCurrentUserMutation()
  const { data: currentUser, refetch } = useGetCurrentUserQuery()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    mode: "onChange",
  })

  useEffect(() => {
    if (currentUser) {
      reset({
        username: currentUser.username,
        email: currentUser.email,
        avatar: currentUser.image,
      })
    }
  }, [currentUser, reset])

  const onSubmit = async (formData) => {
    try {
      const requestBody = {
        ...(formData.email && { email: formData.email }),
        ...(formData.username && { username: formData.username }),
        ...(formData.avatar && { image: formData.avatar }),
        ...(formData.new_password && { password: formData.new_password }),
      }
      await updateProfile(requestBody).unwrap()
      console.log("Request body:", requestBody)
      refetch()
      navigate("/")
    } catch (error) {
      console.error("Update failed:", error)
    }
  }

  return (
    <div className={styles.loginBox}>
      <h1 className={styles.title}>Edit profile</h1>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <label className={styles.inputLabel}>
          Username
          <input
            className={`${styles.input} ${errors.username ? styles.error : ""}`}
            type="text"
            placeholder="Username"
            {...register("username", {
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
          {errors.username && <p className={styles.errorMessage}>{errors.username.message}</p>}
        </label>

        <label className={styles.inputLabel}>
          Email address
          <input
            className={`${styles.input} ${errors.email ? styles.error : ""}`}
            type="email"
            placeholder="Email address"
            {...register("email", {
              pattern: {
                value: /^[a-z][a-z0-9._%+-]*@[a-z0-9.-]+\.[a-z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && <p className={styles.errorMessage}>{errors.email.message}</p>}
        </label>

        <label className={styles.inputLabel}>
          New password
          <input
            className={`${styles.input} ${errors.password ? styles.error : ""}`}
            type="password"
            placeholder="New password"
            {...register("new_password", {
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
          Avatar image (url)
          <input
            className={`${styles.input} ${errors.avatar ? styles.error : ""}`}
            type="text"
            placeholder="Avatar image"
            {...register("avatar", {
              minLength: {
                value: 6,
                message: "Your url needs to be at least 6 characters.",
              },
            })}
          />
          {errors.avatar && <p className={styles.errorMessage}>{errors.avatar.message}</p>}
        </label>

        <button className={styles.submit} type="submit">
          {isLoading ? "Loading..." : "Save"}
        </button>
      </form>
      {error && <Alert description="Произошла ошибка при попытке редактирования данных пользователя!" type="error" closable />}
    </div>
  )
}

export { EditprofilePage }
