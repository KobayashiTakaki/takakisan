import { graphql, Link, useStaticQuery } from "gatsby"
import React from "react"
import TagList from "./tag-list"

import styles from "./aside-tags.module.css"

const AsideTags = () => {
  const result = useStaticQuery(graphql`
    query {
      tagsGroup: allMarkdownRemark(limit: 2000) {
        group(field: frontmatter___tags) {
          fieldValue
          totalCount
        }
      }
    }
  `)
  const tags = result.tagsGroup.group
    .sort((a, b) => b.totalCount - a.totalCount)
    .slice(0, 20)
  return (
    <div className={styles.asideTags}>
      <h4>タグから記事をさがす</h4>
      <TagList tags={tags.map(e => e.fieldValue)} />
      <div className={styles.tagsLink}>
        <Link to="/tags">タグ一覧</Link>
      </div>
    </div>
  )
}

export default AsideTags
