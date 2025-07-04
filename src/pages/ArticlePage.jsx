import { Pagination, Spin, Empty } from "antd"
import { format } from "date-fns"
import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"

import { LikeButton } from "../Components/LikeButton"
import { useGetArticleQuery } from "../redux/articleAPIslice"

import styles from "./ArticlePage.module.scss"
import Avatar from "./Avatar.png"

const ArticlePage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [offset, setOffset] = useState(0)
  const initialPage = parseInt(searchParams.get("page")) || 1
  const [currentPage, setCurrentPage] = useState(initialPage)

  const { data = [], isLoading, isError, refetch } = useGetArticleQuery(offset)

  useEffect(() => {
    setOffset((currentPage - 1) * 5)
  }, [currentPage])

  useEffect(() => {
    refetch()
  }, [refetch])

  const changePage = (page) => {
    setCurrentPage(page)
    setSearchParams({ page: page.toString() })
  }

  const changeDate = (text) => {
    if (text === "") return "The created date is unknown"
    const date = new Date(text)
    const formattedDate = format(date, "MMMM d, yyyy")
    return formattedDate
  }

  const contentStyle = {
    padding: 200,
    background: "transparent",
  }
  const content = <div style={contentStyle} />

  if (isLoading)
    return (
      <Spin tip="Loading" size="large">
        {content}
      </Spin>
    )

  if (isError) return <Empty />

  return (
    <>
      <ul className={styles.articleList}>
        {data.articles.map((article) => (
          <li className={`${styles.articleBox}`} key={article.slug}>
            <div className={`${styles.titleBox}`}>
              <Link to={`/articles/${article.slug}`}>
                <h2 className={styles.title}>{article.title.length > 60 ? `${article.title.slice(0, 60)}...` : article.title}</h2>
              </Link>
              <LikeButton articleId={article.slug} isLiked={article.favorited} refetch={refetch} />
              <p className={styles.like}>{article.favoritesCount}</p>
            </div>
            <div className={`${styles.tagsBox}`}>
              {article.tagList.slice(0, 5).map((tag, index) => (
                <span key={index} className={`${styles.tag}`}>
                  {tag}
                </span>
              ))}
            </div>
            <p className={`${styles.text}`}>{article.description}</p>
            <div className={`${styles.authorBox}`}>
              <div className={`${styles.authorNameBox}`}>
                <h4 className={`${styles.authorName}`}>
                  {article.author.username.length > 20 ? `${article.author.username.slice(0, 20)}...` : article.author.username}
                </h4>
                <p className={`${styles.date}`}>{changeDate(article.createdAt)}</p>
              </div>
              <img className={`${styles.avatar}`} src={article.author.image ? article.author.image : Avatar} alt="avatar" />
            </div>
          </li>
        ))}
      </ul>
      <Pagination align="center" current={currentPage} pageSize={5} onChange={changePage} total={data.articlesCount} showSizeChanger={false} />
    </>
  )
}

export { ArticlePage }
