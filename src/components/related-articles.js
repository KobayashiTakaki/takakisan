import React from "react"
import { Link } from "gatsby"
import Img from "gatsby-image"
import TagList from "./tag-list"
import styles from "./related-articles.module.css"

const RelatedArticles = ({ articles }) => {
  if (articles.edges.length === 0) {
    return null
  }
  return (
    <div className={styles.relatedArticles}>
      <h4>関連しそうな記事</h4>
      <div className={styles.relatedArticles__body}>
        {articles.edges.map(({ node }) => (
          <ArticleItem article={node} key={node.fields.slug} />
        ))}
      </div>
    </div>
  )
}

const ArticleItem = ({ article }) => {
  return (
    <div className={styles.articleItem}>
      <Link to={article.fields.slug}>
        <div className={styles.articleItem__image}>
          <Img
            fixed={article.titleImage.childImageSharp.fixed}
            style={{ height: "100%", borderRadius: "3px" }}
            imgStyle={{ objectFit: "cover" }}
            alt={article.frontmatter.title}
          />
        </div>
      </Link>
      <div className={styles.articleItem__main}>
        <Link to={article.fields.slug}>
          <div className={styles.articleItem__body}>
            <h3 className={styles.articleItem__title}>
              {article.frontmatter.title}
            </h3>
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

export default RelatedArticles
