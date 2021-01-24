import React from "react"
import { Link, graphql } from "gatsby"
import PropTypes from "prop-types"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ArticleItem from "../components/article-item"
import Paginator from "../components/paginator"
import AsideTags from "../components/aside-tags"
import styles from "./tag-articles.module.css"

const TagArticles = ({ pageContext, data }) => {
  const { tag } = pageContext

  return (
    <Layout>
      <SEO title={`${tag} の記事`} />
      <h1>
        <span className={styles.tagName}>{tag}</span>
        の記事
      </h1>
      <div className={styles.tagsLink}>
        <Link to="/tags">タグ一覧</Link>
      </div>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <ArticleItem article={node} key={node.fields.slug} />
      ))}
      <Paginator
        basePath={pageContext.basePath}
        currentPage={pageContext.currentPage}
        numPages={pageContext.numPages}
      />
      <AsideTags />
    </Layout>
  )
}

TagArticles.propTypes = {
  pageContext: PropTypes.shape({
    tag: PropTypes.string.isRequired,
  }),
  data: PropTypes.shape({
    allMarkdownRemark: PropTypes.shape({
      edges: PropTypes.arrayOf(
        PropTypes.shape({
          node: PropTypes.shape({
            frontmatter: PropTypes.shape({
              title: PropTypes.string.isRequired,
            }),
            fields: PropTypes.shape({
              slug: PropTypes.string.isRequired,
            }),
          }),
        }).isRequired
      ),
    }),
  }),
}

export default TagArticles

export const pageQuery = graphql`
  query($tag: String, $skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
      filter: { frontmatter: { tags: { in: [$tag] } } }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          excerpt
          fields {
            slug
          }
          frontmatter {
            title
            date
            tags
          }
          titleImage {
            childImageSharp {
              fixed(width: 400) {
                ...GatsbyImageSharpFixed
              }
            }
          }
        }
      }
    }
  }
`
