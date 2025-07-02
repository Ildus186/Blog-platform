import styles from "./CreateEditArticlePage.module.scss"
import { useState, useEffect } from "react"
import { Alert } from "antd"
import { useForm } from "react-hook-form"
import { useParams, useNavigate } from "react-router-dom"
import { useGetSingleArticleQuery, useCreateArticleMutation, useUpdateArticleMutation } from "../redux/articleAPIslice"

const CreateEditArticlePage = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const isEditMode = Boolean(slug)

  const { data } = useGetSingleArticleQuery(slug, {
    skip: !isEditMode,
  })

  const [tagList, setTagList] = useState([])
  console.log(tagList)
  const {
    register,
    resetField,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      title: "",
      description: "",
      text: "",
      tag: "",
    },
  })

  const [updateArticle, { isLoading: isUpdating, error: updateError }] = useUpdateArticleMutation()
  const [createArticle, { isLoading: isCreating, error: createError }] = useCreateArticleMutation()

  const isLoading = isUpdating || isCreating
  const error = updateError || createError

  useEffect(() => {
    if (isEditMode && data) {
      setTagList(data.article.tagList || [])
      reset({
        title: data.article.title,
        description: data.article.description,
        text: data.article.body,
      })
    } else {
      reset()
      setTagList([])
    }
  }, [isEditMode, data, reset])

  useEffect(() => {
    return () => {
      reset()
      setTagList([])
    }
  }, [reset])

  const tagValue = watch("tag")

  const addTag = (e) => {
    e.preventDefault()
    if (tagValue.trim() === "") return
    setTagList([...tagList, tagValue.trim()])
    resetField("tag")
  }

  const cleanTag = (e) => {
    e.preventDefault()
    resetField("tag")
  }

  const removeTag = (index) => (e) => {
    e.preventDefault()
    setTagList(tagList.filter((_, i) => i !== index))
  }

  const onSubmit = async (formData) => {
    try {
      if (isEditMode) {
        await updateArticle({
          slug,
          article: {
            title: formData.title,
            description: formData.description,
            body: formData.text,
            tagList: tagList,
          },
        }).unwrap()
        navigate(`/articles/${slug}`)
      } else {
        await createArticle({
          title: formData.title,
          description: formData.description,
          body: formData.text,
          tagList: tagList,
        }).unwrap()
        navigate("/")
      }
    } catch (error) {
      console.error("Update an article failed:", error)
    }
  }

  return (
    <div className={styles.createBox}>
      <h1 className={styles.title}>{isEditMode ? "Edit article" : "Create new article"}</h1>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <label className={styles.inputLabel}>
          Title
          <input
            className={`${styles.input} ${errors.title ? styles.error : ""}`}
            type="text"
            placeholder="Title"
            {...register("title", {
              required: "Это поле обязательно для заполнения",
              validate: (value) => value.trim() !== "" || "Нельзя вводить только пробелы",
            })}
          />
          {errors.title && <p className={styles.errorMessage}>{errors.title.message}</p>}
        </label>

        <label className={styles.inputLabel}>
          Short description
          <input
            className={`${styles.input} ${errors.description ? styles.error : ""}`}
            type="text"
            placeholder="Short description"
            {...register("description", {
              required: "Это поле обязательно для заполнения",
              validate: (value) => value.trim() !== "" || "Нельзя вводить только пробелы",
            })}
          />
          {errors.description && <p className={styles.errorMessage}>{errors.description.message}</p>}
        </label>

        <label className={styles.inputLabel}>
          Text
          <textarea
            className={`${styles.textarea} ${errors.text ? styles.error : ""}`}
            type="text"
            placeholder="Text"
            {...register("text", {
              required: "Это поле обязательно для заполнения",
              validate: (value) => value.trim() !== "" || "Нельзя вводить только пробелы",
            })}
          ></textarea>
          {errors.text && <p className={styles.errorMessage}>{errors.text.message}</p>}
        </label>
        <label className={styles.inputLabel}>
          Tags
          {tagList.length > 0 &&
            tagList.map((tag, index) => {
              return (
                <div className={styles.tagBox} key={index}>
                  <input className={styles.tagInput} type="text" defaultValue={tag} disabled />
                  <button className={styles.deleteButton} onClick={(e) => removeTag(index)(e)}>
                    Delete
                  </button>
                </div>
              )
            })}
          <div className={styles.tagBox}>
            <input className={`${styles.tagInput} ${errors.tag ? styles.error : ""}`} type="text" placeholder="Tag" {...register("tag")} />
            {errors.email && <p className={styles.errorMessage}>{errors.tag.message}</p>}
            <button className={styles.deleteButton} onClick={cleanTag}>
              Delete
            </button>
            <button className={styles.addButton} onClick={addTag}>
              Add tag
            </button>
          </div>
        </label>
        <button className={styles.sendButton}>{isLoading ? "Loading..." : "Send"}</button>
      </form>
      {error && (
        <Alert type="error" showIcon closable message={<span style={{ fontSize: "14px" }}>При попытке отправки изменений произошла ошибка!</span>} />
      )}
    </div>
  )
}

export { CreateEditArticlePage }
