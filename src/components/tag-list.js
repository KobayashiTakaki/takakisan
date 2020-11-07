import { Link } from "gatsby"
import React from "react"
import PropTypes from "prop-types"
import kebabCase from "lodash/kebabCase"

import styles from './tag-list.module.css'

const TagList = ({ tags }) => (
  <div className={styles.tagList}>
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

TagList.propTypes = {
  tags: PropTypes.arrayOf(PropTypes.string),
}

export default TagList
