import React from "react"
import PropTypes from "prop-types"
import kebabCase from "lodash/kebabCase"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { Link, graphql } from "gatsby"

import styles from './tags.module.css'

const TagsPage = ({
  data: {
    allMarkdownRemark: { group },
  },
}) => (
  <Layout>
    <SEO title='タグ一覧' />
    <h1>タグ一覧</h1>
    <ul className={styles.tagList}>
      {group.map(tag => (
        <li key={tag.fieldValue}>
          <Link className={styles.tagName} to={`/tags/${kebabCase(tag.fieldValue)}/1`}>
            {tag.fieldValue}
          </Link>
          ({tag.totalCount})
        </li>
      ))}
    </ul>
  </Layout>
)

TagsPage.propTypes = {
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      group: PropTypes.arrayOf(
        PropTypes.shape({
          fieldValue: PropTypes.string.isRequired,
          totalCount: PropTypes.number.isRequired,
        }).isRequired
      ),
    }),
  }),
}

export default TagsPage

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(limit: 2000) {
      group(field: frontmatter___tags) {
        fieldValue
        totalCount
      }
    }
  }
`