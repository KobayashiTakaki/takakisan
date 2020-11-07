import React from "react"
import { graphql } from "gatsby"
import PropTypes from "prop-types"

import Layout from "../components/layout"
import SEO from "../components/seo"
import ArticleItem from '../components/article-item'
import Paginator from '../components/paginator'
import AsideTags from '../components/aside-tags'

const Articles = ({ pageContext, data }) => {
  let title
  if(pageContext.basePath === `/articles/` && pageContext.currentPage === 1){
    title = `Home`
  } else {
    title = `記事 (${pageContext.currentPage} of ${pageContext.numPages})`
  }
  return (
    <Layout>
      <SEO title={title} />
      {
        data.allMarkdownRemark.edges.map(({ node }) => (
          <ArticleItem article={node} key={node.fields.slug} />
        ))
      }
      <Paginator
        basePath={pageContext.basePath}
        currentPage={pageContext.currentPage}
        numPages={pageContext.numPages}/>
      <AsideTags />
    </Layout>
  )
}

Articles.propTypes = {
  pageContext: PropTypes.shape({
    basePath: PropTypes.string.isRequired,
    currentPage: PropTypes.number.isRequired,
    numPages: PropTypes.number.isRequired,
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

export default Articles

export const pageQuery = graphql`
  query blogListQuery($skip: Int!, $limit: Int!) {
    allMarkdownRemark(
      sort: { fields: [frontmatter___date], order: DESC }
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