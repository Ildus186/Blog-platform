import { HeartFilled } from "@ant-design/icons"
import { useSelector } from "react-redux"

import { useToggleLikeMutation } from "../redux/articleAPIslice"
import { selectInitialized } from "../redux/authSlice"

import styles from "./LikeButton.module.scss"

const LikeButton = ({ articleId, isLiked, refetch }) => {
  const [toggleLike] = useToggleLikeMutation()

  const isInitialized = useSelector(selectInitialized)

  const handleLike = async () => {
    if (!isInitialized) return
    try {
      await toggleLike({ id: articleId, like: !isLiked }).unwrap()
      refetch()
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  return (
    <button onClick={handleLike} className={styles.like_btn}>
      <HeartFilled className={`${styles.heart_icon} ${isLiked ? styles.liked : ""} `} />
    </button>
  )
}

export { LikeButton }
