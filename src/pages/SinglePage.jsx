import { useParams, Link, useNavigate } from "react-router-dom"
import { useGetSingleArticleQuery, useDeleteArticleMutation } from "../redux/articleAPIslice"
import { Spin, Popconfirm, Modal } from "antd"
import { format } from "date-fns"
import styles from "./SinglePage.module.scss"
import Avatar from "./Avatar.png"
import ReactMarkdown from "react-markdown"
import { selectCurrentUser } from "../redux/authSlice"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { LikeButton } from "../Components/LikeButton"

const SinglePage = () => {
  const { slug } = useParams()
  const user = useSelector(selectCurrentUser)
  const navigate = useNavigate()

  const { data, isLoading: getArticleLoading, isError: getArticleError, refetch } = useGetSingleArticleQuery(slug)
  const [deleteArticle, { isError: deleteArticleError }] = useDeleteArticleMutation(slug)

  useEffect(() => {
    refetch()
  }, [refetch])

  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (deleteArticleError) {
      setIsModalOpen(true)
    }
  }, [deleteArticleError])

  const handleDelete = async () => {
    try {
      await deleteArticle(slug).unwrap()
      navigate("/")
    } catch (error) {
      console.error("Delete failed:", error)
    }
  }

  const changeDate = (text) => {
    if (text === "") return "The created date is unknown"
    const date = new Date(text)
    const formattedDate = format(date, "MMMM d, yyyy")
    return formattedDate
  }

  const contentStyle = {
    padding: 500,
    background: "transparent",
  }
  const content = <div style={contentStyle} />

  if (getArticleLoading)
    return (
      <Spin tip="Loading" size="large">
        {content}
      </Spin>
    )
  if (getArticleError) return <Empty />

  return (
    <div className={styles.articleBox}>
      <div className={`${styles.titleBox}`}>
        <h2 className={`${styles.title}`}> {data.article.title.length > 60 ? `${data.article.title.slice(0, 60)}...` : data.article.title}</h2>
        <LikeButton articleId={data.article.slug} isLiked={data.article.favorited} refetch={refetch} />
        <p>{data.article.favoritesCount}</p>
      </div>
      <div className={`${styles.tagsBox}`}>
        {data.article.tagList.slice(0, 5).map((tag, index) => (
          <span key={index} className={`${styles.tag}`}>
            {tag}
          </span>
        ))}
      </div>
      <p className={`${styles.text}`}>{data.article.description}</p>
      <div className={styles.bodyText}>
        <ReactMarkdown>{data.article.body}</ReactMarkdown>
      </div>
      <div className={`${styles.authorBox}`}>
        <div className={`${styles.authorNameBox}`}>
          <h4 className={`${styles.authorName}`}>
            {data.article.author.username.length > 20 ? `${data.article.author.username.slice(0, 20)}...` : data.article.author.username}
          </h4>
          <p className={`${styles.date}`}>{changeDate(data.article.createdAt)}</p>
        </div>
        <img className={`${styles.avatar}`} src={data.article.author.image ? data.article.author.image : Avatar} alt="avatar" />
      </div>
      {user?.username === data.article.author.username && (
        <div className={styles.buttonBox}>
          <Popconfirm description="Are you sure to delete this article?" okText="Yes" cancelText="No" onConfirm={handleDelete}>
            <button className={styles.deleteButton}>Delete</button>
          </Popconfirm>
          <Link to={`/articles/${slug}/edit`} className={styles.editButton}>
            Edit
          </Link>
        </div>
      )}
      <Modal title="Ошибка" open={isModalOpen} onCancel={() => setIsModalOpen(false)} footer={null} closable={true}>
        <p>{"Произошла ошибка при попытке удаления статьи"}</p>
      </Modal>
    </div>
  )
}

export { SinglePage }
