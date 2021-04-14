import React from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"
import TagList from "./tag-list"

import styles from "./article-item.module.css"

const ArticleItem = ({ article }) => {
  return (
    <div className={styles.articleItem}>
      <Link to={article.fields.slug}>
        <div className={styles.articleItem__image}>
          <ArticleImage article={article} />
        </div>
      </Link>
      <div className={styles.articleItem__main}>
        <Link to={article.fields.slug}>
          <div className={styles.articleItem__body}>
            <h3 className={styles.articleItem__title}>
              {article.frontmatter.title}
            </h3>
            <p className={styles.articleItem__content}>{article.excerpt}</p>
          </div>
        </Link>
        <div className={styles.articleItem__meta}>
          <p className={styles.articleItem__date}>{article.frontmatter.date}</p>
          <TagList tags={article.frontmatter.tags} />
        </div>
      </div>
    </div>
  )
}

const ArticleImage = ({ article }) => {
  return (
    <Img
      fixed={article.titleImage.childImageSharp.fixed}
      style={{ height: "100%", borderRadius: "3px" }}
      imgStyle={{ objectFit: "cover" }}
      alt={article.frontmatter.title}
    />
  )
}

export default ArticleItem
