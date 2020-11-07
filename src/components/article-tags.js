import { Link } from "gatsby"
import PropTypes from "prop-types"
import React from "react"
import kebabCase from "lodash/kebabCase"

import styles from './article-tags.module.css'

const ArticleTags = ({ tags }) => (
  <div className={styles.articleTags}>
    <ul>
      {
        tags.map((tag) => (
          <li key={tag}>
            <Link to={`/tags/${kebabCase(tag)}/1`}>{tag}</Link>
          </li>
        ))
      }
    </ul>
  </div>
)

ArticleTags.propTypes = {
  tags: PropTypes.array,
}

ArticleTags.defaultProps = {
  tags: [],
}

export default ArticleTags
